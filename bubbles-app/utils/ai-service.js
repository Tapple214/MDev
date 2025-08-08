// AI Service Utility for Bubbles App
// This file contains functions to interact with AI APIs

// Import AI configuration
import { AI_CONFIG } from "../config/ai-config";

/**
 * Generate event description using OpenAI GPT
 * @param {Object} eventData - Event details
 * @returns {Promise<string>} Generated description
 */
export const generateEventDescription = async (eventData) => {
  try {
    console.log("🤖 Generating description with OpenAI...");

    const response = await fetch(
      `${AI_CONFIG.OPENAI_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AI_CONFIG.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an expert event planner and copywriter. Create engaging, concise event descriptions that capture the essence and excitement of the event. Keep descriptions under 200 words and make them inviting and appealing.",
            },
            {
              role: "user",
              content: `Create an engaging event description for: ${JSON.stringify(
                eventData
              )}`,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ OpenAI description generated successfully");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    // Return fallback description if OpenAI fails
    return generateFallbackDescription(eventData);
  }
};

/**
 * Generate fallback description when AI APIs are unavailable
 * @param {Object} eventData - Event details
 * @returns {string} Fallback description
 */
const generateFallbackDescription = (eventData) => {
  const { eventName, tags, location, date, time, guestCount } = eventData;

  let description = "";

  // Add event type based on tags
  if (tags && tags.length > 0) {
    if (tags.includes("formal")) {
      description += "A sophisticated gathering with elegant attire expected. ";
    } else if (tags.includes("casual")) {
      description += "A relaxed and comfortable event with casual dress code. ";
    } else if (tags.includes("creative")) {
      description +=
        "An inspiring creative session where imagination flows freely. ";
    } else if (tags.includes("social")) {
      description += "A friendly social gathering to connect and mingle. ";
    }
  }

  // Add location context
  if (location) {
    description += `Join us at ${location} for this special occasion. `;
  }

  // Add time context
  if (time) {
    const timeStr = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    description += `The event starts at ${timeStr}. `;
  }

  // Add guest context
  if (guestCount > 0) {
    description += `We're expecting ${guestCount} guests to make this event memorable. `;
  }

  // Add atmosphere based on tags
  if (tags && tags.length > 0) {
    if (tags.includes("cozy")) {
      description +=
        "Expect a warm, intimate atmosphere perfect for meaningful conversations. ";
    } else if (tags.includes("adventure")) {
      description +=
        "Get ready for an exciting adventure with unexpected moments! ";
    } else if (tags.includes("outdoor")) {
      description += "Enjoy the fresh air and natural surroundings. ";
    } else if (tags.includes("indoor")) {
      description += "A comfortable indoor setting awaits you. ";
    }
  }

  // Add closing
  description += "We can't wait to see you there!";

  return description;
};

/**
 * Generate event themes and suggestions
 * @param {Object} eventData - Event details
 * @returns {Promise<Object>} Generated themes and suggestions
 */
export const generateEventThemes = async (eventData) => {
  try {
    const response = await fetch(
      `${AI_CONFIG.OPENAI_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AI_CONFIG.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                'You are an expert event planner. Provide 3-5 event theme suggestions and 2-3 activity ideas based on the event details. Return as JSON with "themes" and "activities" arrays.',
            },
            {
              role: "user",
              content: `Generate themes and activities for: ${JSON.stringify(
                eventData
              )}`,
            },
          ],
          max_tokens: 400,
          temperature: 0.8,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      return {
        themes: ["Casual Gathering", "Social Mixer", "Creative Workshop"],
        activities: [
          "Ice breaker games",
          "Group discussions",
          "Interactive activities",
        ],
      };
    }
  } catch (error) {
    console.error("Error generating themes:", error);
    return {
      themes: ["Casual Gathering", "Social Mixer", "Creative Workshop"],
      activities: [
        "Ice breaker games",
        "Group discussions",
        "Interactive activities",
      ],
    };
  }
};

/**
 * Generate personalized invitation messages
 * @param {Object} eventData - Event details
 * @param {string} guestName - Guest name
 * @returns {Promise<string>} Personalized invitation
 */
export const generatePersonalizedInvitation = async (eventData, guestName) => {
  try {
    const response = await fetch(
      `${AI_CONFIG.OPENAI_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AI_CONFIG.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an expert at writing personalized event invitations. Create warm, personal, and engaging invitation messages that make the recipient feel special and excited to attend.",
            },
            {
              role: "user",
              content: `Create a personalized invitation for ${guestName} to attend: ${JSON.stringify(
                eventData
              )}`,
            },
          ],
          max_tokens: 200,
          temperature: 0.8,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating personalized invitation:", error);
    return `Hi ${guestName}! You're invited to ${eventData.eventName}. We'd love to have you join us!`;
  }
};

export default {
  generateEventDescription,
  generateEventThemes,
  generatePersonalizedInvitation,
};
