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
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { generateAttendanceQR, generateAttendancePin } from "./attendance";
import {
  notifyGuestOfInvite,
  notifyGuestsOfBubbleChanges,
  notifyGuestsOfBubbleDeletion,
} from "./notifications/guests";
import { scheduleBubbleNotifications } from "./notifications/all";
import { notifyHostOfGuestResponse } from "./notifications/hosts";
import { dateToTimestamp } from "./helper";

// =============================================== ACCOUNT MANAGEMENT ===============================================

// Sign up functionality
export const addUser = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      profilePicture: userData.profilePicture || null,
      bio: userData.bio || "",
      preferences: userData.preferences || {},
    });
    return true;
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
    throw error;
  }
};

// Delete user data from Firestore
export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    return true;
  } catch (error) {
    console.error("Error deleting user from Firestore:", error);
    throw error;
  }
};

// Retrieving user data from Firestore
export const getUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user from Firestore:", error);
    throw error;
  }
};

// =============================================== BUBBLE MANAGEMENT ===============================================

// Create a new bubble
export const createBubble = async (bubbleData) => {
  try {
    // Try to create bubble online first
    const result = await createBubbleOnline(bubbleData);

    // Cache the new bubble locally
    const { cacheBubbleDetails } = await import("./local-storage");
    await cacheBubbleDetails(result.id, result);

    return result;
  } catch (error) {
    // If it's a network error, queue for offline processing
    if (isNetworkError(error)) {
      const { queueOperation } = await import("./offline-manager");
      const { cacheBubbleDetails } = await import("./local-storage");

      // Generate a temporary ID for offline storage
      const tempId = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Cache the bubble locally with temp ID
      const offlineBubble = {
        ...bubbleData,
        id: tempId,
        isOffline: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await cacheBubbleDetails(tempId, offlineBubble);

      // Queue for offline processing
      await queueOperation("create_bubble", { data: bubbleData });

      return offlineBubble;
    }

    // Re-throw non-network errors
    throw error;
  }
};

// Online bubble creation
const createBubbleOnline = async (bubbleData) => {
  const bubblesRef = collection(db, "bubbles");
  const newBubbleRef = doc(bubblesRef);

  // Create a proper date object from the selected date and time
  const scheduleDate = dateToTimestamp(
    bubbleData.selectedDate,
    bubbleData.selectedTime
  );

  // Convert guest emails to lowercase
  const guestList = bubbleData.guestList
    ? bubbleData.guestList
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter((email) => email.length > 0)
    : [];

  // Generate QR code data and attendance PIN if needQR is true
  let qrCodeData = null;
  let attendancePin = null;

  if (bubbleData.needQR) {
    const bubbleDataQR = {
      id: newBubbleRef.id,
      name: bubbleData.name,
      hostName: bubbleData.hostName,
      schedule: scheduleDate,
    };

    qrCodeData = generateAttendanceQR(bubbleDataQR);
    attendancePin = generateAttendancePin(newBubbleRef.id);
  }

  const bubbleDoc = {
    name: bubbleData.name,
    description: bubbleData.description,
    location: bubbleData.location,
    schedule: scheduleDate,
    guestList: guestList,
    needQR: bubbleData.needQR,
    qrCodeData: qrCodeData,
    attendancePin: attendancePin,
    icon: bubbleData.icon || "heart",
    backgroundColor: bubbleData.backgroundColor || "#E89349",
    tags: bubbleData.tags || [],
    hostName: bubbleData.hostName,
    hostUid: bubbleData.hostUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(newBubbleRef, bubbleDoc);

  // Send notifications to all guests
  if (guestList.length > 0) {
    for (const guestEmail of guestList) {
      await notifyGuestOfInvite(guestEmail, newBubbleRef.id);
    }
  }

  // Schedule upcoming bubble notifications
  await scheduleBubbleNotifications(newBubbleRef.id);

  return { id: newBubbleRef.id, ...bubbleDoc };
};

// Network error detection helper
const isNetworkError = (error) => {
  if (!error) return false;

  const networkErrorCodes = [
    "unavailable",
    "deadline-exceeded",
    "unauthenticated",
    "permission-denied",
  ];

  const networkErrorMessages = [
    "network",
    "connection",
    "timeout",
    "offline",
    "unreachable",
  ];

  return (
    networkErrorCodes.includes(error.code) ||
    networkErrorMessages.some((msg) =>
      error.message?.toLowerCase().includes(msg)
    )
  );
};

// Update an existing bubble
export const updateBubble = async (bubbleData) => {
  try {
    const bubbleRef = doc(db, "bubbles", bubbleData.bubbleId);

    // Create a proper date object from the selected date and time
    const scheduleDate = dateToTimestamp(
      bubbleData.selectedDate,
      bubbleData.selectedTime
    );

    // Convert guest emails to lowercase
    const guestList = bubbleData.guestList
      ? bubbleData.guestList
          .split(",")
          .map((email) => email.trim().toLowerCase())
          .filter((email) => email.length > 0)
      : [];

    // Generate QR code data and attendance PIN if needQR is true
    let qrCodeData = null;
    let attendancePin = null;

    if (bubbleData.needQR) {
      const bubbleDataQR = {
        id: bubbleData.bubbleId,
        name: bubbleData.name,
        hostName: bubbleData.hostName,
        schedule: scheduleDate,
      };
      qrCodeData = generateAttendanceQR(bubbleDataQR);

      // Generate new attendance PIN if it doesn't exist or if needQR was changed from false to true
      const existingBubble = await getDoc(bubbleRef);
      if (existingBubble.exists()) {
        const existingData = existingBubble.data();
        if (!existingData.attendancePin || !existingData.needQR) {
          attendancePin = generateAttendancePin(bubbleData.bubbleId);
        } else {
          attendancePin = existingData.attendancePin; // Keep existing PIN
        }
      } else {
        attendancePin = generateAttendancePin(bubbleData.bubbleId);
      }
    }

    const bubbleDoc = {
      name: bubbleData.name,
      description: bubbleData.description,
      location: bubbleData.location,
      schedule: scheduleDate,
      guestList: guestList,
      needQR: bubbleData.needQR,
      qrCodeData: qrCodeData,
      attendancePin: attendancePin,
      icon: bubbleData.icon || "heart",
      backgroundColor: bubbleData.backgroundColor || "#E89349",
      tags: bubbleData.tags || [],
      hostName: bubbleData.hostName,
      hostUid: bubbleData.hostUid,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(bubbleRef, bubbleDoc);

    // Notify all guests about the bubble changes
    if (guestList.length > 0) {
      await notifyGuestsOfBubbleChanges(
        bubbleData.bubbleId,
        bubbleData.hostName
      );
    }

    return { id: bubbleData.bubbleId, ...bubbleDoc };
  } catch (error) {
    console.error("Error updating bubble in Firestore:", error);
    throw error;
  }
};

// Get all bubbles that a user is involved with (as host or guest)
export const getUserBubbles = async (userId, userEmail) => {
  try {
    // Try to fetch from Firestore
    const bubbles = await getUserBubblesOnline(userId, userEmail);

    // Cache successful responses
    const { cacheUserBubbles, updateLastSyncTime } = await import(
      "./local-storage"
    );
    await cacheUserBubbles(userId, bubbles);
    await updateLastSyncTime("user_bubbles");

    return bubbles;
  } catch (error) {
    // If it's a network error, try to return cached data
    if (isNetworkError(error)) {
      const { getCachedUserBubbles, getLastSyncTime } = await import(
        "./local-storage"
      );
      const cachedBubbles = await getCachedUserBubbles(userId);

      if (cachedBubbles && cachedBubbles.length > 0) {
        return {
          data: cachedBubbles,
          isOffline: true,
          lastSync: await getLastSyncTime("user_bubbles"),
        };
      }
    }

    // Re-throw the error if no cached data available
    throw error;
  }
};

// Online bubble fetching
const getUserBubblesOnline = async (userId, userEmail) => {
  const bubblesRef = collection(db, "bubbles");
  const querySnapshot = await getDocs(bubblesRef);
  const bubbles = [];

  // Emails are already stored as lowercase, so no need to normalize
  const userEmailToCheck = userEmail;

  querySnapshot.forEach((doc) => {
    const bubbleData = doc.data();

    // Check if user is the host
    if (bubbleData.hostUid === userId) {
      bubbles.push({
        id: doc.id,
        ...bubbleData,
        userRole: "host",
      });
    }
    // Check if user is in the guest list (guestList contains guestList contains email addresses)
    else if (bubbleData.guestList) {
      // Handle both string and array formats for guestList
      let guestEmails = [];

      if (typeof bubbleData.guestList === "string") {
        // If guestList is a string, split it into an array
        guestEmails = bubbleData.guestList
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email.length > 0);
      } else if (Array.isArray(bubbleData.guestList)) {
        guestEmails = bubbleData.guestList
          .map((email) => email.trim())
          .filter((email) => email.length > 0);
      }

      // Check if user is in the guest list
      if (guestEmails.includes(userEmailToCheck)) {
        bubbles.push({
          id: doc.id,
          ...bubbleData,
          userRole: "guest",
        });
      }
    }
  });

  return bubbles;
};

// =============================================== GUEST SEARCH ===============================================

// Finds existence of validated emails in the system
export const findUser = async (searchTerm, checkExistsOnly = false) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("email", "==", searchTerm.toLowerCase().trim())
    );

    const querySnapshot = await getDocs(q);

    if (checkExistsOnly) {
      return querySnapshot.size > 0;
    }

    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return users;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Validate multiple emails and check if they exist in database
export const validateGuestEmails = async (emailList) => {
  try {
    const emails = emailList
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0);
    const results = {
      valid: [],
      invalid: [],
      notFound: [],
    };

    for (const email of emails) {
      // Check email format
      if (!isValidEmail(email)) {
        results.invalid.push(email);
        continue;
      }

      // Check if email exists in database using findUser
      const exists = await findUser(email, true);
      if (exists) {
        results.valid.push(email);
      } else {
        results.notFound.push(email);
      }
    }

    return results;
  } catch (error) {
    console.error("Error validating guest emails:", error);
    throw error;
  }
};

