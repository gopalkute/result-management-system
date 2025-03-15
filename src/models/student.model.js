import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
   {
      
   },
   {
      timestamps: true,
   }
);

export const Student = mongoose.model("Student", studentSchema);
