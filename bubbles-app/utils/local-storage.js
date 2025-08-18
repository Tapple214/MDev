import AsyncStorage from "@react-native-async-storage/async-storage";

// =============================================== STORAGE KEYS ===============================================

const STORAGE_KEYS = {
  USER_DATA: "user_data",
  USER_BUBBLES: "user_bubbles",
  BUBBLE_DETAILS: "bubble_details",
  GUEST_RESPONSES: "guest_responses",
  ATTENDANCE_RECORDS: "attendance_records",
  NOTIFICATIONS: "notifications",
  LAST_SYNC: "last_sync",
  CACHE_EXPIRY: "cache_expiry",
  OFFLINE_ATTENDANCE: "offline_attendance",
};

// =============================================== CACHE CONFIGURATION ===============================================

const CACHE_EXPIRY = {
  USER_DATA: 24 * 60 * 60 * 1000, // 24 hours
  USER_BUBBLES: 1 * 60 * 60 * 1000, // 1 hour
  BUBBLE_DETAILS: 2 * 60 * 60 * 1000, // 2 hours
  GUEST_RESPONSES: 30 * 60 * 1000, // 30 minutes
  ATTENDANCE_RECORDS: 7 * 24 * 60 * 60 * 1000, // 7 days
  NOTIFICATIONS: 24 * 60 * 60 * 1000, // 24 hours
};

// =============================================== USER DATA CACHING ===============================================

export const cacheUserData = async (userId, userData) => {
  try {
    const cacheData = {
      data: userData,
      timestamp: Date.now(),
      userId,
    };

    await AsyncStorage.setItem(
      `${STORAGE_KEYS.USER_DATA}_${userId}`,
      JSON.stringify(cacheData)
    );

    console.log("User data cached successfully");
    return true;
  } catch (error) {
    console.error("Failed to cache user data:", error);
    return false;
  }
};

export const getCachedUserData = async (userId) => {
  try {
    const cached = await AsyncStorage.getItem(
      `${STORAGE_KEYS.USER_DATA}_${userId}`
    );
    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    const isExpired = Date.now() - cacheData.timestamp > CACHE_EXPIRY.USER_DATA;

    if (isExpired) {
      await AsyncStorage.removeItem(`${STORAGE_KEYS.USER_DATA}_${userId}`);
      return null;
    }

    return cacheData.data;
  } catch (error) {
    console.error("Failed to get cached user data:", error);
    return null;
  }
};

// =============================================== BUBBLES CACHING ===============================================

export const cacheUserBubbles = async (userId, bubbles) => {
  try {
    const cacheData = {
      data: bubbles,
      timestamp: Date.now(),
      userId,
    };

    await AsyncStorage.setItem(
      `${STORAGE_KEYS.USER_BUBBLES}_${userId}`,
      JSON.stringify(cacheData)
    );

    console.log("User bubbles cached successfully:", bubbles.length);
    return true;
  } catch (error) {
    console.error("Failed to cache user bubbles:", error);
    return false;
  }
};

export const getCachedUserBubbles = async (userId) => {
  try {
    const cached = await AsyncStorage.getItem(
      `${STORAGE_KEYS.USER_BUBBLES}_${userId}`
    );
    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    const isExpired =
      Date.now() - cacheData.timestamp > CACHE_EXPIRY.USER_BUBBLES;

    if (isExpired) {
      await AsyncStorage.removeItem(`${STORAGE_KEYS.USER_BUBBLES}_${userId}`);
      return null;
    }

    return cacheData.data;
  } catch (error) {
    console.error("Failed to get cached user bubbles:", error);
    return null;
  }
};

export const cacheBubbleDetails = async (bubbleId, bubbleData) => {
  try {
    const cacheData = {
      data: bubbleData,
      timestamp: Date.now(),
      bubbleId,
    };

    await AsyncStorage.setItem(
      `${STORAGE_KEYS.BUBBLE_DETAILS}_${bubbleId}`,
      JSON.stringify(cacheData)
    );

    console.log("Bubble details cached successfully:", bubbleId);
    return true;
  } catch (error) {
    console.error("Failed to cache bubble details:", error);
    return false;
  }
};

