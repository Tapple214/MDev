import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// =============================================== CONFIGURATION ===============================================

// Notification Behavior Configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// =============================================== PERMISSIONS ===============================================

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
      return false;
    }

    return true;
  } else {
    return false;
  }
};

// ============================================== PUSH TOKEN GENERATION ==============================================

// Save push token to user's profile
export const savePushToken = async (uid, token) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      pushToken: token,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Error saving push token:", error);
    return false;
  }
};

// generate push token from Expo and attach it to a user
export const registerForPushNotifications = async (uid) => {
  try {
    // Request permissions first
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // Get the token
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: "@tapple/bubbles-app",
    });

    if (token) {
      // Save the token to the user's profile
      await savePushToken(uid, token.data);
      return token.data;
    }

    return null;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
    return null;
  }
};

// =========================================== FETCHING GENERATED PUSH TOKENS ===============================================

// Get logged in user's push token by UID
export const getUserPushToken = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.pushToken || null;
    }
    return null;
  } catch (error) {
    console.error("Error getting user push token:", error);
    return null;
  }
};

// Get other user's push token by email (not logged in user e.g. buddies)
export const getUserPushTokenByEmail = async (email) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.toLowerCase().trim()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data().pushToken || null;
    }
    return null;
  } catch (error) {
    console.error("Error getting user push token by email:", error);
    return null;
  }
};

// =============================================== SENDING NOTIFICATIONS ===============================================

// Primary form of notification
export const sendPushNotification = async (
  pushToken,
  title,
  body,
  data = {}
) => {
  try {
    if (!pushToken) {
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

// Fallback if push notification fails
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

// =============================================== NOTIFICATION INITIALIZATION ===============================================

// Initialize notifications when app starts (permissions + push token registration)
export const initializeAppNotifications = async (user) => {
  try {
    // Request notification permissions
    const hasPermission = await requestNotificationPermissions();

    if (hasPermission && user) {
      // Try to register for push notifications
      const token = await registerForPushNotifications(user.uid);

      if (token) {
        return token;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error initializing app notifications:", error);
    return null;
  }
};
