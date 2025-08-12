// notifications sent to hosts

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  getUserPushToken,
  sendPushNotification,
  sendLocalNotification,
} from "./core.js";
import { getUserNameByEmail } from "../helper.js";

// ============================================ GUEST ACCEPTS/DECLINES INVITE ===============================================

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
      await sendLocalNotification(title, body, data);
    }
  } catch (error) {
    console.error("Error notifying host of guest response:", error);
  }
};

// ============================================ GUEST CLOCKS ATTENDANCE VIA CODE ===============================================

export const notifyHostOfGuestAttendance = async (
  bubbleId,
  guestEmail,
  qrData
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

    const title = "Guest Attendance Confirmed!";
    const body = `${
      guestName || guestEmail
    } has successfully clocked attendance for "${bubbleData.name}"!`;
    const data = {
      type: "guest_attendance_confirmed",
      bubbleId,
      guestEmail,
      guestName: guestName || guestEmail,
      bubbleName: bubbleData.name,
      qrData,
      timestamp: new Date().toISOString(),
    };

    // Send push notification if token is available
    if (hostToken) {
      await sendPushNotification(hostToken, title, body, data);
    } else {
      await sendLocalNotification(title, body, data);
    }
  } catch (error) {
    console.error("Error notifying host of guest attendance:", error);
  }
};
