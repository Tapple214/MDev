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

// Mock the helper function
jest.mock("../../../utils/helper", () => ({
  getUserNameByEmail: jest.fn(),
}));

// Mock Firebase db
jest.mock("../../../firebase", () => ({
  db: {},
}));

// Mock expo-notifications
jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(),
}));

// Mock console methods to clean up test output
const originalConsoleError = console.error;
const originalConsoleLog = console.log;
beforeAll(() => {
  console.error = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
});

import {
  getBubbleParticipants,
  notifyBubbleParticipantsOfNewItem,
  notifyUserAddedAsBubbleBuddy,
  scheduleBubbleNotifications,
} from "../../../utils/notifications/all";

describe("Notifications All Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBubbleParticipants", () => {
    it("should return participants excluding specified user", async () => {
      const { doc, getDoc } = require("firebase/firestore");

      const mockBubbleData = {
        hostUid: "host123",
        guestList: [
          "guest1@example.com",
          "guest2@example.com",
          "exclude@example.com",
        ],
      };

      const mockHostData = { email: "host@example.com" };

      doc.mockReturnValue("bubbleRef");
      getDoc
        .mockResolvedValueOnce({
          exists: () => true,
          data: () => mockBubbleData,
        }) // bubble
        .mockResolvedValueOnce({
          exists: () => true,
          data: () => mockHostData,
        }); // host user

      const result = await getBubbleParticipants(
        "bubble123",
        "exclude@example.com"
      );

      expect(result).toEqual(
        new Set([
          "host@example.com",
          "guest1@example.com",
          "guest2@example.com",
        ])
      );
    });

    it("should return empty set when bubble not found", async () => {
      const { doc, getDoc } = require("firebase/firestore");

      doc.mockReturnValue("bubbleRef");
      getDoc.mockResolvedValue({ exists: () => false });

      const result = await getBubbleParticipants("bubble123");

      expect(result).toEqual(new Set());
    });
  });

  describe("notifyBubbleParticipantsOfNewItem", () => {
    it("should notify participants of new item", async () => {
      const {
        getUserPushTokenByEmail,
        sendPushNotification,
      } = require("../../../utils/notifications/core");
      const { getUserNameByEmail } = require("../../../utils/helper");
      const { doc, getDoc } = require("firebase/firestore");

      // Mock bubble data
      const mockBubbleData = {
        hostUid: "host123",
        guestList: ["user1@example.com", "user2@example.com"],
      };
      const mockHostData = { email: "host@example.com" };

      doc.mockReturnValue("bubbleRef");
      getDoc
        .mockResolvedValueOnce({
          exists: () => true,
          data: () => mockBubbleData,
        })
        .mockResolvedValueOnce({
          exists: () => true,
          data: () => mockHostData,
        });

      getUserPushTokenByEmail.mockResolvedValue("token123");
      getUserNameByEmail.mockResolvedValue("John Doe");

      await notifyBubbleParticipantsOfNewItem(
        "bubble123",
        "john@example.com",
        "Test Bubble"
      );

      // Host + 2 guests (excluding the actor) = 3 notifications
      expect(sendPushNotification).toHaveBeenCalledTimes(3);
    });
  });

  describe("notifyUserAddedAsBubbleBuddy", () => {
    it("should notify user of bubble buddy addition", async () => {
      const {
        getUserPushTokenByEmail,
        sendPushNotification,
      } = require("../../../utils/notifications/core");
      const { getUserNameByEmail } = require("../../../utils/helper");

      getUserPushTokenByEmail.mockResolvedValue("token123");
      getUserNameByEmail.mockResolvedValue("John Doe");

      await notifyUserAddedAsBubbleBuddy(
        "john@example.com",
        "newbuddy@example.com"
      );

      expect(sendPushNotification).toHaveBeenCalledWith(
        "token123",
        "New Bubble Buddy!",
        "John Doe added you as a bubble buddy! Add them back!",
        expect.objectContaining({
          type: "bubble_buddy_added",
          addedByEmail: "john@example.com",
        })
      );
    });
  });

  describe("scheduleBubbleNotifications", () => {
    it("should schedule notifications for bubble", async () => {
      const { scheduleNotificationAsync } = require("expo-notifications");
      const { doc, getDoc } = require("firebase/firestore");

      // Mock bubble data with schedule
      const mockBubbleData = {
        name: "Test Bubble",
        // 30 hours from now so both 24h and 6h reminders are in the future
        schedule: { toDate: () => new Date(Date.now() + 30 * 60 * 60 * 1000) },
      };

      doc.mockReturnValue("bubbleRef");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockBubbleData,
      });

      await scheduleBubbleNotifications("bubble123");

      expect(scheduleNotificationAsync).toHaveBeenCalledTimes(2);
    });
  });
});
