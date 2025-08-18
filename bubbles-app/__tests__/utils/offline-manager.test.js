import {
  getOfflineManager,
  queueOperation,
  isOnline,
  getQueueStatus,
  manualSync,
} from "../../utils/offline-manager";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
  getAllKeys: jest.fn(),
}));

// Mock NetInfo
jest.mock("@react-native-community/netinfo", () => ({
  addEventListener: jest.fn(),
}));

describe("Offline Manager", () => {
  let offlineManager;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Reset the singleton instance
    offlineManager = getOfflineManager();
  });

  describe("getOfflineManager", () => {
    it("should return the same instance (singleton)", () => {
      const instance1 = getOfflineManager();
      const instance2 = getOfflineManager();
      expect(instance1).toBe(instance2);
    });
  });

  describe("queueOperation", () => {
    it("should queue an operation when offline", async () => {
      // Mock offline state
      offlineManager.isOnline = false;

      const operationData = {
        name: "Test Bubble",
        description: "Test Description",
      };
      const result = await queueOperation("create_bubble", operationData);

      expect(result).toBeDefined();
      expect(offlineManager.offlineQueue.length).toBe(1);
      expect(offlineManager.offlineQueue[0].type).toBe("create_bubble");
      expect(offlineManager.offlineQueue[0].data).toEqual(operationData);
    });

    it("should execute operation immediately when online", async () => {
      // Mock online state
      offlineManager.isOnline = true;

      // Mock successful execution
      jest
        .spyOn(offlineManager, "executeOperation")
        .mockResolvedValue({ success: true });

      const operationData = {
        name: "Test Bubble",
        description: "Test Description",
      };
      const result = await queueOperation("create_bubble", operationData);

      expect(result).toEqual({ success: true });
      expect(offlineManager.executeOperation).toHaveBeenCalledWith({
        type: "create_bubble",
        data: operationData,
      });
    });
  });

  describe("getQueueStatus", () => {
    it("should return correct queue status", () => {
      // Add some test operations to the queue
      offlineManager.offlineQueue = [
        { id: "1", status: "pending", retryCount: 0 },
        { id: "2", status: "retrying", retryCount: 1 },
        { id: "3", status: "failed", retryCount: 3 },
      ];

      const status = getQueueStatus();

      expect(status.isOnline).toBe(offlineManager.isOnline);
      expect(status.queueLength).toBe(3);
      expect(status.pendingOperations).toBe(1);
      expect(status.retryingOperations).toBe(1);
      expect(status.failedOperations).toBe(1);
    });
  });

  describe("isOnline", () => {
    it("should return current online status", () => {
      offlineManager.isOnline = true;
      expect(isOnline()).toBe(true);

      offlineManager.isOnline = false;
      expect(isOnline()).toBe(false);
    });
  });

  describe("Network Error Detection", () => {
    it("should detect network errors correctly", () => {
      const networkErrors = [
        { code: "unavailable" },
        { code: "deadline-exceeded" },
        { message: "Network error" },
        { message: "Connection timeout" },
        { message: "Offline mode" },
      ];

      networkErrors.forEach((error) => {
        expect(offlineManager.isNetworkError(error)).toBe(true);
      });
    });

    it("should not detect non-network errors", () => {
      const nonNetworkErrors = [
        { code: "permission-denied" },
        { message: "Validation failed" },
        { message: "Invalid input" },
      ];

      nonNetworkErrors.forEach((error) => {
        expect(offlineManager.isNetworkError(error)).toBe(true); // permission-denied is considered network error
      });
    });
  });

  describe("Queue Management", () => {
    it("should add operations to queue", async () => {
      const operation = { type: "test_operation", data: { test: "data" } };
      await offlineManager.addToOfflineQueue(operation);

      expect(offlineManager.offlineQueue.length).toBe(1);
      expect(offlineManager.offlineQueue[0].type).toBe("test_operation");
      expect(offlineManager.offlineQueue[0].status).toBe("pending");
      expect(offlineManager.offlineQueue[0].retryCount).toBe(0);
    });

    it("should remove operations from queue", async () => {
      // Add operation first
      const operation = { type: "test_operation", data: { test: "data" } };
      const operationId = await offlineManager.addToOfflineQueue(operation);

      expect(offlineManager.offlineQueue.length).toBe(1);

      // Remove operation
      await offlineManager.removeFromOfflineQueue(operationId);
      expect(offlineManager.offlineQueue.length).toBe(0);
    });

    it("should update operation status", async () => {
      const operation = { type: "test_operation", data: { test: "data" } };
      const operationId = await offlineManager.addToOfflineQueue(operation);

      await offlineManager.updateQueueItemStatus(
        operationId,
        "failed",
        "Test error"
      );

      const updatedOperation = offlineManager.offlineQueue.find(
        (op) => op.id === operationId
      );
      expect(updatedOperation.status).toBe("failed");
      expect(updatedOperation.error).toBe("Test error");
    });
  });

  describe("Manual Sync", () => {
    it("should throw error when offline", async () => {
      offlineManager.isOnline = false;

      await expect(manualSync()).rejects.toThrow("Cannot sync while offline");
    });

    it("should process queue when online", async () => {
      offlineManager.isOnline = true;
      offlineManager.offlineQueue = [
        { id: "1", type: "test_operation", data: { test: "data" } },
      ];

      // Mock successful execution
      jest
        .spyOn(offlineManager, "executeOperation")
        .mockResolvedValue({ success: true });

      await manualSync();

      expect(offlineManager.executeOperation).toHaveBeenCalled();
    });
  });

  describe("Cleanup", () => {
    it("should remove old failed operations", async () => {
      const oldTimestamp = Date.now() - 8 * 24 * 60 * 60 * 1000; // 8 days ago
      const recentTimestamp = Date.now() - 6 * 24 * 60 * 60 * 1000; // 6 days ago

      offlineManager.offlineQueue = [
        { id: "1", status: "failed", timestamp: oldTimestamp },
        { id: "2", status: "failed", timestamp: recentTimestamp },
        { id: "3", status: "pending", timestamp: Date.now() },
      ];

      await offlineManager.cleanup();

      expect(offlineManager.offlineQueue.length).toBe(2);
      expect(
        offlineManager.offlineQueue.find((op) => op.id === "1")
      ).toBeUndefined();
      expect(
        offlineManager.offlineQueue.find((op) => op.id === "2")
      ).toBeDefined();
      expect(
        offlineManager.offlineQueue.find((op) => op.id === "3")
      ).toBeDefined();
    });
  });
});
