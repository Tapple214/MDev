import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import NavBar from "../components/navbar";
import { useAuth } from "../contexts/AuthContext";
import { getUser, findUser, validateGuestEmails } from "../utils/firestore";

export default function BubbleBuddies() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailValidation, setEmailValidation] = useState({
    valid: [],
    invalid: [],
    notFound: [],
  });
  const [isValidatingEmails, setIsValidatingEmails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const fetchedUserData = await getUser(user.uid);
        setUserData(fetchedUserData);
      }
    };
    fetchUserData();
  }, [user]);

  // Validate emails or search by name when query changes
  const handleSearchQueryChange = async (text) => {
    setSearchQuery(text);

    if (text.trim()) {
      setIsValidatingEmails(true);
      try {
        // Check if it's an email search
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailSearch =
          text.includes("@") || emailRegex.test(text.trim());

        if (isEmailSearch) {
          // Email validation approach
          const validation = await validateGuestEmails(text);
          setEmailValidation(validation);
        } else {
          // Name search approach
          const results = await findUser(text.trim(), "name");
          if (results.length > 0) {
            setEmailValidation({
              valid: results.map((user) => user.email),
              invalid: [],
              notFound: [],
            });
          } else {
            setEmailValidation({
              valid: [],
              invalid: [],
              notFound: [text.trim()],
            });
          }
        }
      } catch (error) {
        console.error("Error searching:", error);
        setEmailValidation({ valid: [], invalid: [], notFound: [] });
      } finally {
        setIsValidatingEmails(false);
      }
    } else {
      setEmailValidation({ valid: [], invalid: [], notFound: [] });
    }
  };

  const handleAddBuddy = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a name or email address");
      return;
    }

    const isEmailSearch = searchQuery.includes("@");

    if (isEmailSearch && emailValidation.invalid.length > 0) {
      Alert.alert("Error", "Please fix invalid email formats");
      return;
    }

    if (emailValidation.notFound.length > 0) {
      const message = isEmailSearch
        ? "Some emails are not registered users. Please check the email addresses."
        : "No users found with that name. Please try a different search.";
      Alert.alert("Error", message);
      return;
    }

    if (emailValidation.valid.length === 0) {
      Alert.alert("Error", "Please enter a valid name or email address");
      return;
    }

    try {
      // Add the valid users to bubble buddies
      // This would require updating the user's bubbleBuddies array in Firestore
      const successMessage = isEmailSearch
        ? `${emailValidation.valid.join(
            ", "
          )} has been added to your bubble buddies!`
        : `${emailValidation.valid.join(
            ", "
          )} has been added to your bubble buddies!`;

      Alert.alert("Success", successMessage);
      setShowAddModal(false);
      setSearchQuery("");
      setEmailValidation({ valid: [], invalid: [], notFound: [] });

      // Refresh user data
      if (user && user.uid) {
        const fetchedUserData = await getUser(user.uid);
        setUserData(fetchedUserData);
      }
    } catch (error) {
      console.error("Error adding buddy:", error);
      Alert.alert("Error", "Failed to add buddy");
    }
  };

  const renderSearchValidationStatus = () => {
    if (!searchQuery.trim()) return null;

    const isEmailSearch = searchQuery.includes("@");

    return (
      <View style={styles.validationContainer}>
        {isValidatingEmails && (
          <View style={styles.validationItem}>
            <ActivityIndicator size="small" color="#606B38" />
            <Text style={styles.validationText}>
              {isEmailSearch ? "Validating emails..." : "Searching users..."}
            </Text>
          </View>
        )}

        {emailValidation.valid.length > 0 && (
          <View style={styles.validationItem}>
            <Text style={styles.validEmail}>
              {isEmailSearch
                ? `✓ Valid emails: ${emailValidation.valid.join(", ")}`
                : `✓ Found users: ${emailValidation.valid.join(", ")}`}
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
              {isEmailSearch
                ? `⚠ Not registered: ${emailValidation.notFound.join(", ")}`
                : `⚠ No users found: ${emailValidation.notFound.join(", ")}`}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.generalContainer}>
      <Text style={styles.subTitle}>
        A list of your go-to invitees ready for your next bubble!{" "}
      </Text>

      <View style={styles.bubbleBuddiesContainer}>
        {userData?.bubbleBuddies && userData.bubbleBuddies.length > 0 ? (
          userData.bubbleBuddies.map((buddy, index) => (
            <View key={index} style={styles.bubbleBuddyNameContainer}>
              <Text>{buddy}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noBuddiesText}>No bubble buddies found</Text>
        )}
      </View>

      {/* Add Buddy Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Bubble Buddy</Text>

            <Text style={styles.modalSubtitle}>
              Search by name or enter email addresses (comma separated)
            </Text>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Enter name or email addresses"
                value={searchQuery}
                onChangeText={handleSearchQueryChange}
                autoCapitalize="words"
                autoCorrect={false}
                multiline
                numberOfLines={3}
              />
            </View>

            {renderSearchValidationStatus()}

            {emailValidation.valid.length > 0 && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddBuddy}
              >
                <Text style={styles.addButtonText}>Add to Bubble Buddies</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowAddModal(false);
                setSearchQuery("");
                setEmailValidation({ valid: [], invalid: [], notFound: [] });
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <NavBar page="BubbleBuddies" onAddPerson={() => setShowAddModal(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: "#EEDCAD",
    height: "100%",
    paddingVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  subTitle: { paddingHorizontal: 15 },
  input: {
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FEFADF",
  },
  bubbleBuddiesContainer: { paddingVertical: 15, paddingHorizontal: 15 },
  bubbleBuddyNameContainer: {
    backgroundColor: "#FEFADF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  noBuddiesText: {
    textAlign: "center",
    fontSize: 16,
    color: "#452A17",
    marginTop: 20,
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
    marginBottom: 10,
    color: "#452A17",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#452A17",
    marginBottom: 20,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FEFADF",
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  addButton: {
    backgroundColor: "#606B38",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FEFADF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FEFADF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#452A17",
  },
  cancelButtonText: {
    color: "#452A17",
    fontSize: 16,
    fontWeight: "bold",
  },
  validationContainer: {
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
    color: "#606B38",
  },
  validEmail: {
    fontSize: 14,
    color: "#4CAF50",
  },
  invalidEmail: {
    fontSize: 14,
    color: "#F44336",
  },
  notFoundEmail: {
    fontSize: 14,
    color: "#FF9800",
  },
});
