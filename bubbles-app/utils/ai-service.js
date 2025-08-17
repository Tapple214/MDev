// AI Helper for Bubbles

import { AI_CONFIG } from "../config/ai-config";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

// Generate event description based on event data
export const generateEventDescription = async (eventData) => {
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
    console.log("❌ OpenAI API Error:", error);
    return generateFallbackDescription(eventData);
  }
};

// Analyze image and generate description using OpenAI Vision API
export const analyzeImageAndGenerateDescription = async (imageUri) => {
  try {
    // Convert image to base64
    const base64Image = await convertImageToBase64(imageUri);

    const response = await fetch(
      `${AI_CONFIG.OPENAI_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AI_CONFIG.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "system",
              content:
                "You are an expert image analyzer. Provide detailed, engaging descriptions of images that capture the essence, mood, and key elements. Focus on what makes the image interesting and memorable. Keep descriptions under 150 words and make them vivid and appealing.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this image and provide an engaging description that captures its essence, mood, and key elements. Focus on what makes it interesting and memorable.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                    detail: "high",
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenAI Vision API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ OpenAI Vision analysis completed successfully");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("❌ OpenAI Vision API Error:", error);
    return generateFallbackImageDescription();
  }
};

// Convert image URI to base64 for OpenAI API
const convertImageToBase64 = async (imageUri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("❌ Error converting image to base64:", error);
    throw error;
  }
};

// Pick image from gallery or camera
export const pickImage = async (source = "gallery") => {
  try {
    let result;

    if (source === "gallery") {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
    } else {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error("❌ Error picking image:", error);
    throw error;
  }
};

// Capture image with camera
export const captureImageWithCamera = async () => {
  try {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Camera permission not granted");
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error("❌ Error capturing image:", error);
    throw error;
  }
};

// Generate fallback description when AI APIs are unavailable
const generateFallbackImageDescription = () => {
  const fallbackDescriptions = [
    "A captivating image that tells a unique story through its visual elements and composition.",
    "An intriguing scene captured with artistic flair, showcasing interesting details and atmosphere.",
    "A memorable moment frozen in time, filled with visual interest and emotional depth.",
    "A striking composition that draws the eye and invites closer examination of its details.",
    "An evocative image that captures the essence of its subject with clarity and style.",
  ];

  return fallbackDescriptions[
    Math.floor(Math.random() * fallbackDescriptions.length)
  ];
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
