# Firestore Users Collection Setup

## Overview

The app now includes Firestore integration to store user data in a "users" collection. When users sign up, their information is automatically saved to Firestore.

## Firestore Collection Structure

### Users Collection

**Collection Name**: `users`
**Document ID**: User's Firebase Auth UID

**Document Fields**:

```javascript
{
  name: "User's Full Name",
  email: "user@example.com",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Setup Instructions

### 1. Enable Firestore Database

1. Go to your Firebase Console
2. Navigate to "Firestore Database" in the left sidebar
3. Click "Create database"
4. Choose "Start in test mode" (for development)
5. Select a location for your database

### 2. Set Up Security Rules

In Firestore Database > Rules, use these rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow reading all users for search functionality
    match /users/{userId} {
      allow read: if request.auth != null;
    }
  }
}
```

### 3. Update Firebase Configuration

Make sure your `firebase.js` file has the correct configuration with your project details.

## Features Implemented

### ✅ User Registration

- When users sign up, their data is automatically saved to Firestore
- User document is created with UID as document ID
- Includes name, email, and timestamps

### ✅ User Data Retrieval

- Functions to get user data by UID
- Functions to get all users
- Functions to search users by name

### ✅ Form Updates

- Added "Name" field for sign-up
- Password field remains for authentication
- Form validation for all fields

## Utility Functions Available

### `addUser(userId, userData)`

Adds a new user to the Firestore collection.

### `getUser(userId)`

Retrieves user data by UID.

### `updateUser(userId, userData)`

Updates existing user data.

### `getAllUsers()`

Retrieves all users from the collection.

### `findUser(searchTerm, searchType)`

Searches users by email or name. `searchType` can be "email" or "name".

## Usage Examples

```javascript
// Add a new user
await addUser(userId, {
  name: "John Doe",
  email: "john@example.com",
});

// Get user data
const userData = await getUser(userId);

// Search users by name
const users = await findUser("John", "name");

// Search users by email
const user = await findUser("john@example.com", "email");
```

## Testing the Implementation

1. **Sign Up**: Create a new account with name and email
2. **Check Firestore**: Verify user document is created in Firebase Console
3. **Sign In**: Test login with existing credentials
4. **Data Retrieval**: Test getting user data programmatically

## Next Steps

1. **User Profile**: Display user name in the app
2. **User Search**: Implement user search functionality
3. **User Management**: Add user profile editing
4. **Bubble Integration**: Connect users to bubbles/events
5. **Real-time Updates**: Add real-time listeners for user data changes

## Troubleshooting

- **Permission Denied**: Check Firestore security rules
- **Collection Not Found**: Ensure Firestore is enabled in your project
- **Data Not Saving**: Verify Firebase configuration is correct
- **Authentication Errors**: Check that user is properly authenticated before accessing Firestore