export const getCachedBubbleDetails = async (bubbleId) => {
  try {
    const cached = await AsyncStorage.getItem(
      `${STORAGE_KEYS.BUBBLE_DETAILS}_${bubbleId}`
    );
    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    const isExpired =
      Date.now() - cacheData.timestamp > CACHE_EXPIRY.BUBBLE_DETAILS;

    if (isExpired) {
      await AsyncStorage.removeItem(
        `${STORAGE_KEYS.BUBBLE_DETAILS}_${bubbleId}`
      );
      return null;
    }

    return cacheData.data;
  } catch (error) {
    console.error("Failed to get cached bubble details:", error);
    return null;
  }
};

// =============================================== GUEST RESPONSES CACHING ===============================================

export const cacheGuestResponses = async (bubbleId, responses) => {
  try {
    const cacheData = {
      data: responses,
      timestamp: Date.now(),
      bubbleId,
    };

    await AsyncStorage.setItem(
      `${STORAGE_KEYS.GUEST_RESPONSES}_${bubbleId}`,
      JSON.stringify(cacheData)
    );

    console.log("Guest responses cached successfully:", bubbleId);
    return true;
  } catch (error) {
    console.error("Failed to cache guest responses:", error);
    return false;
  }
};

export const getCachedGuestResponses = async (bubbleId) => {
  try {
    const cached = await AsyncStorage.getItem(
      `${STORAGE_KEYS.GUEST_RESPONSES}_${bubbleId}`
    );
    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    const isExpired =
      Date.now() - cacheData.timestamp > CACHE_EXPIRY.GUEST_RESPONSES;

    if (isExpired) {
      await AsyncStorage.removeItem(
        `${STORAGE_KEYS.GUEST_RESPONSES}_${bubbleId}`
      );
      return null;
    }

    return cacheData.data;
  } catch (error) {
    console.error("Failed to get cached guest responses:", error);
    return null;
  }
};

// =============================================== ATTENDANCE RECORDS CACHING ===============================================

export const cacheAttendanceRecord = async (
  bubbleId,
  guestEmail,
  attendanceData
) => {
  try {
    const key = `${STORAGE_KEYS.ATTENDANCE_RECORDS}_${bubbleId}_${guestEmail}`;
    const cacheData = {
      data: attendanceData,
      timestamp: Date.now(),
      bubbleId,
      guestEmail,
    };

    await AsyncStorage.setItem(key, JSON.stringify(cacheData));

    console.log("Attendance record cached successfully:", {
      bubbleId,
      guestEmail,
    });
    return true;
  } catch (error) {
    console.error("Failed to cache attendance record:", error);
    return false;
  }
};

export const getCachedAttendanceRecord = async (bubbleId, guestEmail) => {
  try {
    const key = `${STORAGE_KEYS.ATTENDANCE_RECORDS}_${bubbleId}_${guestEmail}`;
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    const isExpired =
      Date.now() - cacheData.timestamp > CACHE_EXPIRY.ATTENDANCE_RECORDS;

    if (isExpired) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return cacheData.data;
  } catch (error) {
    console.error("Failed to get cached attendance record:", error);
    return null;
  }
};

// =============================================== OFFLINE ATTENDANCE STORAGE ===============================================

