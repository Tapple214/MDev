import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import {
  getBubbleBuddiesForSelection,
  searchUsersInDatabase,
} from "../utils/firestore";
import { COLORS } from "../utils/colors";

export default function GuestSelector({
  value,
  onChangeText,
  placeholder,
  style,
  multiline,
  numberOfLines,
  editable = true,
}) {
  const { user } = useAuth();
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showUserSelector) {
      loadBubbleBuddies();
    }
  }, [showUserSelector]);

  const loadBubbleBuddies = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const bubbleBuddies = await getBubbleBuddiesForSelection(user.uid);
      setUsers(bubbleBuddies);
    } catch (error) {
      console.error("Error loading bubble buddies:", error);
      Alert.alert("Error", "Failed to load bubble buddies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.pickerContainer}>
        <View style={styles.input}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            style={[styles.pickerValueText, style]}
            multiline={multiline}
            numberOfLines={numberOfLines}
            editable={editable}
          />
        </View>

        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowUserSelector(true)}
          disabled={!editable}
        >
          <Text>👥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: COLORS.background,
    height: "100%",
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 15,
    color: COLORS.text.primary,
  },
  inputTitle: {
    paddingBottom: 10,
    color: COLORS.text.primary,
  },
  input: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: COLORS.surface,
    flex: 1,
  },
  pickerContainer: {
    flexDirection: "row",
  },
  pickerButton: {
    paddingHorizontal: 15,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  validationContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  validationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  validationText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.elemental.sage,
  },
  validEmail: {
    fontSize: 14,
    color: COLORS.status.success,
  },
  invalidEmail: {
    fontSize: 14,
    color: COLORS.status.error,
  },
  notFoundEmail: {
    fontSize: 14,
    color: COLORS.status.warning,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    marginVertical: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  createButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  createButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconModalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: "center",
    width: 320,
    maxWidth: "90%",
    minHeight: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  colorModalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: "center",
    width: 300,
    maxWidth: "90%",
    minHeight: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContentWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#452A17",
  },
  dateTimePicker: {
    width: 200,
    height: 200,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#FEFADF",
    alignItems: "center",
    minWidth: 100,
    marginTop: 10,
  },
  modalButtonConfirm: {
    backgroundColor: "#606B38",
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#452A17",
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FEFADF",
  },
  iconPreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconPreview: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  colorPreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
    width: "100%",
  },
  iconOption: {
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FEFADF",
    minWidth: 80,
  },
  selectedIconOption: {
    backgroundColor: "#606B38",
  },
  iconOptionBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  iconOptionText: {
    fontSize: 12,
    textAlign: "center",
    color: "#452A17",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
    width: "100%",
  },
  colorOption: {
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FEFADF",
    minWidth: 80,
  },
  selectedColorOption: {
    backgroundColor: "#606B38",
  },
  colorOptionText: {
    fontSize: 12,
    textAlign: "center",
    color: "#452A17",
    marginTop: 5,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tagOption: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    marginRight: 8,
    minWidth: 80,
    alignItems: "center",
  },
  selectedTagOption: {
    backgroundColor: COLORS.confirm,
  },
  selectedTagText: {
    color: COLORS.surface,
  },
});
