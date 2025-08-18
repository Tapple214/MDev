// Mock Firebase before importing
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(() => "mock-timestamp"),
}));

// Mock the helper functions
jest.mock("../../utils/helper", () => ({
  dateToTimestamp: jest.fn(() => new Date("2024-01-15T14:30:00")),
}));

// Mock the attendance functions
jest.mock("../../utils/attendance", () => ({
  generateEntryQRCode: jest.fn(() => "mock-qr-code"),
  generateAttendancePin: jest.fn(() => "12345"),
}));

// Mock the notification functions
jest.mock("../../utils/notifications/guests", () => ({
  notifyGuestOfInvite: jest.fn(),
  notifyGuestsOfBubbleChanges: jest.fn(),
}));

jest.mock("../../utils/notifications/all", () => ({
  scheduleBubbleNotifications: jest.fn(),
}));

jest.mock("../../utils/notifications/hosts", () => ({
  notifyHostOfGuestResponse: jest.fn(),
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
  addUser,
  getUser,
  deleteUser,
  createBubble,
  updateBubble,
} from "../../utils/firestore";

describe("Firestore Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addUser", () => {
    it("should add user successfully", async () => {
      const userId = "user123";
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        profilePicture: "profile.jpg",
        bio: "Test bio",
        preferences: { theme: "dark" },
      };

      const mockUserRef = "userRef";
      require("firebase/firestore").doc.mockReturnValue(mockUserRef);
      require("firebase/firestore").setDoc.mockResolvedValue();

      const result = await addUser(userId, userData);

      expect(require("firebase/firestore").doc).toHaveBeenCalledWith(
        {},
        "users",
        userId
      );
      expect(require("firebase/firestore").setDoc).toHaveBeenCalledWith(
        mockUserRef,
        {
          name: "John Doe",
          email: "john@example.com",
          createdAt: "mock-timestamp",
          updatedAt: "mock-timestamp",
          profilePicture: "profile.jpg",
          bio: "Test bio",
          preferences: { theme: "dark" },
        }
      );
      expect(result).toBe(true);
    });

    it("should handle errors", async () => {
      const userId = "user123";
      const userData = { name: "John Doe", email: "john@example.com" };

      require("firebase/firestore").doc.mockReturnValue("userRef");
      require("firebase/firestore").setDoc.mockRejectedValue(
        new Error("Database error")
      );

      await expect(addUser(userId, userData)).rejects.toThrow("Database error");
      expect(console.error).toHaveBeenCalledWith(
        "Error adding user to Firestore:",
        expect.any(Error)
      );
    });
  });

  describe("getUser", () => {
    it("should return user data when user exists", async () => {
      const userId = "user123";
      const mockUserData = { name: "John Doe", email: "john@example.com" };

      const mockUserRef = "userRef";
      const mockUserSnap = {
        exists: () => true,
        data: () => mockUserData,
      };

      require("firebase/firestore").doc.mockReturnValue(mockUserRef);
      require("firebase/firestore").getDoc.mockResolvedValue(mockUserSnap);

      const result = await getUser(userId);

      expect(result).toEqual(mockUserData);
    });

    it("should return null when user does not exist", async () => {
      const userId = "user123";

      const mockUserRef = "userRef";
      const mockUserSnap = {
        exists: () => false,
        data: () => ({}),
      };

      require("firebase/firestore").doc.mockReturnValue(mockUserRef);
      require("firebase/firestore").getDoc.mockResolvedValue(mockUserSnap);

      const result = await getUser(userId);

      expect(result).toBeNull();
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      const userId = "user123";

      const mockUserRef = "userRef";
      require("firebase/firestore").doc.mockReturnValue(mockUserRef);
      require("firebase/firestore").deleteDoc.mockResolvedValue();

      const result = await deleteUser(userId);

      expect(require("firebase/firestore").doc).toHaveBeenCalledWith(
        {},
        "users",
        userId
      );
      expect(require("firebase/firestore").deleteDoc).toHaveBeenCalledWith(
        mockUserRef
      );
      expect(result).toBe(true);
    });
  });

  describe("updateBubble", () => {
    it("should update bubble successfully", async () => {
      const bubbleData = {
        bubbleId: "bubble123",
        name: "Updated Bubble",
        selectedDate: new Date("2024-01-15"),
        selectedTime: new Date("2024-01-15T15:00:00"),
      };

      const mockBubbleRef = "bubbleRef";
      require("firebase/firestore").doc.mockReturnValue(mockBubbleRef);
      require("firebase/firestore").updateDoc.mockResolvedValue();

      await updateBubble(bubbleData);

      expect(require("firebase/firestore").doc).toHaveBeenCalledWith(
        {},
        "bubbles",
        "bubble123"
      );

      // Check that updateDoc was called with the expected data structure
      expect(require("firebase/firestore").updateDoc).toHaveBeenCalledWith(
        mockBubbleRef,
        expect.objectContaining({
          name: "Updated Bubble",
          schedule: expect.any(Date),
          updatedAt: "mock-timestamp",
        })
      );
    });
  });
});
