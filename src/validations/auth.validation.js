import { body } from "express-validator";

const validateAdminLogin = [
   body("email", "Valid admin email is required").isEmail(),
   body("password", "Password is required").notEmpty(),
];

const validateHODLogin = [
   body("email", "Valid HOD email is required").isEmail(),
   body("password", "Password is required").notEmpty(),
];

const validateStudentLogin = [
   body("email", "Valid student email is required").isEmail(),
   body("password", "Password is required").notEmpty(),
];

export { validateAdminLogin, validateHODLogin, validateStudentLogin };
