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

// Components
import NavBar from "../components/navbar";
import BubbleItem from "../components/bubble-item";
import QRCodeScanner from "../components/qr-code-scanner-simple";
import { Feather } from "@expo/vector-icons";

// Custom hooks and utility functions
import { useAuth } from "../contexts/AuthContext";
import {
  getUserBubbles,
  getUser,
  updateGuestResponse,
} from "../utils/firestore";
import { COLORS } from "../utils/colors";

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

// To show the different bubbles related to the user
const categories = [
  { id: 1, name: "All" },
  { id: 2, name: "Created By Me" },
  { id: 3, name: "Invited" },
  { id: 4, name: "Attending" },
  { id: 5, name: "Completed" },
];

export default function Home({ navigation }) {
  // Custom Hook
  const { user } = useAuth();

  // States
  const [userData, setUserData] = useState(null);
  const [bubblesData, setBubblesData] = useState([]);
  const [filteredBubbles, setFilteredBubbles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1); // Default to "All"
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentQuickActionIndex, setCurrentQuickActionIndex] = useState(0);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const fetchData = async () => {
    if (user && user.uid) {
      try {
        setLoading(true);

        // Fetch user data
        const fetchedUserData = await getUser(user.uid);
        setUserData(fetchedUserData);

        // Fetch bubbles data
        const fetchedBubblesData = await getUserBubbles(user.uid, user.email);

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

  const handleRetractBubble = async (bubbleId) => {
    try {
      await updateGuestResponse(bubbleId, user.email, "pending");
      Alert.alert(
        "Retracted",
        "You've retracted your invitation to this bubble."
      );
      // Refresh the data to show updated status
      await fetchData();
    } catch (error) {
      console.error("Error retracting bubble:", error);
      Alert.alert("Error", "Failed to retract bubble. Please try again.");
    }
  };

  const handleQRCodeScanned = (qrData) => {
    Alert.alert(
      "QR Code Scanned!",
      `Bubble: ${qrData.bubbleName}\nHost: ${qrData.hostName}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Join Bubble",
          onPress: () => {
            // Here you would implement the logic to join the bubble
            // For now, just show a success message
            Alert.alert("Success", "You have joined the bubble!");
          },
        },
      ]
    );
  };

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
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Hi {userData?.name}!</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.qrScanButton}
              onPress={() => setShowQRScanner(true)}
            >
              <Feather name="qr-code" size={20} color={COLORS.surface} />
            </TouchableOpacity>
          </View>
        </View>

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
                  bubbleData.guestResponses?.[user.email?.toLowerCase()]
                    ?.response || "pending"
                }
                backgroundColor={bubbleData.backgroundColor || "#E89349"}
                tags={bubbleData.tags || []}
                onAccept={() => handleAcceptBubble(bubbleData.id)}
                onDecline={() => handleDeclineBubble(bubbleData.id)}
                onRetract={() => handleRetractBubble(bubbleData.id)}
                // send as params
                action={() =>
                  navigation.navigate("BubbleView", {
                    bubbleDetails: {
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

      {/* QR Code Scanner Modal */}
      <QRCodeScanner
        isVisible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onQRCodeScanned={handleQRCodeScanned}
      />

      <NavBar />
    </View>
  );
}

const screenwidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: COLORS.background,
    height: "100%",
    paddingTop: 15,
    paddingBottom: 100,
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
    alignItems: "center",
  },
  qrScanButton: {
    backgroundColor: COLORS.confirm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: COLORS.background,
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
    color: COLORS.background,
    fontSize: 12,
    fontWeight: "600",
  },
  migrateButton: {
    backgroundColor: COLORS.elemental.sage,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  migrateButtonText: {
    color: COLORS.background,
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
    backgroundColor: "#C4C4C4",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
