# React Native Component Projects

This repository contains 4 separate React Native projects, each dedicated to a specific component or application.

## Projects Overview

### 1. 🍕 Food App (`food-app/`)

A restaurant menu application with navigation between restaurant listings and their menus.

- **Features**: Restaurant cards, menu navigation, delivery times
- **Dependencies**: React Navigation, React Native core components
- **Screens**: Home (restaurant list), Menu (restaurant menu)

### 2. 🧮 Calculator App (`calculator-app/`)

A fully functional calculator with iOS-style design.

- **Features**: Complete arithmetic operations, AC/CE toggle, percentage, chained calculations
- **Dependencies**: React Native core components
- **Design**: iOS-style button layout with proper colors

### 3. ⭕ Tic Tac Toe App (`tic-tac-toe-app/`)

A simple Tic Tac Toe game board display.

- **Features**: 3x3 grid layout, responsive design, pre-populated board
- **Dependencies**: React Native core components
- **Status**: Static display (can be extended for interactive gameplay)

### 4. 🏷️ Name Badge App (`name-badge-app/`)

A name badge display with landscape orientation lock.

- **Features**: Professional badge design, landscape orientation, customizable name
- **Dependencies**: expo-screen-orientation, React Native core components
- **Usage**: Perfect for conferences, events, and display kiosks

## Quick Start

Each project is completely independent and can be run separately. To get started with any project:

1. **Navigate to the project directory:**

   ```bash
   cd [project-name]
   # e.g., cd food-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

4. **Run on your preferred platform:**
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Project Structure

```
├── food-app/           # Restaurant menu application
├── calculator-app/     # iOS-style calculator
├── tic-tac-toe-app/    # Tic tac toe game board
├── name-badge-app/     # Name badge display
└── test/              # Original combined project
```

## Requirements

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Development Notes

- All projects use Expo framework for easier development and testing
- Each project has its own `package.json` and dependencies
- Projects can be developed and deployed independently
- All projects are compatible with Expo Go app for testing

## Customization

Each project can be customized independently:

- **Food App**: Add more restaurants, modify menu items
- **Calculator**: Add more mathematical functions
- **Tic Tac Toe**: Add interactive gameplay, win detection
- **Name Badge**: Change the displayed name, modify styling

## Contributing

Each project is self-contained, so you can modify and extend them independently without affecting the others.
