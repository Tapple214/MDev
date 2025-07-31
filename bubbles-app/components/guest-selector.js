import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { getAllUsersForSelection } from "../utils/firestore";

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
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showUserSelector) {
      loadUsers();
    }
  }, [showUserSelector]);

  const loadUsers = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const allUsers = await getAllUsersForSelection(user.uid);
      setUsers(allUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      Alert.alert("Error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (selectedUser) => {
    const isSelected = selectedUsers.find(
      (user) => user.id === selectedUser.id
    );

    if (isSelected) {
      // Remove user if already selected
      setSelectedUsers(
        selectedUsers.filter((user) => user.id !== selectedUser.id)
      );
    } else {
      // Add user if not selected
      setSelectedUsers([...selectedUsers, selectedUser]);
    }
  };

  const handleConfirmSelection = () => {
    const selectedEmails = selectedUsers.map((user) => user.email);
    const currentEmails = value
      ? value
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email)
      : [];

    // Combine existing emails with selected users
    const allEmails = [...new Set([...currentEmails, ...selectedEmails])];
    const emailString = allEmails.join(", ");

    onChangeText(emailString);
    setSelectedUsers([]);
    setShowUserSelector(false);
  };

  const isUserSelected = (userId) => {
    return selectedUsers.find((user) => user.id === userId);
  };

  return (
    <View>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerValueContainer}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            style={styles.pickerValueText}
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
          <Text style={styles.pickerButtonText}>👥</Text>
        </TouchableOpacity>
      </View>

      {/* User Selection Modal */}
      <Modal
        visible={showUserSelector}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUserSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Guests</Text>

            {loading ? (
              <Text style={styles.loadingText}>Loading users...</Text>
            ) : (
              <ScrollView style={styles.userList}>
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
                <Text style={styles.modalButtonTextConfirm}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  pickerValueContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FEFADF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerValueText: {
    fontSize: 16,
    color: "#333",
  },
  pickerButton: {
    padding: 10,
    backgroundColor: "#FEFADF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerButtonText: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#EEDCAD",
    borderRadius: 10,
    padding: 20,
    margin: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#452A17",
    textAlign: "center",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#452A17",
    padding: 20,
  },
  userList: {
    maxHeight: 400,
  },
  userItem: {
    backgroundColor: "#FEFADF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedUserItem: {
    borderColor: "#606B38",
    backgroundColor: "#E8F5E8",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#452A17",
  },
  selectedUserName: {
    color: "#606B38",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  selectedUserEmail: {
    color: "#606B38",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#FEFADF",
    alignItems: "center",
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
});
