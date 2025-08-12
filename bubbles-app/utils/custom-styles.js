// Design System for Bubbles

export const COLORS = {
  // Primary
  background: "#EEDCAD",
  primary: "#452A17", // Text, Buttons
  surface: "#FEFADF", // Card backgrounds, Clickable elements

  // Action Colors
  confirm: "#5D5820",
  reject: "#BD3526",

  // Accent; Autumn themed
  elemental: {
    beige: "#D4A373",
    orange: "#E89349",
    rust: "#BD6C26",
    sage: "#778A31",
    brown: "#9D5E1D",
  },

  // Text Colors
  text: {
    primary: "#452A17",
    secondary: "#5D5820",
    onSurface: "#452A17",
    onPrimary: "#FEFADF",
    onConfirm: "#FEFADF",
    onReject: "#FEFADF",
  },

  // Status Colors
  status: {
    success: "#5D5820",
    error: "#BD3526",
    warning: "#BD6C26",
    info: "#778A31",
  },
};

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
};
