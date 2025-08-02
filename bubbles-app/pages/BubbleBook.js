import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  RefreshControl,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// Component imports
import NavBar from "../components/navbar";

// Utility function/Hooks imports
import { COLORS } from "../utils/colors";
import { useAuth } from "../contexts/AuthContext";

const { width: screenWidth } = Dimensions.get("window");

export default function BubbleBook() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Fetch photos from Firestore
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const photosRef = collection(db, "bubbleBook");
      const q = query(photosRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedPhotos = [];
      querySnapshot.forEach((doc) => {
        fetchedPhotos.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setPhotos(fetchedPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      Alert.alert("Error", "Failed to load photos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPhotos();
    setRefreshing(false);
  };

  // Request camera and media library permissions
  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || libraryStatus !== "granted") {
      Alert.alert(
        "Permissions Required",
        "Camera and media library permissions are required to add photos to the BubbleBook."
      );
      return false;
    }
    return true;
  };

  // Add photo from camera
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await addPhotoToCollection(result.assets[0].uri, "Camera");
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  // Add photo from gallery
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await addPhotoToCollection(result.assets[0].uri, "Gallery");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  // Add photo to Firestore collection
  const addPhotoToCollection = async (imageUri, source) => {
    try {
      const photosRef = collection(db, "bubbleBook");
      const photoData = {
        imageUri: imageUri,
        source: source,
        addedBy: user.email,
        addedByName: user.displayName || user.email,
        createdAt: serverTimestamp(),
        description: "",
      };

      const docRef = await addDoc(photosRef, photoData);
      const newPhoto = {
        id: docRef.id,
        ...photoData,
      };

      setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);
      Alert.alert("Success", "Photo added to BubbleBook!");
    } catch (error) {
      console.error("Error adding photo:", error);
      Alert.alert("Error", "Failed to add photo. Please try again.");
    }
  };

  // Delete photo
  const deletePhoto = async (photoId) => {
    try {
      await deleteDoc(doc(db, "bubbleBook", photoId));
      setPhotos((prevPhotos) =>
        prevPhotos.filter((photo) => photo.id !== photoId)
      );
      setShowPhotoModal(false);
      setSelectedPhoto(null);
      Alert.alert("Success", "Photo deleted from BubbleBook!");
    } catch (error) {
      console.error("Error deleting photo:", error);
      Alert.alert("Error", "Failed to delete photo. Please try again.");
    }
  };

  // Show photo modal
  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  // Render photo grid
  const renderPhotoGrid = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading photos...</Text>
        </View>
      );
    }

    if (photos.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Feather name="image" size={60} color={COLORS.text.secondary} />
          <Text style={styles.emptyText}>No photos yet</Text>
          <Text style={styles.emptySubtext}>
            Add the first photo to start the album!
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.photoGrid}>
        {photos.map((photo, index) => (
          <TouchableOpacity
            key={photo.id}
            style={styles.photoContainer}
            onPress={() => openPhotoModal(photo)}
          >
            <Image source={{ uri: photo.imageUri }} style={styles.photo} />
            <View style={styles.photoOverlay}>
              <Text style={styles.photoAddedBy}>{photo.addedByName}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.generalContainer}>
      <ScrollView
        vertical
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.confirm]}
            tintColor={COLORS.confirm}
          />
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>BubbleBook</Text>
          <Text style={styles.subtitle}>Collective Photo Album</Text>
        </View>

        <View style={styles.addPhotoContainer}>
          <TouchableOpacity style={styles.addPhotoButton} onPress={takePhoto}>
            <Feather name="camera" size={24} color={COLORS.surface} />
            <Text style={styles.addPhotoText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
            <Feather name="image" size={24} color={COLORS.surface} />
            <Text style={styles.addPhotoText}>Choose Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.photosContainer}>{renderPhotoGrid()}</View>
      </ScrollView>

      {/* Photo Modal */}
      <Modal
        visible={showPhotoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Photo Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPhotoModal(false)}
              >
                <Feather name="x" size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>

            {selectedPhoto && (
              <>
                <Image
                  source={{ uri: selectedPhoto.imageUri }}
                  style={styles.modalPhoto}
                />
                <View style={styles.modalInfo}>
                  <Text style={styles.modalInfoText}>
                    Added by: {selectedPhoto.addedByName}
                  </Text>
                  <Text style={styles.modalInfoText}>
                    Source: {selectedPhoto.source}
                  </Text>
                  {selectedPhoto.createdAt && (
                    <Text style={styles.modalInfoText}>
                      Date:{" "}
                      {selectedPhoto.createdAt
                        .toDate?.()
                        ?.toLocaleDateString() || "Unknown"}
                    </Text>
                  )}
                </View>

                {selectedPhoto.addedBy === user.email && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      Alert.alert(
                        "Delete Photo",
                        "Are you sure you want to delete this photo?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => deletePhoto(selectedPhoto.id),
                          },
                        ]
                      );
                    }}
                  >
                    <Feather name="trash-2" size={20} color={COLORS.surface} />
                    <Text style={styles.deleteButtonText}>Delete Photo</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      <NavBar page="BubbleBook" />
    </View>
  );
}

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: COLORS.background,
    height: "100%",
    paddingTop: 15,
    paddingBottom: 100,
  },
  headerContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  addPhotoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  addPhotoButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 120,
    justifyContent: "center",
  },
  addPhotoText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "600",
  },
  photosContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.text.primary,
    fontWeight: "600",
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginTop: 5,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photoContainer: {
    width: (screenWidth - 45) / 2,
    height: (screenWidth - 45) / 2,
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
  },
  photoAddedBy: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 20,
    margin: 20,
    maxWidth: screenWidth - 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  closeButton: {
    padding: 5,
  },
  modalPhoto: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalInfo: {
    marginBottom: 15,
  },
  modalInfoText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: COLORS.reject,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  deleteButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "600",
  },
});
