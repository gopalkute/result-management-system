import express from "express";
const router = express.Router();

import {
   createStudents, // bulk create
   addANewStudent, // single create
   updateStudent,
   getAllStudents,
   getStudentById,
   deleteStudent,
} from "../controllers/student.controller.js";

import {
   addStudentsViaFileValidation,
   createStudentValidation,
   updateStudentValidation,
   studentIdValidation,
} from "../validations/student.validation.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyInputData from "../middlewares/validation.middleware.js";

// Student routes
router.get("/", verifyJWT, getAllStudents); // get all students
router.get(
   "/:id",
   verifyJWT,
   studentIdValidation,
   verifyInputData,
   getStudentById
); // get single student

router.post(
   "/",
   verifyJWT,
   authorizeRoles("admin", "hod"),
   createStudentValidation,
   verifyInputData,
   addANewStudent
);
router.post(
   "/bulk",
   verifyJWT,
   upload.single("file"),
   authorizeRoles("admin", "hod"),
   addStudentsViaFileValidation,
   verifyInputData,
   createStudents
);

router.put(
   "/:id",
   verifyJWT,
   authorizeRoles("admin", "hod"),
   updateStudentValidation,
   verifyInputData,
   updateStudent
);

router.delete(
   "/:id",
   verifyJWT,
   authorizeRoles("admin", "hod"),
   studentIdValidation,
   verifyInputData,
   deleteStudent
);

export default router;
