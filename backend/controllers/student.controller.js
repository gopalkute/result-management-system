import { Student } from "../models/student.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import { excelToStudents } from "../utils/excelToJSON.js";

// Bulk create students from excel
const createStudents = asyncHandler(async (req, res) => {
   const filePath = req.file?.path;
   const { branch } = req.body;

   // HOD role check
   if (
      req.user.role === "hod" &&
      branch.toString() !== req.user.branch.toString()
   ) {
      return res
         .status(403)
         .json({ status: false, message: "Unauthorized: Not your branch" });
   }

   if (!filePath || !branch) {
      return res.status(400).json({
         status: false,
         message: "Missing required fields or file",
      });
   }

   const studentData = excelToStudents(filePath, branch);
   const insertedStudents = [];

   for (const student of studentData) {
      const exists = await Student.findOne({ prn: student.prn });
      if (!exists) {
         const newStudent = new Student(student);
         await newStudent.save();
         insertedStudents.push(newStudent);
      }
   }

   fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
   });

   res.status(201).json({
      status: true,
      message: "Students created successfully",
      data: insertedStudents,
   });
});

// Add a new student
const addANewStudent = asyncHandler(async (req, res) => {
   const { prn, name, email, password, branch } = req.body;

   // HOD role check
   if (
      req.user.role === "hod" &&
      branch.toString() !== req.user.branch.toString()
   ) {
      return res
         .status(403)
         .json({ status: false, message: "Unauthorized: Not your branch" });
   }

   const exists = await Student.findOne({ $or: [{ prn }, { email }] });
   if (exists) {
      return res
         .status(400)
         .json({ status: false, message: "Student already exists" });
   }

   const student = await Student.create({ prn, name, email, password, branch });
   res.status(201).json({
      status: true,
      message: "Student registered",
      data: student,
   });
});

// Update student
const updateStudent = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { prn, name, email, password, branch } = req.body;

   const student = await Student.findById(id);
   if (!student) {
      return res
         .status(404)
         .json({ status: false, message: "Student not found" });
   }

   // HOD role check
   if (
      req.user.role === "hod" &&
      student.branch.toString() !== req.user.branch.toString()
   ) {
      return res
         .status(403)
         .json({ status: false, message: "Unauthorized: Not your branch" });
   }

   if (email && email !== student.email) {
      const emailExists = await Student.findOne({ email });
      if (emailExists) {
         return res
            .status(400)
            .json({ status: false, message: "Email already in use" });
      }
      student.email = email;
   }

   if (prn) student.prn = prn;
   if (name) student.name = name;
   if (branch) student.branch = branch;
   if (password) student.password = password;

   const updated = await student.save();
   res.status(200).json({
      status: true,
      message: "Student updated",
      data: updated,
   });
});

// Get all students
const getAllStudents = asyncHandler(async (req, res) => {
   const students = await Student.find().populate("branch");
   res.status(200).json({ status: true, data: students });
});

// Get student by ID
const getStudentById = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const student = await Student.findById(id).populate("branch");
   if (!student) {
      return res
         .status(404)
         .json({ status: false, message: "Student not found" });
   }
   res.status(200).json({ status: true, data: student });
});

// Delete student
const deleteStudent = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const student = await Student.findById(id);
   if (!student) {
      return res
         .status(404)
         .json({ status: false, message: "Student not found" });
   }

   // HOD role check
   if (
      req.user.role === "hod" &&
      student.branch.toString() !== req.user.branch.toString()
   ) {
      return res
         .status(403)
         .json({ status: false, message: "Unauthorized: Not your branch" });
   }

   await student.deleteOne();
   res.status(200).json({
      status: true,
      message: "Student deleted",
      data: student,
   });
});

export {
   createStudents,
   addANewStudent,
   updateStudent,
   getAllStudents,
   getStudentById,
   deleteStudent,
};
