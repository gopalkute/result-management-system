import { Branch } from "../models/branch.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addNewBranch = asyncHandler(async (req, res) => {
   const branch = new Branch(req.body);
   const savedBranch = await branch.save();
   res.status(201).json({
      status: true,
      message: "Branch created successfully",
      data: savedBranch,
   });
});

const getAllBranches = asyncHandler(async (req, res) => {
   const branches = await Branch.find();
   res.status(200).json({ status: true, data: branches });
});

const getBranchDetails = asyncHandler(async (req, res) => {
   const branch = await Branch.findById(req.params.id);
   if (!branch) {
      return res
         .status(404)
         .json({ status: false, message: "Branch not found" });
   }
   res.status(200).json({ status: true, data: branch });
});

const updateBranchDetails = asyncHandler(async (req, res) => {
   const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
         new: true,
         runValidators: true,
      }
   );
   if (!updatedBranch) {
      return res
         .status(404)
         .json({ status: false, message: "Branch not found" });
   }
   res.status(200).json({
      status: true,
      message: "Branch updated",
      data: updatedBranch,
   });
});

const deleteBranch = asyncHandler(async (req, res) => {
   const deletedBranch = await Branch.findByIdAndDelete(req.params.id);
   if (!deletedBranch) {
      return res
         .status(404)
         .json({ status: false, message: "Branch not found" });
   }
   res.status(200).json({
      status: true,
      message: "Branch deleted",
      data: deletedBranch,
   });
});

export {
   addNewBranch,
   getAllBranches,
   getBranchDetails,
   updateBranchDetails,
   deleteBranch,
};
