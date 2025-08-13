import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// Custom hooks and utility functions
import { COLORS } from "../utils/custom-styles";

export default function UniqueCodeEntry({
  isVisible,
  onClose,
  onCodeSubmitted,
  bubbleName,
  hostName,
  bubbleId,
}) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitCode = () => {
    if (!code.trim()) {
      Alert.alert("Error", "Please enter a code");
      return;
    }

    setIsSubmitting(true);

    // Create code data for PIN validation
    const codeData = {
      type: "bubble_entry",
      bubbleId: bubbleId || "",
      bubbleName: bubbleName,
      hostName: hostName,
      schedule: new Date().toISOString(),
      uniqueId: Date.now().toString(),
      timestamp: new Date().toISOString(),
      entryCode: code.trim(),
    };

    Alert.alert(
      "Code Submitted!",
      `Bubble: ${codeData.bubbleName}\nHost: ${
        codeData.hostName
      }\nCode: ${code.trim()}\n\nWould you like to confirm your attendance?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            setIsSubmitting(false);
          },
        },
        {
          text: "Yes",
          onPress: () => {
            onCodeSubmitted(codeData);
            onClose();
            setCode("");
            setIsSubmitting(false);
          },
        },
      ]
    );
  };

  const handleClose = () => {
    setCode("");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Enter Attendance Code</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Feather name="key" size={80} color={COLORS.primary} />
          </View>

          <Text style={styles.instructionText}>
            Ask the host for the unique attendance code
          </Text>

          <View style={styles.codeInputContainer}>
            <TextInput
              style={styles.codeInput}
              placeholder="Enter 6-digit code"
              placeholderTextColor={COLORS.textSecondary}
              value={code}
              onChangeText={setCode}
              maxLength={6}
              keyboardType="numeric"
              autoFocus={true}
            />
          </View>

          <Text style={styles.hintText}>
            The code is usually displayed on the host's device
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmitCode}
          disabled={isSubmitting}
        >
          <Feather name="check" size={24} color={COLORS.surface} />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Submitting..." : "Submit Code"}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 30,
  },
  codeInputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 5,
    color: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  hintText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
  submitButton: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
