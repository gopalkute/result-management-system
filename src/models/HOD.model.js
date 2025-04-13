import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const HODSchema = new Schema(
   {
      uid: {
         type: String,
         unique: true,
         required: true,
         index: true,
      },
      branch: {
         type: Schema.Types.ObjectId, // refer to the branch
         ref: "Branch",
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
   },
   {
      timestamps: true,
   }
);

// Hash password before saving
HODSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   const saltRounds = 10;
   this.password = await bcrypt.hash(this.password, saltRounds);
   next();
});

// Password verification method
HODSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password);
};

// Generate Access Token
HODSchema.methods.generateAccessToken = function () {
   return jwt.sign(
      {
         _id: this._id,
         email: this.email,
         name: this.name,
         branch: this.branch,
         role: "hod",
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
      }
   );
};

// Generate Refresh Token
HODSchema.methods.generateRefreshToken = function () {
   return jwt.sign(
      {
         _id: this._id,
         role: "hod",
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
      }
   );
};

export const HOD = mongoose.model("HOD", HODSchema);
