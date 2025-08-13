import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { notifyHostOfGuestAttendance } from "./notifications/hosts.js";

// =============================================== QR CODE GENERATION ===============================================

// A unique ID generator (without uuid dependency)
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate QR code for bubble attendance check-in
export const generateAttendanceQR = (bubbleData) => {
  const { id, name, hostName, schedule } = bubbleData;

  // Check if all required fields exist
  if (!id || !name || !hostName) {
    console.error("Missing required fields for QR generation:", {
      id,
      name,
      hostName,
    });
    return null;
  }

  // Create a unique identifier for this bubble
  const uniqueId = generateUniqueId();

  // Format the schedule date
  const scheduleDate =
    schedule instanceof Date ? schedule.toISOString() : schedule;

  // Create QR data object for attendance
  const qrData = {
    type: "bubble_attendance",
    bubbleId: id,
    bubbleName: name,
    hostName: hostName,
    schedule: scheduleDate,
    uniqueId: uniqueId,
    timestamp: new Date().toISOString(),
  };

  // Return as JSON string for QR code
  return JSON.stringify(qrData);
};

// =============================================== QR CODE VALIDATION ===============================================

// Validate QR code for attendance
export const validateAttendanceQR = (qrDataString, bubbleId) => {
  try {
    // Parse QR data string
    const qrData = JSON.parse(qrDataString);

    // Check if it's a valid bubble QR code
    if (qrData.type !== "bubble_attendance" || !qrData.bubbleId) {
      return {
        isValid: false,
        message: "Invalid QR code format.",
      };
    }

    // Check if QR code is for the correct bubble
    if (qrData.bubbleId !== bubbleId) {
      return {
        isValid: false,
        message: "This QR code is not for this bubble.",
      };
    }

    // Check if QR code is not expired (optional)
    const qrTimestamp = new Date(qrData.timestamp);
    const now = new Date();
    const hoursDiff = (now - qrTimestamp) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return {
        isValid: false,
        message: "This QR code has expired.",
      };
    }

    return {
      isValid: true,
      message: "QR code is valid for attendance confirmation.",
      data: qrData,
    };
  } catch (error) {
    return {
      isValid: false,
      message: "Invalid QR code data.",
    };
  }
};

// =============================================== QR CODE CONFIRMATION ===============================================

// Confirm attendance for a guest (for QR code)
export const confirmAttendanceByQR = async (bubbleId, guestEmail, qrData) => {
  try {
    const bubbleRef = doc(db, "bubbles", bubbleId);

    // Update the guest response to confirmed and mark as attended
    await updateDoc(bubbleRef, {
      [`guestResponses.${guestEmail}`]: {
        response: "confirmed",
        confirmedAt: new Date().toISOString(),
        qrScanned: true,
        qrData: qrData,
        attended: true, // Mark as attended when QR is scanned
      },
    });

    // Notify the host about the guest's attendance
    try {
      await notifyHostOfGuestAttendance(bubbleId, guestEmail, qrData);
    } catch (notificationError) {
      console.error(
        "Error sending attendance notification:",
        notificationError
      );
      // Don't fail the attendance confirmation if notification fails
    }

    return {
      success: true,
      message: "Attendance confirmed successfully!",
    };
  } catch (error) {
    console.error("Error confirming attendance:", error);
    return {
      success: false,
      message: "Failed to confirm attendance. Please try again.",
    };
  }
};

// =============================================== UNIQUE PIN GENERATION ===============================================

// Generate a unique 6-digit attendance PIN for a bubble
export const generateAttendancePin = (bubbleId) => {
  // Generate a 6-digit code based on bubbleId and a random factor
  // This ensures the same bubble always gets the same PIN
  const hash = bubbleId.split("").reduce((a, b) => {
    a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
    return a;
  }, 0);

  // Generate a 6-digit PIN (100000-999999)
  const pin = Math.abs(hash % 900000) + 100000;

  return {
    pin: pin.toString(),
    bubbleId: bubbleId,
    createdAt: new Date().toISOString(),
  };
};

// =============================================== UNIQUE PIN VALIDATION ===============================================

// Validate PIN code for attendance
export const validateAttendancePin = (pinData, bubbleId, storedPin) => {
  try {
    // Check if pinData exists and has required structure
    if (!pinData || typeof pinData !== "object") {
      return {
        isValid: false,
        message: "Invalid PIN data format.",
      };
    }

    // Check if it's a valid attendance PIN
    if (!pinData.code || !pinData.bubbleId) {
      return {
        isValid: false,
        message: "Invalid PIN data structure.",
      };
    }

    // Check if PIN is for the correct bubble
    if (pinData.bubbleId !== bubbleId) {
      return {
        isValid: false,
        message: "This PIN is not for this bubble.",
      };
    }

    // Check if the entered PIN matches the stored PIN
    if (pinData.code !== storedPin) {
      return {
        isValid: false,
        message: "Incorrect PIN code.",
      };
    }

    return {
      isValid: true,
      message: "PIN is valid for attendance confirmation.",
      data: pinData,
    };
  } catch (error) {
    return {
      isValid: false,
      message: "Invalid PIN data.",
    };
  }
};

// =============================================== UNIQUE PIN CONFIRMATION ===============================================

// Confirm attendance for a guest (via unique PIN)
export const confirmAttendanceByPin = async (bubbleId, guestEmail, pinData) => {
  try {
    const bubbleRef = doc(db, "bubbles", bubbleId);

    // Update the guest response to confirmed and mark as attended
    await updateDoc(bubbleRef, {
      [`guestResponses.${guestEmail}`]: {
        response: "confirmed",
        confirmedAt: new Date().toISOString(),
        pinEntered: true,
        pinData: pinData,
        attended: true, // Mark as attended when PIN is entered
      },
    });

    // Notify the host about the guest's attendance
    try {
      await notifyHostOfGuestAttendance(bubbleId, guestEmail, pinData);
    } catch (notificationError) {
      console.error(
        "Error sending attendance notification:",
        notificationError
      );
      // Don't fail the attendance confirmation if notification fails
    }

    return {
      success: true,
      message: "Attendance confirmed successfully!",
    };
  } catch (error) {
    console.error("Error confirming attendance:", error);
    return {
      success: false,
      message: "Failed to confirm attendance. Please try again.",
    };
  }
};
