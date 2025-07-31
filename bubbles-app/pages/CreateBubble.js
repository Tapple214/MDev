import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/navbar";
import { useAuth } from "../contexts/AuthContext";
import { createBubble } from "../utils/firestore";

export default function CreateBubble() {
  const { user, userData } = useAuth();
  const [bubbleName, setBubbleName] = useState("");
  const [bubbleDescription, setBubbleDescription] = useState("");
  const [bubbleLocation, setBubbleLocation] = useState("");
  const [bubbleDate, setBubbleDate] = useState("");
  const [bubbleTime, setBubbleTime] = useState("");
  const [guestList, setGuestList] = useState("");
  const [needQR, setNeedQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!bubbleName.trim()) {
      Alert.alert("Error", "Please enter a bubble name");
      return false;
    }
    if (!bubbleDescription.trim()) {
      Alert.alert("Error", "Please enter a bubble description");
      return false;
    }
    if (!bubbleLocation.trim()) {
      Alert.alert("Error", "Please enter a bubble location");
      return false;
    }
    if (!bubbleDate.trim()) {
      Alert.alert("Error", "Please enter a bubble date");
      return false;
    }
    if (!bubbleTime.trim()) {
      Alert.alert("Error", "Please enter a bubble time");
      return false;
    }
    return true;
  };

  const handleCreateBubble = async () => {
    if (!validateForm()) return;

    if (!user) {
      Alert.alert("Error", "You must be logged in to create a bubble");
      return;
    }

    setIsLoading(true);

    try {
      const bubbleData = {
        name: bubbleName.trim(),
        description: bubbleDescription.trim(),
        location: bubbleLocation.trim(),
        date: bubbleDate.trim(),
        time: bubbleTime.trim(),
        guestList: guestList.trim(),
        needQR,
        hostName: userData?.name || user.email,
        hostUid: user.uid,
      };

      await createBubble(bubbleData);

      Alert.alert("Success!", "Your bubble has been created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setBubbleName("");
            setBubbleDescription("");
            setBubbleLocation("");
            setBubbleDate("");
            setBubbleTime("");
            setGuestList("");
            setNeedQR(false);
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating bubble:", error);
      Alert.alert("Error", "Failed to create bubble. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          editable={!isLoading}
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
          editable={!isLoading}
        />

        <Text style={styles.inputTitle}>Where will your bubble be held?</Text>
        <TextInput
          value={bubbleLocation}
          onChangeText={setBubbleLocation}
          placeholder="Enter bubble location"
          style={styles.input}
          editable={!isLoading}
        />

        <Text style={styles.inputTitle}>When is your bubble? (Date)</Text>
        <TextInput
          value={bubbleDate}
          onChangeText={setBubbleDate}
          placeholder="Enter bubble date (e.g., July 24, 2025)"
          style={styles.input}
          editable={!isLoading}
        />

        <Text style={styles.inputTitle}>What time is your bubble?</Text>
        <TextInput
          value={bubbleTime}
          onChangeText={setBubbleTime}
          placeholder="Enter bubble time (e.g., 5:30 PM)"
          style={styles.input}
          editable={!isLoading}
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
          editable={!isLoading}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.inputTitle}>Need QR Code for entry?</Text>
          <Switch
            value={needQR}
            onValueChange={setNeedQR}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={needQR ? "#f5dd4b" : "#f4f3f4"}
            disabled={isLoading}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.createButton,
            isLoading && styles.createButtonDisabled,
          ]}
          onPress={handleCreateBubble}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FEFADF" />
          ) : (
            <Text style={styles.createButtonText}>Create Bubble</Text>
          )}
        </TouchableOpacity>
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
  createButton: {
    backgroundColor: "#606B38",
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  createButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
