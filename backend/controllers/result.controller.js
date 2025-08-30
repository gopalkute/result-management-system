import { Result } from "../models/result.model.js";
import { Student } from "../models/student.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import { excelToResults } from "../utils/excelToJSON.js";

// Bulk create results from Excel
const createResult = asyncHandler(async (req, res) => {
   const filePath = req.file?.path;
   const { branch, year, sem } = req.body;

   // HOD role check
   if (
      req.user.role === "hod" &&
      branch.toString() !== req.user.branch.toString()
   ) {
      return res
         .status(403)
         .json({ status: false, message: "Unauthorized: Not your branch" });
   }

   if (!filePath || !branch || !year || !sem) {
      return res.status(400).json({
         status: false,
         message: "Missing required fields or file",
      });
   }

   const resultData = excelToResults(filePath, branch, year, sem);
   const insertedResults = [];

   for (const data of resultData) {
      const student = await Student.findOne({ prn: data.prn });
      if (student) {
         const exists = await Result.findOne({
            prn: student._id,
            year,
            sem,
         });
         if (!exists) {
            const newResult = new Result({
               prn: student._id,
               branch,
               year,
               sem,
               result: data.result,
            });
            await newResult.save();
            insertedResults.push(newResult);
         }
      }
   }

   fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
   });

   res.status(201).json({
      status: true,
      message: "Results created successfully",
      data: insertedResults,
   });
});

// Add single result
const addResult = asyncHandler(async (req, res) => {
   const { prn, branch, year, sem, result } = req.body;

   // HOD role check
   if (
      req.user.role === "hod" &&
      branch.toString() !== req.user.branch.toString()
   ) {
      return res
         .status(403)
         .json({ status: false, message: "Unauthorized: Not your branch" });
   }

   const student = await Student.findOne({ _id: prn });
   if (!student || student.branch.toString() !== branch.toString()) {
      return res.status(404).json({
         status: false,
         message: "Student not found or Branch does not match",
      });
   }

   const exists = await Result.findOne({ prn: student._id, year, sem });
   if (exists) {
      return res.status(400).json({
         status: false,
         message: "Result already exists for this sem",
      });
   }

   const newResult = await Result.create({
      prn: student._id,
      branch,
      year,
      sem,
      result,
   });

   res.status(201).json({
      status: true,
      message: "Result added",
      data: newResult,
   });
});

//update result of student
const updateResult = asyncHandler(async (req, res) => {
   const { id } = req.params; // result _id
   const { result } = req.body; // [{subject, grade}, ...]

   const existingResult = await Result.findById(id).select(
      "-__v -createdAt -updatedAt"
   );

   if (!existingResult) {
      return res
         .status(404)
         .json({ status: false, message: "Result not found" });
   }

   // HOD role check
   if (
      req.user.role === "hod" &&
      existingResult.branch.toString() !== req.user.branch.toString()
   ) {
      return res
         .status(403)
         .json({ status: false, message: "Unauthorized: Not your branch" });
   }

   // Loop over incoming subjects
   result.forEach(({ subject, grade }) => {
      // Find if subject already exists in stored result
      const subjectIndex = existingResult.result.findIndex(
         (r) => r.subject === subject
      );

      if (subjectIndex !== -1) {
         // Subject exists → update grade
         existingResult.result[subjectIndex].grade = grade;
      } else {
         // Subject not exists → push new
         existingResult.result.push({ subject, grade });
      }
   });

   await existingResult.save();

   return res.status(200).json({
      status: true,
      message: "Result updated successfully",
      data: existingResult,
   });
});

//get all results
const getAllResults = asyncHandler(async (req, res) => {
   let results = await Result.find()
      .populate("prn", "prn name email")
      .populate("branch", "name code")
      .select("-__v -createdAt -updatedAt");

   // Role-based filter
   if (req.user.role === "hod") {
      results = results.filter(
         (r) => r.prn.branch.toString() === req.user.branch.toString()
      );
   } else if (req.user.role === "student") {
      results = results.filter(
         (r) => r.prn._id.toString() === req.user._id.toString()
      );
   } else if (req.user.role !== "admin") {
      return res.status(403).json({ status: false, message: "Not authorized" });
   }

   res.status(200).json({ status: true, data: results });
});

//get single result
const getResultById = asyncHandler(async (req, res) => {
   const { id } = req.params;
   let result = await Result.findById(id)
      .populate("prn", "prn name email ")
      .populate("branch", "name code")
      .select("-__v -createdAt -updatedAt");

   if (!result) {
      return res
         .status(404)
         .json({ status: false, message: "Result not found" });
   }

   // Role-based access
   if (
      req.user.role === "hod" &&
      result.prn.branch.toString() !== req.user.branch.toString()
   ) {
      return res
         .status(403)
         .json({ status: false, message: "Not authorized for this branch" });
   } else if (
      req.user.role === "student" &&
      result.prn._id.toString() !== req.user._id.toString()
   ) {
      return res
         .status(403)
         .json({ status: false, message: "Not authorized for this result" });
   } else if (
      req.user.role !== "admin" &&
      req.user.role !== "hod" &&
      req.user.role !== "student"
   ) {
      return res.status(403).json({ status: false, message: "Not authorized" });
   }

   res.status(200).json({ status: true, data: result });
});

// Delete result
const deleteResult = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const result = await Result.findById(id).select(
      "-__v -createdAt -updatedAt"
   );
   if (!result) {
      return res
         .status(404)
         .json({ status: false, message: "Result not found" });
   }

   // HOD role check
   if (
      req.user.role === "hod" &&
      result.branch.toString() !== req.user.branch.toString()
   ) {
      return res
         .status(403)
         .json({ status: false, message: "Unauthorized: Not your branch" });
   }

   await result.deleteOne();
   res.status(200).json({
      status: true,
      message: "Result deleted",
      data: result,
   });
});

export {
   createResult,
   addResult,
   updateResult,
   getAllResults,
   getResultById,
   deleteResult,
};
