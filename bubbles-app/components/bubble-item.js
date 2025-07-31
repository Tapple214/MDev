import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
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
  ...props
}) {
  return (
    <View style={styles.bubbleCardContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={action}
        style={styles.bubbleCard}
        {...props}
      >
        <View style={styles.bubbleHeader}>
          <View style={styles.bubbleIcon}>
            <Feather name="message-circle" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.bubbleContent}>
            <Text style={cardTitle}>{bubbleName}</Text>
            <Text style={cardText}>Hosted by {bubbleHost}</Text>
          </View>
        </View>

        <View style={styles.tagContainer}>
          {tags.map((tag) => (
            <View key={tag.id} style={styles.tag}>
              <Text style={styles.tagText}>{tag.name}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>

      {/* Guest action buttons */}
      {userRole === "guest" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={onAccept}
          >
            <Feather name="check" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={onDecline}
          >
            <Feather name="x" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleCardContainer: {
    marginBottom: 16,
  },
  bubbleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bubbleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bubbleIcon: {
    backgroundColor: "#6366F1",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bubbleContent: {
    flex: 1,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  acceptButton: {
    backgroundColor: "#10B981",
  },
  declineButton: {
    backgroundColor: "#EF4444",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
