import { body } from "express-validator";

// Validation rules for authentication-related routes

const loginUserValidation = [
   body("email", "Valid email is required").isEmail(),
   body("password", "Password is required").notEmpty(),
   body("role", "role is required").isString().notEmpty(),
];

const resetPasswordRequestValidation = [
   body("email", "Valid email is required").isEmail(),
   body("role", "role is required").isString().notEmpty(),
];

const resetPasswordVerifyValidation = [
   body("email", "Valid email is required").isEmail(),
   body("role", "role is required").isString().notEmpty(),
   body("otp", "otp is required").isString().notEmpty(),
   body("newPassword", "new password is required").isString().notEmpty(),
];

const changePasswordValidation = [
   body("oldPassword", "old password is required").isString().notEmpty(),
   body("newPassword", "new password is required").isString().notEmpty(),
];

const changeEmailValidation = [
   body("newEmail", "new email is required").isEmail().notEmpty(),
   body("otp", "otp is required").isString().notEmpty(),
];

export {
   loginUserValidation,
   resetPasswordRequestValidation,
   resetPasswordVerifyValidation,
   changePasswordValidation,
   changeEmailValidation,
};
