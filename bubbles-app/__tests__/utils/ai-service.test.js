// Mock fetch before importing
global.fetch = jest.fn();

// Mock the AI config
jest.mock("../../config/ai-config", () => ({
  AI_CONFIG: {
    OPENAI_BASE_URL: "https://api.openai.com/v1",
    OPENAI_API_KEY: "test-api-key",
  },
}));

import { generateEventDescription } from "../../utils/ai-service";

describe("AI Service Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe("generateEventDescription", () => {
    it("should generate AI description successfully", async () => {
      const mockEventData = {
        name: "Test Event",
        tags: ["formal", "social"],
        description: "A test event",
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          choices: [
            { message: { content: "An elegant formal gathering awaits you!" } },
          ],
        }),
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await generateEventDescription(mockEventData);

      expect(fetch).toHaveBeenCalledWith(
        "https://api.openai.com/v1/chat/completions",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test-api-key",
          },
          body: expect.stringContaining("Test Event"),
        })
      );

      expect(result).toBe("An elegant formal gathering awaits you!");
    });

    it("should use fallback description when API fails", async () => {
      const mockEventData = {
        name: "Test Event",
        tags: ["casual", "outdoor"],
        description: "A test event",
      };

      const mockResponse = {
        ok: false,
        status: 500,
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await generateEventDescription(mockEventData);

      // The fallback function only processes the first matching tag
      expect(result).toContain(
        "A relaxed and comfortable event with casual dress code"
      );
      expect(result).toContain("We can't wait to see you there!");
    });

    it("should handle network errors gracefully", async () => {
      const mockEventData = {
        name: "Test Event",
        tags: ["creative"],
        description: "A test event",
      };

      fetch.mockRejectedValue(new Error("Network error"));

      const result = await generateEventDescription(mockEventData);

      expect(result).toContain(
        "An inspiring creative session where imagination flows freely"
      );
      expect(result).toContain("We can't wait to see you there!");
    });

    it("should handle events with no tags", async () => {
      const mockEventData = {
        name: "Test Event",
        description: "A test event",
      };

      const mockResponse = {
        ok: false,
        status: 400,
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await generateEventDescription(mockEventData);

      expect(result).toBe("We can't wait to see you there!");
    });
  });
});
