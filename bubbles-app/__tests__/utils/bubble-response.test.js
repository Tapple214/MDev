// Mock React Native Alert before importing
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

import { Alert } from "react-native";
import useBubbleResponse from "../../utils/bubble-response";

describe("useBubbleResponse Hook", () => {
  let mockUser;
  let mockFetchData;
  let mockUpdateGuestResponse;
  let hookResult;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUser = { email: "test@example.com" };
    mockFetchData = jest.fn();
    mockUpdateGuestResponse = jest.fn();

    hookResult = useBubbleResponse({
      user: mockUser,
      fetchData: mockFetchData,
      updateGuestResponse: mockUpdateGuestResponse,
    });
  });

  describe("handleAcceptBubble", () => {
    it("should accept bubble successfully", async () => {
      mockUpdateGuestResponse.mockResolvedValue();
      mockFetchData.mockResolvedValue();

      await hookResult.handleAcceptBubble("bubble123");

      expect(mockUpdateGuestResponse).toHaveBeenCalledWith(
        "bubble123",
        "test@example.com",
        "accepted"
      );
      expect(Alert.alert).toHaveBeenCalledWith(
        "Success!",
        "You've confirmed you're coming to this bubble!"
      );
      expect(mockFetchData).toHaveBeenCalled();
    });

    it("should show error when user is not authenticated", async () => {
      const hookWithoutUser = useBubbleResponse({
        user: null,
        fetchData: mockFetchData,
        updateGuestResponse: mockUpdateGuestResponse,
      });

      await hookWithoutUser.handleAcceptBubble("bubble123");

      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "User not authenticated"
      );
      expect(mockUpdateGuestResponse).not.toHaveBeenCalled();
    });
  });

  describe("handleDeclineBubble", () => {
    it("should decline bubble successfully", async () => {
      mockUpdateGuestResponse.mockResolvedValue();
      mockFetchData.mockResolvedValue();

      await hookResult.handleDeclineBubble("bubble123");

      expect(mockUpdateGuestResponse).toHaveBeenCalledWith(
        "bubble123",
        "test@example.com",
        "declined"
      );
      expect(Alert.alert).toHaveBeenCalledWith(
        "Declined",
        "You've declined this bubble invitation."
      );
    });
  });

  describe("handleRetractBubble", () => {
    it("should retract bubble successfully", async () => {
      mockUpdateGuestResponse.mockResolvedValue();
      mockFetchData.mockResolvedValue();

      await hookResult.handleRetractBubble("bubble123");

      expect(mockUpdateGuestResponse).toHaveBeenCalledWith(
        "bubble123",
        "test@example.com",
        "pending"
      );
      expect(Alert.alert).toHaveBeenCalledWith(
        "Retracted",
        "You've retracted your invitation to this bubble."
      );
    });
  });

  describe("returned functions", () => {
    it("should return all three handler functions", () => {
      expect(hookResult).toHaveProperty("handleAcceptBubble");
      expect(hookResult).toHaveProperty("handleDeclineBubble");
      expect(hookResult).toHaveProperty("handleRetractBubble");
    });
  });
});
