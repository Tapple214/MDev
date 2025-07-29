import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/navbar";
import { Feather } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

export default function BubbleView() {
  const route = useRoute();
  const { bubbleDetails } = route.params;

  return (
    <View style={styles.generalContainer}>
      <ScrollView vertical style={styles.bubbleViewScrollView}>
        <Text style={styles.title}>More info on the Bubble!</Text>
        {/* Row 1 */}
        <View style={styles.bubbleDetailsRow}>
          <View style={[styles.cell, { width: "95%" }]}>
            <Text style={styles.cardTitle}>{bubbleDetails.bubbleName}</Text>
            <Feather
              name="bookmark"
              size={45}
              style={{ position: "absolute", right: -25, top: 15 }}
              color="#778A31"
            />
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.bubbleDetailsRow}>
          <View style={[styles.cell, { width: "40%", marginLeft: 20 }]}>
            <Text>3</Text>
            <Feather
              name="check-square"
              size={45}
              style={{ position: "absolute", left: -25, bottom: 15 }}
              color="#949D72"
            />
          </View>
          <View style={[styles.cell, { flex: 1 }]}>
            <Text>4</Text>
            <Feather
              name="user"
              size={45}
              style={{ position: "absolute", left: 15, top: 15 }}
              color="#E89349"
            />
            <Text>{bubbleDetails.host}</Text>
          </View>
        </View>

        {/* Row 3 */}
        <View style={styles.bubbleDetailsRow}>
          <View style={[styles.cell, { width: "55%" }]}>
            <Text>5</Text>
            <Feather
              name="map-pin"
              size={45}
              style={{ position: "absolute", right: 15, top: 15 }}
              color="#BD3526"
            />
          </View>
          <View style={[styles.cell, { flex: 1, marginRight: 20 }]}>
            <Text>6</Text>
            <Feather
              name="clock"
              size={45}
              style={{ position: "absolute", right: -25, bottom: 15 }}
              color="#46462B"
            />
          </View>
        </View>

        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.button}>
            <Feather name="camera" size={30} style={{ paddingBottom: 10 }} />
            <Text>Add to BubbleBook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text>Show/Scan QR Code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  // General properties
  generalContainer: {
    backgroundColor: "#EEDCAD",
    height: "100%",
    paddingVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    paddingBottom: 2,
  },
  button: {
    padding: 10,
    backgroundColor: "#FEFADF",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  quickActionsContainer: {
    width: "100%",
    paddingHorizontal: 15,
  },
  bubbleViewScrollView: {
    flex: 1,
  },
  bubbleDetailsRow: {
    flexDirection: "row",
    height: 150,
    marginBottom: 15,
    gap: 15,
    paddingHorizontal: 15,
  },
  cell: {
    backgroundColor: "rgba(254, 250, 223, 0.5)",
    borderRadius: 10,
    padding: 15,
  },
});
