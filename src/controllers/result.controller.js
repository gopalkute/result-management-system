import { asyncHandler } from "../utils/asyncHandler.js";
import { Result } from "../models/result.model.js";
import { Student } from "../models/student.model.js";
import { excelToJSON } from "../utils/excelToJSON.js";
import fs from "fs";

const getResults = asyncHandler(async (req, res) => {
   // Check if req.user exists and has a branch
   const userBranch = req.user?.branch;

   // If the user has a branch, fetch results for that branch only
   let results;
   if (userBranch) {
      results = await Result.find({ branch: userBranch }).populate(
         "prn",
         "prn name email"
      );
   } else {
      // If no user or branch in user, fetch all results
      results = await Result.find().populate("prn", "prn name email");
   }

   // If no results found
   if (results.length === 0) {
      return res.status(404).json({
         status: false,
         message: "No results found",
      });
   }

   // Send the response with the results
   res.status(200).json({
      status: true,
      message: "Results retrieved successfully",
      data: results,
   });
});

const getResultByPRN = asyncHandler(async (req, res) => {
   const { prn } = req.params;

   // First, find student by PRN
   const student = await Student.findOne({ prn }).select(
      "_id name email prn branch"
   );
   if (!student) {
      return res.status(404).json({
         status: false,
         message: "Student not found with given PRN",
      });
   }

   // Then, fetch results using student's ObjectId
   const results = await Result.find({ prn: student._id })
      .populate("branch", "name code") // Optional: get branch info
      .sort({ year: 1, sem: 1 });

   res.status(200).json({
      status: true,
      message: "Results fetched successfully",
      data: {
         student: {
            prn: student.prn,
            name: student.name,
            email: student.email,
            branch: student.branch,
         },
         results,
      },
   });
});

const createResult = asyncHandler(async (req, res) => {
   const filePath = req.file?.path;
   const { branch, year, sem } = req.body;

   if (!filePath || !branch || !year || !sem) {
      return res.status(400).json({
         status: false,
         message: "Missing required fields or file",
      });
   }

   // Extract data from Excel
   const resultData = excelToJSON(filePath, branch, year, sem);

   // Fetch all students once to avoid multiple DB hits
   const students = await Student.find({}, "_id prn");
   const prnMap = new Map(students.map((s) => [s.prn, s._id]));

   const resultDocs = resultData
      .map((data) => {
         const studentId = prnMap.get(data.prn);
         if (!studentId) return null;

         return {
            prn: studentId,
            branch: data.branch,
            year: data.year,
            sem: data.sem,
            result: data.result,
         };
      })
      .filter(Boolean); // Remove nulls if any PRNs weren't found

   if (resultDocs.length === 0) {
      return res.status(404).json({
         status: false,
         message: "No matching students found for provided PRNs",
      });
   }

   // Check if results for the same student, year, and semester already exist
   const existingResults = await Result.find({
      prn: { $in: resultDocs.map((doc) => doc.prn) },
      year,
      sem,
   });

   if (existingResults.length > 0) {
      return res.status(400).json({
         status: false,
         message:
            "Results for the given year and semester already exist for some students.",
      });
   }

   // Save results
   const inserted = await Result.insertMany(resultDocs);

   const insertedResults = await Result.find({
      _id: { $in: inserted.map((doc) => doc._id) },
   }).populate("prn", "prn name email"); // Customize fields as needed

   // Optionally delete uploaded Excel after processing
   fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
   });

   res.status(201).json({
      status: true,
      message: "Results uploaded successfully",
      data: insertedResults,
   });
});

const updateResult = asyncHandler(async (req, res) => {
   const { prn } = req.params;
   const { year, sem, result } = req.body;

   if (!year || !sem || !result) {
      return res.status(400).json({
         status: false,
         message: "Missing required fields: year, sem, result",
      });
   }

   // Check if the student with the given prn exists
   const student = await Student.findOne({ prn });
   if (!student) {
      return res.status(404).json({
         status: false,
         message: "Student not found",
      });
   }

   // Find the result for the student based on prn, year, and sem
   const existingResult = await Result.findOne({ prn: student._id, year, sem });
   if (!existingResult) {
      return res.status(404).json({
         status: false,
         message: "Result for this student and semester not found",
      });
   }

   // Iterate through the result array from the request
   result.forEach((newSubject) => {
      const existingSubject = existingResult.result.find(
         (subject) => subject.subject === newSubject.subject
      );

      if (existingSubject) {
         // If the subject exists, only update the grade
         existingSubject.grade = newSubject.grade;
      } else {
         // If the subject doesn't exist, add it with a new _id
         existingResult.result.push(newSubject);
      }
   });

   // Save the updated result
   await existingResult.save();

   // Populate the prn details (if needed)
   const updatedResult = await Result.findById(existingResult._id).populate(
      "prn",
      "prn name email"
   );

   res.status(200).json({
      status: true,
      message: "Result updated successfully",
      data: updatedResult,
   });
});

const deleteResult = asyncHandler(async (req, res) => {
   const { prn } = req.params;
   const { year, sem } = req.body;

   if (!year || !sem) {
      return res.status(400).json({
         status: false,
         message: "Missing required fields: year and sem",
      });
   }

   // Check if student exists
   const student = await Student.findOne({ prn });
   if (!student) {
      return res.status(404).json({
         status: false,
         message: "Student not found",
      });
   }

   // Delete result
   const deleted = await Result.findOneAndDelete({
      prn: student._id,
      year,
      sem,
   });

   if (!deleted) {
      return res.status(404).json({
         status: false,
         message: "Result not found for this student and semester",
      });
   }

   res.status(200).json({
      status: true,
      message: "Result deleted successfully",
      data: deleted,
   });
});

export { getResults, getResultByPRN, createResult, updateResult, deleteResult };
