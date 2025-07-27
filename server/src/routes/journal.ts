import { Router } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { sendSuccess, sendError } from "../utils/responses";
import { log } from "../utils/logger";
import { createGeminiService } from "../services/geminiService";
import { JournalService } from "../services/journalService";
import { analyzeJournalLimiter } from "../middleware/rateLimiters";

const router = Router();

// Analyze journal text with AI
router.post(
  "/api/analyze-journal",
  analyzeJournalLimiter,
  requireAuth(),
  async (req, res) => {
    const { userId } = getAuth(req);
    if (!userId) {
      log.warn("Unauthorized access attempt to analyze journal");
      return sendError(res, "User authentication required", 401);
    }

    try {
      // Basic validation
      const { text } = req.body;
      const trimmedText = text.trim();
      if (!text || typeof text !== "string" || trimmedText.length === 0) {
        log.warn("Invalid text field in journal analysis request", { userId });
        return sendError(res, "Please provide valid journal text", 400);
      }

      log.info("Journal analysis request received", {
        userId,
        textLength: trimmedText.length,
      });

      // Initialize Gemini service
      let geminiService;
      try {
        geminiService = createGeminiService();
      } catch (serviceError) {
        log.error(
          "Failed to initialize Gemini service",
          serviceError instanceof Error
            ? serviceError
            : new Error(String(serviceError)),
          { userId }
        );
        return sendError(
          res,
          "AI analysis service is currently unavailable",
          503,
          "Service configuration error"
        );
      }

      // Analyze journal with Gemini AI
      try {
        const analysis = await geminiService.analyzeJournal(trimmedText);

        log.info("Gemini analysis completed successfully", {
          userId,
          mood: analysis.mood,
          textLength: trimmedText.length,
        });

        return sendSuccess(
          res,
          analysis,
          "Journal analysis completed successfully"
        );
      } catch (analysisError) {
        log.error(
          "Gemini analysis failed",
          analysisError instanceof Error
            ? analysisError
            : new Error(String(analysisError)),
          { userId, textLength: trimmedText.length }
        );

        // Return a default response asking for journal content
        const defaultAnalysis = {
          mood: "neutral",
          summary:
            "Please share your journal thoughts and experiences for analysis",
          reason:
            "Unable to analyze the provided content. Please write about your day, feelings, or experiences.",
        };

        return sendSuccess(
          res,
          defaultAnalysis,
          "Please provide journal content for analysis"
        );
      }
    } catch (error) {
      log.error(
        "Error processing journal analysis",
        error instanceof Error ? error : new Error(String(error)),
        { userId }
      );
      return sendError(
        res,
        "Failed to analyze journal",
        500,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// Save journal entry to database
router.post("/api/save-journal", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    log.warn("Unauthorized access attempt to save journal");
    return sendError(res, "User authentication required", 401);
  }

  try {
    const { text, mood, summary, reason } = req.body;

    // Basic validation
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      log.warn("Invalid text field in save journal request", { userId });
      return sendError(res, "Please provide valid journal text", 400);
    }

    if (!mood || !summary || !reason) {
      log.warn("Missing required fields in save journal request", { userId });
      return sendError(res, "Missing required analysis fields", 400);
    }

    log.info("Journal save request received", {
      userId,
      textLength: text.trim().length,
      mood,
    });

    // Save journal to database using JournalService
    try {
      const journalData = {
        userId,
        text: text.trim(),
        mood,
        summary,
        reason,
      };

      const savedJournal = await JournalService.saveJournal(journalData);

      log.info("Journal saved successfully", {
        userId,
        mood,
        journalId: savedJournal.id,
      });

      return sendSuccess(
        res,
        {
          id: savedJournal.id,
          title: savedJournal.title,
          mood: savedJournal.mood,
          createdAt: savedJournal.createdAt,
        },
        "Journal saved successfully"
      );
    } catch (dbError) {
      log.error(
        "Database error saving journal",
        dbError instanceof Error ? dbError : new Error(String(dbError)),
        { userId, mood }
      );

      // Return a more specific error message
      return sendError(
        res,
        "Failed to save journal to database",
        500,
        dbError instanceof Error ? dbError.message : "Database connection error"
      );
    }
  } catch (error) {
    log.error(
      "Error saving journal",
      error instanceof Error ? error : new Error(String(error)),
      { userId }
    );
    return sendError(
      res,
      "Failed to save journal",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

// Extract text from PDF (placeholder)
router.post("/api/pdf-extract", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    log.warn("Unauthorized access attempt to extract PDF");
    return sendError(res, "User authentication required", 401);
  }

  try {
    // TODO: Implement PDF text extraction logic
    // For now, return a placeholder response
    log.info("PDF extract request received", { userId });

    return sendError(
      res,
      "PDF extraction not implemented yet",
      501,
      "This feature is coming soon"
    );
  } catch (error) {
    log.error(
      "Error extracting PDF",
      error instanceof Error ? error : new Error(String(error)),
      { userId }
    );
    return sendError(
      res,
      "Failed to extract PDF text",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export default router;
