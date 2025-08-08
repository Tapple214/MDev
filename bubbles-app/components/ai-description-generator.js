import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../utils/custom-styles";
import { generateEventDescription } from "../utils/ai-service";

export default function AIDescriptionGenerator({
  bubbleName,
  selectedTags,
  bubbleLocation,
  selectedDate,
  selectedTime,
  guestList,
  onDescriptionGenerated,
  isVisible,
  onClose,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

  // AI API call using the AI service
  const generateDescription = async () => {
    setIsGenerating(true);

    try {
      // Build context for AI
      const eventData = {
        eventName: bubbleName,
        tags: selectedTags,
        location: bubbleLocation,
        date: selectedDate,
        time: selectedTime,
        guestCount: guestList ? guestList.split(",").length : 0,
      };

      // Call the AI service
      const description = await generateEventDescription(eventData);

      setGeneratedDescription(description);
    } catch (error) {
      console.error("Error generating description:", error);
      Alert.alert("Error", "Failed to generate description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseDescription = () => {
    if (generatedDescription) {
      onDescriptionGenerated(generatedDescription);
      onClose();
    }
  };

  const handleRegenerate = () => {
    setGeneratedDescription("");
    generateDescription();
  };

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
            <Text style={styles.modalTitle}>AI Description Generator</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Generate an engaging description for your bubble using AI. The AI
            will analyze your event details and create a compelling description.
          </Text>

          {!generatedDescription && !isGenerating && (
            <TouchableOpacity
              style={styles.generateButton}
              onPress={generateDescription}
            >
              <Feather name="zap" size={20} color={COLORS.surface} />
              <Text style={styles.generateButtonText}>
                Generate Description
              </Text>
            </TouchableOpacity>
          )}

          {isGenerating && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Generating description...</Text>
            </View>
          )}

          {generatedDescription && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Generated Description:</Text>
              <View style={styles.descriptionBox}>
                <Text style={styles.generatedText}>{generatedDescription}</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.useButton}
                  onPress={handleUseDescription}
                >
                  <Feather name="check" size={20} color={COLORS.surface} />
                  <Text style={styles.useButtonText}>Use This Description</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.regenerateButton}
                  onPress={handleRegenerate}
                >
                  <Feather name="refresh-cw" size={20} color={COLORS.primary} />
                  <Text style={styles.regenerateButtonText}>Regenerate</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    borderRadius: 15,
    padding: 20,
    margin: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  closeButton: {
    padding: 5,
  },
  description: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  generateButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  resultContainer: {
    marginTop: 10,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: 10,
  },
  descriptionBox: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.elemental.beige,
  },
  generatedText: {
    fontSize: 14,
    color: COLORS.text.primary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  useButton: {
    backgroundColor: COLORS.confirm,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
    justifyContent: "center",
  },
  useButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  regenerateButton: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  regenerateButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
