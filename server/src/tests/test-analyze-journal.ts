// Test script for the analyze-journal endpoint
// Run with: npx ts-node src/tests/test-analyze-journal.ts

import { GeminiService } from "../services/geminiService";

async function testGeminiService() {
  console.log("🧪 Testing Gemini Service...\n");

  // Test data
  const testJournalEntries = [
    {
      name: "Happy Day",
      text: "Today was amazing! I got a promotion at work and celebrated with my family. I feel so grateful and excited about the future. Everything seems to be going well.",
    },
    {
      name: "Difficult Day",
      text: "I'm feeling really overwhelmed today. Work has been stressful and I had an argument with my friend. I'm worried about making the right decisions and feel anxious about everything.",
    },
    {
      name: "Neutral Day",
      text: "Today was a pretty normal day. I went to work, had lunch, did some errands, and watched TV in the evening. Nothing particularly exciting happened.",
    },
  ];

  try {
    // Check if API key is set
    if (
      !process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY === "your_gemini_api_key_here"
    ) {
      console.log("❌ GEMINI_API_KEY not set properly in .env file");
      console.log("Please set a valid Gemini API key to test the service.");
      return;
    }

    const geminiService = new GeminiService({
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    });

    for (const entry of testJournalEntries) {
      console.log(`Testing: ${entry.name}`);
      console.log(`Text: "${entry.text.substring(0, 50)}..."`);

      try {
        const result = await geminiService.analyzeJournal(entry.text);

        console.log(`✅ Result:`);
        console.log(`   Mood: ${result.mood}`);
        console.log(`   Summary: ${result.summary}`);
        console.log(`   Reason: ${result.reason}`);
        console.log("");
      } catch (error) {
        console.log(
          `❌ Error: ${error instanceof Error ? error.message : String(error)}`
        );
        console.log("");
      }
    }
  } catch (error) {
    console.log(
      `❌ Failed to initialize Gemini service: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testGeminiService().catch(console.error);
}

export { testGeminiService };
