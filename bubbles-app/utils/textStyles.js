// 📝 Text Style System
// Centralized text styling definitions for consistent theming

import { COLORS } from "./colors";

export const TEXT_STYLES = {
  // Heading Styles
  heading: {
    large: {
      fontSize: 24,
      fontWeight: "bold",
      color: COLORS.text.primary,
    },
    medium: {
      fontSize: 20,
      fontWeight: "bold",
      color: COLORS.text.primary,
    },
    small: {
      fontSize: 18,
      fontWeight: "bold",
      color: COLORS.text.primary,
    },
  },

  // Body Text Styles
  body: {
    large: {
      fontSize: 16,
      fontWeight: "500",
      color: COLORS.text.primary,
    },
    medium: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text.primary,
    },
    small: {
      fontSize: 12,
      fontWeight: "400",
      color: COLORS.text.secondary,
    },
  },

  // Button Text Styles
  button: {
    primary: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text.onPrimary,
    },
    secondary: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text.primary,
    },
    confirm: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text.onConfirm,
    },
    reject: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text.onReject,
    },
  },

  // Card Text Styles
  card: {
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: COLORS.text.primary,
    },
    text: {
      fontSize: 14,
      fontWeight: "400",
      color: COLORS.text.primary,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text.secondary,
    },
  },

  // Navigation Text Styles
  navigation: {
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: COLORS.text.primary,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text.secondary,
    },
  },

  // Status Text Styles
  status: {
    success: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.status.success,
    },
    error: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.status.error,
    },
    warning: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.status.warning,
    },
    info: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.status.info,
    },
  },

  // Alignment Helpers
  alignment: {
    center: {
      textAlign: "center",
    },
    left: {
      textAlign: "left",
    },
    right: {
      textAlign: "right",
    },
  },

  // Spacing Helpers
  spacing: {
    tight: {
      marginBottom: 5,
    },
    normal: {
      marginBottom: 10,
    },
    loose: {
      marginBottom: 15,
    },
  },
};

// Helper function to combine text styles
export const combineTextStyles = (...styles) => {
  return styles.reduce((combined, style) => ({ ...combined, ...style }), {});
};

// Helper function to get text style by type and size
export const getTextStyle = (type, size = "medium") => {
  if (TEXT_STYLES[type] && TEXT_STYLES[type][size]) {
    return TEXT_STYLES[type][size];
  }
  return TEXT_STYLES.body.medium; // fallback
};

// Helper function to get heading style
export const getHeadingStyle = (size = "medium") => {
  return getTextStyle("heading", size);
};

// Helper function to get body text style
export const getBodyStyle = (size = "medium") => {
  return getTextStyle("body", size);
};

// Helper function to get button text style
export const getButtonStyle = (variant = "primary") => {
  return getTextStyle("button", variant);
};

// Helper function to get card text style
export const getCardStyle = (type = "text") => {
  return getTextStyle("card", type);
};

// Helper function to get status text style
export const getStatusStyle = (status = "info") => {
  return getTextStyle("status", status);
};
