import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  analyzeImageAndGenerateDescription,
  pickImage,
  captureImageWithCamera,
} from "../utils/ai-service";

const ImageAnalyzer = ({ onDescriptionGenerated }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCameraCapture = async () => {
    try {
      const imageUri = await captureImageWithCamera();
      if (imageUri) {
        setSelectedImage(imageUri);
        setDescription(""); // Clear previous description
      }
    } catch (error) {
      Alert.alert("Camera Error", "Failed to capture image. Please try again.");
    }
  };

  const handleImagePick = async (source) => {
    try {
      const imageUri = await pickImage(source);
      if (imageUri) {
        setSelectedImage(imageUri);
        setDescription(""); // Clear previous description
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please capture or select an image first.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const generatedDescription = await analyzeImageAndGenerateDescription(
        selectedImage
      );
      setDescription(generatedDescription);

      // Call the callback if provided
      if (onDescriptionGenerated) {
        onDescriptionGenerated(generatedDescription);
      }
    } catch (error) {
      Alert.alert(
        "Analysis Failed",
        "Failed to analyze image. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAll = () => {
    setSelectedImage(null);
    setDescription("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Camera Image Analyzer</Text>

      {/* Primary Camera Button */}
      <View style={styles.cameraContainer}>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={handleCameraCapture}
        >
          <Text style={styles.cameraButtonText}>📷 Take Photo & Analyze</Text>
        </TouchableOpacity>
      </View>

      {/* Secondary Options */}
      <View style={styles.secondaryOptions}>
        <Text style={styles.secondaryTitle}>Or choose from:</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleImagePick("gallery")}
          >
            <Text style={styles.secondaryButtonText}>📁 Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleImagePick("camera")}
          >
            <Text style={styles.secondaryButtonText}>📱 Camera</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Selected Image Display */}
      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={analyzeImage}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.analyzeButtonText}>🔍 Analyze Image</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Generated Description */}
      {description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>AI Generated Description:</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      )}

      {/* Clear Button */}
      {(selectedImage || description) && (
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  cameraContainer: {
    marginBottom: 25,
  },
  cameraButton: {
    backgroundColor: "#FF6B35",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cameraButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryOptions: {
    marginBottom: 20,
  },
  secondaryTitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#666",
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  secondaryButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 225,
    borderRadius: 10,
    marginBottom: 15,
  },
  analyzeButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  analyzeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  descriptionContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  clearButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ImageAnalyzer;
