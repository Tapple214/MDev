import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  getUserPushToken,
  getUserNameByEmail,
  sendPushNotification,
  sendLocalNotification,
} from "./core.js";

// ============================================================================
// NOTIFICATIONS FOR HOSTS
// ============================================================================

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
