// 🍂 Autumn Color System
// Centralized color definitions for consistent theming

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
