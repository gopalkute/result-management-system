import { body, param } from "express-validator";

const createBranchValidation = [
   body("code")
      .isNumeric()
      .withMessage("Code must be a number")
      .notEmpty()
      .withMessage("Code is required"),

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
   body("code").optional().isNumeric().withMessage("Code must be a number"),

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

const validateBranchId = [
   param("id").isMongoId().withMessage("Invalid Branch ID"),
];

export { createBranchValidation, updateBranchValidation, validateBranchId };
