// AI Helper for Bubbles

import { OPENAI_API_KEY, OPENAI_BASE_URL } from "@env";

// Generate event description based on event data
export const generateEventDescription = async (eventData) => {
  try {
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert event planner. Create engaging, concise event descriptions that capture the essence and excitement of the event. Keep descriptions under 200 words and make them inviting and appealing.",
          },
          {
            role: "user",
            content: `Create an engaging event description for: ${JSON.stringify(
              eventData
            )}. Add fun reminders to the description such as 'Don't forget to dress up!', etc. where appropriate.`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    return generateFallbackDescription(eventData);
  }
};

// Fallback description when AI APIs are unavailable
const generateFallbackDescription = (eventData) => {
  const { tags } = eventData;

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
    } else if (tags.includes("cozy")) {
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
