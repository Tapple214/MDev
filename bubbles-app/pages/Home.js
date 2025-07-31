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
    title: "Create a Bubble",
    subtitle: "Plan your next meetup",
    goTo: "CreateBubble",
  },
  {
    id: 2,
    title: "Add Bubble Buddies",
    subtitle: "Connect with friends",
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
  const [filteredBubbles, setFilteredBubbles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1); // Default to "All"
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
        const fetchedBubblesData = await getUserBubbles(user.uid, user.email);
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

  // Filter bubbles based on selected category
  const filterBubbles = (bubbles, category) => {
    switch (category) {
      case 1: // All
        return bubbles;
      case 2: // Created By Me
        return bubbles.filter((bubble) => bubble.userRole === "host");
      case 3: // Invited
        return bubbles.filter((bubble) => bubble.userRole === "guest");
      case 4: // Attending
        return bubbles.filter((bubble) => {
          if (bubble.userRole !== "guest") return false;
          // Check if user has accepted the invitation
          const guestResponses = bubble.guestResponses || {};
          const userResponse = guestResponses[user?.email];
          return userResponse && userResponse.response === "accepted";
        });
      case 5: // Completed
        return []; // Leave empty for now as requested
      default:
        return bubbles;
    }
  };

  // Update filtered bubbles when category or bubbles data changes
  useEffect(() => {
    setFilteredBubbles(filterBubbles(bubblesData, selectedCategory));
  }, [bubblesData, selectedCategory, user]);

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

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
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
  console.log("Filtered bubbles:", filteredBubbles);
  console.log("Selected category:", selectedCategory);

  return (
    <View style={[styles.generalContainer, { paddingBottom: 80 }]}>
      <ScrollView
        vertical
        stickyHeaderIndices={[2]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366F1"]}
            tintColor="#6366F1"
          />
        }
      >
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.title}>{userData?.name}!</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsScrollView}
        >
          {quickActions.map((quickAction) => (
            <View key={quickAction.id} style={styles.quickActionsContainer}>
              <TouchableOpacity
                key={quickAction.id}
                onPress={() => navigation.navigate(quickAction.goTo)}
                style={styles.quickActionsCard}
              >
                <Text style={styles.cardTitle}>{quickAction.title}</Text>
                <Text style={styles.cardSubtitle}>{quickAction.subtitle}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryBtn,
                selectedCategory === category.id && styles.selectedCategoryBtn,
              ]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id &&
                    styles.selectedCategoryText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.bubblesContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading bubbles...</Text>
            </View>
          ) : filteredBubbles && filteredBubbles.length > 0 ? (
            filteredBubbles.map((bubbleData) => (
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
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No bubbles yet</Text>
              <Text style={styles.emptySubtitle}>
                Create your first bubble or wait for invitations
              </Text>
            </View>
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
    backgroundColor: "#F8FAFC",
    height: "100%",
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  cardText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    flex: 0,
    flexGrow: 0,
    backgroundColor: "#F8FAFC",
  },
  categoryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignSelf: "flex-start",
  },
  categoryText: {
    color: "#6B7280",
    fontWeight: "500",
    fontSize: 14,
  },
  bubblesContainer: {
    width: screenwidth,
    paddingRight: 20,
    paddingLeft: 20,
  },
  quickActionsScrollView: {
    paddingBottom: 20,
    flex: 0,
    flexGrow: 0,
  },
  quickActionsContainer: {
    width: screenwidth,
    paddingHorizontal: 20,
  },
  quickActionsCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedCategoryBtn: {
    backgroundColor: "#6366F1",
  },
  selectedCategoryText: {
    color: "#FFFFFF",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
