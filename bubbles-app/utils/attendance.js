import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

// Confirm attendance for a guest
export const confirmAttendance = async (bubbleId, guestEmail, qrData) => {
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

// Validate QR code for attendance
export const validateAttendanceQR = (qrData, bubbleId) => {
  try {
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
    };
  } catch (error) {
    return {
      isValid: false,
      message: "Invalid QR code format.",
    };
  }
};
