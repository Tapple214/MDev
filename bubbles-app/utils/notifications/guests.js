// notifications sent to guests

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  getUserPushTokenByEmail,
  sendPushNotification,
  sendLocalNotification,
} from "./core.js";

// ============================================ RECIEVING AN INVITE ===============================================

export const notifyGuestOfInvite = async (guestEmail, bubbleId) => {
  try {
    // Get bubble data
    const bubbleRef = doc(db, "bubbles", bubbleId);
    const bubbleSnap = await getDoc(bubbleRef);

    if (!bubbleSnap.exists()) return;

    const bubbleData = bubbleSnap.data();

    // Get guest's push token
    const guestToken = await getUserPushTokenByEmail(guestEmail);

    const title = "New Bubble Invite! 🎯";
    const body = `You have been invited by ${bubbleData.hostName} to "${bubbleData.name}" - tap to respond!`;
    const data = {
      type: "bubble_invite",
      bubbleId,
      hostName: bubbleData.hostName,
      bubbleName: bubbleData.name,
    };

    // Send push notification if token is available
    if (guestToken) {
      await sendPushNotification(guestToken, title, body, data);
    } else {
      await sendLocalNotification(title, body, data);
    }
  } catch (error) {
    console.error("Error notifying guest of invite:", error);
  }
};

// =============================================== HOST EDITS BUBBLE ===============================================

export const notifyGuestsOfBubbleChanges = async (bubbleId, hostName) => {
  try {
    // Get bubble data
    const bubbleRef = doc(db, "bubbles", bubbleId);
    const bubbleSnap = await getDoc(bubbleRef);

    if (!bubbleSnap.exists()) return;

    const bubbleData = bubbleSnap.data();
    const guestList = bubbleData.guestList || [];

    // Send notifications to all guests
    for (const guestEmail of guestList) {
      // Get guest's push token
      const guestToken = await getUserPushTokenByEmail(guestEmail);

      const title = "Bubble Updated! 🔄";
      const body = `${hostName} made changes to "${bubbleData.name}". Check it out to stay in the loop!`;
      const data = {
        type: "bubble_updated",
        bubbleId,
        hostName,
        bubbleName: bubbleData.name,
      };

      // Send push notification if token is available
      if (guestToken) {
        await sendPushNotification(guestToken, title, body, data);
      } else {
        await sendLocalNotification(title, body, data);
      }
    }
  } catch (error) {
    console.error("Error notifying guests of bubble changes:", error);
  }
};

// =============================================== HOST DELETES BUBBLE ===============================================

// Notification for all invitees when a host deletes a bubble
export const notifyGuestsOfBubbleDeletion = async (
  bubbleId,
  hostName,
  bubbleName,
  guestList = []
) => {
  try {
    // Use the provided guest list instead of trying to fetch from deleted bubble

    // Send notifications to all guests
    for (const guestEmail of guestList) {
      // Get guest's push token
      const guestToken = await getUserPushTokenByEmail(guestEmail);

      const title = "Bubble Cancelled ⚠️";
      const body = `${hostName} cancelled "${bubbleName}". Check your other bubbles for updates!`;
      const data = {
        type: "bubble_deleted",
        bubbleId,
        hostName,
        bubbleName,
      };

      // Send push notification if token is available
      if (guestToken) {
        await sendPushNotification(guestToken, title, body, data);
      } else {
        await sendLocalNotification(title, body, data);
      }
    }
  } catch (error) {
    console.error("Error notifying guests of bubble deletion:", error);
  }
};
