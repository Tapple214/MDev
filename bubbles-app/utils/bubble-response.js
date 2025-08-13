import { Alert } from "react-native";

export default function useBubbleResponse({
  user,
  fetchData,
  updateGuestResponse,
}) {
  // Accept, Decline, Retract Buttons
  const handleAcceptBubble = async (bubbleId) => {
    try {
      if (!user?.email) {
        Alert.alert("Error", "User not authenticated");
        return;
      }
      // Update bubble status in database
      await updateGuestResponse(bubbleId, user.email, "accepted");
      Alert.alert("Success!", "You've confirmed you're coming to this bubble!");
      // Refresh the data to show updated status
      await fetchData();
    } catch (error) {
      console.error("Error accepting bubble:", error);
      Alert.alert("Error", "Failed to accept bubble. Please try again.");
    }
  };

  const handleDeclineBubble = async (bubbleId) => {
    try {
      if (!user?.email) {
        Alert.alert("Error", "User not authenticated");
        return;
      }
      // Update bubble status in database
      await updateGuestResponse(bubbleId, user.email, "declined");
      Alert.alert("Declined", "You've declined this bubble invitation.");
      // Refresh the data to show updated status
      await fetchData();
    } catch (error) {
      console.error("Error declining bubble:", error);
      Alert.alert("Error", "Failed to decline bubble. Please try again.");
    }
  };

  const handleRetractBubble = async (bubbleId) => {
    try {
      if (!user?.email) {
        Alert.alert("Error", "User not authenticated");
        return;
      }
      // Update bubble status in database
      await updateGuestResponse(bubbleId, user.email, "pending");
      Alert.alert(
        "Retracted",
        "You've retracted your invitation to this bubble."
      );
      // Refresh the data to show updated status
      await fetchData();
    } catch (error) {
      console.error("Error retracting bubble:", error);
      Alert.alert("Error", "Failed to retract bubble. Please try again.");
    }
  };

  return {
    handleAcceptBubble,
    handleDeclineBubble,
    handleRetractBubble,
  };
}
