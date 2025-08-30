import express from "express";
import {
   createAdmin,
   getAdmins,
   getAdminById,
   updateAdmin,
   updateData,
   deleteAdmin,
} from "../controllers/admin.controller.js";

import { updateAdminValidation } from "../validations/admin.validation.js";

import { verifyJWT } from "../middlewares/verifyJWT.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import verifyInputData from "../middlewares/validation.middleware.js";

const router = express.Router();

// CRUD Routes for Admin
//update the admin name
router.post(
   "/edit",
   verifyJWT,
   authorizeRoles("admin"),
   updateAdminValidation,
   verifyInputData,
   updateData
);

// router.post("/", createAdmin); // Create
// router.get("/", getAdmins); // Read all
// router.get("/:id", getAdminById); // Read one
// router.put("/:id", updateAdmin); // Update
// router.delete("/:id", deleteAdmin); // Delete

export default router;
