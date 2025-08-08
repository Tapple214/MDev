import React from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";

// Utility function/Hooks imports
import { useAuth } from "../contexts/AuthContext";
import { COLORS } from "../utils/colors";
import { useNavigation } from "@react-navigation/native";

export default function NavBar({
  page = "default",
  onAddPerson,
  handleEditBubble,
  userRole,
}) {
  // Hooks
  const { logout } = useAuth();
  const navigation = useNavigation();
  const state = navigation.getState();
  const currentRoute = state.routes[state.index];

  //   Logout function
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  // Dynamic highlight icon that will change based on the page; placed on far right of navbar
  const getHighlightIconConfig = () => {
    switch (page) {
      case "BubbleBuddies":
        return {
          icon: "user-plus",
          onPress: () => {
            onAddPerson();
          },
          color: COLORS.background,
          backgroundColor: COLORS.primary,
        };
      case "BubbleView":
        // Check user role for BubbleView page
        if (userRole === "host") {
          return {
            icon: "edit-3",
            onPress: () => {
              handleEditBubble();
            },
            color: COLORS.background,
            backgroundColor: COLORS.primary,
          };
        } else {
          return {
            icon: "plus",
            onPress: () => {
              navigation.navigate("CreateBubble");
            },
            color: COLORS.background,
            backgroundColor: COLORS.primary,
          };
        }
      default:
        return {
          icon: "plus",
          onPress: () => navigation.navigate("CreateBubble"),
          color: COLORS.background,
          backgroundColor: COLORS.primary,
        };
    }
  };

  const highlightConfig = getHighlightIconConfig();

  return (
    <View style={styles.navbar}>
      {/* Logout icon */}
      <TouchableOpacity onPress={handleLogout}>
        <Feather name="log-out" size={30} color={COLORS.primary} />
      </TouchableOpacity>

      {/* Settings icon */}
      <TouchableOpacity
        onPress={() => {
          if (currentRoute.name !== "NotificationSettings") {
            navigation.navigate("NotificationSettings");
          }
        }}
      >
        <Feather name="settings" size={30} color={COLORS.primary} />
      </TouchableOpacity>

      {/* Highlight icon */}
      <View style={styles.highlightIconContainer}>
        <TouchableOpacity
          style={[
            styles.highlightIcon,
            { backgroundColor: highlightConfig.backgroundColor },
          ]}
          onPress={highlightConfig.onPress}
        >
          <Feather
            name={highlightConfig.icon}
            size={25}
            color={highlightConfig.color}
          />
        </TouchableOpacity>
      </View>

      {/* Bubble Buddies icon */}
      <TouchableOpacity>
        <Feather
          name="users"
          size={30}
          color={COLORS.primary}
          onPress={() => {
            if (currentRoute.name !== "BubbleBuddies") {
              navigation.navigate("BubbleBuddies");
            }
          }}
        />
      </TouchableOpacity>

      {/* Home icon */}
      <TouchableOpacity
        onPress={() => {
          if (currentRoute.name !== "Home") {
            navigation.popToTop("Home");
          }
        }}
      >
        <Feather name="home" size={30} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.background,
    alignItems: "center",
    position: "absolute",
    paddingBottom: 30,
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  highlightIcon: {
    position: "relative",
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 50,
    alignSelf: "flex-start",
  },
  highlightIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
