// routes/resultRoutes.js
import express from "express";
import {
   getResults,
   getResultByPRN,
   createResult,
   updateResult,
   deleteResult,
} from "../controllers/result.controller.js";

const router = express.Router();

// Get all results
router.get("/", getResults);

// Get result by PRN
router.get("/:prn", getResultByPRN);

// save the xlsx file and save results into database
router.post("/", createResult);

// Update result by PRN
router.put("/:prn", updateResult);

// Delete result by PRN
router.delete("/:prn", deleteResult);

export default router;
