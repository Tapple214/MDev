import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

// Component imports
import NavBar from "../components/navbar";
import QRCodeDisplay from "../components/qr-code-display";
import QRCodeScanner from "../components/qr-code-scanner-simple";

// Utility function/Hooks imports
import { COLORS } from "../utils/colors";
import { confirmAttendance, validateAttendanceQR } from "../utils/attendance";
import { generateEntryQRCode } from "../utils/qrCode";
import { useAuth } from "../contexts/AuthContext";

export default function BubbleView() {
  // Hooks
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();

  // Extract details from route params (From Home.js)
  const { bubbleDetails } = route.params;

  // State variables
  const [bubbleData, setBubbleData] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load bubble data from Firestore
  useEffect(() => {
    const loadBubbleData = async () => {
      try {
        setLoading(true);
        const bubbleRef = doc(db, "bubbles", bubbleDetails.bubbleId);
        const bubbleSnap = await getDoc(bubbleRef);

        if (bubbleSnap.exists()) {
          setBubbleData({ id: bubbleSnap.id, ...bubbleSnap.data() });
        } else {
          Alert.alert("Error", "Bubble not found");
        }
      } catch (error) {
        console.error("Error loading bubble data:", error);
        Alert.alert("Error", "Failed to load bubble data");
      } finally {
        setLoading(false);
      }
    };

    if (bubbleDetails.bubbleId) {
      loadBubbleData();
    }
  }, [bubbleDetails.bubbleId]);

  // If user is host, user will have to show QR code
  const handleShowQRCode = () => {
    if (!bubbleData?.needQR) {
      Alert.alert("Info", "This bubble doesn't require QR code entry");
      return;
    }

    if (bubbleDetails.userRole === "host") {
      if (!bubbleData?.qrCodeData) {
        const tempBubbleData = {
          id: bubbleData.id,
          name: bubbleData.name,
          hostName: bubbleData.hostName,
          schedule: bubbleData.schedule,
        };
        const generatedQR = generateEntryQRCode(tempBubbleData);

        if (generatedQR) {
          setBubbleData((prev) => ({ ...prev, qrCodeData: generatedQR }));
          setShowQRCode(true);
        } else {
          Alert.alert("Error", "Failed to generate QR code for this bubble");
        }
        return;
      }

      setShowQRCode(true);
    } else {
      setShowQRScanner(true);
    }
  };

  // If user is guest, user will have to scan QR code to confirm attendance
  const handleQRCodeScanned = async (qrData) => {
    const validation = validateAttendanceQR(qrData, bubbleDetails.bubbleId);

    if (!validation.isValid) {
      Alert.alert("Invalid QR Code", validation.message);
      setShowQRScanner(false);
      return;
    }

    Alert.alert(
      "Confirm Attendance",
      `Bubble: ${qrData.bubbleName}\nHost: ${qrData.hostName}\n\nWould you like to confirm your attendance?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setShowQRScanner(false),
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const result = await confirmAttendance(
                bubbleDetails.bubbleId,
                user.email,
                qrData
              );

              if (result.success) {
                Alert.alert("Success", result.message);
              } else {
                Alert.alert("Error", result.message);
              }
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to confirm attendance. Please try again."
              );
            }
            setShowQRScanner(false);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.generalContainer}>
      <ScrollView vertical showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>
          More info on {bubbleData?.hostName}'s Bubble!
        </Text>
        {/* Row 1: Bubble Name, Icon, Host, and Description */}
        <View style={styles.bubbleDetailsRow}>
          <View style={[styles.cell, { width: "94%" }]}>
            {/* Bubble Icon */}
            <View
              style={[
                styles.bubbleIcon,
                { backgroundColor: bubbleData?.backgroundColor || "#E89349" },
              ]}
            >
              <Feather
                name={bubbleData?.icon || "heart"}
                size={30}
                color="#EEDCAD"
              />
            </View>

            {/* Bubble Name */}
            <Text style={styles.cardTitle}>{bubbleData?.name}</Text>

            {/* Bubble Description */}
            <Text style={styles.cardText}>{bubbleData?.description}</Text>
          </View>
        </View>

        {/* Row 2: Attendance and Guest List */}
        <View style={styles.bubbleDetailsRow}>
          {/* Attendance */}
          <View style={[styles.cell, { width: "40%", marginLeft: 20 }]}>
            <Text style={[styles.cardTitle, { textAlign: "right" }]}>
              Are you coming?
            </Text>
            <Feather
              name="check-square"
              size={45}
              style={{ position: "absolute", left: -25, bottom: 15 }}
              color="#949D72"
            />
          </View>

          {/* Guest List */}
          <View style={[styles.cell, { flex: 1 }]}>
            <Text style={[styles.cardTitle, { textAlign: "right" }]}>
              Guests
            </Text>

            <Text style={[styles.cardText, { textAlign: "right" }]}>
              {bubbleData?.guestList
                ? Array.isArray(bubbleData.guestList)
                  ? bubbleData.guestList.length
                  : bubbleData.guestList.split(",").length
                : 0}
            </Text>

            <Feather
              name="user"
              size={45}
              style={{ position: "absolute", left: 15, top: 15 }}
              color="#E89349"
            />
            <Text>{bubbleData?.host}</Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("GuestList", {
                  guestListDetail: {
                    bubbleData: bubbleData,
                    userRole: bubbleDetails.userRole,
                  },
                })
              }
            >
              <Text style={{ textAlign: "right" }}>
                View Guest List <Feather name="chevron-right" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 3: Location, Date, and Time */}
        <View style={styles.bubbleDetailsRow}>
          <View style={[styles.cell, { width: "55%" }]}>
            <Feather
              name="map-pin"
              size={45}
              style={{ position: "absolute", right: 15, top: 15 }}
              color="#BD3526"
            />
            <Text style={styles.cardTitle}>Where?</Text>
            <Text style={styles.cardText}>{bubbleData?.location}</Text>
          </View>
          <View style={[styles.cell, { flex: 1, marginRight: 20 }]}>
            <Feather
              name="clock"
              size={45}
              style={{ position: "absolute", right: -21, bottom: 15 }}
              color="#46462B"
            />
            <Text style={styles.cardTitle}>When?</Text>
            <Text style={styles.cardText}>
              {bubbleData?.schedule?.toDate()?.toLocaleDateString() +
                " " +
                "at" +
                " " +
                bubbleData?.schedule?.toDate()?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }) || "N/A"}
            </Text>
          </View>
        </View>

        {/* Row 4: Quick Actions; Buttons for BubbleBook and QR Code */}
        <View style={styles.quickActionsContainer}>
          {/* QR Code Button */}
          <TouchableOpacity
            style={[styles.button, bubbleData?.needQR && styles.button]}
            onPress={handleShowQRCode}
          >
            <Feather
              name={
                bubbleDetails.userRole === "host" ? "smartphone" : "user-check"
              }
              size={30}
              color={COLORS.primary}
              style={styles.icon}
            />
            <Text style={[styles.buttonText]}>
              {bubbleData?.needQR
                ? bubbleDetails.userRole === "host"
                  ? "Show QR Code"
                  : "Scan QR Code"
                : "No QR Required"}
            </Text>
          </TouchableOpacity>

          {/* QR Code Display Modal (for hosts) */}
          <QRCodeDisplay
            qrCodeData={bubbleData?.qrCodeData}
            bubbleName={bubbleData?.name}
            isVisible={showQRCode}
            onClose={() => setShowQRCode(false)}
          />

          {/* QR Code Scanner Modal (for guests) */}
          <QRCodeScanner
            isVisible={showQRScanner}
            onClose={() => setShowQRScanner(false)}
            onQRCodeScanned={handleQRCodeScanned}
          />

          {/* BubbleBook Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("BubbleBook")}
          >
            <Feather
              name="camera"
              size={30}
              color={COLORS.primary}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Add to BubbleBook</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <NavBar page="BubbleView" />
    </View>
  );
}

const styles = StyleSheet.create({
  // General properties
  generalContainer: {
    backgroundColor: COLORS.background,
    height: "100%",
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 15,
    color: COLORS.primary,
  },
  button: {
    padding: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
  },

  // Icon properties
  icon: {
    paddingBottom: 10,
  },
  bubbleIcon: {
    position: "absolute",
    right: -22,
    top: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  // Card properties
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 10,
    color: COLORS.primary,
  },
  cardText: {
    fontSize: 14,
    paddingBottom: 10,
    color: COLORS.primary,
  },

  // Detail properties
  bubbleDetailsRow: {
    flexDirection: "row",
    minHeight: 130,
    marginBottom: 15,
    gap: 15,
  },
  cell: {
    backgroundColor: "rgba(254, 250, 223, 0.5)",
    borderRadius: 10,
    padding: 15,
  },
});
