import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Share,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Feather } from "@expo/vector-icons";

// Custom hooks and utility functions
import { COLORS } from "../utils/custom-styles";

export default function QRCodeDisplay({
  qrCodeData,
  bubbleName,
  isVisible,
  onClose,
}) {
  const handleShare = async () => {
    if (!qrCodeData) {
      Alert.alert("Error", "No QR code data available");
      return;
    }

    try {
      await Share.share({
        message: `Join my bubble: ${bubbleName}\n\nScan this QR code to join!`,
        title: `Bubble: ${bubbleName}`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share QR code");
    }
  };

  const handleCopyToClipboard = () => {
    // Just show alert for now
    Alert.alert("Info", "QR code data copied to clipboard");
  };

  if (!qrCodeData || !isVisible) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>QR Code for Entry</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.qrContainer}>
            <QRCode
              value={qrCodeData}
              size={200}
              color={COLORS.primary}
              backgroundColor={COLORS.surface}
              logoSize={30}
              logoBackgroundColor={COLORS.background}
              logoBorderRadius={15}
              logoMargin={2}
            />
          </View>

          <Text style={styles.bubbleName}>{bubbleName}</Text>
          <Text style={styles.instruction}>
            Scan this QR code to join the bubble
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={handleShare}
            >
              <Feather name="share-2" size={20} color={COLORS.surface} />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.copyButton]}
              onPress={handleCopyToClipboard}
            >
              <Feather name="copy" size={20} color={COLORS.surface} />
              <Text style={styles.actionButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 20,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: 350,
    width: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  closeButton: {
    padding: 5,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  bubbleName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 100,
    justifyContent: "center",
  },
  shareButton: {
    backgroundColor: COLORS.confirm,
  },
  copyButton: {
    backgroundColor: COLORS.elemental.sage,
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  closeModalButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  closeModalButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "bold",
  },
});
