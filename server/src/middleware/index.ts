import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

export function configureMiddleware(app: express.Application): void {
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    })
  );

  app.use(express.json());

  app.use(clerkMiddleware());
}
