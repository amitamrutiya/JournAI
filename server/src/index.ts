import express from "express";
import dotenv from "dotenv";
import {
  clerkMiddleware,
  requireAuth,
  getAuth,
  clerkClient,
  User,
} from "@clerk/express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { handleClerkWebhook } from "./handlers/webhookHandler";
import { sendSuccess, sendError } from "./utils/responses";
import { log } from "./utils/logger";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.use(clerkMiddleware());

app.get("/", (_, res) => {
  sendSuccess(
    res,
    { service: "JournAI API", status: "running" },
    "Welcome to the JournAI server!"
  );
});

app.get("/health", (_, res) => {
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

app.get("/protected", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    log.warn("Unauthorized access attempt");
    return sendError(res, "User authentication required", 401);
  }

  try {
    const user: User = await clerkClient.users.getUser(userId);
    log.info("User data retrieved successfully", { userId });
    return sendSuccess(res, { user }, "User data retrieved successfully");
  } catch (error) {
    log.error(
      "Failed to retrieve user data",
      error instanceof Error ? error : new Error(String(error)),
      { userId }
    );
    return sendError(
      res,
      "Failed to retrieve user data",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

app.post(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      // Verify the webhook signature
      const evt = await verifyWebhook(req);
      if (!evt) {
        log.error(
          "Invalid webhook event received",
          new Error("Webhook verification failed")
        );
        return sendError(
          res,
          "Invalid webhook event",
          400,
          "Webhook verification failed"
        );
      }

      log.info("Webhook verification successful", { eventType: evt.type });

      // Pass to the webhook handler
      await handleClerkWebhook({ body: evt } as any, res);
    } catch (err) {
      log.error(
        "Webhook verification failed",
        err instanceof Error ? err : new Error(String(err))
      );

      return sendError(
        res,
        "Unable to verify webhook authenticity",
        400,
        err instanceof Error ? err.message : "Unknown verification error"
      );
    }
  }
);

// 404 handler - must be after all other routes
app.use((req, res) => {
  sendError(res, `Route ${req.method} ${req.url} not found`, 404);
});

app.listen(PORT, () => {
  log.info(`Server started successfully on port ${PORT}`);
});
