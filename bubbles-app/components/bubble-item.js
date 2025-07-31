import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const tags = [
  { id: 1, name: "tag 1" },
  { id: 2, name: "tag 2" },
];

export default function BubbleItem({
  cardTitle,
  cardText,
  bubbleName,
  bubbleHost,
  action,
  userRole,
  onAccept,
  onDecline,
  icon = "heart",
  backgroundColor = "#E89349",
  ...props
}) {
  return (
    <View style={styles.bubbleCardContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={action}
        style={styles.bubbleCard}
        {...props}
      >
        <View style={[styles.bubbleIcon, { backgroundColor }]}>
          <Feather name={icon} size={20} color="#EEDCAD" />
        </View>
        <View style={styles.bubbleContent}>
          <Text style={cardTitle}>{bubbleName}</Text>
          <Text style={cardText}>{bubbleHost}</Text>
          <View style={styles.tagContainer}>
            {tags.map((tag) => (
              <Text key={tag.id}>{tag.name}</Text>
            ))}
          </View>
        </View>
      </TouchableOpacity>

      {/* Guest action buttons */}
      {userRole === "guest" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={onAccept}
          >
            <Text style={styles.actionButtonText}>I'm coming!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={onDecline}
          >
            <Text style={styles.actionButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleCardContainer: {
    marginBottom: 15,
  },
  tagContainer: {
    flexDirection: "row",
    gap: 5,
  },
  bubbleCard: {
    backgroundColor: "#FEFADF",
    borderRadius: 10,
    height: 120,
    paddingVertical: 15,
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  declineButton: {
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
