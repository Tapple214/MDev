# BubbleBook Feature

## Overview

BubbleBook is a collective photo album feature that allows users to add pictures to create a shared album. It's designed to capture memories from bubble events and activities.

## Features

### 📸 Photo Management

- **Take Photo**: Capture new photos directly from the camera
- **Choose Photo**: Select existing photos from the device gallery
- **Photo Grid**: Display all photos in a responsive 2-column grid
- **Photo Details**: View photo information including who added it and when

### 🎨 User Interface

- **Consistent Theming**: Uses the same autumn color system as other pages
- **Responsive Design**: Adapts to different screen sizes
- **Pull-to-Refresh**: Refresh the photo collection by pulling down
- **Modal View**: Tap photos to view them in a detailed modal

### 🔐 Permissions & Security

- **Camera Permission**: Required for taking photos
- **Media Library Permission**: Required for selecting photos from gallery
- **User Attribution**: Each photo is tagged with the user who added it
- **Delete Control**: Users can only delete their own photos

### 📱 Navigation

- **NavBar Integration**: Accessible via the image icon in the bottom navigation
- **Direct Link**: "Add to BubbleBook" button in BubbleView pages
- **Proper Routing**: Integrated into the main app navigation stack

## Technical Implementation

### Data Structure

Photos are stored in Firestore with the following structure:

```javascript
{
  id: "document_id",
  imageUri: "file://path/to/image.jpg",
  source: "Camera" | "Gallery",
  addedBy: "user@email.com",
  addedByName: "User Display Name",
  createdAt: timestamp,
  description: "Optional description"
}
```

### Key Components

- **Image Picker**: Uses expo-image-picker for camera and gallery access
- **Firestore Integration**: Stores and retrieves photos from the "bubbleBook" collection
- **State Management**: React hooks for managing photos, loading states, and UI interactions
- **Error Handling**: Comprehensive error handling for permissions, network issues, and data operations

### Styling

- **Color System**: Uses the centralized COLORS from utils/colors.js
- **Consistent Patterns**: Follows the same styling patterns as Home and BubbleView pages
- **Responsive Layout**: Grid layout that adapts to screen width
- **Modal Design**: Clean, accessible modal for photo details

## Usage

1. **Access BubbleBook**: Tap the image icon in the bottom navigation bar
2. **Add Photos**: Use "Take Photo" or "Choose Photo" buttons
3. **View Photos**: Tap any photo in the grid to see details
4. **Delete Photos**: In the photo details modal, tap "Delete Photo" (only for your own photos)
5. **Refresh**: Pull down to refresh the photo collection

## Dependencies

- `expo-image-picker`: For camera and gallery access
- `@expo/vector-icons`: For UI icons (Feather icons)
- `firebase/firestore`: For data storage and retrieval

## Future Enhancements

- Photo descriptions and captions
- Photo sharing between bubbles
- Photo categories and tags
- Advanced photo editing features
- Photo compression and optimization
- Offline photo caching
