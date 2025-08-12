import React, { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser as deleteFireAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import {
  addUser,
  getUser,
  deleteUser as deleteFirestoreUser,
} from "../utils/firestore";
import { initializeNotifications } from "../utils/notifications";

// =============================================== AUTH CONTEXT ===============================================

// Holds auth data for info access across the app
const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      // If user is authenticated, fetch their data from Firestore and initialize notifications
      if (user) {
        try {
          const data = await getUser(user.uid);
          setUserData(data);
          await initializeNotifications(user.uid);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // =============================================== LOGIN/SIGN UP ===============================================

  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Add user data to Firestore with normalized email
      await addUser(user.uid, {
        name,
        email: email.toLowerCase().trim(),
      });

      return user;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  // =============================================== ACCOUNT DELETION===============================================

  const deleteAccount = async (password) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user is currently signed in");
      }

      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete user data from Firestore first
      await deleteFirestoreUser(user.uid);

      // Delete the user account from Firebase Auth
      await deleteFireAuth(user);

      return true;
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  const value = {
    user,
    userData,
    signup,
    login,
    logout,
    deleteAccount,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
