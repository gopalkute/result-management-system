import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
   {
      prn: {
         type: String,
         unique: true,
         required: true,
         index: true,
         trim: true,
      },
      name: {
         type: String,
         required: true,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String, // hashed password store
         required: true,
      },
      refreshToken: {
         type: String, // for varification and providing the access token
      },
      branch: {
         type: Schema.Types.ObjectId, // refer to the branch
         ref: "Branch",
      },
   },
   {
      timestamps: true,
   }
);

export const Student = mongoose.model("Student", studentSchema);
