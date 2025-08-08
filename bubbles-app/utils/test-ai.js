// Test utility for AI integration
// Run this to verify your OpenAI API key is working

import { generateEventDescription } from "./ai-service";

export const testAIIntegration = async () => {
  console.log("🧪 Testing AI Integration...");

  try {
    // Test data
    const testEventData = {
      eventName: "Test Dinner Party",
      tags: ["casual", "social", "indoor"],
      location: "My Home",
      date: new Date(),
      time: new Date(),
      guestCount: 6,
    };

    console.log("📝 Generating test description...");
    const description = await generateEventDescription(testEventData, "openai");

    console.log("✅ AI Integration Test Successful!");
    console.log("📄 Generated Description:", description);

    return {
      success: true,
      description: description,
    };
  } catch (error) {
    console.error("❌ AI Integration Test Failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Usage: Call this function from your app to test the AI integration
// import { testAIIntegration } from "./utils/test-ai";
// testAIIntegration().then(result => console.log(result));
