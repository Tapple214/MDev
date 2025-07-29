# Firebase Authentication Setup for Bubbles App

## Prerequisites

- Firebase project created at [Firebase Console](https://console.firebase.google.com/)
- Expo CLI installed

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "bubbles-app")
4. Follow the setup wizard

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Optionally enable "Google" provider for Google Sign-In

### 3. Get Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "Bubbles Web App")
6. Copy the firebaseConfig object

### 4. Update Firebase Configuration

1. Open `firebase.js` in your project
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};
```

### 5. Test the App

1. Run `npm start` or `expo start`
2. Test the sign-up and sign-in functionality
3. Verify that users are created in your Firebase Authentication console

## Features Included

### Authentication Methods

- **Email/Password Sign Up**: Users can create accounts with email and password
- **Email/Password Sign In**: Existing users can sign in with their credentials
- **Google Sign In**: Placeholder for Google authentication (requires additional setup)
- **Logout**: Users can logout from the home screen

### Security Features

- Password validation (minimum 6 characters)
- Email format validation
- Password confirmation for sign-up
- Error handling with user-friendly messages
- Persistent authentication state

### UI Features

- Clean, modern interface matching your app's design
- Loading states during authentication
- Form validation with error messages
- Toggle between sign-in and sign-up modes
- Responsive design with keyboard handling

## Error Handling

The app handles common Firebase authentication errors:

- `auth/user-not-found`: No account found with this email
- `auth/wrong-password`: Incorrect password
- `auth/email-already-in-use`: Account already exists
- `auth/weak-password`: Password too weak
- `auth/invalid-email`: Invalid email format

## Next Steps

1. **Google Sign-In**: Implement Google authentication using Expo Google Sign-In
2. **Password Reset**: Add "Forgot Password" functionality
3. **User Profile**: Store additional user data in Firestore
4. **Email Verification**: Enable email verification for new accounts
5. **Social Login**: Add Facebook, Apple, or other social login providers

## Troubleshooting

- Make sure your Firebase configuration is correct
- Check that Authentication is enabled in your Firebase project
- Verify that Email/Password provider is enabled
- Check the console for any error messages
- Ensure you're using the latest version of Firebase SDK
