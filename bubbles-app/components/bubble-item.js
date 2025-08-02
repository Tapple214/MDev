import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../utils/colors";

// Component imports
import GuestRespondBtns from "./guest-respond-btns";

export default function BubbleItem({
  cardTitle,
  cardText,
  bubbleName,
  bubbleHost,
  action,
  userRole,
  onAccept,
  onDecline,
  onRetract,
  icon = "heart",
  backgroundColor = "#E89349",
  tags = [],
  response = "pending",
  ...props
}) {
  const getTagIcon = (tag) => {
    switch (tag.toLowerCase()) {
      case "casual":
        return "smile";
      case "formal":
        return "briefcase";
      case "outdoor":
        return "sun";
      case "indoor":
        return "home";
      case "creative":
        return "palette";
      case "social":
        return "users";
      case "cozy":
        return "heart";
      case "adventure":
        return "map-pin";
      default:
        return "tag";
    }
  };

  return (
    <View style={styles.bubbleCardContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={action}
        style={styles.bubbleCard}
        {...props}
      >
        <View style={[styles.bubbleIcon, { backgroundColor }]}>
          <Feather name={icon} size={20} color={COLORS.background} />
        </View>
        <View style={styles.bubbleContent}>
          <Text style={cardTitle}>{bubbleName}</Text>
          <Text style={cardText}>By {bubbleHost}</Text>
        </View>

        {/* Tags with icons in top right corner */}
        {tags && tags.length > 0 && (
          <View style={styles.tagContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tagItem}>
                <Feather
                  name={getTagIcon(tag)}
                  size={12}
                  color={COLORS.surface}
                />
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      <GuestRespondBtns
        userRole={userRole}
        onDecline={onDecline}
        onAccept={onAccept}
        onRetract={onRetract}
        response={response}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleCardContainer: {
    marginBottom: 15,
  },
  tagContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 10,
    right: 10,
    gap: 4,
  },
  tagItem: {
    backgroundColor: COLORS.elemental.brown,
    padding: 6,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    minHeight: 100,
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 30,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bubbleContent: {
    flex: 1,
  },
  bubbleIcon: {
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 50,
    position: "absolute",
    left: -20,
    top: 15,
  },
});
