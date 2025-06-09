import * as ScreenOrientation from "expo-screen-orientation";

export default function NameBadge({ name }) {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);

  return <Text style={styles.welcomeText}>Hello</Text>;
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
});
