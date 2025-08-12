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
import { generateEntryQRCode } from "./attendance";
import {
  notifyGuestOfInvite,
  scheduleBubbleNotifications,
  notifyHostOfGuestResponse,
  notifyGuestsOfBubbleChanges,
} from "./notifications";
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

    // Generate QR code data if needQR is true
    let qrCodeData = null;

    if (bubbleData.needQR) {
      const bubbleDataQR = {
        id: newBubbleRef.id,
        name: bubbleData.name,
        hostName: bubbleData.hostName,
        schedule: scheduleDate,
      };

      qrCodeData = generateEntryQRCode(bubbleDataQR);
    }

    const bubbleDoc = {
      name: bubbleData.name,
      description: bubbleData.description,
      location: bubbleData.location,
      schedule: scheduleDate,
      guestList: guestList,
      needQR: bubbleData.needQR,
      qrCodeData: qrCodeData,
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
  } catch (error) {
    console.error("Error creating bubble in Firestore:", error);
    throw error;
  }
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

    // Generate QR code data if needQR is true
    let qrCodeData = null;
    if (bubbleData.needQR) {
      const bubbleDataQR = {
        id: bubbleData.bubbleId,
        name: bubbleData.name,
        hostName: bubbleData.hostName,
        schedule: scheduleDate,
      };
      qrCodeData = generateEntryQRCode(bubbleDataQR);
    }

    const bubbleDoc = {
      name: bubbleData.name,
      description: bubbleData.description,
      location: bubbleData.location,
      schedule: scheduleDate,
      guestList: guestList,
      needQR: bubbleData.needQR,
      qrCodeData: qrCodeData,
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
      // Check if user is in the guest list (guestList contains email addresses)
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
  } catch (error) {
    console.error("Error getting user bubbles from Firestore:", error);
    throw error;
  }
};

// =============================================== GUEST SEARCH ===============================================

// Function to find users by email
export const findUser = async (searchTerm) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("email", "==", searchTerm.toLowerCase().trim())
    );

    const querySnapshot = await getDocs(q);
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

// Check if a single email exists as a user
export const checkEmailExists = async (email) => {
  try {
    const users = await findUser(email);
    return users.length > 0;
  } catch (error) {
    console.error("Error checking if email exists:", error);
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

      // Check if email exists in database
      const exists = await checkEmailExists(email);
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

    await updateDoc(userRef, {
      bubbleBuddies: updatedBubbleBuddies,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error adding bubble buddies:", error);
    throw error;
  }
};
