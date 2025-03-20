// routes/branchRoutes.js
import express from "express";
import { getBranches, getBranchById, createBranch, updateBranch, deleteBranch } from "../controllers/branch.controller.js";

const router = express.Router();

// Get all branches
router.get("/", getBranches);

// Get branch by ID
router.get("/:id", getBranchById);

// Create a new branch
router.post("/", createBranch);

// Update branch by ID
router.put("/:id", updateBranch);

// Delete branch by ID
router.delete("/:id", deleteBranch);

export default router;
