import mongoose, { Schema } from "mongoose";

const branchSchema = new Schema(
   {
      branchId: {
         type: Number,
         required: true,
         unique: true,
      },
      name: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
   },
   {
      timestamps: true,
   }
);

export const Branch = mongoose.model("Branch", branchSchema);
