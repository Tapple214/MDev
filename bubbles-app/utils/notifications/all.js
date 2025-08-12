import * as Notifications from "expo-notifications";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  getUserPushTokenByEmail,
  getUserNameByEmail,
  sendPushNotification,
  sendLocalNotification,
} from "./core.js";

// =============================================== ADDED TO BUBBLE BUDDY ===============================================

export const notifyUserAddedAsBubbleBuddy = async (
  addedByEmail,
  addedUserEmail
) => {
  try {
    // Get the user who was added's push token
    const addedUserToken = await getUserPushTokenByEmail(addedUserEmail);

    // Get the name of the user who added them (logged in user)
    const addedByName = await getUserNameByEmail(addedByEmail);

    const title = "New Bubble Buddy!";
    const body = `${
      addedByName || addedByEmail
    } added you as a bubble buddy! Add them back!`;
    const data = {
      type: "bubble_buddy_added",
      addedByEmail,
      addedByName: addedByName || addedByEmail,
    };

    // Send push notification if token is available
    if (addedUserToken) {
      await sendPushNotification(addedUserToken, title, body, data);
    } else {
      // Fallback to local notification for development
      await sendLocalNotification(title, body, data);
    }
  } catch (error) {
    console.error("Error notifying user of bubble buddy addition:", error);
  }
};

// =============================================== BUBBLE REMINDERS ===============================================

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