// =============================================== GUEST INTERACTION ===============================================

// Update guest response for a bubble; accepted or declined
export const updateGuestResponse = async (bubbleId, guestEmail, response) => {
  try {
    const bubbleRef = doc(db, "bubbles", bubbleId);

    // Get current bubble data
    const bubbleSnap = await getDoc(bubbleRef);
    if (!bubbleSnap.exists()) {
      throw new Error("Bubble not found");
    }

    const bubbleData = bubbleSnap.data();
    const guestResponses = bubbleData.guestResponses || {};

    // Update guest response with attended field defaulting to false
    guestResponses[guestEmail] = {
      response: response,
      respondedAt: serverTimestamp(),
      attended: false, // Default to false, will be set to true when QR is scanned
    };

    // Update the bubble document
    await updateDoc(bubbleRef, {
      guestResponses: guestResponses,
      updatedAt: serverTimestamp(),
    });

    // Notify the host of the guest response
    await notifyHostOfGuestResponse(bubbleId, guestEmail, response);

    return true;
  } catch (error) {
    console.error("Error updating guest response:", error);
    throw error;
  }
};

// =============================================== BUBBLE BUDDY MANAGEMENT ===============================================

// Get user's bubble buddies for selection
export const getBubbleBuddies = async (currentUserId) => {
  try {
    const userRef = doc(db, "users", currentUserId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return [];
    }

    const userData = userSnap.data();
    const bubbleBuddies = userData.bubbleBuddies || [];

    // Get full user data for each bubble buddy email
    const usersRef = collection(db, "users");
    const users = [];

    for (const email of bubbleBuddies) {
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const buddyData = doc.data();

        // Safety check - ensure buddyData and required properties exist
        if (!buddyData || !buddyData.name || !buddyData.email) {
          return; // Skip this buddy if data is incomplete
        }

        users.push({
          id: doc.id,
          name: buddyData.name,
          email: buddyData.email,
        });
      });
    }

    return users;
  } catch (error) {
    console.error("Error getting bubble buddies for selection:", error);
    throw error;
  }
};

