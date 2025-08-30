// controllers/branch.controller.js
import { Branch } from "../models/branch.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// Create new branch
const addNewBranch = async (req, res) => {
   try {
      const { code, name, duration } = req.body;

      // Validation
      if (!code || !name || !duration) {
         return res
            .status(400)
            .json({ status: false, message: "All fields are required" });
      }

      // Check if branch already exists by code or name
      const existingBranch = await Branch.findOne({
         $or: [{ code }, { name }],
      });

      if (existingBranch) {
         return res.status(409).json({
            status: false,
            message: "Branch with the same code or name already exists",
         });
      }

      // Save new branch
      const branch = new Branch({ code, name, duration });
      const savedBranch = await branch.save();

      res.status(201).json({
         status: true,
         message: "Branch created successfully",
         data: savedBranch,
      });
   } catch (error) {
      res.status(500).json({
         status: false,
         message: "Something went wrong",
         error: error.message,
      });
   }
};

// Get all branches
const getAllBranches = asyncHandler(async (req, res) => {
   const branches = await Branch.find().sort({ createdAt: -1 });
   res.status(200).json({ status: true, data: branches });
});

// Get branch by ID
const getBranchDetails = asyncHandler(async (req, res) => {
   const branch = await Branch.findById(req.params.id);
   if (!branch) {
      return res
         .status(404)
         .json({ status: false, message: "Branch not found" });
   }
   res.status(200).json({ status: true, data: branch });
});

// Update branch by ID
const updateBranchDetails = asyncHandler(async (req, res) => {
   const { code, name, duration } = req.body;

   const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      { code, name, duration },
      { new: true, runValidators: true }
   );

   if (!updatedBranch) {
      return res
         .status(404)
         .json({ status: false, message: "Branch not found" });
   }

   res.status(200).json({
      status: true,
      message: "Branch updated successfully",
      data: updatedBranch,
   });
});

// Delete branch by ID
const deleteBranch = asyncHandler(async (req, res) => {
   const deletedBranch = await Branch.findByIdAndDelete(req.params.id);
   if (!deletedBranch) {
      return res
         .status(404)
         .json({ status: false, message: "Branch not found" });
   }
   res.status(200).json({
      status: true,
      message: "Branch deleted successfully",
   });
});

export {
   addNewBranch,
   getAllBranches,
   getBranchDetails,
   updateBranchDetails,
   deleteBranch,
};
