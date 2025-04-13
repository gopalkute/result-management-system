import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { HOD } from "../models/HOD.model.js";
import { Student } from "../models/student.model.js";
import jwt from "jsonwebtoken";

const getUserProfile = asyncHandler(async (req, res) => {
   const { role, _id } = req.user;

   if (!role || !_id) {
      return res.status(400).json({
         status: false,
         message: "User role or ID missing in request",
      });
   }

   const userModel = role === "hod" ? HOD : Student;

   const userData = await userModel
      .findById(_id)
      .select("-password -refreshToken")
      .populate("branch");

   if (!userData) {
      return res.status(404).json({
         status: false,
         message: "User not found",
      });
   }

   res.status(200).json({
      status: true,
      message: "User profile fetched successfully",
      data: userData,
   });
});

const loginAsAdmin = asyncHandler(async (req, res) => {
   const { email, password } = req.body;
   if (
      email == `${process.env.ADMIN_EMAIL}` &&
      password == `${process.env.ADMIN_PASSWORD}`
   ) {
      const accessToken = await jwt.sign(
         {
            email: email,
            role: "admin",
         },
         process.env.ACCESS_TOKEN_SECRET,
         {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
         }
      );

      const refreshToken = await jwt.sign(
         {
            email: email,
            role: "admin",
         },
         process.env.REFRESH_TOKEN_SECRET,
         {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "15m",
         }
      );

      const options = {
         httpOnly: true,
         secure: true,
      };

      res.status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", refreshToken, options)
         .json(new ApiResponse("admin login successfully"));
   } else {
      res.status(400).json(new ApiError("invalid credential"));
   }
});

const logoutAdmin = asyncHandler(async (req, res) => {
   const refreshToken = req.cookies?.refreshToken;
   const accessToken = req.cookies?.accessToken;

   console.log(req.cookies);
   if (!refreshToken) {
      return res.status(204).json({ status: false, message: "No content" }); // No token, but not an error
   }

   const options = {
      httpOnly: true,
      secure: true,
   };

   // Clear the cookie
   res.clearCookie("accessToken", accessToken, options).clearCookie(
      "refreshToken",
      refreshToken,
      options
   );

   res.status(200).json({ status: true, message: "Logout successful" });
});

const loginAsHOD = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   // Check if HOD exists
   const hod = await HOD.findOne({ email });
   if (!hod) {
      return res
         .status(401)
         .json({ status: false, message: "Invalid email or password" });
   }

   // Verify password
   const isValidPassword = await hod.isPasswordCorrect(password);
   if (!isValidPassword) {
      return res
         .status(401)
         .json({ status: false, message: "Invalid email or password" });
   }

   // Generate tokens
   const accessToken = hod.generateAccessToken();
   const refreshToken = hod.generateRefreshToken();

   // Save refresh token in DB
   hod.refreshToken = refreshToken;
   await hod.save();

   const options = {
      httpOnly: true,
      secure: true,
   };

   // Send tokens and user data
   res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
         status: true,
         message: "Login successful",
      });
});

const logoutHOD = asyncHandler(async (req, res) => {
   const refreshToken = req.cookies?.refreshToken;
   const accessToken = req.cookies?.accessToken;

   if (!refreshToken) {
      return res.status(204).json({ status: true, message: "No content" }); // No token, but not an error
   }

   // Find HOD by refreshToken
   const hod = await HOD.findOne({ refreshToken });

   if (hod) {
      hod.refreshToken = null;
      await hod.save();
   }

   const options = {
      httpOnly: true,
      secure: true,
   };

   // Clear the cookie
   res.clearCookie("accessToken", accessToken, options).clearCookie(
      "refreshToken",
      refreshToken,
      options
   );

   res.status(200).json({ status: true, message: "Logout successful" });
});

const loginAsStudent = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   const student = await Student.findOne({ email });

   if (!student || !(await student.isPasswordCorrect(password))) {
      return res
         .status(401)
         .json({ status: false, message: "Invalid credentials" });
   }

   const accessToken = student.generateAccessToken();
   const refreshToken = student.generateRefreshToken();

   student.refreshToken = refreshToken;
   await student.save();

   const options = {
      httpOnly: true,
      secure: true,
   };

   // Send tokens and user data
   res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
         status: true,
         message: "Login successful",
      });
});

const logoutStudent = asyncHandler(async (req, res) => {
   const refreshToken = req.cookies?.refreshToken;
   const accessToken = req.cookies?.accessToken;

   if (!refreshToken) {
      return res.status(204).json({ status: true, message: "No content" }); // No token, but not an error
   }

   const student = await Student.findOne({ refreshToken });
   if (student) {
      student.refreshToken = null;
      await student.save();
   }

   const options = {
      httpOnly: true,
      secure: true,
   };

   // Clear the cookie
   res.clearCookie("accessToken", accessToken, options).clearCookie(
      "refreshToken",
      refreshToken,
      options
   );

   res.status(200).json({ status: true, message: "Logout successful" });
});

export {
   getUserProfile,
   loginAsAdmin,
   logoutAdmin,
   loginAsHOD,
   logoutHOD,
   loginAsStudent,
   logoutStudent,
};
