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

function Login() {
  return (
    <SafeAreaView style={styles.generalContainer}>
      {/* <Image source={require("./assets/login.PNG")} /> */}
      <TouchableOpacity>
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

function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.generalContainer}>
      <NavBar />
      <View>
        <Text>Welcome to Bubbles!</Text>
        <ScrollView horizontal={true} style={styles.quickActionsContainer}>
          {quickActions.map((quickAction) => {
            return (
              <TouchableOpacity
                key={quickAction.id}
                onPress={() => navigation.navigate(quickAction.goTo)}
              >
                <Text>{quickAction.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View>
        <BubbleItem />
      </View>
    </SafeAreaView>
  );
}

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

const styles = StyleSheet.create({
  generalContainer: { backgroundColor: "#EEDCAD" },
  // Sections that houses quick actions
  quickActionsContainer: { paddingVertical: 10 },
  // All buttons use this
  button: { padding: 10, backgroundColor: "#452A17", borderRadius: 5 },
  row: { flexDirection: "row" },
  rowCell: {
    backgroundColor: "blue",
  },
  text: { color: "#452A17" },
});
