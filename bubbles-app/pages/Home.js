import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import NavBar from "../components/navbar";
import BubbleItem from "../components/bubble-item";

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
  return (
    <View style={[styles.generalContainer, { paddingBottom: 80 }]}>
      <ScrollView vertical stickyHeaderIndices={[2]}>
        <Text style={styles.title}>Welcome to Bubbles!</Text>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          style={styles.quickActionsScrollView}
        >
          {quickActions.map((quickAction) => (
            <View style={styles.quickActionsContainer}>
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
          <BubbleItem cardTitle={styles.cardTitle} cardText={styles.cardText} />
        </View>
      </ScrollView>
      <NavBar />
    </View>
  );
}

const screenwidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  // General properties
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
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 15,
    flex: 0,
    flexGrow: 0,
    backgroundColor: "#EEDCAD",
  },
  categoryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 50,
    backgroundColor: "#452A17",
    width: "auto",
    alignSelf: "flex-start", // ensures that width is as long as content/text in it
  },
  categoryText: {
    color: "#EEDCAD",
  },

  // Home Page
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
