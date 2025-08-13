import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// Custom hooks and utility functions
import { COLORS } from "../utils/custom-styles";

export default function UniqueCodeDisplay({
  isVisible,
  onClose,
  bubbleName,
  bubbleId,
  attendancePin,
}) {
  const [pin, setPin] = useState("");

  // Set the PIN when component becomes visible
  useEffect(() => {
    if (isVisible && attendancePin?.pin) {
      setPin(attendancePin.pin);
    }
  }, [isVisible, attendancePin]);

  const handleRefreshPin = () => {
    Alert.alert(
      "Generate New PIN",
      "Are you sure you want to generate a new attendance PIN? This will invalidate the current PIN.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Generate",
          onPress: () => {
            // For now, just show an alert that this feature needs to be implemented
            Alert.alert(
              "Feature Coming Soon",
              "PIN regeneration will be available in a future update. The current PIN remains valid."
            );
          },
        },
      ]
    );
  };

  if (!attendancePin?.pin) {
    return (
      <Modal visible={isVisible} animationType="slide">
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Attendance PIN</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Feather name="alert-circle" size={80} color={COLORS.primary} />
            </View>
            <Text style={styles.bubbleName}>{bubbleName}</Text>
            <Text style={styles.instructionText}>
              No attendance PIN found for this bubble
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Attendance PIN</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Feather name="shield" size={80} color={COLORS.primary} />
          </View>

          <Text style={styles.bubbleName}>{bubbleName}</Text>
          <Text style={styles.instructionText}>
            Share this PIN with your guests
          </Text>

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Attendance PIN</Text>
            <Text style={styles.codeText}>{pin}</Text>
            <Text style={styles.codeHint}>
              Guests enter this PIN to confirm attendance
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Feather name="info" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              This PIN is permanent and won't expire
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefreshPin}
          >
            <Feather name="refresh-cw" size={20} color={COLORS.surface} />
            <Text style={styles.refreshButtonText}>Regenerate PIN</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 20,
  },
  bubbleName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 40,
  },
  codeContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  codeLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  codeText: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.primary,
    letterSpacing: 8,
    marginBottom: 10,
    fontFamily: "monospace",
  },
  codeHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 5,
    fontWeight: "600",
  },
  buttonContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  refreshButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    flexDirection: "row",
  },
  refreshButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
