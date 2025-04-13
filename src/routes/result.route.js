import express from "express";
import {
   createResult,
   getResultByPRN,
   getResults,
   updateResult,
   deleteResult,
} from "../controllers/result.controller.js";
import {
   uploadResultValidation,
   getResultsByPRNValidation,
   updateResultValidation,
   validateDeleteResult,
} from "../validations/result.validation.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", authMiddleware(["admin", "hod"]), getResults);

router.get(
   "/:prn",
   authMiddleware(["admin", "hod", "student"]),
   getResultsByPRNValidation,
   validateRequest,
   getResultByPRN
);

router.post(
   "/",
   upload.single("file"),
   authMiddleware(["admin", "hod"]),
   uploadResultValidation,
   validateRequest,
   createResult
);

router.put(
   "/:prn",
   authMiddleware(["admin", "hod"]),
   updateResultValidation,
   validateRequest,
   updateResult
);

router.delete(
   "/:prn",
   authMiddleware(["admin", "hod"]),
   validateDeleteResult,
   validateRequest,
   deleteResult
);
export default router;
