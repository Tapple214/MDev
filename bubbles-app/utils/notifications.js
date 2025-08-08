import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
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
      console.log("Failed to get push token for push notification!");
      return false;
    }

    return true;
  } else {
    console.log("Must use physical device for Push Notifications");
    return false;
  }
};

// Get push token
export const getPushToken = async () => {
  try {
    // For now, we'll use a fallback approach since we don't have a proper Expo project ID
    // In production, you would need to create an Expo project and use its project ID
    console.log("Push token generation requires a proper Expo project ID");
    console.log("For development, using local notifications only");
    return null;
  } catch (error) {
    console.error("Error getting push token:", error);
    return null;
  }
};

// Save push token to user's Firestore document
export const savePushToken = async (userId, token) => {
  try {
    const userRef = doc(db, "users", userId);
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

// Get user's push token from Firestore
export const getUserPushToken = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().pushToken;
    }
    return null;
  } catch (error) {
    console.error("Error getting user push token:", error);
    return null;
  }
};

// Get user's push token by email
export const getUserPushTokenByEmail = async (email) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.toLowerCase().trim()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data().pushToken;
    }
    return null;
  } catch (error) {
    console.error("Error getting user push token by email:", error);
    return null;
  }
};

// Send local notification
export const sendLocalNotification = async (title, body, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error("Error sending local notification:", error);
  }
};

// Send push notification to a specific user
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

// Notification for host when guest accepts/declines invite
export const notifyHostOfGuestResponse = async (
  bubbleId,
  guestEmail,
  response
) => {
  try {
    // Get bubble data
    const bubbleRef = doc(db, "bubbles", bubbleId);
    const bubbleSnap = await getDoc(bubbleRef);

    if (!bubbleSnap.exists()) return;

    const bubbleData = bubbleSnap.data();
    const hostUid = bubbleData.hostUid;

    // Get host's push token
    const hostToken = await getUserPushToken(hostUid);

    // Get guest's name
    const guestName = await getUserNameByEmail(guestEmail);

    const title = "Bubble Response";
    const body = `${guestName || guestEmail} ${response} your invite to "${
      bubbleData.name
    }"`;
    const data = {
      type: "guest_response",
      bubbleId,
      guestEmail,
      response,
    };

    // Send push notification if token is available
    if (hostToken) {
      await sendPushNotification(hostToken, title, body, data);
    } else {
      // Fallback to local notification for development
      console.log("Sending local notification for guest response");
      await sendLocalNotification(title, body, data);
    }
  } catch (error) {
    console.error("Error notifying host of guest response:", error);
  }
};

// Notification for guest when they receive an invite
export const notifyGuestOfInvite = async (guestEmail, bubbleId) => {
  try {
    // Get bubble data
    const bubbleRef = doc(db, "bubbles", bubbleId);
    const bubbleSnap = await getDoc(bubbleRef);

    if (!bubbleSnap.exists()) return;

    const bubbleData = bubbleSnap.data();

    // Get guest's push token
    const guestToken = await getUserPushTokenByEmail(guestEmail);

    const title = "New Bubble Invite!";
    const body = `You have been invited by ${bubbleData.hostName} to "${bubbleData.name}"`;
    const data = {
      type: "bubble_invite",
      bubbleId,
      hostName: bubbleData.hostName,
    };

    // Send push notification if token is available
    if (guestToken) {
      await sendPushNotification(guestToken, title, body, data);
    } else {
      // Fallback to local notification for development
      console.log("Sending local notification for bubble invite");
      await sendLocalNotification(title, body, data);
    }
  } catch (error) {
    console.error("Error notifying guest of invite:", error);
  }
};

// Notification for all participants about upcoming bubble (1 day before)
export const notifyUpcomingBubble = async (bubbleId, hoursBefore = 24) => {
  try {
    const bubbleRef = doc(db, "bubbles", bubbleId);
    const bubbleSnap = await getDoc(bubbleRef);

    if (!bubbleSnap.exists()) return;

    const bubbleData = bubbleSnap.data();
    const schedule = bubbleData.schedule.toDate();
    const now = new Date();

    // Calculate when to send the notification
    const notificationTime = new Date(
      schedule.getTime() - hoursBefore * 60 * 60 * 1000
    );

    // Only send if the notification time is in the future
    if (notificationTime > now) {
      const timeUntilNotification = notificationTime.getTime() - now.getTime();

      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Upcoming Bubble Reminder!",
          body: `"${bubbleData.name}" is starting ${
            hoursBefore === 24 ? "tomorrow" : "in 6 hours"
          }! Don't forget to attend!`,
          data: {
            type: "upcoming_bubble",
            bubbleId,
            hoursBefore,
          },
        },
        trigger: {
          seconds: Math.floor(timeUntilNotification / 1000),
        },
      });
    }
  } catch (error) {
    console.error("Error scheduling upcoming bubble notification:", error);
  }
};

// Schedule notifications for a bubble (1 day and 6 hours before)
export const scheduleBubbleNotifications = async (bubbleId) => {
  try {
    // Schedule 1 day before notification
    await notifyUpcomingBubble(bubbleId, 24);

    // Schedule 6 hours before notification
    await notifyUpcomingBubble(bubbleId, 6);
  } catch (error) {
    console.error("Error scheduling bubble notifications:", error);
  }
};

// Helper function to get user name by email
const getUserNameByEmail = async (email) => {
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

// Initialize notifications for a user
export const initializeNotifications = async (userId) => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      const token = await getPushToken();
      if (token) {
        await savePushToken(userId, token);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error initializing notifications:", error);
    return false;
  }
};

// Set up notification listeners
export const setupNotificationListeners = () => {
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("Notification received:", notification);
    }
  );

  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log("Notification response received:", data);

      // Note: Navigation will be handled by the app's navigation system
      // when the user taps on the notification
    });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};
