import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiResponse.js";

const authMiddleware = (roles = []) => {
   return (req, res, next) => {
      try {
         // Get token from headers
         const token =
            req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];

         if (!token) {
            return res.status(401).json(new ApiError("Unauthorized request"));
         }

         // Verify JWT token
         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
         req.user = decoded; // Attach user data

         // Check if user has required role
         if (roles.length && !roles.includes(req.user.role)) {
            return res
               .status(403)
               .json(new ApiError("Forbidden: Insufficient permissions"));
         }

         next();
      } catch (error) {
         return res
            .status(401)
            .json(new ApiError("Unauthorized: Invalid token"));
      }
   };
};

export default authMiddleware;
