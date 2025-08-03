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
  Platform,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import NavBar from "../components/navbar";
import { useAuth } from "../contexts/AuthContext";
import { updateBubble, validateGuestEmails } from "../utils/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "../utils/colors";

export default function EditBubble() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, userData } = useAuth();

  // Get bubble data from route params
  const { bubbleData } = route.params;

  // Initialize state with existing bubble data
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
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [emailValidation, setEmailValidation] = useState({
    valid: [],
    invalid: [],
    notFound: [],
  });
  const [isValidatingEmails, setIsValidatingEmails] = useState(false);

  // Icon and background color selection
  const [selectedIcon, setSelectedIcon] = useState(bubbleData?.icon || "heart");
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(
    bubbleData?.backgroundColor || COLORS.elemental.orange
  );
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Tag selection
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

  const handleTagToggle = (tag) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const handleGuestListChange = async (text) => {
    setGuestList(text);
    if (text.trim()) {
      setIsValidatingEmails(true);
      try {
        const emails = text
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email.length > 0);

        const validation = await validateGuestEmails(emails);
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

    if (selectedDate < new Date()) {
      Alert.alert("Error", "Please select a future date");
      return false;
    }

    return true;
  };

  const handleUpdateBubble = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const bubbleData = {
        bubbleId: route.params.bubbleData.id,
        name: bubbleName.trim(),
        description: bubbleDescription.trim(),
        location: bubbleLocation.trim(),
        selectedDate: selectedDate,
        selectedTime: selectedTime,
        guestList: guestList,
        needQR: needQR,
        icon: selectedIcon,
        backgroundColor: selectedBackgroundColor,
        tags: selectedTags,
        hostName: userData?.name || user?.email,
        hostUid: user?.uid,
      };

      await updateBubble(bubbleData);

      Alert.alert("Success", "Bubble updated successfully!", [
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

  const renderEmailValidationStatus = () => {
    if (!guestList.trim()) return null;

    return (
      <View style={styles.validationContainer}>
        {emailValidation.valid.length > 0 && (
          <Text style={styles.validEmail}>
            ✓ {emailValidation.valid.length} valid email(s)
          </Text>
        )}
        {emailValidation.invalid.length > 0 && (
          <Text style={styles.invalidEmail}>
            ✗ {emailValidation.invalid.length} invalid email(s)
          </Text>
        )}
        {emailValidation.notFound.length > 0 && (
          <Text style={styles.notFoundEmail}>
            ? {emailValidation.notFound.length} email(s) not found in database
          </Text>
        )}
        {isValidatingEmails && (
          <ActivityIndicator size="small" color={COLORS.primary} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Edit Bubble</Text>

        {/* Bubble Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bubble Name *</Text>
          <TextInput
            style={styles.input}
            value={bubbleName}
            onChangeText={setBubbleName}
            placeholder="Enter bubble name"
            placeholderTextColor={COLORS.text.secondary}
          />
        </View>

        {/* Bubble Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bubbleDescription}
            onChangeText={setBubbleDescription}
            placeholder="Describe your bubble"
            placeholderTextColor={COLORS.text.secondary}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Location */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            value={bubbleLocation}
            onChangeText={setBubbleLocation}
            placeholder="Enter location"
            placeholderTextColor={COLORS.text.secondary}
          />
        </View>

        {/* Date and Time */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Date *</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateTimeText}>
                {formatDate(selectedDate)}
              </Text>
              <Feather name="calendar" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.label}>Time *</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateTimeText}>
                {formatTime(selectedTime)}
              </Text>
              <Feather name="clock" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Icon and Color Selection */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Icon</Text>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowIconPicker(true)}
            >
              <View
                style={[
                  styles.iconPreview,
                  { backgroundColor: selectedBackgroundColor },
                ]}
              >
                <Feather name={selectedIcon} size={24} color="#EEDCAD" />
              </View>
              <Text style={styles.iconText}>{selectedIcon}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.label}>Color</Text>
            <TouchableOpacity
              style={styles.colorButton}
              onPress={() => setShowColorPicker(true)}
            >
              <View
                style={[
                  styles.colorPreview,
                  { backgroundColor: selectedBackgroundColor },
                ]}
              />
              <Text style={styles.colorText}>
                {colorOptions.find((c) => c.value === selectedBackgroundColor)
                  ?.name || "Orange"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagsContainer}>
            {tagOptions.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  selectedTags.includes(tag) && styles.selectedTag,
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
        </View>

        {/* Guest List */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Guest List</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={guestList}
            onChangeText={handleGuestListChange}
            placeholder="Enter guest emails separated by commas"
            placeholderTextColor={COLORS.text.secondary}
            multiline
            numberOfLines={3}
          />
          {renderEmailValidationStatus()}
        </View>

        {/* QR Code Toggle */}
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Require QR Code Entry</Text>
          <Switch
            value={needQR}
            onValueChange={setNeedQR}
            trackColor={{ false: COLORS.text.secondary, true: COLORS.primary }}
            thumbColor={needQR ? COLORS.surface : COLORS.text.secondary}
          />
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleUpdateBubble}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.surface} />
          ) : (
            <Text style={styles.buttonText}>Update Bubble</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          onConfirm={handleDateConfirm}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={onTimeChange}
          onConfirm={handleTimeConfirm}
        />
      )}

      {/* Icon Picker Modal */}
      <Modal
        visible={showIconPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowIconPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Icon</Text>
            <View style={styles.iconGrid}>
              {iconOptions.map((option) => (
                <TouchableOpacity
                  key={option.name}
                  style={[
                    styles.iconOption,
                    selectedIcon === option.icon && styles.selectedIcon,
                  ]}
                  onPress={() => {
                    setSelectedIcon(option.icon);
                    setShowIconPicker(false);
                  }}
                >
                  <View
                    style={[
                      styles.iconOptionPreview,
                      { backgroundColor: selectedBackgroundColor },
                    ]}
                  >
                    <Feather name={option.icon} size={24} color="#EEDCAD" />
                  </View>
                  <Text style={styles.iconOptionText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowIconPicker(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Color</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map((option) => (
                <TouchableOpacity
                  key={option.name}
                  style={[
                    styles.colorOption,
                    selectedBackgroundColor === option.value &&
                      styles.selectedColor,
                  ]}
                  onPress={() => {
                    setSelectedBackgroundColor(option.value);
                    setShowColorPicker(false);
                  }}
                >
                  <View
                    style={[
                      styles.colorOptionPreview,
                      { backgroundColor: option.value },
                    ]}
                  />
                  <Text style={styles.colorOptionText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <NavBar page="EditBubble" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.text.secondary,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
  },
  dateTimeButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.text.secondary,
  },
  dateTimeText: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  iconButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.text.secondary,
  },
  iconPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  iconText: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  colorButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.text.secondary,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  colorText: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.text.secondary,
  },
  selectedTag: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tagText: {
    fontSize: 14,
    color: COLORS.text.primary,
  },
  selectedTagText: {
    color: COLORS.surface,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: "600",
  },
  validationContainer: {
    marginTop: 10,
  },
  validEmail: {
    color: COLORS.confirm,
    fontSize: 14,
  },
  invalidEmail: {
    color: COLORS.reject,
    fontSize: 14,
  },
  notFoundEmail: {
    color: COLORS.text.secondary,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  iconOption: {
    alignItems: "center",
    margin: 10,
  },
  selectedIcon: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
  },
  iconOptionPreview: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  iconOptionText: {
    fontSize: 12,
    color: COLORS.text.primary,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  colorOption: {
    alignItems: "center",
    margin: 10,
  },
  selectedColor: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
  },
  colorOptionPreview: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  colorOptionText: {
    fontSize: 12,
    color: COLORS.text.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.text.secondary,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});
