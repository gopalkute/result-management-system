import { HOD } from "../models/HOD.model.js";
import bcrypt from "bcrypt"; // make sure it's imported
import { asyncHandler } from "../utils/asyncHandler.js";
import { Branch } from "../models/branch.model.js";

const addANewHod = asyncHandler(async (req, res) => {
   const { uid, name, email, password, branch } = req.body;

   const branchExists = await Branch.findById(branch);
   if (!branchExists) {
      return res
         .status(404)
         .json({ status: false, message: "Branch not found" });
   }

   const existingHOD = await HOD.findOne({ $or: [{ uid }, { email }] });
   if (existingHOD) {
      return res
         .status(400)
         .json({ status: false, message: "UID or Email already exists" });
   }

   const newHOD = new HOD({ uid, name, email, password, branch });
   const savedHOD = await newHOD.save();

   res.status(201).json({
      status: true,
      message: "HOD created successfully",
      data: savedHOD,
   });
});

const getAllHods = asyncHandler(async (req, res) => {
   const hods = await HOD.find().populate("branch");
   res.status(200).json({ status: true, data: hods });
});

const getHodDetails = asyncHandler(async (req, res) => {
   const hod = await HOD.findById(req.params.id).populate("branch");
   if (!hod) {
      return res.status(404).json({ status: false, message: "HOD not found" });
   }
   res.status(200).json({ status: true, data: hod });
});

const updateHodDetails = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { uid, name, email, password, branch } = req.body;

   const hod = await HOD.findById(id);
   if (!hod) {
      return res.status(404).json({ status: false, message: "HOD not found" });
   }

   if (email && email !== hod.email) {
      const emailExists = await HOD.findOne({ email });
      if (emailExists) {
         return res
            .status(400)
            .json({ status: false, message: "Email already in use" });
      }
      hod.email = email;
   }

   if (name) hod.name = name;
   if (branch) hod.branch = branch;
   if (uid) hod.uid = uid;
   if (password) {
      const saltRounds = 10;
      hod.password = await bcrypt.hash(password, saltRounds);
   }

   const updatedHOD = await hod.save();
   res.status(200).json({
      status: true,
      message: "HOD updated",
      data: updatedHOD,
   });
});

const deleteHod = asyncHandler(async (req, res) => {
   const deletedHOD = await HOD.findByIdAndDelete(req.params.id);
   if (!deletedHOD) {
      return res.status(404).json({ status: false, message: "HOD not found" });
   }
   res.status(200).json({
      status: true,
      message: "HOD deleted",
      data: deletedHOD,
   });
});

export { addANewHod, getAllHods, getHodDetails, updateHodDetails, deleteHod };
