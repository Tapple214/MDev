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
      <Text style={styles.inputTitle}>What is your bubble's name?</Text>
      <TextInput
        value={bubbleName}
        onChangeText={setBubbleName}
        placeholder="Enter bubble name"
        style={styles.input}
      />

      <Text style={styles.inputTitle}>
        Describe your bubble. what is the dresscode, etc?
      </Text>
      <TextInput
        value={bubbleDescription}
        onChangeText={setBubbleDescription}
        placeholder="Enter bubble description"
        style={styles.input}
      />

      <Text style={styles.inputTitle}>Where will your bubble be held?</Text>
      <TextInput
        value={bubbleLocation}
        onChangeText={setBubbleLocation}
        placeholder="Enter bubble location"
        style={styles.input}
      />

      <Text style={styles.inputTitle}>When is your bubble?</Text>
      <TextInput
        value={bubbleDate}
        onChangeText={setBubbleDate}
        placeholder="Enter bubble date"
        style={styles.input}
      />
      <TextInput
        value={bubbleName}
        onChangeText={setBubbleName}
        placeholder="Enter bubble time"
        style={styles.input}
      />
      <NavBar />
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
    marginBottom: 15,
    backgroundColor: "#FEFADF",
  },
});
