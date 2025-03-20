import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

// Hash password before saving
studentSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUND) || 10;
   this.password = await bcrypt.hash(this.password, saltRounds);
   next();
});

// Password verification method
studentSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password);
};

// Generate Access Token
studentSchema.methods.generateAccessToken = function () {
   return jwt.sign(
      {
         _id: this._id,
         email: this.email,
         prn: this.prn,
         name: this.name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
      }
   );
};

// Generate Refresh Token
studentSchema.methods.generateRefreshToken = function () {
   return jwt.sign(
      {
         _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
      }
   );
};

export const Student = mongoose.model("Student", studentSchema);
