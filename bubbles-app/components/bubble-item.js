import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

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
  tags = [],
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
          <Text style={cardText}>By {bubbleHost}</Text>
          {tags && tags.length > 0 && (
            <View style={styles.tagContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tagItem}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Guest action buttons */}
      {userRole === "guest" && (
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={onDecline}
          >
            <Text style={styles.actionButtonText}>X</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={onAccept}
          >
            <Text style={styles.actionButtonText}>I'm coming!</Text>
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
    flexWrap: "wrap",
    gap: 5,
  },
  tagItem: {
    backgroundColor: "#606B38",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 3,
  },
  tagText: {
    fontSize: 10,
    color: "#FEFADF",
    fontWeight: "500",
  },
  bubbleCard: {
    backgroundColor: "#FEFADF",
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
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  button: {
    flex: 0,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: "#606B38",
  },
  declineButton: {
    backgroundColor: "#BD3526",
  },
  actionButtonText: {
    color: "#FEFADF",
    fontSize: 14,
    fontWeight: "bold",
    flex: 0,
  },
});
