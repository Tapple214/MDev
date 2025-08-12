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
