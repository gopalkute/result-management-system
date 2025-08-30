import { body, param } from "express-validator";

const createHODValidation = [
   body("uid")
      .notEmpty()
      .withMessage("UID is required")
      .isString()
      .withMessage("UID must be a string"),

   body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string"),

   body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),

   body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

   body("branch")
      .notEmpty()
      .withMessage("Branch is required")
      .isMongoId()
      .withMessage("Invalid branch ID"),
];

const updateHODValidation = [
   param("id").isMongoId().withMessage("Invalid HOD ID"),

   body("name").optional().isString().withMessage("Name must be a string"),

   body("uid").optional().isString().withMessage("uid must be a string"),

   body("email").optional().isEmail().withMessage("Invalid email format"),

   body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

   body("branch").optional().isMongoId().withMessage("Invalid branch ID"),
];

const HODIdValidation = [param("id").isMongoId().withMessage("Invalid HOD ID")];

export { createHODValidation, updateHODValidation, HODIdValidation };