// Add users to bubble buddies
export const addBubbleBuddies = async (userId, emails) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const userData = userSnap.data();
    const currentBubbleBuddies = userData.bubbleBuddies || [];

    // Convert emails to lowercase and add without duplicates
    const normalizedEmails = emails.map((email) => email.toLowerCase().trim());
    const updatedBubbleBuddies = [
      ...new Set([...currentBubbleBuddies, ...normalizedEmails]),
    ];

    // Get the current user's email for notification
    const currentUserEmail = userData.email;

    await updateDoc(userRef, {
      bubbleBuddies: updatedBubbleBuddies,
      updatedAt: serverTimestamp(),
    });

    // Send notifications to newly added bubble buddies
    const { notifyUserAddedAsBubbleBuddy } = await import(
      "./notifications/all"
    );
    for (const email of normalizedEmails) {
      if (!currentBubbleBuddies.includes(email)) {
        // Only notify if this is a new addition
        await notifyUserAddedAsBubbleBuddy(currentUserEmail, email);
      }
    }

    return true;
  } catch (error) {
    console.error("Error adding bubble buddies:", error);
    throw error;
  }
};

// =============================================== BUBBLE DELETION ===============================================

// Delete a bubble and notify all invitees
export const deleteBubble = async (bubbleId, hostName) => {
  try {
    const bubbleRef = doc(db, "bubbles", bubbleId);
    const bubbleSnap = await getDoc(bubbleRef);

    if (!bubbleSnap.exists()) {
      throw new Error("Bubble not found");
    }

    const bubbleData = bubbleSnap.data();
    const bubbleName = bubbleData.name;

    // Delete the bubble document
    await deleteDoc(bubbleRef);

    // Clean up bubbleBook items associated with this bubble
    try {
      const bubbleBookRef = collection(db, "bubbleBook");
      const bubbleBookQuery = query(
        bubbleBookRef,
        where("bubbleId", "==", bubbleId)
      );
      const bubbleBookSnapshot = await getDocs(bubbleBookQuery);

      // Delete all bubbleBook items for this bubble
      const deletePromises = bubbleBookSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
    } catch (cleanupError) {
      console.error("Error cleaning up bubbleBook items:", cleanupError);
      // Don't fail the main deletion if cleanup fails
    }

    // Notify all invitees about the bubble deletion
    await notifyGuestsOfBubbleDeletion(
      bubbleId,
      hostName,
      bubbleName,
      bubbleData.guestList || []
    );

    return true;
  } catch (error) {
    console.error("Error deleting bubble:", error);
    throw error;
  }
};
