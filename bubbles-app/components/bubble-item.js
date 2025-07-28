import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function BubbleItem() {
  return (
    <TouchableOpacity
    // onPress={action}
    // style={[styles.cell, { height, backgroundColor }]}
    activeOpacity={0.7}
    // underlayColor={highlightColor}
    // {...props}
    >
      <View style={styles.itemContainer}>
        {/* Restaurant header image */}
        <Image source={imgUri} style={styles.headerImage} resizeMode="cover" />
        {/* Delivery time badge */}
        <View style={styles.etaBadge}>
          <Text style={styles.etaText}>{eta} mins</Text>
        </View>
        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {rating}</Text>
        </View>
        {/* Restaurant name and tagline */}
        <View style={styles.cardInfo}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.tagline}>{tagline}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  etaBadge: {
    position: "absolute",
    right: 16,
    top: 160,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  etaText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
  },
  ratingBadge: {
    position: "absolute",
    left: 16,
    top: 160,
    backgroundColor: "#FFD700",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  ratingText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  cardInfo: {
    padding: 16,
  },
});
