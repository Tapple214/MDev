// Generate a unique ID without uuid dependency
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate a unique QR code data for a bubble
export const generateBubbleQRData = (
  bubbleId,
  bubbleName,
  hostName,
  schedule
) => {
  // Create a unique identifier for this bubble
  const uniqueId = generateUniqueId();

  // Format the schedule date
  const scheduleDate =
    schedule instanceof Date ? schedule.toISOString() : schedule;

  // Create QR data object
  const qrData = {
    type: "bubble_entry",
    bubbleId: bubbleId,
    bubbleName: bubbleName,
    hostName: hostName,
    schedule: scheduleDate,
    uniqueId: uniqueId,
    timestamp: new Date().toISOString(),
  };

  // Return as JSON string for QR code
  return JSON.stringify(qrData);
};

// Generate a simple QR code data (alternative format)
export const generateSimpleQRData = (bubbleId, bubbleName) => {
  return `BUBBLE:${bubbleId}:${bubbleName}`;
};

// Validate QR code data
export const validateQRData = (qrDataString) => {
  try {
    const qrData = JSON.parse(qrDataString);

    // Check if it's a valid bubble QR code
    if (qrData.type === "bubble_entry" && qrData.bubbleId) {
      return {
        isValid: true,
        data: qrData,
        message: "Valid bubble QR code",
      };
    }

    return {
      isValid: false,
      data: null,
      message: "Invalid QR code format",
    };
  } catch (error) {
    return {
      isValid: false,
      data: null,
      message: "Invalid QR code data",
    };
  }
};

// Generate QR code for bubble entry verification
export const generateEntryQRCode = (bubbleData) => {
  const { id, name, hostName, schedule } = bubbleData;

  console.log("generateEntryQRCode called with:", bubbleData);

  // Check if all required fields exist
  if (!id || !name || !hostName) {
    console.error("Missing required fields for QR generation:", {
      id,
      name,
      hostName,
    });
    return null;
  }

  const qrData = generateBubbleQRData(id, name, hostName, schedule);
  console.log("Generated QR data:", qrData);

  return qrData;
};

// Generate QR code for bubble sharing
export const generateShareQRCode = (bubbleData) => {
  const { id, name, hostName, schedule } = bubbleData;

  return generateSimpleQRData(id, name);
};
