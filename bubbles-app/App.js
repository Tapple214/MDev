import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Import page components
import Login from "./pages/Login";
import Home from "./pages/Home";
import BubbleView from "./pages/BubbleView";
import BubbleBook from "./pages/BubbleBook";
import BubbleBuddies from "./pages/BubbleBuddies";
import CreateBubble from "./pages/CreateBubble";

const Stack = createStackNavigator();

export default function BubblesApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#EEDCAD",
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: "#452A17",
          headerTitleStyle: {
            fontWeight: "bold",
            color: "#",
          },
        }}
      >
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
