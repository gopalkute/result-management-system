import { body, param } from "express-validator";

const createBranchValidation = [
   body("code").isString().notEmpty().withMessage("Code is required"),

   body("name")
      .isString()
      .withMessage("Name must be a string")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),

   body("duration")
      .isNumeric()
      .withMessage("Duration must be a number")
      .notEmpty()
      .withMessage("Duration is required"),
];

const updateBranchValidation = [
   body("code").optional().isString().withMessage("Code must be a string"),

   body("name")
      .optional()
      .isString()
      .withMessage("Name must be a string")
      .trim(),

   body("duration")
      .optional()
      .isNumeric()
      .withMessage("Duration must be a number"),
];

const branchIdValidation = [
   param("id").isMongoId().withMessage("Invalid Branch ID"),
];

export { createBranchValidation, updateBranchValidation, branchIdValidation };
