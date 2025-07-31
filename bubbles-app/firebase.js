import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWr89kHTDaKqTHMkwJUvZ7tWuf6RB4gzE",
  authDomain: "bubbles-3164d.firebaseapp.com",
  projectId: "bubbles-3164d",
  storageBucket: "bubbles-3164d.firebasestorage.app",
  messagingSenderId: "211384634852",
  appId: "1:211384634852:web:d1addccfc396ac064d0bf1",
  measurementId: "G-KCYJXR1QH5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
