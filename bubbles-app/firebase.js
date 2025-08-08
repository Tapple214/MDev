import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./config/firebase-config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
// Handle the case where auth might already be initialized
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // If auth is already initialized, just get the existing instance
  if (error.code === "auth/already-initialized") {
    auth = getAuth(app);
  } else {
    // Re-throw other errors
    throw error;
  }
}

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;
