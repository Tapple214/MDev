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

// Add a new user to the users collection
export const addUser = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      name: userData.name,
      email: userData.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Add any additional user fields here
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

// Get user data from Firestore
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

// Get bubbles where the user is the host
export const getBubbles = async (userId) => {
  try {
    const bubblesRef = collection(db, "bubbles");
    const q = query(bubblesRef, where("hostUid", "==", userId));
    const querySnapshot = await getDocs(q);
    const bubbles = [];

    querySnapshot.forEach((doc) => {
      bubbles.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return bubbles;
  } catch (error) {
    console.error("Error getting bubbles from Firestore:", error);
    throw error;
  }
};

// Get all bubbles that a user is involved with (as host or guest)
export const getUserBubbles = async (userId, userEmail) => {
  try {
    const bubblesRef = collection(db, "bubbles");
    const querySnapshot = await getDocs(bubblesRef);
    const bubbles = [];

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
      else if (
        bubbleData.guestList &&
        bubbleData.guestList.includes(userEmail)
      ) {
        bubbles.push({
          id: doc.id,
          ...bubbleData,
          userRole: "guest",
        });
      }
    });

    return bubbles;
  } catch (error) {
    console.error("Error getting user bubbles from Firestore:", error);
    throw error;
  }
};

// Update user data in Firestore
export const updateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating user in Firestore:", error);
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

// Get all users from the users collection
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    const users = [];

    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return users;
  } catch (error) {
    console.error("Error getting all users from Firestore:", error);
    throw error;
  }
};

// Search users by name
export const searchUsersByName = async (name) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("name", ">=", name),
      where("name", "<=", name + "\uf8ff")
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
    console.error("Error searching users by name:", error);
    throw error;
  }
};

// Update user profile picture
export const updateUserProfilePicture = async (userId, profilePictureUrl) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      profilePicture: profilePictureUrl,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

// Update user bio
export const updateUserBio = async (userId, bio) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      bio: bio,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating user bio:", error);
    throw error;
  }
};

// Update user preferences
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      preferences: preferences,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }
};

// Create a new bubble
export const createBubble = async (bubbleData) => {
  try {
    const bubblesRef = collection(db, "bubbles");
    const newBubbleRef = doc(bubblesRef);

    // Create a proper date object from the selected date and time
    const scheduleDate = new Date(bubbleData.selectedDate);
    scheduleDate.setHours(bubbleData.selectedTime.getHours());
    scheduleDate.setMinutes(bubbleData.selectedTime.getMinutes());
    scheduleDate.setSeconds(0);
    scheduleDate.setMilliseconds(0);

    const bubbleDoc = {
      name: bubbleData.name,
      description: bubbleData.description,
      location: bubbleData.location,
      schedule: scheduleDate,
      guestList: bubbleData.guestList,
      needQR: bubbleData.needQR,
      hostName: bubbleData.hostName,
      hostUid: bubbleData.hostUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(newBubbleRef, bubbleDoc);
    return { id: newBubbleRef.id, ...bubbleDoc };
  } catch (error) {
    console.error("Error creating bubble in Firestore:", error);
    throw error;
  }
};

// Check if a single email exists as a user
export const checkEmailExists = async (email) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.toLowerCase().trim()));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
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
      .map((email) => email.trim())
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

// Update guest response for a bubble
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

    // Update guest response
    guestResponses[guestEmail] = {
      response: response, // 'accepted' or 'declined'
      respondedAt: serverTimestamp(),
    };

    // Update the bubble document
    await updateDoc(bubbleRef, {
      guestResponses: guestResponses,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error updating guest response:", error);
    throw error;
  }
};

// Get bubble by ID
export const getBubbleById = async (bubbleId) => {
  try {
    const bubbleRef = doc(db, "bubbles", bubbleId);
    const bubbleSnap = await getDoc(bubbleRef);

    if (bubbleSnap.exists()) {
      return {
        id: bubbleSnap.id,
        ...bubbleSnap.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting bubble by ID:", error);
    throw error;
  }
};
