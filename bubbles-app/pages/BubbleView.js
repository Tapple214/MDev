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
import UniqueCodeDisplay from "../components/unique-code-display";
import UniqueCodeEntry from "../components/unique-code-entry";
import GuestRespondBtns from "../components/guest-respond-btns";

// Utility function/Hooks imports
import { COLORS, TEXT_STYLES } from "../utils/custom-styles";
import { confirmAttendance, validateAttendanceQR } from "../utils/attendance";
import { generateEntryQRCode } from "../utils/attendance";
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
  const [showUniqueCodeDisplay, setShowUniqueCodeDisplay] = useState(false);
  const [showUniqueCodeEntry, setShowUniqueCodeEntry] = useState(false);
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

  // Handle attendance confirmation methods
  const handleShowAttendanceOptions = () => {
    if (!bubbleData?.needQR) {
      Alert.alert(
        "Info",
        "This bubble doesn't require attendance confirmation"
      );
      return;
    }

    if (bubbleDetails.userRole === "host") {
      // Show options for host
      Alert.alert(
        "Attendance Method",
        "Choose how guests will confirm attendance:",
        [
          {
            text: "QR Code",
            onPress: () => handleShowQRCode(),
          },
          {
            text: "Unique Code",
            onPress: () => setShowUniqueCodeDisplay(true),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } else {
      // Show options for guest
      Alert.alert(
        "Confirm Attendance",
        "Choose how to confirm your attendance:",
        [
          {
            text: "Scan QR Code",
            onPress: () => setShowQRScanner(true),
          },
          {
            text: "Enter Code",
            onPress: () => setShowUniqueCodeEntry(true),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    }
  };

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
              if (!user?.email) {
                Alert.alert("Error", "User not authenticated");
                return;
              }
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

  const handleCodeSubmitted = async (codeData) => {
    const validation = validateAttendanceQR(codeData, bubbleDetails.bubbleId);

    if (!validation.isValid) {
      Alert.alert("Invalid Code", validation.message);
      setShowUniqueCodeEntry(false);
      return;
    }

    Alert.alert(
      "Confirm Attendance",
      `Bubble: ${codeData.bubbleName}\nHost: ${codeData.hostName}\nCode: ${codeData.entryCode}\n\nWould you like to confirm your attendance?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setShowUniqueCodeEntry(false),
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              if (!user?.email) {
                Alert.alert("Error", "User not authenticated");
                return;
              }
              const result = await confirmAttendance(
                bubbleDetails.bubbleId,
                user.email,
                codeData
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
            setShowUniqueCodeEntry(false);
          },
        },
      ]
    );
  };

  const handleEditBubble = () => {
    // Only allow host to edit the bubble
    if (bubbleDetails.userRole !== "host") {
      Alert.alert("Error", "Only the host can edit this bubble");
      return;
    }

    // Navigate to EditBubble page with bubble data
    navigation.navigate("EditBubble", {
      bubbleData: bubbleData,
    });
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
            <Feather
              name="check-square"
              size={45}
              style={{ position: "absolute", left: -25, bottom: 15 }}
              color="#949D72"
            />

            <Text style={[styles.cardTitle, { textAlign: "right" }]}>
              {bubbleDetails.userRole === "host"
                ? "Are you excited?"
                : "Are you attending?"}
            </Text>

            <GuestRespondBtns
              userRole={bubbleDetails.userRole}
              onAccept={bubbleDetails.onAccept}
              onDecline={bubbleDetails.onDecline}
              onRetract={bubbleDetails.onRetract}
              response={
                user &&
                bubbleData?.guestResponses?.[user.email?.toLowerCase()]
                  ?.response
              }
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
              <Text style={[TEXT_STYLES.body.medium, { textAlign: "right" }]}>
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

        {/* TODO: add images into db */}
        {/* Row 4: Quick Actions; Buttons for BubbleBook and Attendance */}
        <View style={styles.quickActionsContainer}>
          {/* Attendance Button and BubbleBook Button; will only show if user has accepted the bubble or if uses is host */}
          {((user &&
            bubbleData?.guestResponses?.[user.email?.toLowerCase()]
              ?.response === "accepted") ||
            bubbleDetails.userRole === "host") && (
            <View>
              <TouchableOpacity
                style={[styles.button, bubbleData?.needQR && styles.button]}
                onPress={handleShowAttendanceOptions}
              >
                <Feather
                  name={
                    bubbleDetails.userRole === "host" ? "lock" : "user-check"
                  }
                  size={30}
                  color={COLORS.primary}
                  style={styles.icon}
                />
                <Text style={[styles.buttonText]}>
                  {bubbleData?.needQR
                    ? bubbleDetails.userRole === "host"
                      ? "Attendance Options"
                      : "Confirm Attendance"
                    : "No Attendance Required"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("BubbleBook", {
                bubbleId: bubbleDetails.bubbleId,
                bubbleName: bubbleData?.name || bubbleDetails.name,
              })
            }
          >
            <Feather
              name="image"
              size={30}
              color={COLORS.primary}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>View BubbleBook</Text>
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

          {/* Unique Code Display Modal (for hosts) */}
          <UniqueCodeDisplay
            isVisible={showUniqueCodeDisplay}
            onClose={() => setShowUniqueCodeDisplay(false)}
            bubbleName={bubbleData?.name}
            bubbleId={bubbleDetails.bubbleId}
          />

          {/* Unique Code Entry Modal (for guests) */}
          <UniqueCodeEntry
            isVisible={showUniqueCodeEntry}
            onClose={() => setShowUniqueCodeEntry(false)}
            onCodeSubmitted={handleCodeSubmitted}
            bubbleName={bubbleData?.name}
            hostName={bubbleData?.hostName}
          />
        </View>
      </ScrollView>
      <NavBar
        page="BubbleView"
        userRole={bubbleDetails.userRole}
        handleEditBubble={handleEditBubble}
      />
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
    ...TEXT_STYLES.heading.medium,
    paddingBottom: 15,
  },
  button: {
    padding: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    ...TEXT_STYLES.button.primary,
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
    ...TEXT_STYLES.card.title,
    paddingBottom: 10,
  },
  cardText: {
    ...TEXT_STYLES.card.text,
    paddingBottom: 10,
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
