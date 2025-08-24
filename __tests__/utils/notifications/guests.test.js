// Mock Firebase before importing
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock the core notifications
jest.mock("../../../utils/notifications/core", () => ({
  getUserPushTokenByEmail: jest.fn(),
  sendPushNotification: jest.fn(),
  sendLocalNotification: jest.fn(),
}));

// Mock Firebase db
jest.mock("../../../firebase", () => ({
  db: {},
}));

// Mock console methods to clean up test output
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

import {
  notifyGuestOfInvite,
  notifyGuestsOfBubbleChanges,
  notifyGuestsOfBubbleDeletion,
} from "../../../utils/notifications/guests";

describe("Notifications Guests Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("notifyGuestOfInvite", () => {
    it("should notify guest of bubble invite", async () => {
      const { doc, getDoc } = require("firebase/firestore");
      const {
        getUserPushTokenByEmail,
        sendPushNotification,
      } = require("../../../utils/notifications/core");

      const mockBubbleData = {
        name: "Test Bubble",
        hostName: "John Doe",
      };

      doc.mockReturnValue("bubbleRef");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockBubbleData,
      });

      getUserPushTokenByEmail.mockResolvedValue("token123");

      await notifyGuestOfInvite("guest@example.com", "bubble123");

      expect(sendPushNotification).toHaveBeenCalledWith(
        "token123",
        "New Bubble Invite! 🎯",
        'You have been invited by John Doe to "Test Bubble" - tap to respond!',
        {
          bubbleId: "bubble123",
          hostName: "John Doe",
          type: "bubble_invite",
          bubbleName: "Test Bubble",
        }
      );
    });

    it("should use local notification when no push token", async () => {
      const { doc, getDoc } = require("firebase/firestore");
      const {
        getUserPushTokenByEmail,
        sendLocalNotification,
      } = require("../../../utils/notifications/core");

      const mockBubbleData = {
        name: "Test Bubble",
        hostName: "John Doe",
      };

      doc.mockReturnValue("bubbleRef");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockBubbleData,
      });

      getUserPushTokenByEmail.mockResolvedValue(null);

      await notifyGuestOfInvite("guest@example.com", "bubble123");

      expect(sendLocalNotification).toHaveBeenCalledWith(
        "New Bubble Invite! 🎯",
        'You have been invited by John Doe to "Test Bubble" - tap to respond!',
        {
          bubbleId: "bubble123",
          hostName: "John Doe",
          type: "bubble_invite",
          bubbleName: "Test Bubble",
        }
      );
    });
  });

  describe("notifyGuestsOfBubbleChanges", () => {
    it("should notify all guests of bubble changes", async () => {
      const { doc, getDoc } = require("firebase/firestore");
      const {
        getUserPushTokenByEmail,
        sendPushNotification,
      } = require("../../../utils/notifications/core");

      const mockBubbleData = {
        name: "Test Bubble",
        guestList: ["guest1@example.com", "guest2@example.com"],
      };

      doc.mockReturnValue("bubbleRef");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockBubbleData,
      });

      getUserPushTokenByEmail.mockResolvedValue("token123");

      await notifyGuestsOfBubbleChanges("bubble123", "John Doe");

      expect(sendPushNotification).toHaveBeenCalledTimes(2);
      expect(sendPushNotification).toHaveBeenCalledWith(
        "token123",
        "Bubble Updated! 🔄",
        'John Doe made changes to "Test Bubble". Check it out to stay in the loop!',
        {
          bubbleId: "bubble123",
          hostName: "John Doe",
          type: "bubble_updated",
          bubbleName: "Test Bubble",
        }
      );
    });
  });

  describe("notifyGuestsOfBubbleDeletion", () => {
    it("should notify all guests of bubble deletion", async () => {
      // Mock getUserPushTokenByEmail to return tokens
      jest
        .spyOn(
          require("../../../utils/notifications/core"),
          "getUserPushTokenByEmail"
        )
        .mockResolvedValue("token123");

      // Mock sendPushNotification
      const sendPushNotification = jest
        .spyOn(
          require("../../../utils/notifications/core"),
          "sendPushNotification"
        )
        .mockResolvedValue();

      const guestList = ["guest1@example.com", "guest2@example.com"];

      await notifyGuestsOfBubbleDeletion(
        "bubble123",
        "John Doe",
        "Test Bubble",
        guestList
      );

      expect(sendPushNotification).toHaveBeenCalledTimes(2);
      expect(sendPushNotification).toHaveBeenCalledWith(
        "token123",
        "Bubble Cancelled ⚠️",
        'John Doe cancelled "Test Bubble". Check your other bubbles for updates!',
        {
          type: "bubble_deleted",
          bubbleId: "bubble123",
          hostName: "John Doe",
          bubbleName: "Test Bubble",
        }
      );
    });
  });
});
