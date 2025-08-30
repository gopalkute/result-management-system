import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const studentSchema = new Schema(
   {
      branch: {
         type: Schema.Types.ObjectId, // refer to the branch
         ref: "Branch",
      },
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
      otp: {
         type: String,
         default: undefined,
      },
      otpExpiry: {
         type: Date,
         default: undefined,
      },
      refreshToken: {
         type: String,
         default: undefined,
      },
      refreshTokenExpiresAt: {
         type: Date,
         default: undefined,
      },
   },
   {
      timestamps: true,
      toJSON: {
         transform(doc, ret) {
            delete ret.password;
            delete ret.otp;
            delete ret.otpExpiry;
            delete ret.refreshToken;
            delete ret.refreshTokenExpiresAt;
            delete ret.__v;
            return ret;
         },
      },
   }
);

// Hash password before save
studentSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next();
});

// Compare password
studentSchema.methods.comparePassword = async function (enteredPassword) {
   return bcrypt.compare(enteredPassword, this.password);
};

// Generate Access Token
studentSchema.methods.generateAccessToken = function () {
   return jwt.sign(
      { _id: this._id, branch: this.branch, role: "student" },
      process.env.JWT_SECRET,
      {
         expiresIn: "15m",
      }
   );
};

// Generate Refresh Token and set expiry date
studentSchema.methods.generateRefreshToken = function () {
   const token = jwt.sign(
      { _id: this._id, branch: this.branch, role: "student" },
      process.env.JWT_REFRESH_SECRET,
      {
         expiresIn: "7d",
      }
   );

   const decoded = jwt.decode(token);
   this.refreshToken = token;
   this.refreshTokenExpiresAt = new Date(decoded.exp * 1000);

   return token;
};

export const Student = mongoose.model("Student", studentSchema);
