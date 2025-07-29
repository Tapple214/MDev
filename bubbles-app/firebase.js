// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWr89kHTDaKqTHMkwJUvZ7tWuf6RB4gzE",
  authDomain: "bubbles-3164d.firebaseapp.com",
  projectId: "bubbles-3164d",
  storageBucket: "bubbles-3164d.appspot.com", // <-- fixed here
  messagingSenderId: "211384634852",
  appId: "1:211384634852:web:d1addccfc396ac064d0bf1",
  measurementId: "G-KCYJXR1QH5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you need
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
