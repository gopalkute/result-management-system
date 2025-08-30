import { HOD } from "../models/HOD.model.js";
import { Branch } from "../models/branch.model.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";

//create new hod
const addANewHod = asyncHandler(async (req, res) => {
   const { uid, name, email, password, branch } = req.body;

   if (!uid || !name || !email || !password || !branch) {
      return res
         .status(400)
         .json({ status: false, message: "All fields are required" });
   }

   const branchExists = await Branch.findById(branch);
   if (!branchExists) {
      return res
         .status(404)
         .json({ status: false, message: "Branch not found" });
   }

   const existingHOD = await HOD.findOne({ $or: [{ uid }, { email }] });
   if (existingHOD) {
      return res
         .status(409)
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

//get all hods
const getAllHods = asyncHandler(async (req, res) => {
   const hods = await HOD.find().populate("branch", "code name duration");
   res.status(200).json({ status: true, data: hods });
});

//get single hod details
const getHodDetails = asyncHandler(async (req, res) => {
   const hod = await HOD.findById(req.params.id).populate(
      "branch",
      "code name duration"
   );
   if (!hod) {
      return res.status(404).json({ status: false, message: "HOD not found" });
   }
   res.status(200).json({ status: true, data: hod });
});

//update hod details
const updateHodDetails = asyncHandler(async (req, res) => {
   const { id } = req.params;
   const { uid, name, email, password, branch } = req.body;

   const hod = await HOD.findById(id);
   if (!hod) {
      return res.status(404).json({ status: false, message: "HOD not found" });
   }

   // Validate email uniqueness
   if (email && email !== hod.email) {
      const emailExists = await HOD.findOne({ email });
      if (emailExists) {
         return res
            .status(409)
            .json({ status: false, message: "Email already in use" });
      }
      hod.email = email;
   }

   if (uid) hod.uid = uid;
   if (name) hod.name = name;
   if (branch) {
      const branchExists = await Branch.findById(branch);
      if (!branchExists) {
         return res
            .status(404)
            .json({ status: false, message: "Branch not found" });
      }
      hod.branch = branch;
   }
   if (password) {
      hod.password = await bcrypt.hash(password, 10);
   }

   const updatedHOD = await hod.save();
   res.status(200).json({
      status: true,
      message: "HOD updated successfully",
      data: updatedHOD,
   });
});

//delete hod
const deleteHod = asyncHandler(async (req, res) => {
   const deletedHOD = await HOD.findByIdAndDelete(req.params.id);
   if (!deletedHOD) {
      return res.status(404).json({ status: false, message: "HOD not found" });
   }
   res.status(200).json({
      status: true,
      message: "HOD deleted successfully",
      data: deletedHOD,
   });
});

export { addANewHod, getAllHods, getHodDetails, updateHodDetails, deleteHod };
