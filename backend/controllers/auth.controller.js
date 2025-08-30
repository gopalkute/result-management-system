import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Admin } from "../models/admin.model.js";
import { HOD } from "../models/HOD.model.js";
import { Student } from "../models/student.model.js";
import { sendOTP } from "../utils/sendOTP.js";
import { generateOTP } from "../utils/generateOTP.js";

const userModels = {
   admin: Admin,
   hod: HOD,
   student: Student,
};

//login
const login = async (req, res) => {
   try {
      const { email, password, role } = req.body;
      if (!email || !password || !role) {
         return res.status(400).json({
            status: false,
            message: "Email, password, and role are required",
         });
      }

      const Model = userModels[role.toLowerCase()];
      if (!Model)
         return res
            .status(400)
            .json({ status: false, message: "Invalid role" });

      const user = await Model.findOne({ email });
      if (!user)
         return res
            .status(404)
            .json({ status: false, message: "User not found" });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
         return res
            .status(401)
            .json({ status: false, message: "Invalid credentials" });

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("refreshToken", refreshToken, {
         httpOnly: true,
         secure: true,
         sameSite: "strict",
      });

      return res.json({
         status: true,
         message: "Login successful",
         data: { accessToken, userId: user._id, role },
      });
   } catch (error) {
      res.status(500).json({ status: false, message: error.message });
   }
};

//logout
const logout = async (req, res) => {
   try {
      const { role, _id } = req.user;
      const Model = userModels[role.toLowerCase()];

      await Model.findByIdAndUpdate(_id, { refreshToken: "" });
      res.clearCookie("refreshToken");

      return res.json({ status: true, message: "Logged out successfully" });
   } catch (error) {
      res.status(500).json({ status: false, message: error.message });
   }
};

//get profile
const getProfile = async (req, res) => {
   try {
      const { role, _id } = req.user;
      const Model = userModels[role.toLowerCase()];

      let user = await Model.findById(_id).populate("branch");

      return res.json({ status: true, data: user, role });
   } catch (error) {
      res.status(500).json({ status: false, message: error.message });
   }
};

//get new access token
const getAccessToken = async (req, res) => {
   try {
      const { refreshToken } = req.cookies;
      if (!refreshToken)
         return res
            .status(401)
            .json({ status: false, message: "No refresh token provided" });

      jwt.verify(
         refreshToken,
         process.env.JWT_REFRESH_SECRET,
         async (err, decoded) => {
            if (err)
               return res
                  .status(403)
                  .json({ status: false, message: "Invalid refresh token" });

            const Model = userModels[decoded.role.toLowerCase()];
            const user = await Model.findById(decoded._id);
            if (!user || user.refreshToken !== refreshToken) {
               return res
                  .status(403)
                  .json({ status: false, message: "Refresh token mismatch" });
            }

            const accessToken = jwt.sign(
               { _id: decoded._id, role: decoded.role },
               process.env.JWT_SECRET,
               { expiresIn: "15m" }
            );

            return res.json({ status: true, accessToken });
         }
      );
   } catch (error) {
      res.status(500).json({ status: false, message: error.message });
   }
};

//request otp for email change
const requestEmailChangeOTP = async (req, res) => {
   try {
      const { role, _id } = req.user;
      const Model = userModels[role.toLowerCase()];
      const user = await Model.findById(_id);

      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
      await user.save();

      await sendOTP(user.email, otp);
      return res.json({
         status: true,
         message: "OTP sent to your current email",
      });
   } catch (error) {
      res.status(500).json({ status: false, message: error.message });
   }
};

//Change Email after OTP verification
const changeEmail = async (req, res) => {
   try {
      const { newEmail, otp } = req.body;
      const { role, _id } = req.user;

      const Model = userModels[role.toLowerCase()];
      const user = await Model.findById(_id);

      if (!otp || otp !== user.otp || Date.now() > user.otpExpiry) {
         return res
            .status(400)
            .json({ status: false, message: "Invalid or expired OTP" });
      }

      user.email = newEmail;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      return res.json({ status: true, message: "Email updated successfully" });
   } catch (error) {
      res.status(500).json({ status: false, message: error.message });
   }
};

//change password
const changePassword = async (req, res) => {
   try {
      const { oldPassword, newPassword } = req.body;
      const { role, _id } = req.user;

      const Model = userModels[role.toLowerCase()];
      const user = await Model.findById(_id);

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
         return res
            .status(400)
            .json({ status: false, message: "Old password is incorrect" });

      user.password = newPassword;
      await user.save();

      return res.json({
         status: true,
         message: "Password changed successfully",
      });
   } catch (error) {
      res.status(500).json({ status: false, message: error.message });
   }
};

//reset password (request otp)
const requestPasswordReset = async (req, res) => {
   try {
      const { email, role } = req.body;
      const Model = userModels[role.toLowerCase()];

      const user = await Model.findOne({ email });
      if (!user)
         return res
            .status(404)
            .json({ status: false, message: "User not found" });

      const date = new Date();
      const timeZone = "Asia/Kolkata";
      const currentTime = new Date(date.toLocaleString("en-US", { timeZone }));

      const otp = generateOTP();

      user.otp = otp;
      user.otpExpiry = new Date(currentTime.getTime() + 10 * 60 * 1000);

      await user.save();

      await sendOTP(email, otp);
      return res.json({ status: true, message: "OTP sent to email" });
   } catch (error) {
      res.status(500).json({ status: false, message: error.message });
   }
};

//reset password (verify otp)
const resetPassword = async (req, res) => {
   try {
      const { email, role, otp, newPassword } = req.body;
      const Model = userModels[role.toLowerCase()];

      const user = await Model.findOne({ email });
      if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
         return res
            .status(400)
            .json({ status: false, message: "Invalid or expired OTP" });
      }

      // const salt = await bcrypt.genSalt(10);
      // await bcrypt.hash(newPassword, salt)
      user.password = newPassword;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      return res.json({ status: true, message: "Password reset successfully" });
   } catch (error) {
      res.status(500).json({ status: false, message: error.message });
   }
};

export {
   login,
   logout,
   getProfile,
   getAccessToken,
   requestEmailChangeOTP,
   changeEmail,
   changePassword,
   requestPasswordReset,
   resetPassword,
};
