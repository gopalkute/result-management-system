import mongoose, { Schema } from "mongoose";

const HODSchema = new Schema(
   {
      uid: {
         type: String,
         unique: true,
         required: true,
         index: true,
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
         // for varification and providing the access token
         type: String,
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

export const HOD = mongoose.model("HOD", HODSchema);
