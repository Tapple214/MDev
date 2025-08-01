import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import NavBar from "../components/navbar";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { COLORS } from "../utils/colors";
import QRCodeDisplay from "../components/qr-code-display";
import QRCodeScanner from "../components/qr-code-scanner-simple";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { confirmAttendance, validateAttendanceQR } from "../utils/attendance";
import { generateEntryQRCode } from "../utils/qrCode";
import { useAuth } from "../contexts/AuthContext";

export default function BubbleView() {
  const route = useRoute();
  const navigation = useNavigation();
  const { bubbleDetails } = route.params;
  const { user } = useAuth();
  const [bubbleData, setBubbleData] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log("BubbleView render - showQRCode:", showQRCode);
  console.log("User role:", bubbleDetails.userRole);

  // Monitor showQRCode state changes
  useEffect(() => {
    console.log("showQRCode state changed to:", showQRCode);
  }, [showQRCode]);

  // Fetch complete bubble data including QR code
  useEffect(() => {
    const fetchBubbleData = async () => {
      if (bubbleDetails.bubbleId) {
        setLoading(true);
        try {
          const bubbleRef = doc(db, "bubbles", bubbleDetails.bubbleId);
          const bubbleSnap = await getDoc(bubbleRef);

          if (bubbleSnap.exists()) {
            const fetchedData = { id: bubbleSnap.id, ...bubbleSnap.data() };
            console.log("Fetched bubble data:", fetchedData);
            console.log("needQR:", fetchedData.needQR);
            console.log("qrCodeData exists:", !!fetchedData.qrCodeData);
            setBubbleData(fetchedData);
          }
        } catch (error) {
          console.error("Error fetching bubble data:", error);
          Alert.alert("Error", "Failed to load bubble details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBubbleData();
  }, [bubbleDetails.bubbleId]);

  const handleShowQRCode = () => {
    console.log("QR button clicked");
    console.log("bubbleData:", bubbleData);
    console.log("needQR:", bubbleData?.needQR);
    console.log("qrCodeData:", bubbleData?.qrCodeData);
    console.log("User role:", bubbleDetails.userRole);

    if (!bubbleData?.needQR) {
      Alert.alert("Info", "This bubble doesn't require QR code entry");
      return;
    }

    // Different behavior for host vs guest
    if (bubbleDetails.userRole === "host") {
      // Host: Show QR code for others to scan
      if (!bubbleData?.qrCodeData) {
        // Temporary fix: Generate QR code on the fly for existing bubbles
        console.log("QR code missing, generating on the fly...");
        const tempBubbleData = {
          id: bubbleData.id,
          name: bubbleData.name,
          hostName: bubbleData.hostName,
          schedule: bubbleData.schedule,
        };
        const generatedQR = generateEntryQRCode(tempBubbleData);
        console.log("Generated QR on the fly:", generatedQR);

        if (generatedQR) {
          // Update the local state with the generated QR
          setBubbleData((prev) => ({ ...prev, qrCodeData: generatedQR }));
          setShowQRCode(true);
        } else {
          Alert.alert("Error", "Failed to generate QR code for this bubble");
        }
        return;
      }
      console.log("Host: Setting showQRCode to true");
      setShowQRCode(true);
    } else {
      // Guest: Scan QR code to confirm attendance
      console.log("Guest: Opening QR scanner");
      setShowQRScanner(true);
    }
  };

  const handleQRCodeScanned = async (qrData) => {
    // Validate the QR code
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
          text: "Confirm Attendance",
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
      <ScrollView vertical style={styles.bubbleViewScrollView}>
        <Text style={styles.title}>More info on the Bubble!</Text>
        {/* Row 1 */}
        <View style={styles.bubbleDetailsRow}>
          <View style={[styles.cell, { width: "95%" }]}>
            <Text style={styles.cardTitle}>{bubbleDetails.bubbleName}</Text>
            <View
              style={[
                styles.bubbleIcon,
                { backgroundColor: bubbleDetails.backgroundColor || "#E89349" },
              ]}
            >
              <Feather
                name={bubbleDetails.icon || "heart"}
                size={30}
                color="#EEDCAD"
              />
            </View>
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("BubbleBook")}
          >
            <Feather name="camera" size={30} style={{ paddingBottom: 10 }} />
            <Text>Add to BubbleBook</Text>
          </TouchableOpacity>

          {/* Debug button - remove after testing */}
          {bubbleDetails.userRole === "host" && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: COLORS.reject }]}
              onPress={() => {
                console.log("Debug: Forcing QR display");
                setShowQRCode(true);
              }}
            >
              <Text style={{ color: COLORS.surface }}>
                DEBUG: Force Show QR
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, bubbleData?.needQR && styles.qrButton]}
            onPress={handleShowQRCode}
          >
            {console.log(
              "Button render - needQR:",
              bubbleData?.needQR,
              "userRole:",
              bubbleDetails.userRole
            )}
            <Feather
              name={bubbleDetails.userRole === "host" ? "smartphone" : "camera"}
              size={30}
              style={{ paddingBottom: 10 }}
              color={
                bubbleData?.needQR ? COLORS.confirm : COLORS.text.secondary
              }
            />
            <Text
              style={[
                styles.buttonText,
                bubbleData?.needQR && styles.qrButtonText,
              ]}
            >
              {bubbleData?.needQR
                ? bubbleDetails.userRole === "host"
                  ? "Show QR Code"
                  : "Scan QR Code"
                : "No QR Required"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* QR Code Display Modal (for hosts) */}
        <QRCodeDisplay
          qrCodeData={bubbleData?.qrCodeData}
          bubbleName={bubbleData?.name || bubbleDetails.bubbleName}
          isVisible={showQRCode}
          onClose={() => setShowQRCode(false)}
        />
        {console.log("QRCodeDisplay props:", {
          qrCodeData: bubbleData?.qrCodeData ? "exists" : "null",
          bubbleName: bubbleData?.name || bubbleDetails.bubbleName,
          isVisible: showQRCode,
        })}

        {/* QR Code Scanner Modal (for guests) */}
        <QRCodeScanner
          isVisible={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onQRCodeScanned={handleQRCodeScanned}
        />
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
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  qrButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.confirm,
  },
  qrButtonText: {
    color: COLORS.confirm,
    fontWeight: "bold",
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
  bubbleIcon: {
    position: "absolute",
    right: -20,
    top: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
