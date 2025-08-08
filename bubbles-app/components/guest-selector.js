import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { getBubbleBuddiesForSelection } from "../utils/firestore";
import { COLORS } from "../utils/custom-styles";
import { validateGuestEmails } from "../utils/firestore";
import Feather from "react-native-vector-icons/Feather";

export default function GuestSelector({
  value,
  placeholder,
  style,
  multiline,
  numberOfLines,
  editable = true,
  guestList,
  setGuestList,
  emailValidation,
  setEmailValidation,
}) {
  const { user } = useAuth();
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
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

  // Validate emails when guest list changes
  const handleGuestListChange = async (text) => {
    setGuestList(text);

    if (text.trim()) {
      try {
        const validation = await validateGuestEmails(text);
        setEmailValidation(validation);
      } catch (error) {
        console.error("Error validating emails:", error);
      }
    } else {
      setEmailValidation({ valid: [], invalid: [], notFound: [] });
    }
  };

  const handleUserSelect = (selectedUser) => {
    const isSelected = selectedUsers.find(
      (user) => user.id === selectedUser.id
    );

    if (isSelected) {
      setSelectedUsers(
        selectedUsers.filter((user) => user.id !== selectedUser.id)
      );
    } else {
      setSelectedUsers([...selectedUsers, selectedUser]);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedUsers.length === 0) {
      setShowUserSelector(false);
      return;
    }

    const selectedEmails = selectedUsers.map((user) => user.email);
    const currentEmails = guestList
      ? guestList
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email)
      : [];

    const allEmails = [...new Set([...currentEmails, ...selectedEmails])];
    const emailString = allEmails.join(", ");

    setGuestList(emailString);
    setSelectedUsers([]);
    setShowUserSelector(false);
  };

  const isUserSelected = (userId) => {
    return selectedUsers.find((user) => user.id === userId);
  };

  return (
    <View>
      <View style={styles.pickerContainer}>
        <View style={styles.input}>
          <TextInput
            value={value}
            onChangeText={handleGuestListChange}
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
          <Feather name="users" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Validation properties */}
      <View style={styles.validationContainer}>
        {emailValidation.valid.length > 0 && (
          <View style={styles.validationItem}>
            <Text style={styles.validEmail}>
              ✓ Valid emails: {emailValidation.valid.join(", ")}
            </Text>
          </View>
        )}

        {emailValidation.invalid.length > 0 && (
          <View style={styles.validationItem}>
            <Text style={styles.invalidEmail}>
              ✗ Invalid format: {emailValidation.invalid.join(", ")}
            </Text>
          </View>
        )}

        {emailValidation.notFound.length > 0 && (
          <View style={styles.validationItem}>
            <Text style={styles.notFoundEmail}>
              ⚠ Not registered: {emailValidation.notFound.join(", ")}
            </Text>
          </View>
        )}
      </View>

      {/* User selector modal */}
      <Modal
        visible={showUserSelector}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUserSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select from BubbleBuddies</Text>

            <ScrollView style={styles.userListContainer}>
              {users.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.userItem,
                    isUserSelected(user.id) && styles.selectedUserItem,
                  ]}
                  onPress={() => handleUserSelect(user)}
                >
                  <Text style={[styles.userName]}>{user.name}</Text>
                  <Text style={[styles.userEmail]}>{user.email}</Text>
                </TouchableOpacity>
              ))}
              {users.length === 0 && (
                <Text style={styles.noUsersText}>
                  No bubble buddies available
                </Text>
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setSelectedUsers([]);
                  setShowUserSelector(false);
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleConfirmSelection}
              >
                <Text style={styles.modalButtonTextConfirm}>
                  Add
                  {selectedUsers.length > 0
                    ? `(${selectedUsers.length})`
                    : ""}{" "}
                  Users
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Input properties
  input: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: COLORS.surface,
    flex: 1,
  },

  // Picker properties
  pickerContainer: {
    flexDirection: "row",
  },
  pickerButton: {
    paddingHorizontal: 15,
    backgroundColor: COLORS.surface,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  pickerValueText: {
    fontSize: 16,
    color: COLORS.text.primary,
  },

  // Validation properties
  validationContainer: {
    height: 50,
    justifyContent: "center",
  },
  validationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
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

  // Modal properties
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
    alignItems: "stretch",
    width: "90%",
    height: "40%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: COLORS.primary,
    textAlign: "center",
  },

  // Modal button properties
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    minWidth: 100,
    flex: 1,
  },
  modalButtonConfirm: {
    backgroundColor: COLORS.primary,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.surface,
  },

  // User list properties
  userListContainer: {
    flex: 1,
    marginVertical: 10,
  },
  userItem: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },

  // Selected user UI properties
  selectedUserItem: {
    borderColor: COLORS.primary,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 2,
  },

  // No users text properties
  noUsersText: {
    textAlign: "center",
    fontSize: 16,
    color: COLORS.text.secondary,
    padding: 20,
  },
});
