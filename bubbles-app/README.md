# Bubbles App

A React Native mobile application for creating and managing social bubbles.

## Features

- **Home Page**: Main dashboard with bubble overview
- **Login Page**: User authentication
- **Bubble View**: Detailed view of individual bubbles
- **Bubble Buddies**: Manage bubble members
- **Create Bubble**: Create new social bubbles
- **Bubble Book**: Browse and discover bubbles

## Components

- **Navbar**: Navigation component
- **Bubble Item**: Reusable bubble display component

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

3. Run on iOS simulator or Android emulator

## Project Structure

```
bubbles/
├── App.js                 # Main app component
├── pages/                 # Screen components
│   ├── Home.js
│   ├── Login.js
│   ├── BubbleView.js
│   ├── BubbleBuddies.js
│   ├── CreateBubble.js
│   └── BubbleBook.js
├── components/            # Reusable components
│   ├── navbar.js
│   └── bubble-item.js
└── assets/               # Images and static files
```

## Technologies Used

- React Native
- Expo
- JavaScript
