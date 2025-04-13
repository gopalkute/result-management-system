import { Student } from "../models/student.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import fs from "fs";
import { excelToStudents } from "../utils/excelToJSON.js";

const createStudents = asyncHandler(async (req, res) => {
   const filePath = req.file?.path;
   const { branch } = req.body;

   if (!filePath || !branch) {
      return res.status(400).json({
         status: false,
         message: "Missing required fields or file",
      });
   }

   // Extract student data from Excel
   const studentData = excelToStudents(filePath, branch);

   const insertedStudents = [];

   for (const student of studentData) {
      // Avoid duplicate PRNs
      const exists = await Student.findOne({ prn: student.prn });
      if (!exists) {
         const newStudent = new Student(student); // pre-save will hash password
         await newStudent.save();
         insertedStudents.push(newStudent);
      }
   }

   // Delete the uploaded file
   fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
   });

   res.status(201).json({
      status: true,
      message: "Students created successfully",
      data: insertedStudents,
   });
});

const addANewStudent = asyncHandler(async (req, res) => {
   const { prn, name, email, password, branch } = req.body;
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

const updateStudent = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { prn, name, email, password, branch } = req.body;
   const student = await Student.findById(id);
   if (!student)
      return res
         .status(404)
         .json({ status: false, message: "Student not found" });

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
   if (password) student.password = await bcrypt.hash(password, 10);

   const updated = await student.save();
   res.status(200).json({
      status: true,
      message: "Student updated",
      data: updated,
   });
});

const getAllStudents = asyncHandler(async (req, res) => {
   const students = await Student.find().populate("branch");
   res.status(200).json({ status: true, data: students });
});

const getStudentById = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const student = await Student.findById(id).populate("branch");
   if (!student)
      return res
         .status(404)
         .json({ status: false, message: "Student not found" });
   res.status(200).json({ status: true, data: student });
});

const deleteStudent = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const student = await Student.findById(id);
   if (!student)
      return res
         .status(404)
         .json({ status: false, message: "Student not found" });
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
