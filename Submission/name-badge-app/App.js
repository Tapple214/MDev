import * as ScreenOrientation from "expo-screen-orientation";
import { Text, StyleSheet, View, SafeAreaView } from "react-native";
import { useEffect } from "react";

export default function App() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);

  // START
  const name = "Apple 🍎 (She/Her)";
  // END
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* START */}
        <Text style={styles.welcomeText}>Kumusta</Text>
        <Text style={styles.subtitleText}>ako ay si</Text>
        {/* END */}
        <View style={styles.nameBox}>
          <Text style={styles.nameText}>{name}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  welcomeText: {
    fontSize: 90,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 30,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
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
