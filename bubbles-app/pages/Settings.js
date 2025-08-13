import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { doc, updateDoc } from "firebase/firestore";

// Custom hooks and utility functions
import { useAuth } from "../contexts/AuthContext";
import { COLORS, TEXT_STYLES } from "../utils/custom-styles";
import {
  requestNotificationPermissions,
  getUserPushToken,
  registerForPushNotifications,
  sendLocalNotification,
} from "../utils/notifications/core.js";
import { db } from "../firebase";

export default function Settings() {
  const { user } = useAuth();

  // States
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [pushToken, setPushToken] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    guestResponses: true,
    bubbleInvites: true,
    upcomingReminders: true,
    localNotifications: true,
  });

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    try {
      // Check permission status
      const { status } = await requestNotificationPermissions();
      setPermissionStatus(status);

      // Get push token if available
      if (user) {
        const token = await getUserPushToken(user.uid);
        setPushToken(token);

        // If no token exists, try to register for notifications
        if (!token) {
          const newToken = await registerForPushNotifications(user.uid);
          if (newToken) {
            setPushToken(newToken);
          }
        }
      }
    } catch (error) {
      console.error("Error checking notification status:", error);
    }
  };

  const handlePermissionRequest = async () => {
    try {
      const granted = await requestNotificationPermissions();
      if (granted) {
        Alert.alert("Success", "Notification permissions granted!");
        setPermissionStatus("granted");

        // Try to register for push notifications
        if (user) {
          const token = await registerForPushNotifications(user.uid);
          if (token) {
            setPushToken(token);
            Alert.alert(
              "Success",
              "Push notifications registered successfully!"
            );
          }
        }

        await checkNotificationStatus();
      } else {
        Alert.alert(
          "Permission Denied",
          "Please enable notifications in your device settings."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to request notification permissions");
    }
  };

  const handleSettingToggle = async (setting) => {
    const newSettings = {
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    };
    setNotificationSettings(newSettings);

    // Save to Firestore
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          notificationSettings: newSettings,
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error("Error saving notification settings:", error);
      }
    }
  };

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case "granted":
        return "Granted";
      case "denied":
        return "Denied";
      case "undetermined":
        return "Not Requested";
      default:
        return "Unknown";
    }
  };

  const getTokenStatusText = () => {
    return pushToken ? "Available" : "Not Available";
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Notification Settings</Text>

        {/* Permission Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permission Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Permission:</Text>
            <Text style={styles.statusValue}>{getPermissionStatusText()}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Push Token:</Text>
            <Text style={styles.statusValue}>{getTokenStatusText()}</Text>
          </View>

          {permissionStatus !== "granted" && (
            <TouchableOpacity
              style={[styles.button, styles.permissionButton]}
              onPress={handlePermissionRequest}
            >
              <Feather name="bell" size={20} color="#FFFFFF" />
              <Text style={[styles.buttonText, styles.permissionButtonText]}>
                Request Permissions
              </Text>
            </TouchableOpacity>
          )}

          {permissionStatus === "granted" && !pushToken && (
            <TouchableOpacity
              style={[styles.button, styles.permissionButton]}
              onPress={handlePermissionRequest}
            >
              <Feather name="refresh-cw" size={20} color="#FFFFFF" />
              <Text style={[styles.buttonText, styles.permissionButtonText]}>
                Refresh Push Token
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Guest Responses</Text>
              <Text style={styles.settingDescription}>
                Notify when guests accept or decline your bubbles
              </Text>
            </View>
            <Switch
              value={notificationSettings.guestResponses}
              onValueChange={() => handleSettingToggle("guestResponses")}
              trackColor={{ false: "#767577", true: COLORS.primary }}
              thumbColor={
                notificationSettings.guestResponses ? "#fff" : "#f4f3f4"
              }
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Bubble Invites</Text>
              <Text style={styles.settingDescription}>
                Notify when you receive new bubble invites
              </Text>
            </View>
            <Switch
              value={notificationSettings.bubbleInvites}
              onValueChange={() => handleSettingToggle("bubbleInvites")}
              trackColor={{ false: "#767577", true: COLORS.primary }}
              thumbColor={
                notificationSettings.bubbleInvites ? "#fff" : "#f4f3f4"
              }
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Upcoming Reminders</Text>
              <Text style={styles.settingDescription}>
                Remind about bubbles 1 day and 6 hours before
              </Text>
            </View>
            <Switch
              value={notificationSettings.upcomingReminders}
              onValueChange={() => handleSettingToggle("upcomingReminders")}
              trackColor={{ false: "#767577", true: COLORS.primary }}
              thumbColor={
                notificationSettings.upcomingReminders ? "#fff" : "#f4f3f4"
              }
            />
          </View>
        </View>

        {/* Local Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Notification Settings</Text>
          <Text style={styles.sectionDescription}>
            Local notifications will work even when push notifications are
            unavailable
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>
                Enable Local Notifications
              </Text>
              <Text style={styles.settingDescription}>
                Use local notifications as a backup when push notifications fail
              </Text>
            </View>
            <Switch
              value={notificationSettings.localNotifications}
              onValueChange={() => handleSettingToggle("localNotifications")}
              trackColor={{ false: "#767577", true: COLORS.primary }}
              thumbColor={
                notificationSettings.localNotifications ? "#fff" : "#f4f3f4"
              }
            />
          </View>

          {notificationSettings.localNotifications && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: COLORS.surface }]}
              onPress={() =>
                sendLocalNotification(
                  "Local Notification Test",
                  "This is a test of your local notification system",
                  { type: "local_test" }
                )
              }
            >
              <Feather name="bell" size={20} color={COLORS.primary} />
              <Text style={[styles.buttonText, { color: COLORS.primary }]}>
                Test Local Notification
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    ...TEXT_STYLES.heading.large,
    marginBottom: 20,
  },
  section: {
    backgroundColor: "rgba(254, 250, 223, 0.5)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    ...TEXT_STYLES.card.title,
    marginBottom: 15,
  },
  sectionDescription: {
    ...TEXT_STYLES.body.small,
    color: "#666",
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusLabel: {
    ...TEXT_STYLES.body.medium,
    fontWeight: "500",
  },
  statusValue: {
    ...TEXT_STYLES.body.medium,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    ...TEXT_STYLES.button.primary,
    marginLeft: 10,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    ...TEXT_STYLES.body.medium,
    fontWeight: "600",
    marginBottom: 5,
  },
  settingDescription: {
    ...TEXT_STYLES.body.small,
    color: "#666",
  },
  infoText: {
    ...TEXT_STYLES.body.small,
    marginBottom: 8,
    color: "#666",
  },
});
