import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  RefreshControl,
} from "react-native";
import NavBar from "../components/navbar";
import BubbleItem from "../components/bubble-item";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserBubbles,
  getUser,
  updateGuestResponse,
} from "../utils/firestore";

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
  const [bubblesData, setBubblesData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (user && user.uid) {
      try {
        setLoading(true);

        // Fetch user data
        const fetchedUserData = await getUser(user.uid);
        console.log("User data from Firestore:", fetchedUserData);
        setUserData(fetchedUserData);

        // Fetch bubbles data
        const fetchedBubblesData = await getUserBubbles(user.uid);
        console.log("Bubbles data from Firestore:", fetchedBubblesData);
        setBubblesData(fetchedBubblesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleAcceptBubble = async (bubbleId) => {
    try {
      // Update bubble status in database
      await updateGuestResponse(bubbleId, user.email, "accepted");
      Alert.alert("Success!", "You've confirmed you're coming to this bubble!");
      // Refresh the data to show updated status
      await fetchData();
    } catch (error) {
      console.error("Error accepting bubble:", error);
      Alert.alert("Error", "Failed to accept bubble. Please try again.");
    }
  };

  const handleDeclineBubble = async (bubbleId) => {
    try {
      // Update bubble status in database
      await updateGuestResponse(bubbleId, user.email, "declined");
      Alert.alert("Declined", "You've declined this bubble invitation.");
      // Refresh the data to show updated status
      await fetchData();
    } catch (error) {
      console.error("Error declining bubble:", error);
      Alert.alert("Error", "Failed to decline bubble. Please try again.");
    }
  };

  console.log("Current bubbles data:", bubblesData);

  return (
    <View style={[styles.generalContainer, { paddingBottom: 80 }]}>
      <ScrollView
        vertical
        stickyHeaderIndices={[2]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#606B38"]}
            tintColor="#606B38"
          />
        }
      >
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
          {loading ? (
            <Text style={styles.noBubblesText}>Loading bubbles...</Text>
          ) : bubblesData && bubblesData.length > 0 ? (
            bubblesData.map((bubbleData) => (
              <BubbleItem
                cardTitle={styles.cardTitle}
                cardText={styles.cardText}
                key={bubbleData.id}
                bubbleName={bubbleData.name}
                bubbleHost={bubbleData.hostName}
                userRole={bubbleData.userRole}
                onAccept={() => handleAcceptBubble(bubbleData.id)}
                onDecline={() => handleDeclineBubble(bubbleData.id)}
                // send as params
                action={() =>
                  navigation.navigate("BubbleView", {
                    bubbleDetails: {
                      bubbleName: bubbleData.name,
                      host: bubbleData.hostName,
                      bubbleId: bubbleData.id,
                      userRole: bubbleData.userRole,
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
