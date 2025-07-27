import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { getAuth } from "@clerk/express";
import { log } from "../utils/logger";
import { sendError } from "../utils/responses";

// Rate limiting for journal analysis - 10 requests per 15 minutes per user
export const analyzeJournalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many analysis requests",
    details:
      "You can only analyze 10 journal entries per 15 minutes. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const { userId } = getAuth(req);
    return userId || ipKeyGenerator(req.ip || "anonymous"); // Use ipKeyGenerator helper for IPv6 compatibility
  },
  handler: (req, res) => {
    const { userId } = getAuth(req);
    log.warn("Rate limit exceeded for journal analysis", {
      userId: userId || "anonymous",
      ip: req.ip,
    });

    return sendError(
      res,
      "Too many analysis requests",
      429,
      "You can only analyze 10 journal entries per 15 minutes. Please try again later."
    );
  },
});
