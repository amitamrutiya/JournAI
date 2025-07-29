import { Router } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { sendSuccess, sendError } from "../utils/responses";
import { log } from "../utils/logger";
import { createGeminiService } from "../services/geminiService";
import { JournalService } from "../services/journalService";
import { analyzeJournalLimiter } from "../middleware/rateLimiters";

const router = Router();

// Analyze journal text with AI
router.post("/api/analyze-journal", analyzeJournalLimiter, async (req, res) => {
  let { userId } = getAuth(req);

  if (!userId) {
    userId = "anonymous";
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
});

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

    const moodValue = mood && typeof mood === "string" ? mood : "";
    const summaryValue = summary && typeof summary === "string" ? summary : "";
    const reasonValue = reason && typeof reason === "string" ? reason : "";

    log.info("Journal save request received", {
      userId,
      textLength: text.trim().length,
      mood: moodValue,
      hasAnalysis: !!(moodValue && summaryValue && reasonValue),
    });

    // Save journal to database using JournalService
    try {
      const journalData = {
        userId,
        text: text.trim(),
        mood: moodValue,
        summary: summaryValue,
        reason: reasonValue,
      };

      const savedJournal = await JournalService.saveJournal(journalData);

      log.info("Journal saved successfully", {
        userId,
        mood: moodValue,
        journalId: savedJournal.id,
        hasAnalysis: !!(moodValue && summaryValue && reasonValue),
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

// Update journal entry in database
router.put("/api/update-journal/:id", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    log.warn("Unauthorized access attempt to update journal");
    return sendError(res, "User authentication required", 401);
  }

  try {
    const { id: journalId } = req.params;
    const { text, mood, summary, reason } = req.body;

    // Basic validation
    if (!journalId) {
      log.warn("Missing journal ID in update request", { userId });
      return sendError(res, "Journal ID is required", 400);
    }

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      log.warn("Invalid text field in update journal request", { userId });
      return sendError(res, "Please provide valid journal text", 400);
    }

    const moodValue = mood && typeof mood === "string" ? mood : "";
    const summaryValue = summary && typeof summary === "string" ? summary : "";
    const reasonValue = reason && typeof reason === "string" ? reason : "";

    log.info("Journal update request received", {
      userId,
      journalId,
      textLength: text.trim().length,
      mood: moodValue,
      hasAnalysis: !!(moodValue && summaryValue && reasonValue),
    });

    // Update journal in database using JournalService
    try {
      const journalData = {
        text: text.trim(),
        mood: moodValue,
        summary: summaryValue,
        reason: reasonValue,
      };

      const updatedJournal = await JournalService.updateJournal(
        journalId,
        userId,
        journalData
      );

      if (!updatedJournal) {
        log.warn("Journal not found or access denied for update", {
          userId,
          journalId,
        });
        return sendError(res, "Journal not found", 404);
      }

      log.info("Journal updated successfully", {
        userId,
        mood: moodValue,
        journalId,
        hasAnalysis: !!(moodValue && summaryValue && reasonValue),
      });

      return sendSuccess(
        res,
        {
          id: updatedJournal.id,
          title: updatedJournal.title,
          mood: updatedJournal.mood,
          updatedAt: updatedJournal.updatedAt,
        },
        "Journal updated successfully"
      );
    } catch (dbError) {
      log.error(
        "Database error updating journal",
        dbError instanceof Error ? dbError : new Error(String(dbError)),
        { userId, journalId, mood }
      );

      // Return a more specific error message
      return sendError(
        res,
        "Failed to update journal in database",
        500,
        dbError instanceof Error ? dbError.message : "Database connection error"
      );
    }
  } catch (error) {
    log.error(
      "Error updating journal",
      error instanceof Error ? error : new Error(String(error)),
      { userId }
    );
    return sendError(
      res,
      "Failed to update journal",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});
router.get("/api/get-user-journal", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    log.warn("Unauthorized access attempt to get user journal");
    return sendError(res, "User authentication required", 401);
  }

  try {
    // Extract query parameters
    const { month } = req.query;
    const selectedMonth = month as string;

    log.info("Fetching user journal entries", {
      userId,
      selectedMonth: selectedMonth || "all",
    });

    // Fetch user's journal entries using JournalService
    const journals = await JournalService.getUserJournals(
      userId,
      31, // limit
      0, // offset
      selectedMonth
    );

    log.info(
      `Retrieved ${journals.length} journal entries for user: ${userId}${
        selectedMonth ? ` for month: ${selectedMonth}` : ""
      }`
    );
    return sendSuccess(
      res,
      journals,
      "User journal entries retrieved successfully"
    );
  } catch (error) {
    log.error(
      "Error fetching user journal",
      error instanceof Error ? error : new Error(String(error)),
      { userId }
    );
    return sendError(
      res,
      "Failed to fetch user journal",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

// Get a specific journal by ID
router.get("/api/journal/:id", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    log.warn("Unauthorized access attempt to get journal by ID");
    return sendError(res, "User authentication required", 401);
  }

  try {
    const { id: journalId } = req.params;

    if (!journalId) {
      log.warn("Missing journal ID in request", { userId });
      return sendError(res, "Journal ID is required", 400);
    }

    log.info("Fetching journal by ID", { userId, journalId });

    // Fetch journal by ID using JournalService
    const journal = await JournalService.getJournalById(journalId, userId);

    if (!journal) {
      log.warn("Journal not found or access denied", { userId, journalId });
      return sendError(res, "Journal not found", 404);
    }

    log.info("Journal retrieved successfully", { userId, journalId });
    return sendSuccess(res, journal, "Journal retrieved successfully");
  } catch (error) {
    log.error(
      "Error fetching journal by ID",
      error instanceof Error ? error : new Error(String(error)),
      { userId }
    );
    return sendError(
      res,
      "Failed to fetch journal",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

// Delete journal entry
router.delete("/api/delete-journal/:id", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    log.warn("Unauthorized access attempt to delete journal");
    return sendError(res, "User authentication required", 401);
  }

  try {
    const { id: journalId } = req.params;

    if (!journalId) {
      log.warn("Journal ID missing in delete request", { userId });
      return sendError(res, "Journal ID is required", 400);
    }

    log.info("Delete journal request received", { userId, journalId });

    await JournalService.deleteJournal(journalId, userId);

    log.info("Journal deleted successfully", { userId, journalId });
    return sendSuccess(res, null, "Journal deleted successfully");
  } catch (error) {
    log.error(
      "Error deleting journal",
      error instanceof Error ? error : new Error(String(error)),
      { userId }
    );
    return sendError(
      res,
      "Failed to delete journal",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

// Get journal insights and analytics
router.get("/api/journals/insights", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    log.warn("Unauthorized access attempt to get journal insights");
    return sendError(res, "User authentication required", 401);
  }

  try {
    const { range, mood } = req.query;
    const timeRange = (range as string) || "month";
    const moodFilter = mood as string;

    log.info("Fetching journal insights", {
      userId,
      timeRange,
      moodFilter: moodFilter || "none",
    });

    // Get insights using JournalService
    const insights = await JournalService.getJournalInsights(
      userId,
      timeRange,
      moodFilter
    );

    log.info("Journal insights retrieved successfully", {
      userId,
      totalEntries: insights.totalEntries,
      timeRange,
    });

    return sendSuccess(
      res,
      insights,
      "Journal insights retrieved successfully"
    );
  } catch (error) {
    log.error(
      "Error fetching journal insights",
      error instanceof Error ? error : new Error(String(error)),
      { userId }
    );
    return sendError(
      res,
      "Failed to fetch journal insights",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export default router;
