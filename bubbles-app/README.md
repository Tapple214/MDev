# Bubbles App 🫧

A React Native mobile application for creating, managing, and attending social events called "Bubbles". Built with Expo and Firebase, this app helps users organize gatherings, invite friends, and track attendance through QR codes and unique codes.

## ✨ Features

### 🎯 Core Functionality

- **Create Bubbles**: Set up social events with custom names, descriptions, locations, dates, and times
- **Bubble Management**: Edit, view, and organize your created events
- **Guest Invitations**: Invite friends via email with automatic validation
- **QR Code System**: Generate and scan QR codes for easy event check-ins
- **Unique Codes**: Alternative check-in method using unique codes
- **Attendance Tracking**: Monitor who's attending your events

### 🎨 Customization

- **Visual Themes**: Choose from multiple color schemes (Orange, Sage, Beige, Rust)
- **Icon Selection**: Pick from various icons (heart, star, gift, map-pin)
- **Tag System**: Categorize events with tags like casual, formal, outdoor, indoor, etc.
- **AI Description Generator**: Get AI-powered event descriptions

### 🔧 Technical Features

- **Offline Support**: Works without internet connection with data caching
- **Push Notifications**: Stay updated on event changes and reminders
- **Real-time Sync**: Firebase integration for live updates
- **Cross-platform**: Works on both iOS and Android
- **Responsive Design**: Optimized for various screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bubbles-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   - Create a Firebase project
   - Add your Firebase configuration to `config/firebase-config.js`
   - Enable Authentication and Firestore in your Firebase console

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## 📱 App Structure

### Pages

- **Home**: Dashboard with quick actions and bubble overview
- **CreateBubble**: Event creation with customization options
- **BubbleView**: Detailed view of individual events
- **BubbleBook**: Photo and document management
- **BubbleBuddies**: Contact and friend management
- **Settings**: User preferences and app configuration

### Components

- **BubbleItem**: Individual event display component
- **QRCodeScanner**: Camera-based QR code scanning
- **GuestSelector**: Friend invitation interface
- **ConnectivityStatus**: Network status indicator
- **NavBar**: Custom navigation component

## 🧪 Testing

Run the test suite using Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🛠 Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Firebase (Authentication, Firestore)
- **State Management**: React Context API
- **Navigation**: React Navigation
- **Testing**: Jest, React Native Testing Library
- **Icons**: Expo Vector Icons
- **QR Codes**: react-native-qrcode-svg, expo-barcode-scanner

## 📁 Project Structure

```
bubbles-app/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── pages/             # Main app screens
├── utils/             # Helper functions and services
├── config/            # Configuration files
├── assets/            # Images and static files
├── __tests__/         # Test files
└── App.js            # Main app component
```

## 🔐 Environment Setup

Create a `.env` file in the root directory with your Firebase configuration:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## 📱 Building for Production

### Android

```bash
expo build:android
```

### iOS

```bash
expo build:ios
```
