import { body } from "express-validator";

const updateAdminValidation = [
   body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string"),
];

export { updateAdminValidation };
