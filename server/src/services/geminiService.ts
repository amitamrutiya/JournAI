import { GoogleGenerativeAI } from "@google/generative-ai";
import { log } from "../utils/logger";

interface GeminiAnalysisResult {
  mood: string;
  summary: string;
  reason: string;
}

interface GeminiServiceConfig {
  apiKey: string;
  model: string;
}

export class GeminiService {
  private _genAI: GoogleGenerativeAI;
  private _model: string;

  constructor(config: GeminiServiceConfig) {
    if (!config.apiKey) {
      throw new Error("Gemini API key is required");
    }

    this._genAI = new GoogleGenerativeAI(config.apiKey);
    this._model = config.model;
  }

  /**
   * Analyzes journal text using Gemini AI
   */
  async analyzeJournal(journalText: string): Promise<GeminiAnalysisResult> {
    try {
      const model = this._genAI.getGenerativeModel({ model: this._model });

      const prompt = this.createAnalysisPrompt(journalText);

      log.info("Sending journal analysis request to Gemini", {
        textLength: journalText.length,
        model: this._model,
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      log.info("Received response from Gemini", {
        responseLength: text.length,
      });

      return this.parseGeminiResponse(text);
    } catch (error) {
      log.error(
        "Failed to analyze journal with Gemini",
        error instanceof Error ? error : new Error(String(error))
      );
      throw new Error(
        `Gemini analysis failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private createAnalysisPrompt(journalText: string): string {
    return `
You are an expert emotional intelligence AI assistant. Analyze the following journal entry and return insights in a strictly formatted JSON.

JOURNAL ENTRY:
"""
${journalText}
"""

TASK:
1. Determine the primary mood or emotion expressed in the text.
2. Generate a one-line summary of the user's day or emotional state.
3. Provide a brief reason explaining why this mood was identified.

RESPONSE FORMAT:
Respond ONLY with a valid JSON object in this exact format:
{
  "mood": "[one of the following: happy, sad, anxious, excited, angry, peaceful, grateful, frustrated, worried, content, neutral, tired]",
  "summary": "[one-line summary of the day/experience in 15–30 words]",
  "reason": "[brief explanation citing specific phrases or emotional indicators from the journal entry]"
}

IMPORTANT INSTRUCTIONS:
- The mood **must be one of these EXACT values**: happy, sad, anxious, excited, angry, peaceful, grateful, frustrated, worried, content, neutral, tired.
- Do not invent or choose any mood word outside of this list.
- Only include the JSON object in your response.
- The summary should be concise and reflect the emotional tone of the entry.
- The reason must clearly reference emotional signals or language from the journal.
- Use "neutral" for entries that don't express strong emotions or are matter-of-fact.
- Use "tired" for entries expressing physical or mental exhaustion, fatigue, or feeling drained.

Respond with **only the JSON**, and nothing else.
`;
  }

  /**
   * Parses Gemini's response and extracts the analysis result
   */
  private parseGeminiResponse(responseText: string): GeminiAnalysisResult {
    try {
      let cleanedText = responseText.trim();

      // Remove markdown code blocks if present
      cleanedText = cleanedText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "");

      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON object found in Gemini response");
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      if (
        !parsedResponse.mood ||
        !parsedResponse.summary ||
        !parsedResponse.reason
      ) {
        throw new Error("Missing required fields in Gemini response");
      }

      if (
        typeof parsedResponse.mood !== "string" ||
        typeof parsedResponse.summary !== "string" ||
        typeof parsedResponse.reason !== "string"
      ) {
        throw new Error("Invalid field types in Gemini response");
      }

      // Clean and validate mood (should be a single word)
      const mood = parsedResponse.mood.toLowerCase().trim();
      if (mood.split(" ").length > 2) {
        log.warn("Mood contains multiple words, using first word", {
          originalMood: mood,
        });
        parsedResponse.mood = mood.split(" ")[0];
      }

      log.info("Successfully parsed Gemini response", {
        mood: parsedResponse.mood,
        summaryLength: parsedResponse.summary.length,
        reasonLength: parsedResponse.reason.length,
      });

      return {
        mood: parsedResponse.mood,
        summary: parsedResponse.summary.trim(),
        reason: parsedResponse.reason.trim(),
      };
    } catch (error) {
      log.error(
        "Failed to parse Gemini response",
        error instanceof Error ? error : new Error(String(error)),
        { responseText: responseText.substring(0, 500) } // Log first 500 chars for debugging
      );
      throw new Error(
        `Failed to parse Gemini response: ${
          error instanceof Error ? error.message : "Unknown parsing error"
        }`
      );
    }
  }

  static validateApiKey(apiKey: string): boolean {
    return (
      typeof apiKey === "string" &&
      apiKey.length > 10 &&
      apiKey.startsWith("AI")
    );
  }
}

export function createGeminiService(): GeminiService {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }

  if (!model) {
    throw new Error("GEMINI_MODEL environment variable is required");
  }

  if (!GeminiService.validateApiKey(apiKey)) {
    throw new Error("Invalid GEMINI_API_KEY format");
  }

  return new GeminiService({ apiKey, model });
}
