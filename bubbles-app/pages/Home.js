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
import { getBubbles, getUser } from "../utils/firestore";

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

export default function Home({ navigation }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [bubblesData, setBubblesData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const fetchedUserData = await getUser(user.uid);
        console.log("User data from Firestore:", fetchedUserData);
        setUserData(fetchedUserData);

        const fetchedBubblesData = await getBubbles(user.uid);
        console.log("Bubbles data from Firestore:", fetchedBubblesData);
        setBubblesData(fetchedBubblesData);
      }
    };
    fetchUserData();
  }, [user]);

  console.log(userData);

  return (
    <View style={[styles.generalContainer, { paddingBottom: 80 }]}>
      <ScrollView vertical stickyHeaderIndices={[2]}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Hi {userData?.name}!</Text>
          <View style={styles.headerButtons}></View>
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
          {bubblesData && bubblesData.length > 0 ? (
            bubblesData.map((bubbleData) => (
              <BubbleItem
                cardTitle={styles.cardTitle}
                cardText={styles.cardText}
                key={bubbleData.id}
                bubbleName={bubbleData.name}
                bubbleHost={bubbleData.hostName}
                // send as params
                action={() =>
                  navigation.navigate("BubbleView", {
                    bubbleDetails: {
                      bubbleName: bubbleData.name,
                      host: bubbleData.hostName,
                    },
                  })
                }
              />
            ))
          ) : (
            <Text style={styles.noBubblesText}>No bubbles found</Text>
          )}
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
  migrateButton: {
    backgroundColor: "#778A31",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  migrateButtonText: {
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
  noBubblesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#452A17",
    marginTop: 20,
  },
});
