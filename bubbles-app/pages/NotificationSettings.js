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
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { COLORS } from "../utils/colors";
import { TEXT_STYLES, combineTextStyles } from "../utils/textStyles";
import {
  requestNotificationPermissions,
  sendLocalNotification,
  getUserPushToken,
} from "../utils/notifications";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function NotificationSettings() {
  const navigation = useNavigation();
  const { user, userData } = useAuth();

  const [permissionStatus, setPermissionStatus] = useState(null);
  const [pushToken, setPushToken] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    guestResponses: true,
    bubbleInvites: true,
    upcomingReminders: true,
    testNotifications: false,
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

  const handleTestNotification = async () => {
    try {
      await sendLocalNotification(
        "Test Notification",
        "This is a test notification from the Bubbles app! Tap to verify notifications are working.",
        { type: "test" }
      );
      Alert.alert("Success", "Test notification sent!");
    } catch (error) {
      Alert.alert("Error", "Failed to send test notification");
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
        return "Granted ✅";
      case "denied":
        return "Denied ❌";
      case "undetermined":
        return "Not Requested ⚠️";
      default:
        return "Unknown ❓";
    }
  };

  const getTokenStatusText = () => {
    return pushToken ? "Available ✅" : "Not Available ❌";
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
              style={styles.button}
              onPress={handlePermissionRequest}
            >
              <Feather name="bell" size={20} color={COLORS.primary} />
              <Text style={styles.buttonText}>Request Permissions</Text>
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

        {/* Test Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Notifications</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF6B6B" }]}
            onPress={handleTestNotification}
          >
            <Feather name="bell" size={20} color="#FFFFFF" />
            <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
              Send Test Notification
            </Text>
          </TouchableOpacity>
        </View>

        {/* Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          <Text style={styles.infoText}>
            • Push notifications require a physical device
          </Text>
          <Text style={styles.infoText}>
            • Local notifications work on simulator
          </Text>
          <Text style={styles.infoText}>
            • You can change notification settings in your device settings
          </Text>
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
