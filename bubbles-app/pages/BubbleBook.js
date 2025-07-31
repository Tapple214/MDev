import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/navbar";
import { Feather } from "@expo/vector-icons";

export default function BubbleBook() {
  return (
    <SafeAreaView style={styles.generalContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>BubbleBook</Text>
        <Text style={styles.subtitle}>
          Your collection of memorable bubbles
        </Text>
      </View>

      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Feather name="book" size={48} color="#9CA3AF" />
        </View>
        <Text style={styles.emptyTitle}>No bubbles saved yet</Text>
        <Text style={styles.emptySubtitle}>
          Save your favorite bubbles to your BubbleBook for quick access
        </Text>
      </View>

      <NavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  generalContainer: {
    backgroundColor: "#F8FAFC",
    height: "100%",
    paddingVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
