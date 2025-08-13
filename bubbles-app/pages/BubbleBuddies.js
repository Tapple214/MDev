import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

// Components

// Custom hooks and utility functions
import { useAuth } from "../contexts/AuthContext";
import { useNavBar } from "../contexts/NavBarContext";
import {
  getUser,
  validateGuestEmails,
  addBubbleBuddies,
} from "../utils/firestore";
import { COLORS } from "../utils/custom-styles";

export default function BubbleBuddies() {
  const { user } = useAuth();
  const { registerNavBarFunctions } = useNavBar();

  // States
  const [userData, setUserData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailValidation, setEmailValidation] = useState({
    valid: [],
    invalid: [],
    notFound: [],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const fetchedUserData = await getUser(user.uid);
        setUserData(fetchedUserData);
      }
    };
    fetchUserData();
  }, [user]);

  // Register NavBar functions when component mounts
  useEffect(() => {
    registerNavBarFunctions("BubbleBuddies", {
      onAddPerson: () => setShowAddModal(true),
    });
  }, []);

  const handleSearchQueryChange = async (text) => {
    setSearchQuery(text);

    if (text.trim()) {
      try {
        const validation = await validateGuestEmails(text);
        setEmailValidation(validation);
      } catch (error) {
        console.error("Error validating emails:", error);
        setEmailValidation({ valid: [], invalid: [], notFound: [] });
      }
    } else {
      setEmailValidation({ valid: [], invalid: [], notFound: [] });
    }
  };

  const handleAddBuddy = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    if (emailValidation.invalid.length > 0) {
      Alert.alert("Error", "Please fix invalid email formats");
      return;
    }

    if (emailValidation.notFound.length > 0) {
      Alert.alert("Error", "Some emails are not registered users");
      return;
    }

    if (emailValidation.valid.length === 0) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      const emailsToAdd = emailValidation.valid;

      await addBubbleBuddies(user.uid, emailsToAdd);

      Alert.alert(
        "Success",
        `${emailsToAdd.join(", ")} added to bubble buddies!`
      );
      setShowAddModal(false);
      setSearchQuery("");
      setEmailValidation({ valid: [], invalid: [], notFound: [] });
      setSearchResults([]);

      // Refresh user data
      const fetchedUserData = await getUser(user.uid);
      setUserData(fetchedUserData);
    } catch (error) {
      console.error("Error adding buddy:", error);
      Alert.alert("Error", "Failed to add buddy");
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setSearchQuery("");
    setEmailValidation({ valid: [], invalid: [], notFound: [] });
  };

  return (
    <View style={styles.generalContainer}>
      <Text style={styles.subTitle}>
        A list of your go-to invitees ready for your next bubble!
      </Text>

      <View style={styles.bubbleBuddiesContainer}>
        {userData?.bubbleBuddies?.length > 0 ? (
          userData.bubbleBuddies.map((buddy, index) => (
            <View key={index} style={styles.bubbleBuddyNameContainer}>
              <Feather name="user" size={24} color={COLORS.primary} />
              <Text>{buddy}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noBuddiesText}>No bubble buddies found</Text>
        )}
      </View>

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={resetModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a new bubble buddy</Text>

            <Text style={styles.inputTitle}>
              Type in email addresses of your buddies you'd like to add! (comma
              separated)
            </Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter email addresses (comma separated)"
              value={searchQuery}
              onChangeText={handleSearchQueryChange}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              multiline
              numberOfLines={3}
            />

            {/* Validation display */}
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

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={resetModal}>
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddBuddy}
              >
                <Text style={styles.addButtonText}>Add Buddy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // general properties
  generalContainer: {
    backgroundColor: COLORS.background,
    height: "100%",
    paddingVertical: 15,
  },

  // Text properties
  subTitle: {
    paddingHorizontal: 15,
    color: COLORS.text.primary,
  },
  noBuddiesText: {
    textAlign: "center",
    fontSize: 16,
    color: COLORS.text.primary,
    marginTop: 20,
  },

  // Bubble buddies list properties
  bubbleBuddiesContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  bubbleBuddyNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  // Input properties
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    color: COLORS.text.primary,
  },

  // Validation properties
  validationContainer: {
    marginBottom: 15,
    minHeight: 50,
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
    color: COLORS.text.primary,
    textAlign: "center",
  },

  // Modal button properties
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  modalButtonTextCancel: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  addButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "bold",
  },
});
