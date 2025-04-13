import { body, param, check } from "express-validator";

const studentValidation = [
   check("branch")
      .notEmpty()
      .withMessage("Branch is required")
      .isString()
      .withMessage("Branch must be a string"),

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

const validateStudentId = [
   param("id").isMongoId().withMessage("Invalid student ID"),
];

const loginStudentValidation = [
   body("email").isEmail().withMessage("Valid email is required"),
   body("password").notEmpty().withMessage("Password is required"),
];

export {
   studentValidation,
   createStudentValidation,
   updateStudentValidation,
   validateStudentId,
   loginStudentValidation,
};
