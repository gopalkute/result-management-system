import express from "express";
import {
   createStudents,
   addANewStudent,
   updateStudent,
   getAllStudents,
   getStudentById,
   deleteStudent,
} from "../controllers/student.controller.js";
import {
   studentValidation,
   createStudentValidation,
   updateStudentValidation,
   validateStudentId,
} from "../validations/student.validation.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import resultRoutes from "../routes/result.route.js";
const router = express.Router();

router.use("/result", resultRoutes);

router.post(
   "/create",
   upload.single("file"),
   authMiddleware(["admin", "hod"]),
   studentValidation,
   createStudents
);

router.post(
   "/",
   authMiddleware(["admin", "hod"]),
   createStudentValidation,
   validateRequest,
   addANewStudent
);

router.get("/", authMiddleware(["admin", "hod"]), getAllStudents);
router.get("/:id", validateStudentId, validateRequest, getStudentById);

router.put(
   "/:id",
   authMiddleware(["admin", "hod"]),
   updateStudentValidation,
   validateRequest,
   updateStudent
);

router.delete(
   "/:id",
   authMiddleware(["admin", "hod"]),
   validateStudentId,
   validateRequest,
   deleteStudent
);

export default router;
