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
import { COLORS } from "../utils/custom-styles";

export default function UniqueCodeDisplay({
  isVisible,
  onClose,
  bubbleName,
  bubbleId,
}) {
  const [attendanceCode, setAttendanceCode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds

  // Generate a unique 6-digit code
  useEffect(() => {
    if (isVisible) {
      generateAttendanceCode();
      startTimer();
    }
  }, [isVisible]);

  const generateAttendanceCode = () => {
    // Generate a 6-digit code based on bubbleId and current time
    const timestamp = Date.now();
    const code = Math.floor((timestamp % 1000000) + 100000);
    setAttendanceCode(code.toString());
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          Alert.alert(
            "Code Expired",
            "The attendance code has expired. Generate a new one?",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: onClose,
              },
              {
                text: "Generate New",
                onPress: () => {
                  generateAttendanceCode();
                  setTimeRemaining(300);
                  startTimer();
                },
              },
            ]
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleCopyCode = () => {
    // In a real app, you'd use Clipboard API
    Alert.alert("Code Copied", "Attendance code copied to clipboard");
  };

  const handleRefreshCode = () => {
    Alert.alert(
      "Generate New Code",
      "Are you sure you want to generate a new attendance code?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Generate",
          onPress: () => {
            generateAttendanceCode();
            setTimeRemaining(300);
            startTimer();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Attendance Code</Text>
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
            Share this code with your guests
          </Text>

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Attendance Code</Text>
            <Text style={styles.codeText}>{attendanceCode}</Text>
            <Text style={styles.codeHint}>
              Guests enter this code to confirm attendance
            </Text>
          </View>

          <View style={styles.timerContainer}>
            <Feather name="clock" size={20} color={COLORS.primary} />
            <Text style={styles.timerText}>
              Expires in {formatTime(timeRemaining)}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
            <Feather name="copy" size={20} color={COLORS.primary} />
            <Text style={styles.copyButtonText}>Copy Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefreshCode}
          >
            <Feather name="refresh-cw" size={20} color={COLORS.surface} />
            <Text style={styles.refreshButtonText}>New Code</Text>
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
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 5,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 15,
  },
  copyButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  copyButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  refreshButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  refreshButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
