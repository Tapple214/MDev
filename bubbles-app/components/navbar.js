import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function NavBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity>
        <Feather name="heart" size={40} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
});
