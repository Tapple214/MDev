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
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// Components

import GuestSelector from "../components/guest-selector";
import AIDescriptionGenerator from "../components/ai-description-generator";

// Custom hooks and utility functions
import { useAuth } from "../contexts/AuthContext";
import { createBubble } from "../utils/firestore";

import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "../utils/custom-styles";

export default function CreateBubble() {
  // Hooks
  const { user, userData } = useAuth();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [bubbleName, setBubbleName] = useState("");
  const [bubbleDescription, setBubbleDescription] = useState("");
  const [bubbleLocation, setBubbleLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [guestList, setGuestList] = useState("");
  const [needQR, setNeedQR] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [emailValidation, setEmailValidation] = useState({
    valid: [],
    invalid: [],
    notFound: [],
  });
  const [selectedIcon, setSelectedIcon] = useState("heart");
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(
    COLORS.elemental.orange
  );
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  // Customization Options
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

  // Tag Options
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

  // Function when submit button is clicked
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
        icon: selectedIcon,
        backgroundColor: selectedBackgroundColor,
        tags: selectedTags,
        hostName: userData?.name || user?.email || "Unknown User",
        hostUid: user?.uid || "",
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
            setSelectedIcon("heart");
            setSelectedBackgroundColor("#E89349");
            setSelectedTags([]);
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
        <View style={styles.descriptionContainer}>
          <TextInput
            value={bubbleDescription}
            onChangeText={setBubbleDescription}
            placeholder="Dresscode, notes, etc."
            style={[styles.input, styles.descriptionInput]}
            multiline
            numberOfLines={3}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => setShowAIGenerator(true)}
            disabled={isLoading}
          >
            <Feather name="zap" size={15} color={COLORS.surface} />
          </TouchableOpacity>
        </View>

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
          <View style={[styles.input, { marginRight: 10, flex: 1 }]}>
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
          <Text style={styles.inputTitle}>Need attendance checking?</Text>
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

      {/* AI Description Generator Modal */}
      <AIDescriptionGenerator
        bubbleName={bubbleName}
        selectedTags={selectedTags}
        bubbleLocation={bubbleLocation}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        guestList={guestList}
        onDescriptionGenerated={setBubbleDescription}
        isVisible={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
      />
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
  },
  pickerContainer: {
    flexDirection: "row",
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
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  descriptionInput: {
    flex: 1,
    marginRight: 10,
  },
  aiButton: {
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
});
