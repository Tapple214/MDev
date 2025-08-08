// 🎨 Custom Styles System
// Centralized color and text styling definitions for consistent theming

// ===== COLOR SYSTEM =====
export const COLORS = {
  // Primary Colors (Core Brand)
  background: "#EEDCAD", // Main page backgrounds
  primary: "#452A17", // Primary text, category tabs, primary buttons
  surface: "#FEFADF", // Form backgrounds, card backgrounds, clickable elements

  // Action Colors (User Interactions)
  confirm: "#5D5820", // Confirm/Accept buttons, success states
  reject: "#BD3526", // Reject/Decline buttons, error states

  // Elemental Colors (Bubble Icons & Accents)
  elemental: {
    beige: "#D4A373", // Warm beige - bubble icon backgrounds
    orange: "#E89349", // Orange - bubble icon backgrounds (default)
    rust: "#BD6C26", // Rust orange - bubble icon backgrounds
    sage: "#778A31", // Sage green - tags, secondary accents
    brown: "#9D5E1D", // Brown - tags, secondary accents
  },

  // Text Colors
  text: {
    primary: "#452A17", // Primary text color
    secondary: "#5D5820", // Secondary text color
    onSurface: "#452A17", // Text on surface backgrounds
    onPrimary: "#FEFADF", // Text on primary backgrounds
    onConfirm: "#FEFADF", // Text on confirm buttons
    onReject: "#FEFADF", // Text on reject buttons
  },

  // Status Colors
  status: {
    success: "#5D5820", // Success states
    error: "#BD3526", // Error states
    warning: "#BD6C26", // Warning states
    info: "#778A31", // Info states
  },
};

// ===== TEXT STYLE SYSTEM =====
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

// ===== COLOR HELPER FUNCTIONS =====
// Helper function to get elemental colors for bubble icons
export const getElementalColors = () => Object.values(COLORS.elemental);

// Helper function to get a random elemental color
export const getRandomElementalColor = () => {
  const colors = getElementalColors();
  return colors[Math.floor(Math.random() * colors.length)];
};

// Helper function to get color by category
export const getColorByCategory = (category) => {
  switch (category) {
    case "background":
      return COLORS.background;
    case "primary":
      return COLORS.primary;
    case "surface":
      return COLORS.surface;
    case "confirm":
      return COLORS.confirm;
    case "reject":
      return COLORS.reject;
    default:
      return COLORS.primary;
  }
};

// ===== TEXT STYLE HELPER FUNCTIONS =====
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
