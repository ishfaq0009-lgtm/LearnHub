import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnection from "./shared/config/db/dbconection.js";
import userRouter from "./modules/user/user.route.js";
import courseRouter from "./modules/courses/course.route.js";
import contactRouter from "./modules/contact/contact.route.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

// Supports one or many frontend origins, separated by commas.
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

console.log("[CORS] Allowed origins:", allowedOrigins);

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no Origin header, such as server-to-server or curl.
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    console.warn(
      `[CORS] Blocked origin: ${origin}. Allowed origins: ${allowedOrigins.join(", ")}`
    );

    // Do not throw an error here. Returning false means no CORS header.
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

app.get("/", (_req, res) =>
  res.json({ success: true, message: "LearnHub API is running" })
);

app.get("/api/health", (_req, res) =>
  res.json({ success: true, message: "API healthy" })
);

app.use(["/user", "/api/courses", "/api/contact"], async (_req, _res, next) => {
  try {
    await dbConnection();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/user", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/contact", contactRouter);

app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
);

app.use((error, _req, res, _next) => {
  console.error(error);

  const isValidationError = ["ValidationError", "CastError"].includes(
    error.name
  );

  const status =
    error.status ||
    (error.name === "MulterError" || isValidationError ? 400 : 500);

  res.status(status).json({
    success: false,
    message:
      status === 500
        ? "Something went wrong on the server."
        : error.message,
  });
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  dbConnection()
    .then(() =>
      app.listen(PORT, () =>
        console.log(`LearnHub API running on port ${PORT}`)
      )
    )
    .catch((error) => {
      console.error("Database connection failed:", error.message);
      process.exit(1);
    });
}

export default app;