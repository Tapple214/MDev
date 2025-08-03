# BubbleBook Base64 Implementation

## Overview

This implementation adds base64 conversion and storage for images in the BubbleBook feature to enable cross-device viewing.

## Problem Solved

Previously, images were stored as local file URIs (`imageUri`) which only worked on the device that took the photo. This caused images to appear as white squares when viewed from other devices.

## Solution

- Images are now converted to base64 strings before being stored in Firestore
- The base64 string includes the data URI format: `data:image/jpeg;base64,{base64String}`
- This enables cross-device viewing since base64 strings are universal

## Key Changes

### 1. Dependencies Added

- `expo-file-system`: For reading and converting images to base64

### 2. New Functions

- `convertImageToBase64()`: Converts image URI to base64 string with size validation
- File size limit: 5MB before conversion
- Base64 size limit: 1MB after conversion (Firestore limit)

### 3. Updated Functions

- `addPhotoToCollection()`: Now converts images to base64 before storing
- Image rendering: Uses `photo.imageBase64 || photo.imageUri` for backward compatibility

### 4. User Experience Improvements

- Loading state during upload (`uploading` state)
- File size validation with user-friendly error messages
- Progress indicators in UI during conversion

## Backward Compatibility

- Existing photos with `imageUri` will still display correctly
- New photos will use `imageBase64` format
- The app gracefully handles both formats

## Firestore Schema

```javascript
{
  imageBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...", // New format
  imageUri: "file:///path/to/image.jpg", // Old format (for backward compatibility)
  source: "Camera" | "Gallery",
  addedBy: "user@email.com",
  addedByName: "User Name",
  bubbleId: "bubble123",
  bubbleName: "Bubble Name",
  createdAt: timestamp,
  description: ""
}
```

## Error Handling

- File size validation (5MB limit)
- Base64 size validation (1MB limit for Firestore)
- Network error handling
- User-friendly error messages

## Performance Considerations

- Base64 strings are larger than file URIs (~33% increase)
- Firestore has a 1MB document size limit
- Images are compressed to 0.8 quality before conversion
- Loading states prevent multiple simultaneous uploads
