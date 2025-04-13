const asyncHandler = (requestHandler) => {
   return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next)).catch((err) => {
         res.status(500).json({
            success: false,
            message: err.message,
         });
      });
   };
};

export { asyncHandler };
