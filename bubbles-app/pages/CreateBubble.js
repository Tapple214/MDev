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
      <Text style={styles.title}>Fill the deets to get your bubble set!</Text>
      <NavBar />
      <Text style={styles.inputTitle}>What is your bubble's name?</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  inputTitle: { paddingHorizontal: 15, paddingBottom: 10 },
  input: {
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 15,
    backgroundColor: "#FEFADF",
  },
});
