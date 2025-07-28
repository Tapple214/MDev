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
import { Feather } from "@expo/vector-icons";

const Stack = createStackNavigator();

export default function BubblesApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BubbleView" component={BubbleView} />
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
function Home({ navigation }) {
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
      <NavBar />
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
  text: { color: "#452A17" },
  button: {
    padding: 10,
    backgroundColor: "#FEFADF",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
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

  bubbleViewScrollView: {
    flex: 1,
  },
  bubbleDetailsRow: {
    flexDirection: "row",
    height: 150,
    marginBottom: 15,
    gap: 15,
    paddingHorizontal: 15,
  },
  cell: {
    backgroundColor: "rgba(254, 250, 223, 0.5)",
    borderRadius: 10,
    padding: 15,
  },

  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 20,
  },
});

function BubbleView() {
  return (
    <View style={styles.generalContainer}>
      <ScrollView vertical style={styles.bubbleViewScrollView}>
        <Text style={styles.title}>More info on the Bubble!</Text>
        {/* Row 1 */}
        <View style={styles.bubbleDetailsRow}>
          <View style={[styles.cell, { width: "95%" }]}>
            <Text style={styles.cardTitle}>ewfdhb</Text>
            <Feather
              name="bookmark"
              size={45}
              style={{ position: "absolute", right: -25, top: 15 }}
              color="#778A31"
            />
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.bubbleDetailsRow}>
          <View style={[styles.cell, { width: "40%", marginLeft: 20 }]}>
            <Text>3</Text>
            <Feather
              name="check-square"
              size={45}
              style={{ position: "absolute", left: -25, bottom: 15 }}
              color="#949D72"
            />
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text>4</Text>
            <Feather
              name="user"
              size={45}
              style={{ position: "absolute", left: 15, top: 15 }}
              color="#E89349"
            />
          </View>
        </View>

        {/* Row 3 */}
        <View style={styles.bubbleDetailsRow}>
          <View style={[styles.cell, { width: "55%" }]}>
            <Text>5</Text>
            <Feather
              name="map-pin"
              size={45}
              style={{ position: "absolute", right: 15, top: 15 }}
              color="#BD3526"
            />
          </View>
          <View style={[styles.cell, { flex: 1, marginRight: 20 }]}>
            <Text>6</Text>
            <Feather
              name="clock"
              size={45}
              style={{ position: "absolute", right: -25, bottom: 15 }}
              color="#46462B"
            />
          </View>
        </View>

        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.button}>
            <Feather name="camera" size={30} style={{ paddingBottom: 10 }} />
            <Text>Add to BubbleBook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text>Show/Scan QR Code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <NavBar />
    </View>
  );
}
