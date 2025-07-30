import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
    <View style={styles.navbar}>
      <TouchableOpacity onPress={handleLogout}>
        <Feather name="log-out" size={30} color="#452A17" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (currentRoute.name !== "Home") {
            navigation.popToTop("Home");
          }
        }}
      >
        <Feather name="home" size={30} color="#452A17" />
      </TouchableOpacity>

      <TouchableOpacity>
        <Feather
          name="users"
          size={30}
          color="#452A17"
          onPress={() => {
            if (currentRoute.name !== "BubbleBuddies") {
              navigation.navigate("BubbleBuddies");
            }
          }}
        />
      </TouchableOpacity>

      <View style={styles.highlightIconContainer}>
        <TouchableOpacity
          style={styles.highlightIcon}
          onPress={() => navigation.navigate("CreateBubble")}
        >
          <Feather name="plus" size={25} color="#EEDCAD" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#EEDCAD",
    alignItems: "center",
    position: "absolute",
    paddingBottom: 30,
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  highlightIcon: {
    position: "relative",
    backgroundColor: "#452A17",
    padding: 13,
    borderRadius: 50,
    alignSelf: "flex-start",
    bottom: 10,
  },
  highlightIconContainer: {
    // Remove the red background for testing
    alignItems: "center",
    justifyContent: "center",
  },
});
