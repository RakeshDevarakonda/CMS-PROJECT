// errorMiddleware.js
export const errorHandler = (err, req, res, next) => {
  console.log("Error:", err.message);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    error: err.message,
    customCode: err.customCode || null,
  });
};
