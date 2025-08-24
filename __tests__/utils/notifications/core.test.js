// Mock Firebase before importing
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

// Mock Firebase db
jest.mock("../../../firebase", () => ({
  db: {},
}));

// Mock expo-notifications
jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
}));

// Mock expo-device
jest.mock("expo-device", () => ({
  isDevice: true,
}));

// Mock fetch
global.fetch = jest.fn();

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
  requestNotificationPermissions,
  savePushToken,
  registerForPushNotifications,
  getUserPushToken,
  getUserPushTokenByEmail,
  sendPushNotification,
  sendLocalNotification,
  initializeAppNotifications,
} from "../../../utils/notifications/core";

describe("Notifications Core Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("requestNotificationPermissions", () => {
    it("should request permissions when not granted", async () => {
      const {
        getPermissionsAsync,
        requestPermissionsAsync,
      } = require("expo-notifications");

      getPermissionsAsync.mockResolvedValue({ status: "undetermined" });
      requestPermissionsAsync.mockResolvedValue({ status: "granted" });

      const result = await requestNotificationPermissions();

      expect(result).toBe(true);
      expect(requestPermissionsAsync).toHaveBeenCalled();
    });

    it("should return true when permissions already granted", async () => {
      const { getPermissionsAsync } = require("expo-notifications");

      getPermissionsAsync.mockResolvedValue({ status: "granted" });

      const result = await requestNotificationPermissions();

      expect(result).toBe(true);
    });
  });

  describe("savePushToken", () => {
    it("should save push token successfully", async () => {
      const { doc, updateDoc } = require("firebase/firestore");

      doc.mockReturnValue("userRef");
      updateDoc.mockResolvedValue();

      const result = await savePushToken("user123", "token123");

      expect(result).toBe(true);
      expect(updateDoc).toHaveBeenCalledWith("userRef", {
        pushToken: "token123",
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("getUserPushToken", () => {
    it("should return user push token", async () => {
      const { doc, getDoc } = require("firebase/firestore");

      doc.mockReturnValue("userRef");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ pushToken: "token123" }),
      });

      const result = await getUserPushToken("user123");

      expect(result).toBe("token123");
    });

    it("should return null when user not found", async () => {
      const { doc, getDoc } = require("firebase/firestore");

      doc.mockReturnValue("userRef");
      getDoc.mockResolvedValue({ exists: () => false });

      const result = await getUserPushToken("user123");

      expect(result).toBe(null);
    });
  });

  describe("getUserPushTokenByEmail", () => {
    it("should return push token by email", async () => {
      const {
        collection,
        query,
        where,
        getDocs,
      } = require("firebase/firestore");

      collection.mockReturnValue("usersRef");
      query.mockReturnValue("queryRef");
      where.mockReturnValue("whereRef");
      getDocs.mockResolvedValue({
        empty: false,
        docs: [{ data: () => ({ pushToken: "token123" }) }],
      });

      const result = await getUserPushTokenByEmail("user@example.com");

      expect(result).toBe("token123");
    });
  });

  describe("sendPushNotification", () => {
    it("should send push notification", async () => {
      global.fetch.mockResolvedValue({ ok: true });

      await sendPushNotification("token123", "Title", "Body", { type: "test" });

      expect(fetch).toHaveBeenCalledWith(
        "https://exp.host/--/api/v2/push/send",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            to: "token123",
            sound: "default",
            title: "Title",
            body: "Body",
            data: { type: "test" },
          }),
        })
      );
    });

    it("should skip when no token provided", async () => {
      await sendPushNotification(null, "Title", "Body");

      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe("sendLocalNotification", () => {
    it("should schedule local notification", async () => {
      const { scheduleNotificationAsync } = require("expo-notifications");

      await sendLocalNotification("Title", "Body", { type: "test" });

      expect(scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: "Title",
          body: "Body",
          data: { type: "test" },
        },
        trigger: null,
      });
    });
  });

  describe("initializeAppNotifications", () => {
    it("should initialize notifications successfully", async () => {
      const { getExpoPushTokenAsync } = require("expo-notifications");

      getExpoPushTokenAsync.mockResolvedValue({ data: "token123" });

      const mockUser = { uid: "user123" };

      const result = await initializeAppNotifications(mockUser);

      expect(result).toBe("token123");
    });
  });
});
