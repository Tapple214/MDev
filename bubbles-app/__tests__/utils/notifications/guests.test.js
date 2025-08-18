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
        "New Bubble Invite!",
        'You have been invited by John Doe to "Test Bubble"',
        expect.objectContaining({
          type: "bubble_invite",
          bubbleId: "bubble123",
          hostName: "John Doe",
        })
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
        "New Bubble Invite!",
        'You have been invited by John Doe to "Test Bubble"',
        expect.objectContaining({
          type: "bubble_invite",
          bubbleId: "bubble123",
          hostName: "John Doe",
        })
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
        "Bubble Updated!",
        'John Doe made changes to "Test Bubble". Check it out to stay in the loop!',
        expect.objectContaining({
          type: "bubble_updated",
          bubbleId: "bubble123",
          hostName: "John Doe",
          bubbleName: "Test Bubble",
        })
      );
    });
  });

  describe("notifyGuestsOfBubbleDeletion", () => {
    it("should notify all guests of bubble deletion", async () => {
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

      await notifyGuestsOfBubbleDeletion(
        "bubble123",
        "John Doe",
        "Test Bubble"
      );

      expect(sendPushNotification).toHaveBeenCalledTimes(2);
      expect(sendPushNotification).toHaveBeenCalledWith(
        "token123",
        "Bubble Deleted",
        'John Doe cancelled "Test Bubble"',
        expect.objectContaining({
          type: "bubble_deleted",
          bubbleId: "bubble123",
          hostName: "John Doe",
          bubbleName: "Test Bubble",
        })
      );
    });
  });
});
