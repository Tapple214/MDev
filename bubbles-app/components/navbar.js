import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

// TODO: add a page prop to change the middle icon
export default function NavBar() {
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

  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={handleLogout}>
          <Feather name="log-out" size={24} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            if (currentRoute.name !== "Home") {
              navigation.popToTop("Home");
            }
          }}
        >
          <Feather name="home" size={24} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            if (currentRoute.name !== "BubbleBuddies") {
              navigation.navigate("BubbleBuddies");
            }
          }}
        >
          <Feather name="users" size={24} color="#6B7280" />
        </TouchableOpacity>

        <View style={styles.highlightIconContainer}>
          <TouchableOpacity
            style={styles.highlightIcon}
            onPress={() => navigation.navigate("CreateBubble")}
          >
            <Feather name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  navButton: {
    padding: 8,
    borderRadius: 12,
  },
  highlightIcon: {
    backgroundColor: "#6366F1",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  highlightIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
