import { useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

// Utility function/Hooks imports
import { COLORS } from "../utils/custom-styles";
import { findUser } from "../utils/firestore";

export default function GuestList() {
  // Hooks
  const route = useRoute();

  // Extract details from route params (From BubbleView.js)
  const { guestListDetail } = route.params;

  // State variables
  const [guestListWithDetails, setGuestListWithDetails] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    loadGuestListWithDetails();
  }, [guestListDetail.bubbleData]);

  //   Get guest list with details using params from BubbleView.js
  const loadGuestListWithDetails = async () => {
    if (!guestListDetail.bubbleData?.guestList) {
      setGuestListWithDetails([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const guests = Array.isArray(guestListDetail.bubbleData.guestList)
        ? guestListDetail.bubbleData.guestList
        : guestListDetail.bubbleData.guestList
            .split(",")
            .map((email) => email.trim());

      const guestResponses = guestListDetail.bubbleData.guestResponses || {};
      const guestDetails = [];

      for (const guestEmail of guests) {
        const normalizedEmail = guestEmail.toLowerCase().trim();
        const response = guestResponses[normalizedEmail];

        // Get user details from database
        let userName = guestEmail; // Default to email if name not found
        try {
          const users = await findUser(guestEmail);
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
        return COLORS.text.primary;
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

  return (
    <View style={styles.generalContainer}>
      <Text style={styles.title}>Guest List</Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading guest list...</Text>
        </View>
      ) : guestListWithDetails.length > 0 ? (
        <ScrollView vertical>
          {guestListWithDetails.map((guest, index) => (
            <View key={index} style={styles.guestListItem}>
              {/* Guest name and email */}
              <View>
                <Text style={styles.cardTitle}>{guest.name}</Text>
                <Text style={styles.cardText}>{guest.email}</Text>
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

                {/* Attendance Status; Only show if bubble requires QR */}
                {guestListDetail.bubbleData?.needQR && (
                  <View style={[styles.statusItem, { marginLeft: 15 }]}>
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
                      Attended
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noGuestsText}>
          No guests invited to this bubble
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // General properties
  generalContainer: {
    backgroundColor: COLORS.background,
    height: "100%",
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 15,
    color: COLORS.primary,
  },
  loadingText: {
    textAlign: "center",
    color: COLORS.text.secondary,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Guest list item properties
  guestListItem: {
    backgroundColor: "#FEFADF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 5,
    color: COLORS.primary,
  },
  cardText: {
    fontSize: 14,
    paddingBottom: 10,
    color: COLORS.primary,
  },
  guestStatus: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  noGuestsText: {
    textAlign: "center",
    color: COLORS.text.secondary,
    fontSize: 14,
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
