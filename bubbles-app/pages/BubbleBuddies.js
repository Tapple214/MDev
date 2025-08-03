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
import {
  getUser,
  validateGuestEmails,
  addBubbleBuddies,
  searchUsersInDatabase,
  getBubbleBuddiesForSelection,
} from "../utils/firestore";

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
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectionMode, setSelectionMode] = useState("text"); // "text" or "emoji"

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const fetchedUserData = await getUser(user.uid);
        setUserData(fetchedUserData);
      }
    };
    fetchUserData();
  }, [user]);

  // Handle manual text input - check against ALL users in database
  const handleSearchQueryChange = async (text) => {
    setSearchQuery(text);
    setSelectionMode("text");

    if (text.trim()) {
      setIsValidatingEmails(true);
      try {
        // Check if input contains email format
        if (text.includes("@")) {
          // Email validation approach - check against ALL users
          const validation = await validateGuestEmails(text);
          setEmailValidation(validation);
          setSearchResults([]);
        } else {
          // Name search approach - search across ENTIRE database
          const results = await searchUsersInDatabase(text);
          setSearchResults(results);
          setEmailValidation({ valid: [], invalid: [], notFound: [] });
        }
      } catch (error) {
        console.error("Error validating emails:", error);
        setEmailValidation({ valid: [], invalid: [], notFound: [] });
        setSearchResults([]);
      } finally {
        setIsValidatingEmails(false);
      }
    } else {
      setEmailValidation({ valid: [], invalid: [], notFound: [] });
      setSearchResults([]);
    }
  };

  // Handle emoji/icon selection - ONLY show bubble buddies
  const handleEmojiSelection = async () => {
    setSelectionMode("emoji");
    setIsSearching(true);
    try {
      if (!user?.uid) {
        Alert.alert("Error", "User not authenticated");
        return;
      }
      // Only get user's bubble buddies
      const bubbleBuddies = await getBubbleBuddiesForSelection(user.uid);
      setSearchResults(bubbleBuddies);
      setEmailValidation({ valid: [], invalid: [], notFound: [] });
    } catch (error) {
      console.error("Error loading bubble buddies:", error);
      Alert.alert("Error", "Failed to load bubble buddies");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddBuddy = async () => {
    if (!searchQuery.trim() && searchResults.length === 0) {
      Alert.alert("Error", "Please enter an email address or select users");
      return;
    }

    try {
      let emailsToAdd = [];

      if (selectionMode === "text") {
        // Handle text input validation
        if (emailValidation.invalid.length > 0) {
          Alert.alert("Error", "Please fix invalid email formats");
          return;
        }

        if (emailValidation.notFound.length > 0) {
          Alert.alert(
            "Error",
            "Some emails are not registered users. Please check the email addresses."
          );
          return;
        }

        if (emailValidation.valid.length === 0 && searchResults.length === 0) {
          Alert.alert("Error", "Please enter a valid email address or name");
          return;
        }

        // Add valid emails and search results
        emailsToAdd = [
          ...emailValidation.valid,
          ...searchResults.map((user) => user.email),
        ];
      } else {
        // Handle emoji selection - only bubble buddies
        if (searchResults.length === 0) {
          Alert.alert("Error", "No bubble buddies found");
          return;
        }
        emailsToAdd = searchResults.map((user) => user.email);
      }

      if (!user?.uid) {
        Alert.alert("Error", "User not authenticated");
        return;
      }
      // Add the emails to bubble buddies
      await addBubbleBuddies(user.uid, emailsToAdd);

      const successMessage = `${emailsToAdd.join(
        ", "
      )} has been added to your bubble buddies!`;
      Alert.alert("Success", successMessage);
      setShowAddModal(false);
      setSearchQuery("");
      setEmailValidation({ valid: [], invalid: [], notFound: [] });
      setSearchResults([]);

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
    if (!searchQuery.trim() && searchResults.length === 0) return null;

    return (
      <View style={styles.validationContainer}>
        {isValidatingEmails && (
          <View style={styles.validationItem}>
            <ActivityIndicator size="small" color="#606B38" />
            <Text style={styles.validationText}>
              {selectionMode === "text"
                ? "Searching all users..."
                : "Loading bubble buddies..."}
            </Text>
          </View>
        )}

        {selectionMode === "text" && emailValidation.valid.length > 0 && (
          <View style={styles.validationItem}>
            <Text style={styles.validEmail}>
              ✓ Valid emails: {emailValidation.valid.join(", ")}
            </Text>
          </View>
        )}

        {selectionMode === "text" && emailValidation.invalid.length > 0 && (
          <View style={styles.validationItem}>
            <Text style={styles.invalidEmail}>
              ✗ Invalid format: {emailValidation.invalid.join(", ")}
            </Text>
          </View>
        )}

        {selectionMode === "text" && emailValidation.notFound.length > 0 && (
          <View style={styles.validationItem}>
            <Text style={styles.notFoundEmail}>
              ⚠ Not registered: {emailValidation.notFound.join(", ")}
            </Text>
          </View>
        )}

        {searchResults.length > 0 && (
          <View style={styles.validationItem}>
            <Text style={styles.validEmail}>
              ✓ Found {searchResults.length} user(s):{" "}
              {searchResults.map((u) => u.name).join(", ")}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0) return null;

    return (
      <View style={styles.searchResultsContainer}>
        <Text style={styles.searchResultsTitle}>
          {selectionMode === "emoji" ? "Your Bubble Buddies:" : "Found Users:"}
        </Text>
        <ScrollView style={styles.searchResultsList}>
          {searchResults.map((user) => (
            <View key={user.id} style={styles.searchResultItem}>
              <Text style={styles.searchResultName}>{user.name}</Text>
              <Text style={styles.searchResultEmail}>{user.email}</Text>
            </View>
          ))}
        </ScrollView>
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
              Type to search ALL users, or click 👥 for your bubble buddies only
            </Text>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Enter email addresses or names to search all users"
                value={searchQuery}
                onChangeText={handleSearchQueryChange}
                autoCapitalize="words"
                autoCorrect={false}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={styles.emojiButton}
                onPress={handleEmojiSelection}
              >
                <Text style={styles.emojiButtonText}>👥</Text>
              </TouchableOpacity>
            </View>

            {renderSearchValidationStatus()}
            {renderSearchResults()}

            {(emailValidation.valid.length > 0 || searchResults.length > 0) && (
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
                setSearchResults([]);
                setSelectionMode("text");
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
  emojiButton: {
    backgroundColor: "#606B38",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  emojiButtonText: {
    fontSize: 24,
    color: "#FEFADF",
  },
  addButton: {
    backgroundColor: "#606B38",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
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
    marginTop: 10,
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
  searchResultsContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#452A17",
  },
  searchResultsList: {
    maxHeight: 150, // Limit height for scrolling
  },
  searchResultItem: {
    backgroundColor: "#FEFADF",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#452A17",
  },
  searchResultEmail: {
    fontSize: 12,
    color: "#606B38",
    marginTop: 2,
  },
});
