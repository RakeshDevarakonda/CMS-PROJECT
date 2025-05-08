import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "response-logging" },
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});

export const loggerMiddleware = (req, res, next) => {
  const originalSend = res.send; // Store the original `res.send` function

  // Override `res.send` to log the response before sending
  res.send = function (body) {
    // Log the response status, body, and other details
    logger.info({
      status: res.statusCode,
      response: body, // The data sent to the frontend
      endpoint: `${req.method} ${req.url}`,
    });

    // Call the original `res.send` to send the response
    originalSend.call(res, body);
  };

  next(); // Proceed to the next middleware/route
};
