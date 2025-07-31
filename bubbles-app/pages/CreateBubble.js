import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/navbar";

export default function CreateBubble() {
  const [bubbleName, setBubbleName] = useState("");
  const [bubbleDescription, setBubbleDescription] = useState("");
  const [bubbleLocation, setBubbleLocation] = useState("");
  const [bubbleDate, setBubbleDate] = useState("");
  const [bubbleTime, setBubbleTime] = useState("");
  const [guestList, setGuestList] = useState("");
  const [needQR, setNeedQR] = useState(false);

  return (
    <View style={styles.generalContainer}>
      <ScrollView>
        <Text style={styles.title}>Fill the deets to get your bubble set!</Text>

        <Text style={styles.inputTitle}>What is your bubble's name?</Text>
        <TextInput
          value={bubbleName}
          onChangeText={setBubbleName}
          placeholder="Enter bubble name"
          style={styles.input}
        />

        <Text style={styles.inputTitle}>
          Describe your bubble. What is the dresscode, etc?
        </Text>
        <TextInput
          value={bubbleDescription}
          onChangeText={setBubbleDescription}
          placeholder="Enter bubble description"
          style={styles.input}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.inputTitle}>Where will your bubble be held?</Text>
        <TextInput
          value={bubbleLocation}
          onChangeText={setBubbleLocation}
          placeholder="Enter bubble location"
          style={styles.input}
        />

        <Text style={styles.inputTitle}>When is your bubble? (Date)</Text>
        <TextInput
          value={bubbleDate}
          onChangeText={setBubbleDate}
          placeholder="Enter bubble date (e.g., July 24, 2025)"
          style={styles.input}
        />

        <Text style={styles.inputTitle}>What time is your bubble?</Text>
        <TextInput
          value={bubbleTime}
          onChangeText={setBubbleTime}
          placeholder="Enter bubble time (e.g., 5:30 PM)"
          style={styles.input}
        />

        <Text style={styles.inputTitle}>
          Guest List (comma separated emails)
        </Text>
        <TextInput
          value={guestList}
          onChangeText={setGuestList}
          placeholder="Enter guest emails (e.g., guest1@email.com, guest2@email.com)"
          style={styles.input}
          multiline
          numberOfLines={5}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.inputTitle}>Need QR Code for entry?</Text>
          <Switch
            value={needQR}
            onValueChange={setNeedQR}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={needQR ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </ScrollView>

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
  inputTitle: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  input: {
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FEFADF",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
});
