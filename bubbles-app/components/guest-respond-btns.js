import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

// Utility function/Hooks imports
import { COLORS } from "../utils/colors";

export default function GuestRespondBtns({
  userRole,
  onDecline,
  onAccept,
  onRetract,
  response = "pending",
}) {
  // Hooks
  const navigation = useNavigation();
  const state = navigation.getState();
  const currentRoute = state.routes[state.index];

  // Selections based on the user's response to the bubble
  const getResponseColor = () => {
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

  const getResponseText = () => {
    switch (response) {
      case "accepted":
        return "Accepted";
      case "declined":
        return "Declined";
      case "confirmed":
        return "Confirmed";
      default:
        return "Pending";
    }
  };

  return (
    <View>
      {/* If user is a guest, then show the "I'm coming" or X buttons */}
      {userRole === "guest" && (
        <View
          style={[
            styles.buttons,
            currentRoute.name !== "BubbleView" && {
              position: "absolute",
              right: 10,
              bottom: 10,
            },
          ]}
        >
          {/* UI for whether user has or has not responded to the bubble */}
          {response === "pending" ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.declineButton]}
                onPress={onDecline}
              >
                <Text style={styles.actionButtonText}>X</Text>
              </TouchableOpacity>
              {currentRoute.name === "BubbleView" ? (
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={onAccept}
                >
                  <Feather name="check" size={15} color={COLORS.surface} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={onAccept}
                >
                  <Text style={styles.actionButtonText}>I'm coming!</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginTop: currentRoute.name === "BubbleView" ? 7 : 0,
              }}
            >
              <TouchableOpacity style={styles.button} onPress={onRetract}>
                <Text
                  style={{
                    color: COLORS.reject,
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  Retract
                </Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.responseStatus,
                  { borderColor: getResponseColor(), borderWidth: 3 },
                ]}
              >
                {currentRoute.name === "BubbleView" ? (
                  <Text style={{ color: getResponseColor() }}>
                    <Feather name="check" size={15} color={COLORS.accept} />
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.responseText,
                      { color: getResponseColor(), fontWeight: "bold" },
                    ]}
                  >
                    {getResponseText()}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: 8,
  },
  button: {
    flex: 0,
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: COLORS.confirm,
  },
  declineButton: {
    backgroundColor: COLORS.reject,
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: "bold",
    flex: 0,
  },
  responseStatus: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.7,
  },
  responseText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: "bold",
  },
});
