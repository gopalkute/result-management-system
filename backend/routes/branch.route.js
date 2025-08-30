// routes/branch.routes.js
import express from "express";
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
   branchIdValidation,
} from "../validations/branch.validation.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import verifyInputData from "../middlewares/validation.middleware.js";

const router = express.Router();

// ✅ Public/Student/HOD/Admin can view branches
router.get("/", verifyJWT, getAllBranches);
router.get(
   "/:id",
   verifyJWT,
   branchIdValidation,
   verifyInputData,
   getBranchDetails
);

// ✅ Only Admin can manage branches
router.post(
   "/",
   verifyJWT,
   authorizeRoles("admin"),
   createBranchValidation,
   verifyInputData,
   addNewBranch
);
router.put(
   "/:id",
   verifyJWT,
   authorizeRoles("admin"),
   branchIdValidation,
   updateBranchValidation,
   verifyInputData,
   updateBranchDetails
);
router.delete(
   "/:id",
   verifyJWT,
   authorizeRoles("admin"),
   branchIdValidation,
   verifyInputData,
   deleteBranch
);

export default router;
