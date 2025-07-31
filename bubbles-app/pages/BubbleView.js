import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import NavBar from "../components/navbar";
import { Feather } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

export default function BubbleView() {
  const route = useRoute();
  const { bubbleDetails } = route.params;

  return (
    <View style={styles.generalContainer}>
      <ScrollView vertical style={styles.bubbleViewScrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Bubble Details</Text>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Feather name="bookmark" size={24} color="#6366F1" />
          </TouchableOpacity>
        </View>

        <View style={styles.bubbleCard}>
          <Text style={styles.bubbleName}>{bubbleDetails.bubbleName}</Text>
          <Text style={styles.bubbleHost}>Hosted by {bubbleDetails.host}</Text>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <View style={styles.iconContainer}>
              <Feather name="check-square" size={24} color="#10B981" />
            </View>
            <Text style={styles.detailNumber}>3</Text>
            <Text style={styles.detailLabel}>Confirmed</Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.iconContainer}>
              <Feather name="user" size={24} color="#6366F1" />
            </View>
            <Text style={styles.detailNumber}>4</Text>
            <Text style={styles.detailLabel}>Total Guests</Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.iconContainer}>
              <Feather name="map-pin" size={24} color="#EF4444" />
            </View>
            <Text style={styles.detailNumber}>5</Text>
            <Text style={styles.detailLabel}>Location</Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.iconContainer}>
              <Feather name="clock" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.detailNumber}>6</Text>
            <Text style={styles.detailLabel}>Time</Text>
          </View>
        </View>

        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="camera" size={24} color="#6366F1" />
            <Text style={styles.actionButtonText}>Add to BubbleBook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Feather name="qr-code" size={24} color="#6366F1" />
            <Text style={styles.actionButtonText}>Show/Scan QR Code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: "#F8FAFC",
    height: "100%",
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  bubbleViewScrollView: {
    flex: 1,
  },
  bubbleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bubbleName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  bubbleHost: {
    fontSize: 16,
    color: "#6B7280",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "47%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  detailNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 12,
  },
});
