// Mock Firebase before importing
jest.mock("firebase/firestore", () => ({
  updateDoc: jest.fn(),
  doc: jest.fn(),
}));

// Mock the notifications module
jest.mock("../../utils/notifications/hosts.js", () => ({
  notifyHostOfGuestAttendance: jest.fn(),
}));

// Mock Firebase db
jest.mock("../../firebase", () => ({
  db: {},
}));

// Mock console.error to suppress expected error messages during testing
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

import {
  generateAttendanceQR,
  validateAttendanceQR,
} from "../../utils/attendance";

describe("Attendance Utility Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateAttendanceQR", () => {
    it("should generate valid QR data for complete bubble data", () => {
      const bubbleData = {
        id: "bubble123",
        name: "Test Bubble",
        hostName: "John Doe",
        schedule: new Date("2024-01-15T14:30:00"),
      };

      const result = generateAttendanceQR(bubbleData);

      expect(result).toBeTruthy();

      const parsedResult = JSON.parse(result);
      expect(parsedResult.type).toBe("bubble_attendance");
      expect(parsedResult.bubbleId).toBe("bubble123");
      expect(parsedResult.bubbleName).toBe("Test Bubble");
      expect(parsedResult.hostName).toBe("John Doe");
      expect(parsedResult.uniqueId).toBeDefined();
      expect(parsedResult.timestamp).toBeDefined();
    });

    it("should return null when missing required fields", () => {
      const bubbleDataMissingId = {
        name: "Test Bubble",
        hostName: "John Doe",
        schedule: new Date("2024-01-15T14:30:00"),
      };

      const result = generateAttendanceQR(bubbleDataMissingId);
      
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Missing required fields for QR generation:",
        expect.objectContaining({
          id: undefined,
          name: "Test Bubble",
          hostName: "John Doe",
        })
      );
    });
  });

  describe("validateAttendanceQR", () => {
    it("should validate correct QR code for matching bubble", () => {
      const qrData = {
        type: "bubble_attendance",
        bubbleId: "bubble123",
        bubbleName: "Test Bubble",
        hostName: "John Doe",
        schedule: "2024-01-15T14:30:00",
        uniqueId: "abc123",
        timestamp: new Date().toISOString(),
      };

      const qrString = JSON.stringify(qrData);
      const result = validateAttendanceQR(qrString, "bubble123");

      expect(result.isValid).toBe(true);
      expect(result.message).toBe(
        "QR code is valid for attendance confirmation."
      );
    });

    it("should reject QR code with wrong type", () => {
      const qrData = {
        type: "wrong_type",
        bubbleId: "bubble123",
        bubbleName: "Test Bubble",
        hostName: "John Doe",
        schedule: "2024-01-15T14:30:00",
        uniqueId: "abc123",
        timestamp: new Date().toISOString(),
      };

      const qrString = JSON.stringify(qrData);
      const result = validateAttendanceQR(qrString, "bubble123");

      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Invalid QR code format.");
    });

    it("should reject QR code for different bubble", () => {
      const qrData = {
        type: "bubble_attendance",
        bubbleId: "bubble456",
        bubbleName: "Test Bubble",
        hostName: "John Doe",
        schedule: "2024-01-15T14:30:00",
        uniqueId: "abc123",
        timestamp: new Date().toISOString(),
      };

      const qrString = JSON.stringify(qrData);
      const result = validateAttendanceQR(qrString, "bubble123");

      expect(result.isValid).toBe(false);
      expect(result.message).toBe("This QR code is not for this bubble.");
    });

    it("should handle invalid JSON string", () => {
      const invalidJson = "invalid json string";
      const result = validateAttendanceQR(invalidJson, "bubble123");

      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Invalid QR code data.");
    });
  });
});
