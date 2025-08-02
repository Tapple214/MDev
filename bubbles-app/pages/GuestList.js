import React from "react";
import { View, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

// Utility function/Hooks imports
import { COLORS } from "../utils/colors";

// Component imports
import GuestListDisplay from "../components/guest-list-display";

export default function GuestList() {
  // Hooks
  const route = useRoute();

  // Extract details from route params (From BubbleView.js)
  const { guestListDetail } = route.params;

  return (
    <View style={styles.generalContainer}>
      {guestListDetail.bubbleData && (
        <GuestListDisplay
          bubbleData={guestListDetail.bubbleData}
          userRole={guestListDetail.userRole}
        />
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
});
