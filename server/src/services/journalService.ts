import db from "../db/db.config";
import { log } from "../utils/logger";
import { Mood } from "../../generated/prisma";

export interface JournalData {
  userId: string;
  text: string;
  mood: string;
  summary: string;
  reason: string;
  title?: string;
}

export class JournalService {
  /**
   * Convert mood string to Prisma Mood enum
   */
  private static _mapMoodToEnum(mood: string): Mood {
    const moodMap: Record<string, Mood> = {
      happy: Mood.HAPPY,
      sad: Mood.SAD,
      anxious: Mood.ANXIOUS,
      neutral: Mood.NEUTRAL,
      excited: Mood.EXCITED,
      angry: Mood.ANGRY,
      peaceful: Mood.PEACEFUL,
      grateful: Mood.GREATFUL,
      frustrated: Mood.FRUSTRATED,
      worried: Mood.WORRIED,
      content: Mood.CONTENT,
      tired: Mood.TIRED,
    };

    const normalizedMood = mood.toLowerCase();
    return moodMap[normalizedMood] || Mood.NEUTRAL;
  }

  /**
   * Generate a title from the journal text
   */
  private static _generateTitle(text: string): string {
    const words = text.trim().split(/\s+/);
    const titleWords = words.slice(0, 8); // Take first 8 words
    let title = titleWords.join(" ");

    // If title is too long, truncate and add ellipsis
    if (title.length > 50) {
      title = title.substring(0, 47) + "...";
    }

    return title || "Journal Entry";
  }

