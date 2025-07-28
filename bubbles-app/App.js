import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NavBar from "./components/navbar";

const Stack = createStackNavigator();

export default function BubblesApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Sreen name="Home" component={Home} />
        <Stack.Sreen name="BubbleDetails" component={BubbleDetails} />
        <Stack.Sreen name="BubbleBook" component={BubbleBook} />
        <Stack.Sreen name="BubbleBuddies" component={BubbleBudies} />
        <Stack.Sreen name="CreateBubble" component={CreateBubble} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Login() {
  return (
    <SafeAreaView>
      <Image source={require("./assets/login.png")} />
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
    <SafeAreaView>
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
    </SafeAreaView>
  );
}

function BubbleDetails() {
  return (
    <SafeAreaView>
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
    <SafeAreaView>
      <NavBar />
      <View></View>
    </SafeAreaView>
  );
}

function BubbleBudies() {
  return (
    <SafeAreaView>
      <NavBar />
      <View></View>
    </SafeAreaView>
  );
}

function CreateBubble() {
  return (
    <SafeAreaView>
      <NavBar />
      <View></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Sections that houses quick actions
  quickActionsContainer: {},
  // All buttons use this
  button: {},
  row: { flexDirection: row },
  rowCell: {
    backgroundColor: "blue",
  },
});
