import express from "express";
import {
   addANewHod,
   getAllHods,
   getHodDetails,
   updateHodDetails,
   deleteHod,
} from "../controllers/hod.controller.js";

import {
   HODIdValidation,
   createHODValidation,
   updateHODValidation,
} from "../validations/hod.validation.js";
import verifyInputData from "../middlewares/validation.middleware.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

// HOD routes
router.get("/", verifyJWT, getAllHods);
router.get("/:id", verifyJWT, HODIdValidation, verifyInputData, getHodDetails);

router.post(
   "/",
   verifyJWT,
   authorizeRoles("admin"),
   createHODValidation,
   verifyInputData,
   addANewHod
);
router.put(
   "/:id",
   verifyJWT,
   authorizeRoles("admin"),
   updateHODValidation,
   verifyInputData,
   updateHodDetails
);
router.delete(
   "/:id",
   verifyJWT,
   authorizeRoles("admin"),
   HODIdValidation,
   verifyInputData,
   deleteHod
);
export default router;
