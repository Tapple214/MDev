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

export default function BubbleItem({ cardTitle, cardText }) {
  return (
    <TouchableOpacity activeOpacity={0.7}>
      <View style={styles.bubbleCard}>
        <View style={styles.bubbleIcon}>
          <Feather name="heart" size={20} color="#EEDCAD" />
        </View>
        <View>
          <Text style={cardTitle}>Bubble Name</Text>
          <Text style={cardText}>By who</Text>
          <View style={styles.tagContainer}>
            {tags.map((tag) => (
              <Text>{tag.name}</Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tagContainer: { flexDirection: "row", gap: 5 },
  bubbleCard: {
    backgroundColor: "#FEFADF",
    borderRadius: 10,
    height: 120,
    paddingVertical: 15,
    paddingLeft: 30,
    marginBottom: 15,
  },
  bubbleIcon: {
    backgroundColor: "#E89349",
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 50,
    position: "absolute",
    left: -20,
    top: 15,
  },
});
