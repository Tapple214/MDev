import React, { useEffect, useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Components
import Login from "./pages/Login";
import Home from "./pages/Home";
import BubbleView from "./pages/BubbleView";
import BubbleBook from "./pages/BubbleBook";
import BubbleBuddies from "./pages/BubbleBuddies";
import CreateBubble from "./pages/CreateBubble";
import EditBubble from "./pages/EditBubble";
import GuestList from "./pages/GuestList";
import Settings from "./pages/Settings";
import ImageAnalysisDemo from "./pages/ImageAnalysisDemo";
import NavBar from "./components/navbar";

// Custom hooks and utility functions
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { initializeAppNotifications } from "./utils/notifications/core.js";
import { NavBarProvider, useNavBar } from "./contexts/NavBarContext";

const Stack = createStackNavigator();

function NavigationContent() {
  // Custom Hook
  const { user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState("Home");
  const { getNavBarFunctions } = useNavBar();

  // Initialize notifications when user is authenticated
  useEffect(() => {
    if (user) {
      initializeAppNotifications(user);
    }
  }, [user]);

  // Function to get NavBar props based on current route
  const getNavBarProps = (routeName) => {
    const registeredFunctions = getNavBarFunctions(routeName);

    switch (routeName) {
      case "BubbleBook":
        return {
          page: "BubbleBook",
          onTakePhoto: registeredFunctions.onTakePhoto || (() => {}),
          onPickImage: registeredFunctions.onPickImage || (() => {}),
          onPickDocument: registeredFunctions.onPickDocument || (() => {}),
        };
      case "BubbleBuddies":
        return {
          page: "BubbleBuddies",
          onAddPerson: registeredFunctions.onAddPerson || (() => {}),
        };
      case "BubbleView":
        return {
          page: "BubbleView",
          userRole: registeredFunctions.userRole || "host",
          handleEditBubble: registeredFunctions.handleEditBubble || (() => {}),
        };
      default:
        return { page: "default" };
    }
  };

  return (
    <>
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
        screenListeners={{
          state: (e) => {
            if (e.data?.state?.routes) {
              const routeName = e.data.state.routes[e.data.state.index].name;
              setCurrentRoute(routeName);
            }
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
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen
              name="ImageAnalysisDemo"
              component={ImageAnalysisDemo}
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
      {user && currentRoute && currentRoute !== "Login" && (
        <NavBar {...getNavBarProps(currentRoute)} />
      )}
    </>
  );
}

export default function BubblesApp() {
  return (
    <AuthProvider>
      <NavBarProvider>
        <NavigationContainer>
          <NavigationContent />
        </NavigationContainer>
      </NavBarProvider>
    </AuthProvider>
  );
}
