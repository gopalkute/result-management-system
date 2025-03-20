// routes/hodRoutes.js
import express from "express";
import { getHODs, getHODById, createHOD, updateHOD, deleteHOD } from "../controllers/hod.controller.js";

const router = express.Router();

// Get all HODs
router.get("/", getHODs);

// Get HOD by ID
router.get("/:uid", getHODById);

// Create a new HOD
router.post("/", createHOD);

// Update HOD by ID
router.put("/:uid", updateHOD);

// Delete HOD by ID
router.delete("/:uid", deleteHOD);

export default router;
