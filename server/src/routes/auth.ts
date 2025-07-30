import { Router } from "express";
import { requireAuth, getAuth, clerkClient, User } from "@clerk/express";
import { sendSuccess, sendError } from "../utils/responses";
import { log } from "../utils/logger";
import { JournalService } from "../services/journalService";

const router = Router();

// Get authenticated user data
router.get("/protected", requireAuth(), async (req, res) => {
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

export default router;
