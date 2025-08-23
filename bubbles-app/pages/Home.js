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
  ImageBackground,
} from "react-native";

// Components
import BubbleItem from "../components/bubble-item";
import ConnectivityStatus from "../components/connectivity-status";

// Custom hooks and utility functions
import { useAuth } from "../contexts/AuthContext";
import {
  getUserBubbles,
  getUser,
  updateGuestResponse,
} from "../utils/firestore";
import { COLORS } from "../utils/custom-styles";
import useBubbleResponse from "../utils/bubble-response";

// Quick actions that are displayed on the home screen
const quickActions = [
  {
    id: 1,
    title: "Create a Bubble!",
    goTo: "CreateBubble",
    image: require("../assets/create-bubble.png"),
  },
  {
    id: 2,
    title: "Add a Bubble Buddy!",
    goTo: "BubbleBuddies",
    image: require("../assets/add-buddy.png"),
  },
];

// To show the different bubbles related to the user
const categories = [
  { id: 1, name: "All" },
  { id: 2, name: "Created By Me" },
  { id: 3, name: "Invited" },
  { id: 4, name: "Attending" },
  { id: 5, name: "Completed" },
];

export default function Home({ navigation }) {
  // States
  const [userData, setUserData] = useState(null);
  const [bubblesData, setBubblesData] = useState([]);
  const [filteredBubbles, setFilteredBubbles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1); // Default to "All"
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentQuickActionIndex, setCurrentQuickActionIndex] = useState(0);

  // Fetch data from firestore
  const fetchData = async () => {
    if (user && user.uid) {
      try {
        setLoading(true);

        // Fetch user data using firebase's auth user uid (i.e. user.uid)
        const fetchedUserData = await getUser(user.uid);
        setUserData(fetchedUserData);

        // Fetch bubbles data
        const fetchedBubblesData = await getUserBubbles(user.uid, user.email);

        // Handle offline data structure
        if (fetchedBubblesData && fetchedBubblesData.isOffline) {
          setBubblesData(fetchedBubblesData.data);
        } else {
          setBubblesData(fetchedBubblesData);
        }
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
          if (!user?.email) return false;
          // Check if user has accepted the invitation
          const guestResponses = bubble.guestResponses || {};
          const userResponse = guestResponses[user.email];
          return userResponse && userResponse.response === "accepted";
        });
      case 5: // Completed; shows all bubbles that have ended
        return bubbles.filter(
          (bubble) => bubble.schedule?.toDate() < new Date()
        );
      default:
        return bubbles;
    }
  };

  // Update filtered bubbles when category or bubbles data changes
  useEffect(() => {
    setFilteredBubbles(filterBubbles(bubblesData, selectedCategory));
  }, [bubblesData, selectedCategory, user]);

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

  // Custom Hook
  const { user } = useAuth();
  const { handleAcceptBubble, handleDeclineBubble, handleRetractBubble } =
    useBubbleResponse({ user, fetchData, updateGuestResponse });

  return (
    <View style={styles.generalContainer}>
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
        {/* Title */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Hi {userData?.name}!</Text>
        </View>

        {/* Connectivity Status */}
        <ConnectivityStatus />

        {/* Quick Actions */}
        <View style={styles.quickActionsWrapper}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.quickActionsScrollView}
            onMomentumScrollEnd={(event) => {
              const contentOffset = event.nativeEvent.contentOffset;
              const viewSize = event.nativeEvent.layoutMeasurement.width;
              const selectedIndex = Math.floor(contentOffset.x / viewSize);
              setCurrentQuickActionIndex(selectedIndex);
            }}
          >
            {quickActions.map((quickAction) => (
              <View key={quickAction.id} style={styles.quickActionsContainer}>
                <ImageBackground
                  source={quickAction.image}
                  style={styles.quickActionsCard}
                  imageStyle={styles.quickActionsBackgroundImage}
                >
                  <TouchableOpacity
                    key={quickAction.id}
                    onPress={() => navigation.navigate(quickAction.goTo)}
                    style={styles.quickActionsTouchable}
                  >
                    {quickAction.title === "Create a Bubble!" ? (
                      <Text
                        style={[
                          styles.quickActionsTitle,
                          { alignSelf: "flex-start", paddingLeft: 10 },
                        ]}
                      >
                        {quickAction.title}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.quickActionsTitle,
                          {
                            position: "absolute",
                            bottom: 8,
                            right: 0,
                          },
                        ]}
                      >
                        {quickAction.title}
                      </Text>
                    )}
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>

          {/* Dot Indicators */}
          <View style={styles.dotContainer}>
            {quickActions.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentQuickActionIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Categories */}
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

        {/* Bubbles */}
        <View style={styles.bubblesContainer}>
          {loading ? (
            <Text style={styles.noBubblesText}>Loading bubbles...</Text>
          ) : filteredBubbles && filteredBubbles.length > 0 ? (
            filteredBubbles.map((bubbleData) => (
              <BubbleItem
                key={bubbleData.id}
                cardTitle={styles.cardTitle}
                cardText={styles.cardText}
                bubbleName={bubbleData.name}
                bubbleHost={bubbleData.hostName}
                userRole={bubbleData.userRole}
                icon={bubbleData.icon || "heart"}
                response={
                  (user &&
                    bubbleData.guestResponses?.[user.email?.toLowerCase()]
                      ?.response) ||
                  "pending"
                }
                backgroundColor={bubbleData.backgroundColor || "#E89349"}
                tags={bubbleData.tags || []}
                onAccept={() => handleAcceptBubble(bubbleData.id)}
                onDecline={() => handleDeclineBubble(bubbleData.id)}
                onRetract={() => handleRetractBubble(bubbleData.id)}
                bubbleId={bubbleData.id}
                hostName={bubbleData.hostName}
                // send as params
                action={() =>
                  navigation.navigate("BubbleView", {
                    bubbleDetails: {
                      bubbleId: bubbleData.id,
                      userRole: bubbleData.userRole,
                      onAccept: () => handleAcceptBubble(bubbleData.id),
                      onDecline: () => handleDeclineBubble(bubbleData.id),
                      onRetract: () => handleRetractBubble(bubbleData.id),
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
    </View>
  );
}

const screenwidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: COLORS.background,
    height: "100%",
    paddingTop: 15,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoriesContainer: {
    paddingBottom: 15,
    flex: 0,
    flexGrow: 0,
    backgroundColor: COLORS.background,
  },
  categoryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: 8,
    borderRadius: 50,
    alignSelf: "flex-start", // ensures that width is as long as content/text in it
  },
  categoryText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  bubblesContainer: {
    width: screenwidth,
    paddingRight: 15,
    paddingLeft: 35,
  },
  quickActionsWrapper: {
    paddingBottom: 10,
  },
  quickActionsScrollView: {
    flex: 0, // prevents unnecessary growth
    flexGrow: 0, // ensures its only as high as contents in it
  },
  quickActionsContainer: {
    width: screenwidth,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionsCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    justifyContent: "center",
    borderRadius: 10,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionsBackgroundImage: {
    borderRadius: 10,
    opacity: 0.8,
  },
  quickActionsTouchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  noBubblesText: {
    textAlign: "center",
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 20,
  },
  selectedCategoryBtn: {
    backgroundColor: COLORS.primary,
  },
  selectedCategoryText: {
    color: COLORS.background,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surface,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
