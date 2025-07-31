import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Import page components
import Login from "./pages/Login";
import Home from "./pages/Home";
import BubbleView from "./pages/BubbleView";
import BubbleBook from "./pages/BubbleBook";
import BubbleBuddies from "./pages/BubbleBuddies";
import CreateBubble from "./pages/CreateBubble";

const Stack = createStackNavigator();

function NavigationContent() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#2D3748",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
          color: "#2D3748",
        },
        headerShadowVisible: false,
      }}
    >
      {user ? (
        // User is signed in
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="BubbleView" component={BubbleView} />
          <Stack.Screen name="BubbleBook" component={BubbleBook} />
          <Stack.Screen name="BubbleBuddies" component={BubbleBuddies} />
          <Stack.Screen name="CreateBubble" component={CreateBubble} />
        </>
      ) : (
        // User is not signed in
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

export default function BubblesApp() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <NavigationContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
