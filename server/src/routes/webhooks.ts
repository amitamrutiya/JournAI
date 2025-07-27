import { Router } from "express";
import express from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { handleClerkWebhook } from "../handlers/webhookHandler";
import { sendError } from "../utils/responses";
import { log } from "../utils/logger";

const router = Router();

// Clerk webhook handler
router.post(
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

export default router;
