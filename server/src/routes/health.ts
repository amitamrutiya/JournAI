import { Router } from "express";
import { sendSuccess } from "../utils/responses";

const router = Router();

// Root endpoint
router.get("/", (_, res) => {
  sendSuccess(
    res,
    { service: "JournAI API", status: "running" },
    "Welcome to the JournAI server!"
  );
});

// Health check endpoint
router.get("/health", (_, res) => {
  sendSuccess(
    res,
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    },
    "Service is healthy"
  );
});

export default router;
