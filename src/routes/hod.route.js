import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/auth.middleware.js";

import {
   addANewHod,
   getAllHods,
   getHodDetails,
   updateHodDetails,
   deleteHod,
} from "../controllers/hod.controller.js";

import {
   createHODValidation,
   updateHODValidation,
   validateHODId,
} from "../validations/hod.validation.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import studentRoutes from "../routes/student.route.js";
import resultRoutes from "../routes/result.route.js";

router.use("/student", studentRoutes);
router.use("/result", resultRoutes);

router.get("/", authMiddleware(["admin"]), getAllHods);

router.get(
   "/:id",
   authMiddleware(["admin"]),
   validateHODId,
   validateRequest,
   getHodDetails
);

router.post(
   "/",
   authMiddleware(["admin"]),
   createHODValidation,
   validateRequest,
   addANewHod
);

router.put(
   "/:id",
   authMiddleware(["admin"]),
   updateHODValidation,
   validateRequest,
   updateHodDetails
);

router.delete(
   "/:id",
   authMiddleware(["admin"]),
   validateHODId,
   validateRequest,
   deleteHod
);

export default router;
