# Tic Tac Toe App

A simple Tic Tac Toe game board display built in React Native.

## Features

- Clean 3x3 game grid layout
- Responsive design that adapts to screen size
- Pre-populated game board with X and O symbols
- Proper border styling for grid cells

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Run on your preferred platform:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Dependencies

- React Native core components
- Expo framework

## Project Structure

- `App.js` - Main component displaying the Tic Tac Toe board
- Responsive grid that scales with device width
- Static game state (can be extended for interactive gameplay)

## Game Board

The app currently displays a static game board with the following layout:

```
O | O | X
---------
X | O | O
---------
X | X | O
```

## Future Enhancements

- Add interactive gameplay
- Implement win detection
- Add game reset functionality
- Include player turn indicators
