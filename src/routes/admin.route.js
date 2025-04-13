// Method	Endpoint	Description

import express from "express";
const router = express.Router();

import HODRoutes from "../routes/hod.route.js";
import BranchRoutes from "../routes/branch.route.js";

router.use("/hod", HODRoutes);
router.use("/branch", BranchRoutes);

export default router;
