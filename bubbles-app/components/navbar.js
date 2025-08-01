import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { COLORS } from "../utils/colors";

export default function NavBar({ page = "default", onAddPerson }) {
  const { logout } = useAuth();
  const navigation = useNavigation();
  const state = navigation.getState();
  const currentRoute = state.routes[state.index];

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

  // Dynamic highlight icon configuration based on page
  const getHighlightIconConfig = () => {
    switch (page) {
      case "BubbleBuddies":
        return {
          icon: "user-plus",
          onPress: () => {
            if (onAddPerson) {
              onAddPerson();
            } else {
              Alert.alert(
                "Add Person",
                "Add person functionality will be implemented here"
              );
            }
          },
          color: COLORS.background,
          backgroundColor: COLORS.primary, // Original brown background
        };
      case "BubbleView":
        return {
          icon: "edit-3",
          onPress: () => {
            // Placeholder functionality for editing bubble
            Alert.alert(
              "Edit Bubble",
              "Edit bubble functionality will be implemented here"
            );
          },
          color: COLORS.background,
          backgroundColor: COLORS.primary, // Original brown background
        };
      default:
        return {
          icon: "plus",
          onPress: () => navigation.navigate("CreateBubble"),
          color: COLORS.background,
          backgroundColor: COLORS.primary, // Original brown background
        };
    }
  };

  const highlightConfig = getHighlightIconConfig();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={handleLogout}>
        <Feather name="log-out" size={30} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (currentRoute.name !== "Home") {
            navigation.popToTop("Home");
          }
        }}
      >
        <Feather name="home" size={30} color={COLORS.primary} />
      </TouchableOpacity>

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

      <TouchableOpacity>
        <Feather
          name="image"
          size={30}
          color={COLORS.primary}
          onPress={() => {
            if (currentRoute.name !== "BubbleBook") {
              navigation.navigate("BubbleBook");
            }
          }}
        />
      </TouchableOpacity>

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
