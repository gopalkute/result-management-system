const authorizeRoles = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return res.status(403).json({
            status: false,
            message: "Access Denied. Insufficient permissions.",
         });
      }
      next();
   };
};

export { authorizeRoles };
