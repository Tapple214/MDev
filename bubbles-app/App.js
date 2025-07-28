import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "./components/navbar";
import BubbleItem from "./components/bubble-item";

const Stack = createStackNavigator();

export default function BubblesApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BubbleDetails" component={BubbleDetails} />
        <Stack.Screen name="BubbleBook" component={BubbleBook} />
        <Stack.Screen name="BubbleBuddies" component={BubbleBuddies} />
        <Stack.Screen name="CreateBubble" component={CreateBubble} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Login({ navigation }) {
  return (
    <SafeAreaView style={styles.generalContainer}>
      <Image source={require("./assets/login.jpeg")} style={styles.image} />
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text>Sign in with Google</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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

// Home

function BubbleDetails() {
  return (
    <SafeAreaView style={styles.generalContainer}>
      <NavBar />
      {/* Row 1 */}
      <View style={styles.row}>
        <View style={[styles.cell, { width: "60%" }]}>
          <Text>1</Text>
        </View>
        <View>
          <Text>2</Text>
        </View>
      </View>

      {/* Row 2 */}
      <View>
        <View>
          <Text>3</Text>
        </View>
        <View>
          <Text>4</Text>
        </View>
      </View>

      {/* Row 3 */}
      <View>
        <View>
          <Text>5</Text>
        </View>
        <View>
          <Text>6</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function BubbleBook() {
  return (
    <SafeAreaView style={styles.generalContainer}>
      <NavBar />
      <View></View>
    </SafeAreaView>
  );
}

function BubbleBuddies() {
  return (
    <SafeAreaView style={styles.generalContainer}>
      <NavBar />
      <View></View>
    </SafeAreaView>
  );
}

function CreateBubble() {
  const [bubbleName, setBubbleName] = useState("");
  const [bubbleDescription, setBubbleDescription] = useState("");
  const [bubbleLocation, setBubbleLocation] = useState("");
  const [bubbleDate, setBubbleDate] = useState("");
  const [bubbleTime, setBubbleTime] = useState("");
  return (
    <SafeAreaView style={styles.generalContainer}>
      <NavBar />
      <Text>What is your bubble's name?</Text>
      <TextInput
        value={bubbleName}
        onChangeText={setBubbleName}
        placeholder="Enter bubble name"
        style={styles.input}
      />
    </SafeAreaView>
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
  button: { padding: 10, backgroundColor: "#452A17", borderRadius: 5 },
  categoriesContainer: {
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 15,
    flex: 0,
    flexGrow: 0,
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

  row: { flexDirection: "row" },
  rowCell: {
    backgroundColor: "blue",
  },
  text: { color: "#452A17" },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 20,
  },
});

function Home({ navigation }) {
  return (
    <View style={styles.generalContainer}>
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

      <ScrollView horizontal style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryBtn}>
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bubblesContainer}>
        <BubbleItem cardTitle={styles.cardTitle} cardText={styles.cardText} />
      </View>

      <NavBar />
    </View>
  );
}
