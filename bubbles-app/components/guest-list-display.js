import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../utils/colors";
import { findUser } from "../utils/firestore";

export default function GuestListDisplay({ bubbleData, userRole }) {
  const [guestListWithDetails, setGuestListWithDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGuestListWithDetails();
  }, [bubbleData]);

  const loadGuestListWithDetails = async () => {
    if (!bubbleData?.guestList) {
      setGuestListWithDetails([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const guests = Array.isArray(bubbleData.guestList)
        ? bubbleData.guestList
        : bubbleData.guestList.split(",").map((email) => email.trim());

      const guestResponses = bubbleData.guestResponses || {};
      const guestDetails = [];

      for (const guestEmail of guests) {
        const normalizedEmail = guestEmail.toLowerCase().trim();
        const response = guestResponses[normalizedEmail];

        // Get user details from database
        let userName = guestEmail; // Default to email if name not found
        try {
          const users = await findUser(guestEmail, "email");
          if (users.length > 0) {
            userName = users[0].name;
          }
        } catch (error) {
          console.log("Could not fetch user details for:", guestEmail);
        }

        guestDetails.push({
          email: guestEmail,
          name: userName,
          response: response?.response || "pending",
          attended: response?.attended || false,
          respondedAt: response?.respondedAt,
        });
      }

      setGuestListWithDetails(guestDetails);
    } catch (error) {
      console.error("Error loading guest list details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getResponseColor = (response) => {
    switch (response) {
      case "accepted":
        return COLORS.confirm;
      case "declined":
        return COLORS.reject;
      case "confirmed":
        return COLORS.confirm;
      default:
        return COLORS.text.secondary;
    }
  };

  const getResponseIcon = (response) => {
    switch (response) {
      case "accepted":
        return "check-circle";
      case "declined":
        return "x-circle";
      case "confirmed":
        return "check-circle";
      default:
        return "clock";
    }
  };

  const getAttendanceIcon = (attended) => {
    return attended ? "check-square" : "square";
  };

  const getAttendanceColor = (attended) => {
    return attended ? COLORS.confirm : COLORS.text.secondary;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading guest list...</Text>
      </View>
    );
  }

  if (!guestListWithDetails.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noGuestsText}>
          No guests invited to this bubble
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guest List</Text>
      <ScrollView style={styles.guestList}>
        {guestListWithDetails.map((guest, index) => (
          <View key={index} style={styles.guestItem}>
            <View style={styles.guestInfo}>
              <Text style={styles.guestName}>{guest.name}</Text>
              <Text style={styles.guestEmail}>{guest.email}</Text>
            </View>

            <View style={styles.guestStatus}>
              {/* Response Status */}
              <View style={styles.statusItem}>
                <Feather
                  name={getResponseIcon(guest.response)}
                  size={16}
                  color={getResponseColor(guest.response)}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getResponseColor(guest.response) },
                  ]}
                >
                  {guest.response.charAt(0).toUpperCase() +
                    guest.response.slice(1)}
                </Text>
              </View>

              {/* Attendance Status - Only show if bubble requires QR */}
              {bubbleData?.needQR && (
                <View style={styles.statusItem}>
                  <Feather
                    name={getAttendanceIcon(guest.attended)}
                    size={16}
                    color={getAttendanceColor(guest.attended)}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: getAttendanceColor(guest.attended) },
                    ]}
                  >
                    {guest.attended ? "Attended" : "Not Attended"}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text.primary,
    marginBottom: 15,
  },
  loadingText: {
    textAlign: "center",
    color: COLORS.text.secondary,
    fontSize: 14,
  },
  noGuestsText: {
    textAlign: "center",
    color: COLORS.text.secondary,
    fontSize: 14,
  },
  guestList: {
    maxHeight: 300,
  },
  guestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  guestInfo: {
    flex: 1,
  },
  guestName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  guestEmail: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  guestStatus: {
    alignItems: "flex-end",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
});
