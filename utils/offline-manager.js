import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

// =============================================== OFFLINE MANAGER CLASS ===============================================

class OfflineManager {
  constructor() {
    this.offlineQueue = [];
    this.isOnline = true;
    this.syncInProgress = false;
    this.setupNetworkListener();
    this.loadOfflineQueue();
  }

  // =============================================== NETWORK MONITORING ===============================================

  setupNetworkListener() {
    NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected && state.isInternetReachable;

      if (wasOffline && this.isOnline) {
        this.processOfflineQueue();
      }
    });
  }

  // =============================================== OFFLINE QUEUE MANAGEMENT ===============================================

  async addToOfflineQueue(operation) {
    const queueItem = {
      id: this.generateOperationId(),
      ...operation,
      timestamp: Date.now(),
      retryCount: 0,
      status: "pending",
    };

    this.offlineQueue.push(queueItem);
    await this.saveOfflineQueue();

    return queueItem.id;
  }

  async removeFromOfflineQueue(operationId) {
    this.offlineQueue = this.offlineQueue.filter(
      (item) => item.id !== operationId
    );
    await this.saveOfflineQueue();
  }

  async updateQueueItemStatus(operationId, status, error = null) {
    const item = this.offlineQueue.find((item) => item.id === operationId);
    if (item) {
      item.status = status;
      item.error = error;
      item.lastAttempt = Date.now();
      await this.saveOfflineQueue();
    }
  }

  // =============================================== QUEUE PROCESSING ===============================================

  async processOfflineQueue() {
    if (this.syncInProgress || this.offlineQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;

    try {
      const queue = [...this.offlineQueue];
      const results = {
        successful: 0,
        failed: 0,
        skipped: 0,
      };

      for (const operation of queue) {
        try {
          if (operation.retryCount >= 3) {
            await this.updateQueueItemStatus(
              operation.id,
              "failed",
              "Max retries exceeded"
            );
            results.skipped++;
            continue;
          }

          await this.executeOperation(operation);
          await this.removeFromOfflineQueue(operation.id);
          results.successful++;
        } catch (error) {
          operation.retryCount++;
          await this.updateQueueItemStatus(
            operation.id,
            "retrying",
            error.message
          );
          results.failed++;

          console.error("Failed to process offline operation:", {
            type: operation.type,
            error: error.message,
            retryCount: operation.retryCount,
          });
        }
      }
    } catch (error) {
      console.error("Error processing offline queue:", error);
    } finally {
      this.syncInProgress = false;
    }
  }

  async executeOperation(operation) {
    switch (operation.type) {
      case "create_bubble":
        return await this.executeCreateBubble(operation);
      case "update_bubble":
        return await this.executeUpdateBubble(operation);
      case "delete_bubble":
        return await this.executeDeleteBubble(operation);
      case "confirm_attendance":
        return await this.executeConfirmAttendance(operation);
      case "update_guest_response":
        return await this.executeUpdateGuestResponse(operation);
      case "send_notification":
        return await this.executeSendNotification(operation);
      default:
        throw new Error(`Unknown operation type: ${operation.type}`);
    }
  }

  // =============================================== OPERATION EXECUTORS ===============================================

  async executeCreateBubble(operation) {
    // Import here to avoid circular dependencies
    const { createBubble } = await import("./firestore");
    return await createBubble(operation.data);
  }

  async executeUpdateBubble(operation) {
    const { updateBubble } = await import("./firestore");
    return await updateBubble(operation.data);
  }

  async executeDeleteBubble(operation) {
    const { deleteBubble } = await import("./firestore");
    return await deleteBubble(operation.bubbleId);
  }

  async executeConfirmAttendance(operation) {
    const { confirmAttendanceByQR, confirmAttendanceByPin } = await import(
      "./attendance"
    );

    if (operation.method === "qr") {
      return await confirmAttendanceByQR(
        operation.bubbleId,
        operation.guestEmail,
        operation.qrData
      );
    } else if (operation.method === "pin") {
      return await confirmAttendanceByPin(
        operation.bubbleId,
        operation.guestEmail,
        operation.pinData
      );
    }

    throw new Error("Invalid attendance confirmation method");
  }

  async executeUpdateGuestResponse(operation) {
    const { updateGuestResponse } = await import("./firestore");
    return await updateGuestResponse(
      operation.bubbleId,
      operation.guestEmail,
      operation.response
    );
  }

  async executeSendNotification(operation) {
    const { sendPushNotification } = await import("./notifications/core");
    return await sendPushNotification(
      operation.pushToken,
      operation.title,
      operation.body,
      operation.data
    );
  }

  // =============================================== LOCAL STORAGE OPERATIONS ===============================================

  async saveOfflineQueue() {
    try {
      await AsyncStorage.setItem(
        "offline_queue",
        JSON.stringify(this.offlineQueue)
      );
    } catch (error) {
      console.error("Failed to save offline queue:", error);
    }
  }

  async loadOfflineQueue() {
    try {
      const stored = await AsyncStorage.getItem("offline_queue");
      if (stored) {
        this.offlineQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load offline queue:", error);
      this.offlineQueue = [];
    }
  }

  async clearOfflineQueue() {
    this.offlineQueue = [];
    await AsyncStorage.removeItem("offline_queue");
  }

  // =============================================== UTILITY METHODS ===============================================

  generateOperationId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getQueueStatus() {
    return {
      isOnline: this.isOnline,
      queueLength: this.offlineQueue.length,
      syncInProgress: this.syncInProgress,
      pendingOperations: this.offlineQueue.filter(
        (item) => item.status === "pending"
      ).length,
      retryingOperations: this.offlineQueue.filter(
        (item) => item.status === "retrying"
      ).length,
      failedOperations: this.offlineQueue.filter(
        (item) => item.status === "failed"
      ).length,
    };
  }

  async getOfflineQueue() {
    return [...this.offlineQueue];
  }

  // =============================================== PUBLIC API ===============================================

  async queueOperation(type, data, options = {}) {
    if (this.isOnline && !options.forceOffline) {
      // Try to execute immediately if online
      try {
        return await this.executeOperation({ type, data });
      } catch (error) {
        if (this.isNetworkError(error)) {
          // If it's a network error, add to offline queue
          return await this.addToOfflineQueue({ type, data });
        }
        throw error;
      }
    } else {
      // Add to offline queue
      return await this.addToOfflineQueue({ type, data });
    }
  }

  isNetworkError(error) {
    if (!error) return false;

    const networkErrorCodes = [
      "unavailable",
      "deadline-exceeded",
      "unauthenticated",
      "permission-denied",
    ];

    const networkErrorMessages = [
      "network",
      "connection",
      "timeout",
      "offline",
      "unreachable",
    ];

    return (
      networkErrorCodes.includes(error.code) ||
      networkErrorMessages.some((msg) =>
        error.message?.toLowerCase().includes(msg)
      )
    );
  }

  // =============================================== MANUAL SYNC ===============================================

  async manualSync() {
    if (this.isOnline) {
      await this.processOfflineQueue();
    } else {
      throw new Error("Cannot sync while offline");
    }
  }

  // =============================================== CLEANUP ===============================================

  async cleanup() {
    // Remove old failed operations (older than 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    this.offlineQueue = this.offlineQueue.filter(
      (item) => item.status !== "failed" || item.timestamp > sevenDaysAgo
    );
    await this.saveOfflineQueue();
  }
}

// =============================================== CALLING FUNCTION ===============================================

let offlineManagerInstance = null;

export const getOfflineManager = () => {
  if (!offlineManagerInstance) {
    offlineManagerInstance = new OfflineManager();
  }
  return offlineManagerInstance;
};

// =============================================== CONVENIENCE FUNCTIONS ===============================================

export const queueOperation = async (type, data, options = {}) => {
  const manager = getOfflineManager();
  return await manager.queueOperation(type, data, options);
};

export const isOnline = () => {
  const manager = getOfflineManager();
  return manager.isOnline;
};

export const getQueueStatus = () => {
  const manager = getOfflineManager();
  return manager.getQueueStatus();
};

export const manualSync = async () => {
  const manager = getOfflineManager();
  return await manager.manualSync();
};

export const cleanupOfflineData = async () => {
  const manager = getOfflineManager();
  return await manager.cleanup();
};

export default getOfflineManager;
