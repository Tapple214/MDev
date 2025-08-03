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
import { COLORS } from "../utils/colors";
import { validateGuestEmails } from "../utils/firestore";
import { ActivityIndicator } from "react-native";

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
          <Text>👥</Text>
        </TouchableOpacity>
      </View>

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

      <Modal
        visible={showUserSelector}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUserSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Bubble Buddies</Text>

            {selectedUsers.length > 0 && (
              <View style={styles.selectedUsersContainer}>
                <Text style={styles.selectedUsersTitle}>
                  Selected ({selectedUsers.length}):
                </Text>
                <ScrollView horizontal style={styles.selectedUsersList}>
                  {selectedUsers.map((user) => (
                    <View key={user.id} style={styles.selectedUserChip}>
                      <Text style={styles.selectedUserChipText}>
                        {user.name}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {loading ? (
              <Text style={styles.loadingText}>Loading bubble buddies...</Text>
            ) : (
              <ScrollView>
                {users.map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    style={[
                      styles.userItem,
                      isUserSelected(user.id) && styles.selectedUserItem,
                    ]}
                    onPress={() => handleUserSelect(user)}
                  >
                    <Text
                      style={[
                        styles.userName,
                        isUserSelected(user.id) && styles.selectedUserName,
                      ]}
                    >
                      {user.name}
                    </Text>
                    <Text
                      style={[
                        styles.userEmail,
                        isUserSelected(user.id) && styles.selectedUserEmail,
                      ]}
                    >
                      {user.email}
                    </Text>
                  </TouchableOpacity>
                ))}
                {users.length === 0 && (
                  <Text style={styles.noUsersText}>
                    No bubble buddies available
                  </Text>
                )}
              </ScrollView>
            )}

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
                  Add{" "}
                  {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""}{" "}
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
    height: 50,
    justifyContent: "center",
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
    maxWidth: "90%",
    height: "40%",
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
  pickerValueText: {
    fontSize: 16,
    color: COLORS.text.primary,
  },

  selectedUsersContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  selectedUsersTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  selectedUsersList: {
    maxHeight: 40,
  },
  selectedUserChip: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  selectedUserChipText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: "bold",
  },
  userList: {
    maxHeight: 300,
    minHeight: 100,
  },
  userItem: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
    width: "100%",
  },
  selectedUserItem: {
    borderColor: COLORS.confirm,
    backgroundColor: "#E8F5E8",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  selectedUserName: {
    color: COLORS.confirm,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  selectedUserEmail: {
    color: COLORS.confirm,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: COLORS.text.secondary,
    padding: 20,
  },
  noUsersText: {
    textAlign: "center",
    fontSize: 16,
    color: COLORS.text.secondary,
    padding: 20,
  },
});

// TODO: fix modal
