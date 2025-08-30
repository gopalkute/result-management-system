import mongoose, { Schema } from "mongoose";

const branchSchema = new Schema(
   {
      code: {
         type: String,
         required: true,
         unique: true,
      },
      name: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
      duration: {
         type: Number,
         required: true,
      },
   },
   {
      timestamps: true,
      toJSON: {
         transform(doc, ret) {
            delete ret.updatedAt;
            delete ret.createdAt;
            delete ret.__v;
            return ret;
         },
      },
   }
);

export const Branch = mongoose.model("Branch", branchSchema);
