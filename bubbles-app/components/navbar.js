import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

// TODO: add a page prop to change the middle icon
export default function NavBar() {
  const navigation = useNavigation();
  const state = navigation.getState();
  const currentRoute = state.routes[state.index];

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        onPress={() => {
          if (currentRoute.name !== "Home") {
            navigation.navigate("Home");
          }
        }}
      >
        <Feather name="home" size={30} color="#452A17" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.centerIcon}
        // onPress={() => navigation.replace("BubbleView")}
      >
        <Feather name="heart" size={25} color="#EEDCAD" />
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
    paddingBottom: 20,
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  centerIcon: {
    position: "absolute",
    backgroundColor: "#452A17",
    padding: 13,
    borderRadius: 50,
    marginBottom: 35,
  },
});
