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
} from "firebase/firestore";

// Add a new user to the users collection
export const addUser = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      name: userData.name,
      email: userData.email,
      createdAt: new Date(),
      updatedAt: new Date(),
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

// Update user data in Firestore
export const updateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Error updating user in Firestore:", error);
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