  /**
   * Save a journal entry to the database
   */
  static async saveJournal(journalData: JournalData): Promise<any> {
    try {
      log.debug(`Saving journal for user: ${journalData.userId}`);

      // Ensure user exists
      const user = await db.user.findUnique({
        where: { id: journalData.userId },
      });

      if (!user) {
        throw new Error(`User not found: ${journalData.userId}`);
      }

      // Generate title if not provided
      const title = journalData.title || this._generateTitle(journalData.text);

      // Convert mood to enum
      const moodEnum = this._mapMoodToEnum(journalData.mood);

      // Prepare content as JSON
      const content = {
        text: journalData.text,
        analysis: {
          mood: journalData.mood,
          summary: journalData.summary,
          reason: journalData.reason,
        },
        metadata: {
          wordCount: journalData.text.trim().split(/\s+/).length,
          characterCount: journalData.text.length,
          createdAt: new Date().toISOString(),
        },
      };

      // Save journal entry
      const journal = await db.journal.create({
        data: {
          userId: journalData.userId,
          title,
          content,
          mood: moodEnum,
          summary: journalData.summary,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await db.user.update({
        where: { id: journalData.userId },
        data: {
          journalIds: {
            push: journal.id,
          },
          updatedAt: new Date(),
        },
      });

      log.info(`Journal saved successfully: ${journal.id}`, {
        userId: journalData.userId,
        mood: journalData.mood,
        textLength: journalData.text.length,
      });

      return journal;
    } catch (error) {
      log.error(
        "Failed to save journal",
        error instanceof Error ? error : new Error(String(error)),
        { userId: journalData.userId }
      );
      throw error;
    }
  }

  /**
   * Get journals for a user
   */
  static async getUserJournals(
    userId: string,
    limit: number = 31,
    offset: number = 0,
    selectedMonth?: string
  ): Promise<any[]> {
    try {
      log.debug(
        `Fetching journals for user: ${userId}${
          selectedMonth ? ` for month: ${selectedMonth}` : ""
        }`
      );

      let whereClause: any = { userId };

      // If selectedMonth is provided, filter by month and year
      if (selectedMonth) {
        const [year, month] = selectedMonth.split("-");
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(
          parseInt(year),
          parseInt(month),
          0,
          23,
          59,
          59,
          999
        );

        whereClause.createdAt = {
          gte: startDate,
          lte: endDate,
        };
      }

      const journals = await db.journal.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      });

      // Transform the journals to include necessary fields for the calendar
      const transformedJournals = journals.map((journal) => {
        const content = journal.content as any;
        return {
          id: journal.id,
          title: journal.title,
          content: content?.text || "",
          mood: journal.mood.toLowerCase(),
          summary: journal.summary,
          reason: content?.analysis?.reason || "", // Add reason from content analysis
          createdAt: journal.createdAt.toISOString(),
          wordCount: content?.metadata?.wordCount || 0,
        };
      });

      log.info(
        `Retrieved ${journals.length} journals for user: ${userId}${
          selectedMonth ? ` for month: ${selectedMonth}` : ""
        }`
      );
      return transformedJournals;
    } catch (error) {
      log.error(
        "Failed to fetch user journals",
        error instanceof Error ? error : new Error(String(error)),
        { userId, selectedMonth }
      );
      throw error;
    }
  }

  /**
   * Get a specific journal by ID
   */
  static async getJournalById(journalId: string, userId: string): Promise<any> {
    try {
      log.debug(`Fetching journal: ${journalId} for user: ${userId}`);

      const journal = await db.journal.findFirst({
        where: {
          id: journalId,
          userId,
        },
      });

      if (!journal) {
        throw new Error(`Journal not found: ${journalId}`);
      }

      // Transform the journal to include necessary fields (same format as getUserJournals)
      const content = journal.content as any;
      const transformedJournal = {
        id: journal.id,
        title: journal.title,
        content: content?.text || "",
        mood: journal.mood.toLowerCase(),
        summary: journal.summary,
        reason: content?.analysis?.reason || "", // Add reason from content analysis
        createdAt: journal.createdAt.toISOString(),
        wordCount: content?.metadata?.wordCount || 0,
      };

      log.info(`Retrieved journal: ${journalId}`);
      return transformedJournal;
    } catch (error) {
      log.error(
        "Failed to fetch journal",
        error instanceof Error ? error : new Error(String(error)),
        { journalId, userId }
      );
      throw error;
    }
  }

  /**
   * Update a journal entry
   */
  static async updateJournal(
    journalId: string,
    userId: string,
    journalData: {
      text: string;
      mood: string;
      summary: string;
      reason: string;
    }
  ): Promise<any> {
    try {
      log.debug(`Updating journal: ${journalId} for user: ${userId}`);

      // Check if journal exists and belongs to user
      const existingJournal = await db.journal.findFirst({
        where: {
          id: journalId,
          userId,
        },
      });

      if (!existingJournal) {
        throw new Error(`Journal not found: ${journalId}`);
      }

      // Generate title if the text changed
      const title = this._generateTitle(journalData.text);

      // Convert mood to enum
      const moodEnum = this._mapMoodToEnum(journalData.mood);

      // Prepare updated content as JSON
      const content = {
        text: journalData.text,
        analysis: {
          mood: journalData.mood,
          summary: journalData.summary,
          reason: journalData.reason,
        },
        metadata: {
          wordCount: journalData.text.trim().split(/\s+/).length,
          characterCount: journalData.text.length,
          updatedAt: new Date().toISOString(),
        },
      };

      // Update journal entry
      const updatedJournal = await db.journal.update({
        where: { id: journalId },
        data: {
          title,
          content,
          mood: moodEnum,
          summary: journalData.summary,
          updatedAt: new Date(),
        },
      });

      log.info(`Journal updated successfully: ${journalId}`, {
        userId,
        mood: journalData.mood,
        textLength: journalData.text.length,
      });

      return updatedJournal;
    } catch (error) {
      log.error(
        "Failed to update journal",
        error instanceof Error ? error : new Error(String(error)),
        { journalId, userId }
      );
      throw error;
    }
  }

  /**
   * Delete a journal entry
   */
  static async deleteJournal(journalId: string, userId: string): Promise<void> {
    try {
      log.debug(`Deleting journal: ${journalId} for user: ${userId}`);

      const deletedJournal = await db.journal.deleteMany({
        where: {
          id: journalId,
          userId,
        },
      });

      if (deletedJournal.count === 0) {
        throw new Error(`Journal not found or not authorized: ${journalId}`);
      }

      await db.user.update({
        where: { id: userId },
        data: {
          journalIds: {
            set: await db.user
              .findUnique({ where: { id: userId } })
              .then(
                (user) =>
                  user?.journalIds?.filter((id) => id !== journalId) || []
              ),
          },
          updatedAt: new Date(),
        },
      });

      log.info(`Journal deleted: ${journalId}`);
    } catch (error) {
      log.error(
        "Failed to delete journal",
        error instanceof Error ? error : new Error(String(error)),
        { journalId, userId }
      );
      throw error;
    }
  }

  /**
   * Sync user's journal IDs with actual journals in database
   * Generated by Copilot
   */
  static async syncUserJournalIds(userId: string): Promise<void> {
    try {
      log.debug(`Syncing journal IDs for user: ${userId}`);

      // Get all journal IDs for the user
      const journals = await db.journal.findMany({
        where: { userId },
        select: { id: true },
        orderBy: { createdAt: "desc" },
      });

      const journalIds = journals.map((journal) => journal.id);

      // Update user's journalIds array
      await db.user.update({
        where: { id: userId },
        data: {
          journalIds,
          updatedAt: new Date(),
        },
      });

      log.info(`Synced ${journalIds.length} journal IDs for user: ${userId}`);
    } catch (error) {
      log.error(
        "Failed to sync user journal IDs",
        error instanceof Error ? error : new Error(String(error)),
        { userId }
      );
      throw error;
    }
  }

  /**
   * Get user with journal IDs for quick access
   */
  static async getUserWithJournalIds(userId: string): Promise<any> {
    try {
      log.debug(`Fetching user with journal IDs: ${userId}`);

      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          imageUrl: true,
          journalIds: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error(`User not found: ${userId}`);
      }

      log.info(
        `Retrieved user with ${user.journalIds.length} journal IDs: ${userId}`
      );
      return user;
    } catch (error) {
      log.error(
        "Failed to fetch user with journal IDs",
        error instanceof Error ? error : new Error(String(error)),
        { userId }
      );
      throw error;
    }
  }
}
