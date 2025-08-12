// Miscellaneous helper functions
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const dateToTimestamp = (date, time) => {
  const scheduleDate = new Date(date);
  scheduleDate.setHours(time.getHours());
  scheduleDate.setMinutes(time.getMinutes());
  scheduleDate.setSeconds(0);
  scheduleDate.setMilliseconds(0);

  return scheduleDate;
};

// Helper function to get user name by email; used for personalized notifications
export const getUserNameByEmail = async (email) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.toLowerCase().trim()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data().name;
    }
    return null;
  } catch (error) {
    console.error("Error getting user name by email:", error);
    return null;
  }
};
