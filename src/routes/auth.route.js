import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/auth.middleware.js";
import {
   getUserProfile,
   loginAsAdmin,
   logoutAdmin,
   loginAsHOD,
   logoutHOD,
   loginAsStudent,
   logoutStudent,
} from "../controllers/auth.controller.js";
import {
   validateAdminLogin,
   validateHODLogin,
   validateStudentLogin,
} from "../validations/auth.validation.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

router.get("/profile", authMiddleware(["hod", "student"]), getUserProfile);

router.post("/login/admin", validateAdminLogin, validateRequest, loginAsAdmin);
router.post("/logout/admin", authMiddleware(["admin"]), logoutAdmin);

router.post("/login/hod", validateHODLogin, validateRequest, loginAsHOD);
router.post("/logout/hod", authMiddleware(["hod"]), logoutHOD);

router.post(
   "/login/student",
   validateStudentLogin,
   validateRequest,
   loginAsStudent
);
router.post("/logout/student", authMiddleware(["student"]), logoutStudent);

export default router;
