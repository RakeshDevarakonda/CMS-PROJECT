import express from "express";
import { upload } from "./middlewares/multer.js";
import "dotenv/config";
import cors from "cors";
import { mongoosedatabse } from "./config/db-config.js";
import createrRouter from "./routes/creator/creater-routes.js";
import authRouter from "./routes/auth/auth-routes.js";
import cookieParser from "cookie-parser";
import { loggerMiddleware } from "./utils/logger-middleware.js";
import { uploadToCloudinary } from "./utils/cloudinary.js";
import moderatoreRouter from "./routes/moderator/moderator-routes.js";
import { errorHandler } from "./utils/error-handler.js";
import adminRouter from "./routes/admin/admin-routes.js";
import homePageRouter from "./routes/homepage/home-page-routes.js";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";
import { createServer } from "http";
import helmet from "helmet";
import { throwError } from "./utils/throw-error.js";
import { initSocketServer } from "./socket.js";
import { extractPublicId } from "./utils/DeleteUrls.js";
import { v2 as cloudinary } from "cloudinary";

const app = express();

const corsOptions = {
  origin: [process.env.FRONTEND_URL1, process.env.FRONTEND_URL2],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(helmet());

const rateLimiter = rateLimit({
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

app.use(rateLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.redirect("https://cms-project-kappa.vercel.app");
});

app.post("/api/addurls", upload.array("file"), async (req, res, next) => {
  const photos = req.files?.map((file) => file.path) || [];
  let uploadedImageUrls = [];
  let result;
  try {
    if (photos.length > 0) {
      result = await uploadToCloudinary(photos);

      if (result.success) {
        uploadedImageUrls = result.urls;
        return res.json({
          message: "Images uploaded successfully",
          urls: uploadedImageUrls,
        });
      } else {
        throwError(400, result.error.message);
      }
    } else {
      return res.status(400).json({ message: "No files provided" });
    }
  } catch (error) {
    console.log(error);
    for (const url of uploadedImageUrls) {
      const publicId = extractPublicId(url);
      await cloudinary.uploader.destroy(publicId);
    }
    next(error);
  }
});

app.use("/api/homepage", homePageRouter);
app.use("/api/auth", authRouter);
app.use("/api/creator", createrRouter);
app.use("/api/moderator", moderatoreRouter);
app.use("/api/admin", adminRouter);

const server = createServer(app);
initSocketServer(server);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  mongoosedatabse();
  console.log("Example app listening on port " + PORT + "!");
});
