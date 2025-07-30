import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import NavBar from "../components/navbar";
import BubbleItem from "../components/bubble-item";
import { useAuth } from "../contexts/AuthContext";
import { getUser } from "../utils/firestore";

// Quick actions that are displayed on the home screen
const quickActions = [
  {
    id: 1,
    title: "Create a Bubble!",
    goTo: "CreateBubble",
  },
  {
    id: 2,
    title: "Add a Bubble Buddy!",
    goTo: "BubbleBuddies",
  },
];

const categories = [
  { id: 1, name: "All" },
  { id: 2, name: "Created By Me" },
  { id: 3, name: "Invited" },
  { id: 4, name: "Attending" },
  { id: 5, name: "Completed" },
];

const sampleBubbles = [
  { id: 1, bubbleName: "My Birthday", host: "Apple" },
  { id: 2, bubbleName: "Graddd", host: "Krish" },
  { id: 3, bubbleName: "Study Date", host: "Khai" },
  { id: 4, bubbleName: "Bake Day", host: "Mal" },
  { id: 5, bubbleName: "Valentines", host: "Mac" },
];

export default function Home({ navigation }) {
  const { user, logout } = useAuth();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        console.log("Current user UID:", user.uid);
        console.log("Expected Firestore document ID: aV7ugcuUgyjbFc5xnWG1");
        console.log("UIDs match?", user.uid === "aV7ugcuUgyjbFc5xnWG1");

        try {
          const userData = await getUser(user.uid);
          console.log("User data from Firestore:", userData);
          if (userData && userData.name) {
            console.log("Setting userName to:", userData.name);
            setUserName(userData.name);
            // Set the header title with the user's name
            navigation.setOptions({
              title: `Welcome, ${userData.name}!`,
            });
          } else {
            console.log("No userData or no name found:", userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("No user found");
      }
    };

    fetchUserName();
  }, [user, navigation]);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  // Debug function to print all users from Firestore
  const printAllUsers = async () => {
    try {
      const { getAllUsers } = await import("../utils/firestore");
      const users = await getAllUsers();
      console.log("=== ALL USERS IN FIRESTORE ===");
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`, user);
      });
      console.log("=== END USERS ===");
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  // Debug function to print current user's data
  const printCurrentUserData = async () => {
    if (user) {
      console.log("=== CURRENT USER DATA ===");
      console.log("Firebase Auth User:", user);
      console.log("User UID:", user.uid);
      console.log("User Email:", user.email);

      try {
        const userData = await getUser(user.uid);
        console.log("Firestore User Data:", userData);

        // Also try to fetch the specific document you mentioned
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("../firebase");
        const specificDoc = await getDoc(
          doc(db, "users", "aV7ugcuUgyjbFc5xnWG1")
        );
        console.log("Specific document data:", specificDoc.data());
      } catch (error) {
        console.error("Error fetching current user data:", error);
      }
      console.log("=== END CURRENT USER DATA ===");
    }
  };

  return (
    <View style={[styles.generalContainer, { paddingBottom: 80 }]}>
      <ScrollView vertical stickyHeaderIndices={[2]}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Hi {userName || user.email}!</Text>
          <Text style={styles.subtitle}>{user.email}</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={() => {
                printAllUsers();
                printCurrentUserData();
              }}
            >
              <Text style={styles.debugButtonText}>Debug</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          style={styles.quickActionsScrollView}
        >
          {quickActions.map((quickAction) => (
            <View key={quickAction.id} style={styles.quickActionsContainer}>
              <View style={styles.quickActionsCard}>
                <TouchableOpacity
                  key={quickAction.id}
                  onPress={() => navigation.navigate(quickAction.goTo)}
                >
                  <View style={styles.quickActionsCard}>
                    <Text style={styles.cardTitle}>{quickAction.title}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryBtn}>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.bubblesContainer}>
          {sampleBubbles.map((sampleBubble) => (
            <BubbleItem
              cardTitle={styles.cardTitle}
              cardText={styles.cardText}
              key={sampleBubble.id}
              bubbleName={sampleBubble.bubbleName}
              host={sampleBubble.host}
              // send as params
              action={() =>
                navigation.navigate("BubbleView", {
                  bubbleDetails: {
                    bubbleName: sampleBubble.bubbleName,
                    host: sampleBubble.host,
                  },
                })
              }
            />
          ))}
        </View>
      </ScrollView>
      <NavBar />
    </View>
  );
}

const screenwidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: "#EEDCAD",
    height: "100%",
    paddingVertical: 15,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#452A17",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: "#EEDCAD",
    fontSize: 14,
    fontWeight: "600",
  },
  debugButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  debugButtonText: {
    color: "#EEDCAD",
    fontSize: 12,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    paddingBottom: 2,
  },
  cardText: {
    fontSize: 12,
    paddingBottom: 10,
  },
  categoriesContainer: {
    paddingTop: 5,
    paddingBottom: 15,
    flex: 0,
    flexGrow: 0,
    backgroundColor: "#EEDCAD",
  },
  categoryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 15,

    borderRadius: 50,
    backgroundColor: "#452A17",
    alignSelf: "flex-start", // ensures that width is as long as content/text in it
  },
  categoryText: {
    color: "#EEDCAD",
  },
  bubblesContainer: {
    width: screenwidth,
    paddingRight: 15,
    paddingLeft: 35,
  },
  quickActionsScrollView: {
    paddingBottom: 15,
    flex: 0, // prevents unnecessary growth
    flexGrow: 0, // ensures its only as high as contents in it
  },
  quickActionsContainer: {
    width: screenwidth,
    paddingHorizontal: 15,
  },
  quickActionsCard: {
    backgroundColor: "#FEFADF",
    padding: 20,
    justifyContent: "center",
    borderRadius: 10,
  },
});
