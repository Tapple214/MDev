// Mock Firebase before importing
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock the core notifications
jest.mock("../../../utils/notifications/core", () => ({
  getUserPushToken: jest.fn(),
  sendPushNotification: jest.fn(),
  sendLocalNotification: jest.fn(),
}));

// Mock the helper function
jest.mock("../../../utils/helper", () => ({
  getUserNameByEmail: jest.fn(),
}));

// Mock Firebase db
jest.mock("../../../firebase", () => ({
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
  notifyHostOfGuestResponse,
  notifyHostOfGuestAttendance,
} from "../../../utils/notifications/hosts";

describe("Host Notifications Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("notifyHostOfGuestResponse", () => {
    it("should notify host when guest responds to invite", async () => {
      const bubbleId = "bubble123";
      const guestEmail = "guest@example.com";
      const response = "accepted";

      const mockBubbleData = {
        hostUid: "host123",
        name: "Test Bubble",
      };

      const mockBubbleSnap = {
        exists: () => true,
        data: () => mockBubbleData,
      };

      const mockHostToken = "host-token-123";
      const mockGuestName = "John Doe";

      // Mock dependencies
      require("firebase/firestore").doc.mockReturnValue("bubbleRef");
      require("firebase/firestore").getDoc.mockResolvedValue(mockBubbleSnap);
      require("../../../utils/notifications/core").getUserPushToken.mockResolvedValue(
        mockHostToken
      );
      require("../../../utils/helper").getUserNameByEmail.mockResolvedValue(
        mockGuestName
      );
      require("../../../utils/notifications/core").sendPushNotification.mockResolvedValue();

      await notifyHostOfGuestResponse(bubbleId, guestEmail, response);

      expect(require("firebase/firestore").doc).toHaveBeenCalledWith(
        {},
        "bubbles",
        bubbleId
      );
      expect(require("firebase/firestore").getDoc).toHaveBeenCalledWith(
        "bubbleRef"
      );
      expect(
        require("../../../utils/notifications/core").getUserPushToken
      ).toHaveBeenCalledWith("host123");
      expect(
        require("../../../utils/helper").getUserNameByEmail
      ).toHaveBeenCalledWith(guestEmail);
      expect(
        require("../../../utils/notifications/core").sendPushNotification
      ).toHaveBeenCalledWith(
        mockHostToken,
        "Bubble Response",
        'John Doe accepted your invite to "Test Bubble"',
        {
          type: "guest_response",
          bubbleId,
          guestEmail,
          response,
        }
      );
    });

    it("should use local notification when push token not available", async () => {
      const bubbleId = "bubble123";
      const guestEmail = "guest@example.com";
      const response = "declined";

      const mockBubbleData = {
        hostUid: "host123",
        name: "Test Bubble",
      };

      const mockBubbleSnap = {
        exists: () => true,
        data: () => mockBubbleData,
      };

      // Mock dependencies
      require("firebase/firestore").doc.mockReturnValue("bubbleRef");
      require("firebase/firestore").getDoc.mockResolvedValue(mockBubbleSnap);
      require("../../../utils/notifications/core").getUserPushToken.mockResolvedValue(
        null
      );
      require("../../../utils/helper").getUserNameByEmail.mockResolvedValue(
        "Jane Smith"
      );
      require("../../../utils/notifications/core").sendLocalNotification.mockResolvedValue();

      await notifyHostOfGuestResponse(bubbleId, guestEmail, response);

      expect(
        require("../../../utils/notifications/core").sendLocalNotification
      ).toHaveBeenCalledWith(
        "Bubble Response",
        'Jane Smith declined your invite to "Test Bubble"',
        {
          type: "guest_response",
          bubbleId,
          guestEmail,
          response,
        }
      );
    });

    it("should handle non-existent bubble gracefully", async () => {
      const bubbleId = "nonexistent";
      const guestEmail = "guest@example.com";
      const response = "accepted";

      const mockBubbleSnap = {
        exists: () => false,
        data: () => ({}),
      };

      require("firebase/firestore").doc.mockReturnValue("bubbleRef");
      require("firebase/firestore").getDoc.mockResolvedValue(mockBubbleSnap);

      await notifyHostOfGuestResponse(bubbleId, guestEmail, response);

      expect(
        require("../../../utils/notifications/core").getUserPushToken
      ).not.toHaveBeenCalled();
      expect(
        require("../../../utils/helper").getUserNameByEmail
      ).not.toHaveBeenCalled();
    });
  });

  describe("notifyHostOfGuestAttendance", () => {
    it("should notify host when guest confirms attendance", async () => {
      const bubbleId = "bubble123";
      const guestEmail = "guest@example.com";
      const qrData = { qrCode: "test123" };

      const mockBubbleData = {
        hostUid: "host123",
        name: "Test Bubble",
      };

      const mockBubbleSnap = {
        exists: () => true,
        data: () => mockBubbleData,
      };

      const mockHostToken = "host-token-123";
      const mockGuestName = "John Doe";

      // Mock dependencies
      require("firebase/firestore").doc.mockReturnValue("bubbleRef");
      require("firebase/firestore").getDoc.mockResolvedValue(mockBubbleSnap);
      require("../../../utils/notifications/core").getUserPushToken.mockResolvedValue(
        mockHostToken
      );
      require("../../../utils/helper").getUserNameByEmail.mockResolvedValue(
        mockGuestName
      );
      require("../../../utils/notifications/core").sendPushNotification.mockResolvedValue();

      await notifyHostOfGuestAttendance(bubbleId, guestEmail, qrData);

      expect(
        require("../../../utils/notifications/core").sendPushNotification
      ).toHaveBeenCalledWith(
        mockHostToken,
        "Guest Attendance Confirmed!",
        'John Doe has successfully clocked attendance for "Test Bubble"!',
        {
          type: "guest_attendance_confirmed",
          bubbleId,
          guestEmail,
          guestName: "John Doe",
          bubbleName: "Test Bubble",
          qrData,
          timestamp: expect.any(String),
        }
      );
    });

    it("should use guest email when name not available", async () => {
      const bubbleId = "bubble123";
      const guestEmail = "guest@example.com";
      const qrData = { qrCode: "test123" };

      const mockBubbleData = {
        hostUid: "host123",
        name: "Test Bubble",
      };

      const mockBubbleSnap = {
        exists: () => true,
        data: () => mockBubbleData,
      };

      // Mock dependencies
      require("firebase/firestore").doc.mockReturnValue("bubbleRef");
      require("firebase/firestore").getDoc.mockResolvedValue(mockBubbleSnap);
      require("../../../utils/notifications/core").getUserPushToken.mockResolvedValue(
        null
      );
      require("../../../utils/helper").getUserNameByEmail.mockResolvedValue(
        null
      );
      require("../../../utils/notifications/core").sendLocalNotification.mockResolvedValue();

      await notifyHostOfGuestAttendance(bubbleId, guestEmail, qrData);

      expect(
        require("../../../utils/notifications/core").sendLocalNotification
      ).toHaveBeenCalledWith(
        "Guest Attendance Confirmed!",
        'guest@example.com has successfully clocked attendance for "Test Bubble"!',
        {
          type: "guest_attendance_confirmed",
          bubbleId,
          guestEmail,
          guestName: "guest@example.com",
          bubbleName: "Test Bubble",
          qrData,
          timestamp: expect.any(String),
        }
      );
    });
  });
});
