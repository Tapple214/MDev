import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

// TODO: add a page prop to change the middle icon
export default function NavBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Feather name="home" size={30} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.centerIcon}>
        <Feather name="heart" size={30} color="#EEDCAD" />
      </TouchableOpacity>

      <TouchableOpacity>
        <Feather name="users" size={30} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
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
    padding: 10,
    borderRadius: 50,
    marginBottom: 35,
  },
});
