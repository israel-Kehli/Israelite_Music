import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./lib/connectDB.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import categoryRouter from "./routes/category.route.js";
import webhookRouter from "./routes/webhook.route.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";

const app = express();

const rawOrigins = process.env.CLIENT_URL || "";
const normalizeOrigin = (value = "") => value.trim().replace(/\/+$/, "");
const allowedOrigins = new Set(
  [
    "https://israelitemusic.com.ng",
    "https://www.israelitemusic.com.ng",
    "http://localhost:5173",
    ...rawOrigins.split(","),
  ]
    .map(normalizeOrigin)
    .filter(Boolean)
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no Origin header (curl, server-to-server, same-origin).
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);
      return callback(null, allowedOrigins.has(normalizedOrigin));
    },
    credentials: true,
  })
);

app.use(clerkMiddleware());
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(503).json({
      message: "Database is unavailable. Please try again later.",
    });
  }
});

app.use("/webhooks", webhookRouter);
app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/categories", categoryRouter);

app.use((error, req, res, next) => {
  res.status(error.status || 500);

  res.json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

export default app;
