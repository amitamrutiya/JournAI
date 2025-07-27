import { Application } from "express";
import healthRoutes from "./health";
import authRoutes from "./auth";
import journalRoutes from "./journal";
import webhookRoutes from "./webhooks";
import { sendError } from "../utils/responses";

export function configureRoutes(app: Application): void {
  // Health and status routes
  app.use(healthRoutes);

  // Authentication routes
  app.use(authRoutes);

  // Journal-related routes
  app.use(journalRoutes);

  // Webhook routes
  app.use(webhookRoutes);

  // 404 handler - must be after all other routes
  app.use((req, res) => {
    sendError(res, `Route ${req.method} ${req.url} not found`, 404);
  });
}
