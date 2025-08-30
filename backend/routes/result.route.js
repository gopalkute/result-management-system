import express from "express";
const router = express.Router();

import {
   createResult, // bulk create (Excel upload)
   addResult, // single create
   updateResult,
   getAllResults,
   getResultById,
   deleteResult,
} from "../controllers/result.controller.js";

import {
   uploadResultValidation,
   IdValidation,
   updateResultValidation,
   addResultValidation,
} from "../validations/result.validation.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyInputData from "../middlewares/validation.middleware.js";

// Result routes
router.get("/", verifyJWT, getAllResults);
router.get("/:id", verifyJWT, IdValidation, verifyInputData, getResultById);

router.post(
   "/",
   verifyJWT,
   authorizeRoles("admin", "hod"),
   addResultValidation,
   verifyInputData,
   addResult
);

router.post(
   "/bulk",
   verifyJWT,
   authorizeRoles("admin", "hod"),
   upload.single("file"),
   uploadResultValidation,
   verifyInputData,
   createResult
); // bulk create via Excel

router.put(
   "/:id",
   verifyJWT,
   authorizeRoles("admin", "hod"),
   updateResultValidation,
   verifyInputData,
   updateResult
);

router.delete(
   "/:id",
   verifyJWT,
   authorizeRoles("admin", "hod"),
   IdValidation,
   verifyInputData,
   deleteResult
);

export default router;
