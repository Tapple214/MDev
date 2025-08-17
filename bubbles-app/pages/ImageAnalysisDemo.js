import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import ImageAnalyzer from "../components/image-analyzer";
import { COLORS } from "../utils/custom-styles";

export default function ImageAnalysisDemo() {
  const navigation = useNavigation();
  const [generatedDescription, setGeneratedDescription] = useState("");

  const handleDescriptionGenerated = (description) => {
    setGeneratedDescription(description);
  };

  const handleUseDescription = () => {
    if (generatedDescription) {
      Alert.alert(
        "Use Description",
        "This description can be copied and used in your bubble creation or editing. The AI has analyzed your image and generated a unique description based on what it sees.",
        [
          {
            text: "Copy to Clipboard",
            onPress: () => {
              // In a real app, you'd copy to clipboard here
              Alert.alert("Copied!", "Description copied to clipboard");
            },
          },
          {
            text: "Go to Create Bubble",
            onPress: () => navigation.navigate("CreateBubble"),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>📸 AI Image Analysis</Text>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.subtitle}>
          Take a photo or select an image to generate an AI-powered description
        </Text>

        {/* Image Analyzer Component */}
        <View style={styles.analyzerContainer}>
          <ImageAnalyzer onDescriptionGenerated={handleDescriptionGenerated} />
        </View>

        {/* Generated Description Display */}
        {generatedDescription && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>
              ✨ AI Generated Description:
            </Text>
            <Text style={styles.descriptionText}>{generatedDescription}</Text>

            <TouchableOpacity
              style={styles.useDescriptionButton}
              onPress={handleUseDescription}
            >
              <Feather name="copy" size={20} color="#fff" />
              <Text style={styles.useDescriptionButtonText}>
                Use This Description
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <View style={styles.infoItem}>
            <Feather name="camera" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Take a photo or select from your gallery
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Feather name="zap" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              AI analyzes the image and generates a description
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Feather name="edit" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Use the generated description in your bubble
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text.primary,
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 44,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  analyzerContainer: {
    marginBottom: 30,
  },
  descriptionContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text.secondary,
    marginBottom: 20,
  },
  useDescriptionButton: {
    backgroundColor: COLORS.confirm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  useDescriptionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  infoContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: 15,
    textAlign: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginLeft: 15,
    flex: 1,
    lineHeight: 22,
  },
});
