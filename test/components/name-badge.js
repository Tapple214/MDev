import * as ScreenOrientation from "expo-screen-orientation";
import { Text, StyleSheet } from "react-native";

export default function NameBadge({ name }) {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);

  return (
    <>
      <Text style={styles.welcomeText}>Hello</Text>
      <Text style={styles.nameText}>{name}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 90,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    letterSpacing: 2,
    lineHeight: 100,
  },
  subtitleText: {
    fontSize: 30,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 1,
    lineHeight: 35,
  },
  nameBox: {
    width: "100%",
    height: "55%",
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 60,
    textAlign: "center",
    fontWeight: "bold",
  },
});
