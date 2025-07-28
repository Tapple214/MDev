import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/navbar";

export default function BubbleBuddies() {
  return (
    <SafeAreaView style={styles.generalContainer}>
      <NavBar />
      <View></View>
      <NavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: "#EEDCAD",
    height: "100%",
    paddingVertical: 15,
  },
});
