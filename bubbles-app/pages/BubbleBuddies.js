import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/navbar";
import { useAuth } from "../contexts/AuthContext";
import { getUser } from "../utils/firestore";
import { Feather } from "@expo/vector-icons";

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
      <View style={styles.header}>
        <Text style={styles.title}>Bubble Buddies</Text>
        <Text style={styles.subtitle}>
          Your go-to invitees ready for your next bubble!
        </Text>
      </View>

      <View style={styles.bubbleBuddiesContainer}>
        {userData?.bubbleBuddies && userData.bubbleBuddies.length > 0 ? (
          userData.bubbleBuddies.map((buddy, index) => (
            <View key={index} style={styles.bubbleBuddyCard}>
              <View style={styles.buddyIcon}>
                <Feather name="user" size={20} color="#6366F1" />
              </View>
              <Text style={styles.buddyName}>{buddy}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Feather name="users" size={48} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No bubble buddies yet</Text>
            <Text style={styles.emptySubtitle}>
              Add friends to your bubble buddies list to quickly invite them to
              future bubbles
            </Text>
          </View>
        )}
      </View>

      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: "#F8FAFC",
    height: "100%",
    paddingVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  bubbleBuddiesContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  bubbleBuddyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buddyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  buddyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
