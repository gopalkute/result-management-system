import { body, param, check } from "express-validator";

const addStudentsViaFileValidation = [
   body("branch")
      .notEmpty()
      .withMessage("Branch is required")
      .isMongoId()
      .withMessage("Branch must be a mongoId"),

   // File should be present
   check("file")
      .custom((value, { req }) => {
         if (!req.file) {
            throw new Error("File is required");
         }
         return true;
      })
      .withMessage("Excel file is required"),
];

const createStudentValidation = [
   body("prn").notEmpty().withMessage("PRN is required").isString().trim(),
   body("name").notEmpty().withMessage("Name is required").isString().trim(),
   body("email").isEmail().withMessage("Valid email is required"),
   body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
   body("branch").isMongoId().withMessage("Valid branch ID is required"),
];

const updateStudentValidation = [
   param("id").isMongoId().withMessage("Invalid student ID"),
   body("prn").optional().isString().trim(),
   body("name").optional().isString().trim(),
   body("email").optional().isEmail(),
   body("password").optional().isLength({ min: 6 }),
   body("branch").optional().isMongoId(),
];

const studentIdValidation = [
   param("id").isMongoId().withMessage("Invalid student ID"),
];

export {
   addStudentsViaFileValidation,
   createStudentValidation,
   updateStudentValidation,
   studentIdValidation,
};
