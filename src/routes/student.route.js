// routes/studentRoutes.js
import express from "express";
import { getStudents, getStudentByPRN, createStudent, updateStudent, deleteStudent } from "../controllers/student.controller.js";

const router = express.Router();

// Get all students
router.get("/", getStudents);

// Get student by PRN
router.get("/:prn", getStudentByPRN);

// Create a new student
router.post("/", createStudent);

// Update student by PRN
router.put("/:prn", updateStudent);

// Delete student by PRN
router.delete("/:prn", deleteStudent);

export default router;
