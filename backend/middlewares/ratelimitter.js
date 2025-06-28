


import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 1000 * 60 * 10, // 1000milliseconds equals to 1 second toatal 10 minutes
  max: 100,
  message: {
    status: 429,
    error: "Too many login attempts, please try again after 10 minutes.",
  },
  handler: (req, res, next, options) => {
    console.error(
      `Rate limit hit: ${req.ip} tried ${req.originalUrl} too many times.`
    );

    throwError(
      429,
      "Too many login attempts, please try again after 10 minutes."
    );

    res.status(options.statusCode).json(options.message);
  },
});