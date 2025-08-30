import express from "express";
import {
   login,
   logout,
   getProfile,
   getAccessToken,
   requestEmailChangeOTP,
   changeEmail,
   changePassword,
   requestPasswordReset,
   resetPassword,
} from "../controllers/auth.controller.js";

import {
   loginUserValidation,
   resetPasswordRequestValidation,
   resetPasswordVerifyValidation,
   changePasswordValidation,
   changeEmailValidation,
} from "../validations/auth.validation.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import verifyInputData from "../middlewares/validation.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", loginUserValidation, verifyInputData, login);
router.post(
   "/reset-password/request",
   resetPasswordRequestValidation,
   verifyInputData,
   requestPasswordReset
);
router.post(
   "/reset-password/verify",
   resetPasswordVerifyValidation,
   verifyInputData,
   resetPassword
);

// Protected routes
router.post("/logout", verifyJWT, logout);
router.get("/profile", verifyJWT, getProfile);
router.get("/refresh-token", getAccessToken);
router.post("/change-email/otp", verifyJWT, requestEmailChangeOTP);
router.put(
   "/change-email",
   verifyJWT,
   changeEmailValidation,
   verifyInputData,
   changeEmail
);
router.put(
   "/change-password",
   verifyJWT,
   changePasswordValidation,
   verifyInputData,
   changePassword
);

export default router;
