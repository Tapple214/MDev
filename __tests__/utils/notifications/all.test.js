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
      // Mock the database calls
      const { doc, getDoc } = require("firebase/firestore");

      // Mock bubble data
      const mockBubbleData = {
        hostUid: "host123",
        guestList: ["guest@example.com"],
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

      // Mock getUserPushTokenByEmail to return tokens
      jest
        .spyOn(
          require("../../../utils/notifications/core"),
          "getUserPushTokenByEmail"
        )
        .mockResolvedValue("token123");

      // Mock getUserNameByEmail to return a name
      jest
        .spyOn(require("../../../utils/helper"), "getUserNameByEmail")
        .mockResolvedValue("John Doe");

      // Mock sendPushNotification
      const sendPushNotification = jest
        .spyOn(
          require("../../../utils/notifications/core"),
          "sendPushNotification"
        )
        .mockResolvedValue();

      await notifyBubbleParticipantsOfNewItem(
        "bubble123",
        "john@example.com",
        "Test Bubble"
      );

      // Should be called for both host and guest (excluding the person who added the item)
      expect(sendPushNotification).toHaveBeenCalledTimes(2);
      expect(sendPushNotification).toHaveBeenCalledWith(
        "token123",
        "New Item Added to BubbleBook! 📚",
        'John Doe added an item to "Test Bubble" - check it out!',
        {
          type: "item_added_to_bubble_book",
          bubbleId: "bubble123",
          bubbleName: "Test Bubble",
          addedByEmail: "john@example.com",
          addedByName: "John Doe",
        }
      );
    });
  });

  describe("notifyUserAddedAsBubbleBuddy", () => {
    it("should notify user of bubble buddy addition", async () => {
      // Mock getUserPushTokenByEmail to return a token
      const mockToken = "token123";
      jest
        .spyOn(
          require("../../../utils/notifications/core"),
          "getUserPushTokenByEmail"
        )
        .mockResolvedValue(mockToken);

      // Mock getUserNameByEmail to return a name
      jest
        .spyOn(require("../../../utils/helper"), "getUserNameByEmail")
        .mockResolvedValue("John Doe");

      // Mock sendPushNotification
      const sendPushNotification = jest
        .spyOn(
          require("../../../utils/notifications/core"),
          "sendPushNotification"
        )
        .mockResolvedValue();

      await notifyUserAddedAsBubbleBuddy(
        "john@example.com",
        "jane@example.com"
      );

      expect(sendPushNotification).toHaveBeenCalledWith(
        "token123",
        "New Bubble Buddy! 🤝",
        "John Doe added you as a bubble buddy! Add them back to stay connected!",
        {
          addedByEmail: "john@example.com",
          addedByName: "John Doe",
          type: "bubble_buddy_added",
        }
      );
    });
  });

  describe("scheduleBubbleNotifications", () => {
    it.skip("should schedule notifications for bubble", async () => {
      // Mock the database calls
      const { doc, getDoc } = require("firebase/firestore");

      // Mock bubble data - ensure it's far enough in the future
      const futureDate = new Date(Date.now() + 30 * 60 * 60 * 1000); // 30 hours from now
      const mockBubbleData = {
        name: "Test Bubble",
        schedule: {
          toDate: () => futureDate,
        },
      };

      // Mock the host user data
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
        })
        .mockResolvedValueOnce({
          exists: () => true,
          data: () => mockHostData,
        });

      // Mock getUserPushTokenByEmail to return tokens
      jest
        .spyOn(
          require("../../../utils/notifications/core"),
          "getUserPushTokenByEmail"
        )
        .mockResolvedValue("token123");

      // Mock Notifications.scheduleNotificationAsync
      const scheduleNotificationAsync = jest.fn().mockResolvedValue();
      const Notifications = require("expo-notifications");
      Notifications.scheduleNotificationAsync = scheduleNotificationAsync;

      await scheduleBubbleNotifications("bubble123");

      // Should schedule notifications for 2 participants × 2 time periods = 4 total
      expect(scheduleNotificationAsync).toHaveBeenCalledTimes(4);
    });
  });
});
