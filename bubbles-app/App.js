import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Custom hooks and utility functions
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import {
  setupNotificationListeners,
  initializeAppNotifications,
  cleanupNotificationListeners,
} from "./utils/notifications/core.js";

// Import page components
import Login from "./pages/Login";
import Home from "./pages/Home";
import BubbleView from "./pages/BubbleView";
import BubbleBook from "./pages/BubbleBook";
import BubbleBuddies from "./pages/BubbleBuddies";
import CreateBubble from "./pages/CreateBubble";
import EditBubble from "./pages/EditBubble";
import GuestList from "./pages/GuestList";
import NotificationSettings from "./pages/NotificationSettings";

const Stack = createStackNavigator();

// TODO: add a navbar component that will be used on all pages

function NavigationContent() {
  // Custom Hook
  const { user } = useAuth();

  // Set up notification listeners and initialize notifications when user is authenticated
  useEffect(() => {
    if (user) {
      // Initialize notifications
      initializeAppNotifications(user);

      // Set up notification listeners
      const cleanup = setupNotificationListeners();
      return () => cleanupNotificationListeners(cleanup);
    }
  }, [user]);

  return (
    <Stack.Navigator
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
          color: "#452A17",
        },
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
          <Stack.Screen name="EditBubble" component={EditBubble} />
          <Stack.Screen name="GuestList" component={GuestList} />
          <Stack.Screen
            name="NotificationSettings"
            component={NotificationSettings}
          />
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
