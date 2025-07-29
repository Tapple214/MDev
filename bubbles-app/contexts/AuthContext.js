import React, { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { addUser, getUser } from "../utils/firestore";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addUserToFirestore = async (userId, userData) => {
    try {
      await addUser(userId, userData);
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
      throw error;
    }
  };

  const getUserFromFirestore = async (userId) => {
    try {
      return await getUser(userId);
    } catch (error) {
      console.error("Error getting user from Firestore:", error);
      throw error;
    }
  };

  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Add user data to Firestore
      await addUserToFirestore(user.uid, { name, email });

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

  const signInWithGoogle = async (idToken) => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    signup,
    login,
    logout,
    signInWithGoogle,
    addUserToFirestore,
    getUserFromFirestore,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
