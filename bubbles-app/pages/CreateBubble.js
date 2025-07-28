import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/navbar";

export default function CreateBubble() {
  const [bubbleName, setBubbleName] = useState("");
  const [bubbleDescription, setBubbleDescription] = useState("");
  const [bubbleLocation, setBubbleLocation] = useState("");
  const [bubbleDate, setBubbleDate] = useState("");
  const [bubbleTime, setBubbleTime] = useState("");

  return (
    <View style={styles.generalContainer}>
      <NavBar />
      <Text>What is your bubble's name?</Text>
      <TextInput
        value={bubbleName}
        onChangeText={setBubbleName}
        placeholder="Enter bubble name"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: "#EEDCAD",
    height: "100%",
    paddingVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#452A17",
    borderRadius: 5,
    padding: 10,
    margin: 10,
    backgroundColor: "#FEFADF",
  },
});
