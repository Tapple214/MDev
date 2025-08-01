# 🍂 Autumn Color System

## Overview

This document outlines the centralized autumn color system for the Bubbles app, ensuring consistent theming and reducing color confusion across components.

## Color Categories

### 🎨 Primary Colors (Core Brand)

These are the foundation colors used throughout the app:

- **`#EEDCAD` - Cream Background**

  - Main page backgrounds
  - Navbar background
  - Modal backgrounds
  - Icon backgrounds on primary buttons

- **`#452A17` - Dark Brown**

  - Primary text color
  - Category tab colors
  - Primary button backgrounds
  - Navbar icons
  - Selected states

- **`#FEFADF` - Light Cream**
  - Form backgrounds
  - Card backgrounds
  - Clickable element backgrounds
  - Text on primary backgrounds

### ⚡ Action Colors (User Interactions)

These colors guide user actions and provide feedback:

- **`#5D5820` - Olive Green**

  - Confirm/Accept buttons
  - Success states
  - Validation success messages

- **`#BD3526` - Burgundy Red**
  - Reject/Decline buttons
  - Error states
  - Validation error messages

### 🌟 Elemental Colors (Bubble Icons & Accents)

These colors are used for bubble icon backgrounds and decorative elements:

- **`#D4A373` - Warm Beige**

  - Bubble icon backgrounds
  - Subtle accents
  - Secondary highlights

- **`#E89349` - Orange** _(Default bubble color)_

  - Bubble icon backgrounds
  - Warm highlights
  - Primary bubble accent

- **`#BD6C26` - Rust Orange**

  - Bubble icon backgrounds
  - Emphasis elements
  - Warning states

- **`#778A31` - Sage Green**
  - Tags
  - Secondary accents
  - Info states

## Usage Guidelines

### Text Colors

- **Primary text**: `COLORS.text.primary` (`#452A17`)
- **Secondary text**: `COLORS.text.secondary` (`#5D5820`)
- **Text on surfaces**: `COLORS.text.onSurface` (`#452A17`)
- **Text on primary**: `COLORS.text.onPrimary` (`#FEFADF`)
- **Text on confirm buttons**: `COLORS.text.onConfirm` (`#FEFADF`)
- **Text on reject buttons**: `COLORS.text.onReject` (`#FEFADF`)

### Status Colors

- **Success**: `COLORS.status.success` (`#5D5820`)
- **Error**: `COLORS.status.error` (`#BD3526`)
- **Warning**: `COLORS.status.warning` (`#BD6C26`)
- **Info**: `COLORS.status.info` (`#778A31`)

### Helper Functions

```javascript
import {
  COLORS,
  getElementalColors,
  getRandomElementalColor,
  getColorByCategory,
} from "../utils/colors";

// Get all elemental colors for bubble icons
const elementalColors = getElementalColors();

// Get a random elemental color for bubble icons
const randomColor = getRandomElementalColor();

// Get color by category
const backgroundColor = getColorByCategory("background");
```

## Implementation Examples

### Buttons

```javascript
// Primary button
<TouchableOpacity style={[styles.button, { backgroundColor: COLORS.primary }]}>
  <Text style={[styles.buttonText, { color: COLORS.text.onPrimary }]}>
    Primary Action
  </Text>
</TouchableOpacity>

// Confirm button
<TouchableOpacity style={[styles.button, { backgroundColor: COLORS.confirm }]}>
  <Text style={[styles.buttonText, { color: COLORS.text.onConfirm }]}>
    Confirm
  </Text>
</TouchableOpacity>

// Reject button
<TouchableOpacity style={[styles.button, { backgroundColor: COLORS.reject }]}>
  <Text style={[styles.buttonText, { color: COLORS.text.onReject }]}>
    Cancel
  </Text>
</TouchableOpacity>
```

### Cards and Surfaces

```javascript
// Card background
<View style={[styles.card, { backgroundColor: COLORS.surface }]}>
  <Text style={[styles.cardText, { color: COLORS.text.onSurface }]}>
    Card content
  </Text>
</View>

// Page background
<View style={[styles.container, { backgroundColor: COLORS.background }]}>
  {/* Page content */}
</View>
```

### Bubble Icons

```javascript
// Bubble icon with elemental color
<View style={[styles.bubbleIcon, { backgroundColor: COLORS.elemental.orange }]}>
  <Feather name="heart" size={20} color={COLORS.background} />
</View>

// Random elemental color for bubble
<View style={[styles.bubbleIcon, { backgroundColor: getRandomElementalColor() }]}>
  <Feather name="star" size={20} color={COLORS.background} />
</View>
```

## Migration Guide

### Before (Hardcoded Colors)

```javascript
// ❌ Don't do this
backgroundColor: "#EEDCAD";
color: "#452A17";
backgroundColor: "#FEFADF";
```

### After (Centralized Colors)

```javascript
// ✅ Do this
backgroundColor: COLORS.background;
color: COLORS.primary;
backgroundColor: COLORS.surface;
```

## Benefits

1. **Consistency**: All colors are defined in one place
2. **Maintainability**: Easy to update colors across the entire app
3. **Semantic Meaning**: Colors have clear purposes and meanings
4. **Autumn Theme**: Cohesive autumn color palette
5. **Accessibility**: Proper contrast ratios maintained
6. **Scalability**: Easy to add new colors or modify existing ones

## Color Accessibility

All color combinations have been tested for proper contrast ratios:

- Text on backgrounds meets WCAG AA standards
- Interactive elements have sufficient contrast
- Status colors are distinguishable for color-blind users

## Future Considerations

- Consider adding dark mode support
- Add color variants for different seasons
- Implement color theming for user preferences
- Add color validation tools for new components
