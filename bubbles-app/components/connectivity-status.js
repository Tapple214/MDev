import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../utils/custom-styles";
import { getQueueStatus, manualSync, isOnline } from "../utils/offline-manager";

export default function ConnectivityStatus() {
  const [queueStatus, setQueueStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const status = getQueueStatus();
      setQueueStatus(status);
      setIsVisible(!status.isOnline || status.queueLength > 0);
    };

    // Check status immediately
    checkStatus();

    // Check status every 5 seconds
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    try {
      Alert.alert(
        "Manual Sync",
        "This will attempt to sync all pending offline operations. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sync",
            onPress: async () => {
              try {
                await manualSync();
                Alert.alert(
                  "Success",
                  "Offline operations synced successfully!"
                );
              } catch (error) {
                Alert.alert(
                  "Error",
                  "Failed to sync offline operations. Please try again."
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to initiate manual sync.");
    }
  };

  const getStatusMessage = () => {
    if (!queueStatus) return "Checking connection...";

    if (!queueStatus.isOnline) {
      return "📶 You're offline. Some features may be limited.";
    }

    if (queueStatus.queueLength > 0) {
      if (queueStatus.syncInProgress) {
        return "🔄 Syncing offline data...";
      }

      if (queueStatus.failedOperations > 0) {
        return `⚠️ ${queueStatus.failedOperations} operation(s) failed to sync`;
      }

      return `📱 ${queueStatus.queueLength} operation(s) pending sync`;
    }

    return null;
  };

  const getStatusColor = () => {
    if (!queueStatus) return COLORS.primary;

    if (!queueStatus.isOnline) return "#FF6B6B";
    if (queueStatus.failedOperations > 0) return "#FFA500";
    if (queueStatus.queueLength > 0) return "#4ECDC4";

    return COLORS.primary;
  };

  const getStatusIcon = () => {
    if (!queueStatus) return "wifi";

    if (!queueStatus.isOnline) return "wifi-off";
    if (queueStatus.syncInProgress) return "refresh-cw";
    if (queueStatus.failedOperations > 0) return "alert-triangle";
    if (queueStatus.queueLength > 0) return "smartphone";

    return "wifi";
  };

  if (!isVisible) {
    return null;
  }

  const statusMessage = getStatusMessage();
  const statusColor = getStatusColor();
  const statusIcon = getStatusIcon();

  return (
    <View style={[styles.container, { borderLeftColor: statusColor }]}>
      <View style={styles.content}>
        <Feather
          name={statusIcon}
          size={16}
          color={statusColor}
          style={styles.icon}
        />
        <Text
          style={[styles.message, { color: statusColor }]}
          numberOfLines={2}
        >
          {statusMessage}
        </Text>
      </View>

      {queueStatus?.queueLength > 0 && !queueStatus?.syncInProgress && (
        <TouchableOpacity
          style={[styles.syncButton, { backgroundColor: statusColor }]}
          onPress={handleManualSync}
        >
          <Feather name="refresh-cw" size={14} color="white" />
          <Text style={styles.syncButtonText}>Sync</Text>
        </TouchableOpacity>
      )}

      {queueStatus?.queueLength > 0 && (
        <View style={styles.queueInfo}>
          <Text style={styles.queueInfoText}>
            {queueStatus.pendingOperations} pending •{" "}
            {queueStatus.retryingOperations} retrying
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF8F0",
    borderLeftWidth: 4,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  syncButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  queueInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  queueInfoText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
});
