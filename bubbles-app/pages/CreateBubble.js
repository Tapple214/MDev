import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/navbar";
import GuestSelector from "../components/guest-selector";
import { useAuth } from "../contexts/AuthContext";
import { createBubble, validateGuestEmails } from "../utils/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CreateBubble() {
  const { user, userData } = useAuth();
  const [bubbleName, setBubbleName] = useState("");
  const [bubbleDescription, setBubbleDescription] = useState("");
  const [bubbleLocation, setBubbleLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [guestList, setGuestList] = useState("");
  const [needQR, setNeedQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [emailValidation, setEmailValidation] = useState({
    valid: [],
    invalid: [],
    notFound: [],
  });
  const [isValidatingEmails, setIsValidatingEmails] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setSelectedTime(selectedTime);
    }
  };

  const handleDateConfirm = () => {
    setShowDatePicker(false);
  };

  const handleTimeConfirm = () => {
    setShowTimePicker(false);
  };

  // Validate emails when guest list changes
  const handleGuestListChange = async (text) => {
    setGuestList(text);

    if (text.trim()) {
      setIsValidatingEmails(true);
      try {
        const validation = await validateGuestEmails(text);
        setEmailValidation(validation);
      } catch (error) {
        console.error("Error validating emails:", error);
      } finally {
        setIsValidatingEmails(false);
      }
    } else {
      setEmailValidation({ valid: [], invalid: [], notFound: [] });
    }
  };

  const validateForm = () => {
    if (!bubbleName.trim()) {
      Alert.alert("Error", "Please enter a bubble name");
      return false;
    }
    if (!bubbleDescription.trim()) {
      Alert.alert("Error", "Please enter a bubble description");
      return false;
    }
    if (!bubbleLocation.trim()) {
      Alert.alert("Error", "Please enter a bubble location");
      return false;
    }
    if (guestList.trim() && emailValidation.invalid.length > 0) {
      Alert.alert("Error", "Please fix invalid email formats");
      return false;
    }
    if (guestList.trim() && emailValidation.notFound.length > 0) {
      Alert.alert(
        "Error",
        "Some emails are not registered users. Please check the guest list."
      );
      return false;
    }
    return true;
  };

  const handleCreateBubble = async () => {
    if (!validateForm()) return;

    if (!user) {
      Alert.alert("Error", "You must be logged in to create a bubble");
      return;
    }

    setIsLoading(true);

    try {
      const bubbleData = {
        name: bubbleName.trim(),
        description: bubbleDescription.trim(),
        location: bubbleLocation.trim(),
        selectedDate: selectedDate,
        selectedTime: selectedTime,
        guestList: guestList.trim(),
        needQR,
        hostName: userData?.name || user.email,
        hostUid: user.uid,
      };

      await createBubble(bubbleData);

      Alert.alert("Success!", "Your bubble has been created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setBubbleName("");
            setBubbleDescription("");
            setBubbleLocation("");
            setSelectedDate(new Date());
            setSelectedTime(new Date());
            setGuestList("");
            setNeedQR(false);
            setEmailValidation({ valid: [], invalid: [], notFound: [] });
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating bubble:", error);
      Alert.alert("Error", "Failed to create bubble. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailValidationStatus = () => {
    if (!guestList.trim()) return null;

    return (
      <View style={styles.validationContainer}>
        {isValidatingEmails && (
          <View style={styles.validationItem}>
            <ActivityIndicator size="small" color="#606B38" />
            <Text style={styles.validationText}>Validating emails...</Text>
          </View>
        )}

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
    );
  };

  return (
    <View style={styles.generalContainer}>
      <ScrollView>
        <Text style={styles.title}>Fill the deets to get your bubble set!</Text>

        <Text style={styles.inputTitle}>What is your bubble's name?</Text>
        <TextInput
          value={bubbleName}
          onChangeText={setBubbleName}
          placeholder="Enter bubble name"
          style={styles.input}
          editable={!isLoading}
        />

        <Text style={styles.inputTitle}>
          Describe your bubble. What is the dresscode, etc?
        </Text>
        <TextInput
          value={bubbleDescription}
          onChangeText={setBubbleDescription}
          placeholder="Enter bubble description"
          style={styles.input}
          multiline
          numberOfLines={3}
          editable={!isLoading}
        />

        <Text style={styles.inputTitle}>Where will your bubble be held?</Text>
        <TextInput
          value={bubbleLocation}
          onChangeText={setBubbleLocation}
          placeholder="Enter bubble location"
          style={styles.input}
          editable={!isLoading}
        />

        <Text style={styles.inputTitle}>When is your bubble?</Text>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerValueContainer}>
            <Text style={styles.pickerValueText}>
              {formatDate(selectedDate)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowDatePicker(true)}
            disabled={isLoading}
          >
            <Text style={styles.pickerButtonText}>📅</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.inputTitle}>What time is your bubble?</Text>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerValueContainer}>
            <Text style={styles.pickerValueText}>
              {formatTime(selectedTime)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowTimePicker(true)}
            disabled={isLoading}
          >
            <Text style={styles.pickerButtonText}>🕐</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.inputTitle}>
          Guest List (comma separated emails)
        </Text>
        <GuestSelector
          value={guestList}
          onChangeText={handleGuestListChange}
          placeholder="Enter guest emails or tap 👥 to select from users"
          style={styles.input}
          multiline
          numberOfLines={5}
          editable={!isLoading}
        />

        {renderEmailValidationStatus()}

        <View style={styles.switchContainer}>
          <Text style={styles.inputTitle}>Need QR Code for entry?</Text>
          <Switch
            value={needQR}
            onValueChange={setNeedQR}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={needQR ? "#f5dd4b" : "#f4f3f4"}
            disabled={isLoading}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.createButton,
            isLoading && styles.createButtonDisabled,
          ]}
          onPress={handleCreateBubble}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FEFADF" />
          ) : (
            <Text style={styles.createButtonText}>Create Bubble</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={onDateChange}
              minimumDate={new Date()}
              style={styles.dateTimePicker}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleDateConfirm}
              >
                <Text style={styles.modalButtonTextConfirm}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time</Text>
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display="spinner"
              onChange={onTimeChange}
              style={styles.dateTimePicker}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleTimeConfirm}
              >
                <Text style={styles.modalButtonTextConfirm}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: "#F8FAFC",
    height: "100%",
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 20,
    paddingBottom: 20,
    color: "#1F2937",
  },
  inputTitle: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
    color: "#1F2937",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pickerValueContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 12,
  },
  pickerValueText: {
    fontSize: 16,
    color: "#1F2937",
  },
  pickerButton: {
    padding: 16,
    backgroundColor: "#6366F1",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  validationContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  validationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  validationText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  validEmail: {
    fontSize: 14,
    color: "#10B981",
  },
  invalidEmail: {
    fontSize: 14,
    color: "#EF4444",
  },
  notFoundEmail: {
    fontSize: 14,
    color: "#F59E0B",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#6366F1",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1F2937",
  },
  dateTimePicker: {
    width: 200,
    height: 200,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  modalButtonConfirm: {
    backgroundColor: "#6366F1",
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
