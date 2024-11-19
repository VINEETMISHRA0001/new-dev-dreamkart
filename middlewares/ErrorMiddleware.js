// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Development Error: log the full stack for debugging
  if (process.env.NODE_ENV === "development") {
    console.error("ERROR 💥:", err);
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // Production Error: Send only operational errors
  if (process.env.NODE_ENV === "production") {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Log the error (optional: you can add more advanced logging here)
      console.error("ERROR 💥:", err);

      // Send a generic message
      return res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
    }
  }
};

module.exports = globalErrorHandler;
