import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../utils/custom-styles";

export default function QRCodeScannerSimple({
  isVisible,
  onClose,
  onQRCodeScanned,
}) {
  const [scanned, setScanned] = useState(false);

  const handleSimulateScan = () => {
    setScanned(true);

    // Simulate scanning a QR code
    const mockQRData = {
      type: "bubble_entry",
      bubbleId: "mock-bubble-id",
      bubbleName: "Coffee Meetup",
      hostName: "John Doe",
      schedule: "2024-01-15T18:00:00.000Z",
      uniqueId: "mock-uuid",
      timestamp: new Date().toISOString(),
    };

    Alert.alert(
      "QR Code Scanned!",
      `Bubble: ${mockQRData.bubbleName}\nHost: ${mockQRData.hostName}`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setScanned(false),
        },
        {
          text: "Join Bubble",
          onPress: () => {
            onQRCodeScanned(mockQRData);
            onClose();
          },
        },
      ]
    );
  };

  const handleClose = () => {
    setScanned(false);
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.scannerContainer}>
          {/* Placeholder for camera view */}
          <View style={styles.cameraPlaceholder}>
            <Feather name="camera" size={80} color={COLORS.primary} />
            <Text style={styles.placeholderText}>Camera Scanner</Text>
            <Text style={styles.placeholderSubtext}>
              Native camera module is being configured
            </Text>
          </View>

          {/* Scanner overlay */}
          <View style={styles.overlay}>
            <View style={styles.scanFrame}>
              <View style={styles.corner} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleSimulateScan}
        >
          <Feather name="qr-code" size={24} color={COLORS.surface} />
          <Text style={styles.scanButtonText}>Simulate QR Scan</Text>
        </TouchableOpacity>

        {scanned && (
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.rescanButtonText}>Tap to Scan Again</Text>
          </TouchableOpacity>
        )}
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
  scannerContainer: {
    flex: 1,
    position: "relative",
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    borderRadius: 15,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 20,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionContainer: {
    position: "absolute",
    bottom: 150,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  scanButton: {
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
  scanButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  rescanButton: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  rescanButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "bold",
  },
});
