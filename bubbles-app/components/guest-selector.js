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
import {
  getBubbleBuddiesForSelection,
  searchUsersInDatabase,
} from "../utils/firestore";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearchQueryChange = async (text) => {
    setSearchQuery(text);

    if (text.trim()) {
      setIsSearching(true);
      try {
        const results = await searchUsersInDatabase(text);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
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
    const currentEmails = value
      ? value
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email)
      : [];

    const allEmails = [...new Set([...currentEmails, ...selectedEmails])];
    const emailString = allEmails.join(", ");

    onChangeText(emailString);
    setSelectedUsers([]);
    setShowUserSelector(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const isUserSelected = (userId) => {
    return selectedUsers.find((user) => user.id === userId);
  };

  const getDisplayUsers = () => {
    if (searchResults.length > 0) {
      return searchResults;
    }
    return users;
  };

  return (
    <View>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerValueContainer}>
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
          <Text style={styles.pickerButtonText}>👥</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showUserSelector}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUserSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Users</Text>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChangeText={handleSearchQueryChange}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

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
              <Text style={styles.loadingText}>Loading users...</Text>
            ) : isSearching ? (
              <Text style={styles.loadingText}>Searching users...</Text>
            ) : (
              <ScrollView style={styles.userList}>
                {getDisplayUsers().map((user) => (
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
                {getDisplayUsers().length === 0 && (
                  <Text style={styles.noUsersText}>No users available</Text>
                )}
              </ScrollView>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setSelectedUsers([]);
                  setShowUserSelector(false);
                  setSearchQuery("");
                  setSearchResults([]);
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
  selectedUsersContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#FEFADF",
    borderRadius: 8,
  },
  selectedUsersTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#452A17",
    marginBottom: 8,
  },
  selectedUsersList: {
    maxHeight: 40,
  },
  selectedUserChip: {
    backgroundColor: "#606B38",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  selectedUserChipText: {
    color: "#FEFADF",
    fontSize: 12,
    fontWeight: "bold",
  },
  searchContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#FEFADF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchInput: {
    fontSize: 16,
    color: "#333",
  },
  noUsersText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    padding: 20,
  },
});
