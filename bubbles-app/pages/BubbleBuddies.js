import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/navbar";
import { useAuth } from "../contexts/AuthContext";
import { getUser } from "../utils/firestore";

export default function BubbleBuddies() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  // const [bubbleBuddies, setBubbleBuddies] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const fetchedUserData = await getUser(user.uid);
        console.log("User data from Firestore:", fetchedUserData);
        setUserData(fetchedUserData);
      }
    };
    fetchUserData();
  }, [user]);

  console.log("bubble buddies", userData?.bubbleBuddies[0]);

  return (
    <View style={styles.generalContainer}>
      <Text style={styles.subTitle}>
        A list of your go-to invitees ready for your next bubble!{" "}
      </Text>

      <View style={styles.bubbleBuddiesContainer}>
        {userData?.bubbleBuddies && userData.bubbleBuddies.length > 0 ? (
          userData.bubbleBuddies.map((buddy, index) => (
            <View key={index} style={styles.bubbleBuddyNameContainer}>
              <Text>{buddy}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noBuddiesText}>No bubble buddies found</Text>
        )}
      </View>

      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: "#EEDCAD",
    height: "100%",
    paddingVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  subTitle: { paddingHorizontal: 15 },
  input: {
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FEFADF",
  },
  bubbleBuddiesContainer: { paddingVertical: 15, paddingHorizontal: 15 },
  bubbleBuddyNameContainer: {
    backgroundColor: "#FEFADF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  noBuddiesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#452A17",
    marginTop: 20,
  },
});
