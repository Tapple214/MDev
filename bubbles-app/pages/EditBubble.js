import React, { useState, useEffect } from "react";
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
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";

// Components
import NavBar from "../components/navbar";
import GuestSelector from "../components/guest-selector";

// Custom hooks and utility functions
import { useAuth } from "../contexts/AuthContext";
import { updateBubble, validateGuestEmails } from "../utils/firestore";

// TODO: create a date util file
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "../utils/colors";

export default function EditBubble() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, userData } = useAuth();

  // Get bubble data from route params
  const { bubbleData } = route.params;

  // Initialize state with existing bubble data
  const [isLoading, setIsLoading] = useState(false);
  const [bubbleName, setBubbleName] = useState(bubbleData?.name || "");
  const [bubbleDescription, setBubbleDescription] = useState(
    bubbleData?.description || ""
  );
  const [bubbleLocation, setBubbleLocation] = useState(
    bubbleData?.location || ""
  );
  const [selectedDate, setSelectedDate] = useState(
    bubbleData?.schedule ? new Date(bubbleData.schedule.toDate()) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState(
    bubbleData?.schedule ? new Date(bubbleData.schedule.toDate()) : new Date()
  );
  const [guestList, setGuestList] = useState(
    bubbleData?.guestList
      ? Array.isArray(bubbleData.guestList)
        ? bubbleData.guestList.join(", ")
        : bubbleData.guestList
      : ""
  );
  const [needQR, setNeedQR] = useState(bubbleData?.needQR || false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [emailValidation, setEmailValidation] = useState({
    valid: [],
    invalid: [],
    notFound: [],
  });
  const [selectedIcon, setSelectedIcon] = useState(bubbleData?.icon || "heart");
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(
    bubbleData?.backgroundColor || COLORS.elemental.orange
  );
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedTags, setSelectedTags] = useState(bubbleData?.tags || []);

  // Available options
  const iconOptions = [
    { name: "heart", icon: "heart" },
    { name: "star", icon: "star" },
    { name: "gift", icon: "gift" },
    { name: "map-pin", icon: "map-pin" },
  ];

  const colorOptions = [
    { name: "Orange", value: COLORS.elemental.orange },
    { name: "Sage", value: COLORS.elemental.sage },
    { name: "Beige", value: COLORS.elemental.beige },
    { name: "Rust", value: COLORS.elemental.rust },
  ];

  const tagOptions = [
    "casual",
    "formal",
    "outdoor",
    "indoor",
    "creative",
    "social",
    "cozy",
    "adventure",
  ];

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

  const onDateChange = (selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const onTimeChange = (selectedTime) => {
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

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else if (prev.length < 3) {
        return [...prev, tag];
      } else {
        Alert.alert("Limit Reached", "You can only select up to 3 tags");
        return prev;
      }
    });
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
    if (!selectedIcon || !selectedBackgroundColor) {
      Alert.alert(
        "Error",
        "Please select an icon and background color for your bubble"
      );
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

  const handleUpdateBubble = async () => {
    if (!validateForm()) return;

    if (!user) {
      Alert.alert("Error", "You must be logged in to update a bubble");
      return;
    }

    setIsLoading(true);

    try {
      const updatedBubbleData = {
        bubbleId: route.params.bubbleData.id,
        name: bubbleName.trim(),
        description: bubbleDescription.trim(),
        location: bubbleLocation.trim(),
        selectedDate: selectedDate,
        selectedTime: selectedTime,
        guestList: guestList.trim(),
        needQR,
        icon: selectedIcon,
        backgroundColor: selectedBackgroundColor,
        tags: selectedTags,
        hostName: userData?.name || user?.email || "Unknown User",
        hostUid: user?.uid || "",
      };

      await updateBubble(updatedBubbleData);

      Alert.alert("Success!", "Your bubble has been updated successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } catch (error) {
      console.error("Error updating bubble:", error);
      Alert.alert("Error", "Failed to update bubble. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.generalContainer}>
      <ScrollView>
        {/* Title; For bubble name, description, and tags */}
        <Text style={[styles.title, { textAlign: "center" }]}>
          Name it & Frame it!
        </Text>

        <Text style={styles.inputTitle}>What is your bubble's name?</Text>
        <TextInput
          value={bubbleName}
          onChangeText={setBubbleName}
          placeholder="Bubble name"
          style={styles.input}
          editable={!isLoading}
        />

        <Text style={styles.inputTitle}>Describe your bubble.</Text>
        <TextInput
          value={bubbleDescription}
          onChangeText={setBubbleDescription}
          placeholder="Dresscode, notes, etc."
          style={styles.input}
          multiline
          numberOfLines={3}
          editable={!isLoading}
        />

        <Text style={styles.inputTitle}>
          Choose tags for your bubble (up to 3)
        </Text>
        <View style={styles.tagContainer}>
          {tagOptions.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagOption,
                selectedTags.includes(tag) && styles.selectedTagOption,
              ]}
              onPress={() => handleTagToggle(tag)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedTags.includes(tag) && styles.selectedTagText,
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Title; For location, date, and time */}
        <Text style={[styles.title, { textAlign: "center", paddingTop: 15 }]}>
          When and Where is your Bubble?
        </Text>

        <Text style={styles.inputTitle}>Location</Text>
        <TextInput
          value={bubbleLocation}
          onChangeText={setBubbleLocation}
          placeholder="(Postal Code, Address, etc.)"
          style={styles.input}
          editable={!isLoading}
        />

        <Text style={styles.inputTitle}>Date and Time</Text>
        <View style={styles.pickerContainer}>
          <View style={[styles.input, { marginRight: 10 }]}>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              disabled={isLoading}
            >
              <Text style={styles.pickerValueText}>
                {formatDate(selectedDate)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.input}>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              disabled={isLoading}
            >
              <View style={styles.colorPreviewContainer}>
                <Text style={styles.pickerValueText}>
                  {formatTime(selectedTime)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title; For guest list */}
        <Text style={[styles.title, { textAlign: "center", paddingTop: 15 }]}>
          Who's Poppin' in?
        </Text>

        <View style={styles.switchContainer}>
          <Text style={styles.inputTitle}>Need QR Code for attendance?</Text>
          <Switch
            value={needQR}
            onValueChange={setNeedQR}
            trackColor={{ false: "#767577", true: COLORS.confirm }}
            thumbColor={needQR ? COLORS.background : "#f4f3f4"}
            disabled={isLoading}
          />
        </View>

        <Text style={styles.inputTitle}>
          Guest List (comma separated emails)
        </Text>
        <GuestSelector
          value={guestList}
          placeholder="Type or tap or the icon on the right"
          multiline
          numberOfLines={5}
          editable={!isLoading}
          guestList={guestList}
          setGuestList={setGuestList}
          emailValidation={emailValidation}
          setEmailValidation={setEmailValidation}
        />

        {/* Title; For customizing your bubble */}
        <Text style={[styles.title, { textAlign: "center", paddingTop: 5 }]}>
          Make it your own!
        </Text>

        <Text style={styles.inputTitle}>
          Choose your bubble icon and color!
        </Text>

        <View style={styles.pickerContainer}>
          <View style={[styles.input, { marginRight: 10 }]}>
            <TouchableOpacity
              onPress={() => setShowIconPicker(true)}
              disabled={isLoading}
            >
              <View style={styles.iconPreviewContainer}>
                <View
                  style={[
                    styles.iconPreview,
                    { backgroundColor: selectedBackgroundColor },
                  ]}
                >
                  <Feather name={selectedIcon} size={15} color="#EEDCAD" />
                </View>
                <Text style={styles.pickerValueText}>
                  {iconOptions.find((option) => option.icon === selectedIcon)
                    ?.name || "Heart"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.input}>
            <TouchableOpacity
              onPress={() => setShowColorPicker(true)}
              disabled={isLoading}
            >
              <View style={styles.colorPreviewContainer}>
                <View
                  style={[
                    styles.colorPreview,
                    { backgroundColor: selectedBackgroundColor },
                  ]}
                />
                <Text style={styles.pickerValueText}>
                  {colorOptions.find(
                    (option) => option.value === selectedBackgroundColor
                  )?.name || "Orange"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.createButton,
            isLoading && styles.createButtonDisabled,
          ]}
          onPress={handleUpdateBubble}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FEFADF" />
          ) : (
            <Text style={styles.createButtonText}>Update Bubble</Text>
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

      {/* Icon Picker Modal */}
      <Modal
        visible={showIconPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowIconPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.iconModalContent}>
            <View style={styles.modalContentWrapper}>
              <Text style={styles.modalTitle}>Select Icon</Text>
              <View style={styles.iconGrid}>
                {iconOptions.map((option) => (
                  <TouchableOpacity
                    key={option.icon}
                    style={[
                      styles.iconOption,
                      selectedIcon === option.icon && styles.selectedIconOption,
                    ]}
                    onPress={() => {
                      setSelectedIcon(option.icon);
                      setShowIconPicker(false);
                    }}
                  >
                    <View
                      style={[
                        styles.iconOptionBackground,
                        { backgroundColor: selectedBackgroundColor },
                      ]}
                    >
                      <Feather name={option.icon} size={24} color="#EEDCAD" />
                    </View>
                    <Text style={styles.iconOptionText}>{option.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowIconPicker(false)}
            >
              <Text style={styles.modalButtonTextCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.colorModalContent}>
            <View style={styles.modalContentWrapper}>
              <Text style={styles.modalTitle}>Select Background Color</Text>
              <View style={styles.colorGrid}>
                {colorOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.colorOption,
                      selectedBackgroundColor === option.value &&
                        styles.selectedColorOption,
                    ]}
                    onPress={() => {
                      setSelectedBackgroundColor(option.value);
                      setShowColorPicker(false);
                    }}
                  >
                    <View
                      style={[
                        styles.colorPreview,
                        { backgroundColor: option.value },
                      ]}
                    />
                    <Text style={styles.colorOptionText}>{option.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={styles.modalButtonTextCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <NavBar />
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
    marginBottom: 10,
    backgroundColor: COLORS.surface,
    flex: 1,
  },
  pickerContainer: {
    flexDirection: "row",
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
  pickerValueText: {
    color: COLORS.text.primary,
  },
});