export const storeOfflineAttendance = async (
  bubbleId,
  guestEmail,
  attendanceData
) => {
  try {
    const existing = await AsyncStorage.getItem(
      STORAGE_KEYS.OFFLINE_ATTENDANCE
    );
    const attendanceList = existing ? JSON.parse(existing) : [];

    // Check if attendance already exists for this bubble/guest combination
    const existingIndex = attendanceList.findIndex(
      (item) => item.bubbleId === bubbleId && item.guestEmail === guestEmail
    );

    const attendanceRecord = {
      bubbleId,
      guestEmail,
      attendanceData,
      timestamp: Date.now(),
      synced: false,
    };

    if (existingIndex >= 0) {
      attendanceList[existingIndex] = attendanceRecord;
    } else {
      attendanceList.push(attendanceRecord);
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.OFFLINE_ATTENDANCE,
      JSON.stringify(attendanceList)
    );

    console.log("Offline attendance stored successfully:", {
      bubbleId,
      guestEmail,
    });
    return true;
  } catch (error) {
    console.error("Failed to store offline attendance:", error);
    return false;
  }
};

export const getOfflineAttendanceRecords = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_ATTENDANCE);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to get offline attendance records:", error);
    return [];
  }
};

export const markAttendanceAsSynced = async (bubbleId, guestEmail) => {
  try {
    const attendanceList = await getOfflineAttendanceRecords();
    const updatedList = attendanceList.filter(
      (item) => !(item.bubbleId === bubbleId && item.guestEmail === guestEmail)
    );

    await AsyncStorage.setItem(
      STORAGE_KEYS.OFFLINE_ATTENDANCE,
      JSON.stringify(updatedList)
    );

    console.log("Attendance marked as synced:", { bubbleId, guestEmail });
    return true;
  } catch (error) {
    console.error("Failed to mark attendance as synced:", error);
    return false;
  }
};

// =============================================== CACHE MANAGEMENT ===============================================

export const updateLastSyncTime = async (dataType) => {
  try {
    const syncData = {
      [dataType]: Date.now(),
    };

    const existing = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    const lastSync = existing ? JSON.parse(existing) : {};

    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_SYNC,
      JSON.stringify({
        ...lastSync,
        ...syncData,
      })
    );

    return true;
  } catch (error) {
    console.error("Failed to update last sync time:", error);
    return false;
  }
};

export const getLastSyncTime = async (dataType) => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    if (!stored) return null;

    const lastSync = JSON.parse(stored);
    return dataType ? lastSync[dataType] : lastSync;
  } catch (error) {
    console.error("Failed to get last sync time:", error);
    return null;
  }
};

export const clearExpiredCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const expiredKeys = [];

    for (const key of keys) {
      if (key.includes("_cache_") || key.includes("_timestamp_")) {
        try {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            const data = JSON.parse(value);
            if (
              data.timestamp &&
              Date.now() - data.timestamp > 24 * 60 * 60 * 1000
            ) {
              expiredKeys.push(key);
            }
          }
        } catch (e) {
          // If we can't parse the value, consider it expired
          expiredKeys.push(key);
        }
      }
    }

    if (expiredKeys.length > 0) {
      await AsyncStorage.multiRemove(expiredKeys);
      console.log("Cleared expired cache entries:", expiredKeys.length);
    }

    return expiredKeys.length;
  } catch (error) {
    console.error("Failed to clear expired cache:", error);
    return 0;
  }
};

export const clearAllCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) =>
      Object.values(STORAGE_KEYS).some((storageKey) => key.includes(storageKey))
    );

    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
      console.log("Cleared all cache entries:", cacheKeys.length);
    }

    return cacheKeys.length;
  } catch (error) {
    console.error("Failed to clear all cache:", error);
    return 0;
  }
};

// =============================================== UTILITY FUNCTIONS ===============================================

export const isCacheValid = (timestamp, expiryTime) => {
  return Date.now() - timestamp < expiryTime;
};

export const getCacheAge = (timestamp) => {
  return Date.now() - timestamp;
};

export const formatCacheAge = (timestamp) => {
  const age = getCacheAge(timestamp);
  const minutes = Math.floor(age / (60 * 1000));
  const hours = Math.floor(age / (60 * 60 * 1000));
  const days = Math.floor(age / (24 * 60 * 60 * 1000));

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
};
