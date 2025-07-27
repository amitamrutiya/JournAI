import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

export function configureMiddleware(app: express.Application): void {
  // CORS configuration
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    })
  );

  // JSON parsing middleware
  app.use(express.json());

  // Clerk authentication middleware
  app.use(clerkMiddleware());
}
