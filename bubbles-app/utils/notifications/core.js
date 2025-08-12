import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request user to allow notifications
export const requestNotificationPermissions = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get notification permissions!");
      return false;
    }

    return true;
  } else {
    console.log("Must use physical device for Notifications");
    return false;
  }
};

// Primary form of notification
export const sendPushNotification = async (
  pushToken,
  title,
  body,
  data = {}
) => {
  try {
    if (!pushToken) {
      console.log("No push token available, skipping push notification");
      return;
    }

    const message = {
      to: pushToken,
      sound: "default",
      title,
      body,
      data,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};

// Send local notification as fallback if push notification fails
export const sendLocalNotification = async (title, body, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null,
    });
  } catch (error) {
    console.error("Error sending local notification:", error);
  }
};

// Helper function to get user name by email; used for personalized notifications
export const getUserNameByEmail = async (email) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.toLowerCase().trim()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data().name;
    }
    return null;
  } catch (error) {
    console.error("Error getting user name by email:", error);
    return null;
  }
};

// Initialize notifications for a user (permissions only)
export const initializeNotifications = async () => {
  try {
    const hasPermission = await requestNotificationPermissions();
    return hasPermission;
  } catch (error) {
    console.error("Error initializing notifications:", error);
    return false;
  }
};
