import db from "../db/db.config";
import { log } from "../utils/logger";
import { Moods } from "../utils/mood";

export interface JournalData {
  userId: string;
  text: string;
  mood: string;
  summary: string;
  reason: string;
  title?: string;
}

export class JournalService {
  private static _normalizeMood(mood: string): string {
    const validMoods = Object.values(Moods).map((m) => m.toLowerCase());

    const normalizedMood = mood.toLowerCase().trim();
    return validMoods.includes(normalizedMood) ? normalizedMood : "neutral";
  }

  // Generate a title from the journal text
  private static _generateTitle(text: string): string {
    // Remove HTML tags
    let cleanText = text.replace(/<[^>]*>/g, "");

    cleanText = cleanText
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      .replace(/~~([^~]+)~~/g, "$1")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/^\s*>\s+/gm, "")
      .replace(/\s+/g, " ")
      .trim();

    const words = cleanText.split(/\s+/);
    const titleWords = words.slice(0, 8);
    let title = titleWords.join(" ");

    if (title.length > 50) {
      title = title.substring(0, 47) + "...";
    }

    return title || "Journal Entry";
  }

  // Save a journal entry to the database
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

      const normalizedMood = this._normalizeMood(journalData.mood);

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
          content: JSON.stringify(content),
          mood: normalizedMood,
          summary: journalData.summary,
          createdAt: new Date(),
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

  // Get journals for a user
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
        let content;
        try {
          content =
            typeof journal.content === "string"
              ? JSON.parse(journal.content)
              : journal.content;
        } catch {
          content = { text: journal.content || "" };
        }

        return {
          id: journal.id,
          title: journal.title,
          content: content?.text || "",
          mood: journal.mood,
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

  // Get a specific journal by ID
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
      let content;
      try {
        content =
          typeof journal.content === "string"
            ? JSON.parse(journal.content)
            : journal.content;
      } catch {
        content = { text: journal.content || "" };
      }

      const transformedJournal = {
        id: journal.id,
        title: journal.title,
        content: content?.text || "",
        mood: journal.mood,
        summary: journal.summary,
        reason: content?.analysis?.reason || "",
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

  // Update a journal entry
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

      const existingJournal = await db.journal.findFirst({
        where: {
          id: journalId,
          userId,
        },
      });

      if (!existingJournal) {
        throw new Error(`Journal not found: ${journalId}`);
      }

      const title = this._generateTitle(journalData.text);

      const normalizedMood = this._normalizeMood(journalData.mood);

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
          content: JSON.stringify(content),
          mood: normalizedMood,
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

  // Delete a journal entry
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

  static async getJournalInsights(
    userId: string,
    timeRange: string = "month",
    moodFilter?: string
  ): Promise<any> {
    try {
      log.debug(
        `Fetching journal insights for user: ${userId}, range: ${timeRange}`
      );

      // Calculate date range based on timeRange parameter
      const now = new Date();
      let startDate: Date;

      switch (timeRange) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "quarter":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default: // month
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Build where clause
      let whereClause: any = {
        userId,
        createdAt: {
          gte: startDate,
          lte: now,
        },
      };

      // Add mood filter if provided
      if (moodFilter) {
        const normalizedMoodFilter = this._normalizeMood(moodFilter);
        whereClause.mood = normalizedMoodFilter;
      }

      // Get all journals in the time range
      const journals = await db.journal.findMany({
        where: whereClause,
        orderBy: { createdAt: "asc" },
      });

      // Calculate basic metrics
      const totalEntries = journals.length;

      let totalWords = 0;
      const moodCounts: Record<string, number> = {};
      const dailyData: Record<
        string,
        { wordCount: number; entryCount: number }
      > = {};
      const weeklyActivity: Record<string, number> = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
      };

      // Process each journal entry
      journals.forEach((journal) => {
        let content;
        try {
          content =
            typeof journal.content === "string"
              ? JSON.parse(journal.content)
              : journal.content;
        } catch {
          content = { metadata: { wordCount: 0 } };
        }

        const wordCount = content?.metadata?.wordCount || 0;
        totalWords += wordCount;

        // Count moods
        const mood = journal.mood;
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;

        // Group by date for trend analysis
        const dateKey = journal.createdAt.toISOString().split("T")[0];
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = { wordCount: 0, entryCount: 0 };
        }
        dailyData[dateKey].wordCount += wordCount;
        dailyData[dateKey].entryCount += 1;

        // Count by day of week
        const dayOfWeek = journal.createdAt.toLocaleDateString("en-US", {
          weekday: "short",
        });
        weeklyActivity[dayOfWeek] = (weeklyActivity[dayOfWeek] || 0) + 1;
      });

      // Calculate averages
      const averageWordsPerEntry =
        totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

      // Calculate streaks (consecutive days with entries)
      const { currentStreak, longestStreak } = this._calculateStreaks(journals);

      // Prepare mood distribution
      const moodDistribution = Object.entries(moodCounts)
        .map(([mood, count]) => ({
          mood,
          count,
          percentage:
            totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);

      // Prepare word count trend
      const wordCountTrend = Object.entries(dailyData)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-30) // Last 30 days
        .map(([date, data]) => ({
          date,
          wordCount: data.wordCount,
          entryCount: data.entryCount,
        }));

      // Prepare weekly activity
      const weeklyActivityArray = Object.entries(weeklyActivity).map(
        ([day, entries]) => ({
          day,
          entries,
        })
      );

      const insights = {
        totalEntries,
        averageWordsPerEntry,
        longestStreak,
        currentStreak,
        moodDistribution,
        wordCountTrend,
        weeklyActivity: weeklyActivityArray,
      };

      log.info(`Generated insights for user: ${userId}`, {
        totalEntries,
        timeRange,
        moodFilter: moodFilter || "none",
      });

      return insights;
    } catch (error) {
      log.error(
        "Failed to fetch journal insights",
        error instanceof Error ? error : new Error(String(error)),
        { userId, timeRange }
      );
      throw error;
    }
  }

  private static _calculateStreaks(journals: any[]): {
    currentStreak: number;
    longestStreak: number;
  } {
    if (journals.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Get unique dates with entries
    const entryDates = [
      ...new Set(journals.map((j) => j.createdAt.toISOString().split("T")[0])),
    ].sort();

    if (entryDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // Check if today or yesterday has an entry for current streak
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    if (entryDates.includes(today) || entryDates.includes(yesterday)) {
      currentStreak = 1;

      // Count backwards from today/yesterday
      let checkDate = entryDates.includes(today) ? today : yesterday;
      let currentDate = new Date(checkDate);

      for (let i = entryDates.length - 1; i >= 0; i--) {
        const entryDate = new Date(entryDates[i]);
        const timeDiff = currentDate.getTime() - entryDate.getTime();
        const dayDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));

        if (dayDiff <= 1 && dayDiff >= 0) {
          if (i > 0) {
            const prevEntryDate = new Date(entryDates[i - 1]);
            const prevTimeDiff = entryDate.getTime() - prevEntryDate.getTime();
            const prevDayDiff = Math.round(
              prevTimeDiff / (1000 * 60 * 60 * 24)
            );

            if (prevDayDiff === 1) {
              currentStreak++;
              currentDate = entryDate;
            } else {
              break;
            }
          }
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    for (let i = 1; i < entryDates.length; i++) {
      const currentDate = new Date(entryDates[i]);
      const prevDate = new Date(entryDates[i - 1]);
      const timeDiff = currentDate.getTime() - prevDate.getTime();
      const dayDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }
}
