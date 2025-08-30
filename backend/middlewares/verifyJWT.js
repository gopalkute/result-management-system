import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
   try {
      const token =
         req.cookies?.refreshToken ||
         req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
         return res.status(401).json({
            status: false,
            message: "Unauthorized. Token missing.",
         });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // contains { _id, role }

      next();
   } catch (error) {
      return res.status(401).json({
         status: false,
         message: "Invalid or expired token.",
      });
   }
};

export { verifyJWT };
