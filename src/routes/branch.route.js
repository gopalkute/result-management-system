import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/auth.middleware.js";
import {
   addNewBranch,
   getAllBranches,
   getBranchDetails,
   updateBranchDetails,
   deleteBranch,
} from "../controllers/branch.controller.js";

import {
   createBranchValidation,
   updateBranchValidation,
   validateBranchId,
} from "../validations/branch.validation.js";

import { validateRequest } from "../middlewares/validate.middleware.js";

router.get("/", authMiddleware(["admin"]), getAllBranches);

router.get("/:id", authMiddleware(["admin"]), getBranchDetails);

router.post(
   "/",
   authMiddleware(["admin"]),
   createBranchValidation,
   validateRequest,
   addNewBranch
);

router.put(
   "/:id",
   authMiddleware(["admin"]),
   validateBranchId,
   updateBranchValidation,
   validateRequest,
   updateBranchDetails
);

router.delete(
   "/:id",
   authMiddleware(["admin"]),
   validateBranchId,
   validateRequest,
   deleteBranch
);

export default router;
