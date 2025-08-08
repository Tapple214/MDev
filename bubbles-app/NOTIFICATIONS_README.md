# Push Notifications System

This document describes the push notification system implemented in the Bubbles app.

## Features

The notification system provides the following features:

### 1. Host Notifications

- **Guest Response Notifications**: Hosts receive notifications when guests accept or decline their bubble invites
- **Upcoming Bubble Reminders**: Hosts get notified 1 day and 6 hours before their bubbles start

### 2. Guest Notifications

- **Invite Notifications**: Guests receive notifications when they are invited to a bubble
- **Upcoming Bubble Reminders**: Guests get notified 1 day and 6 hours before bubbles they're attending start

### 3. All Users

- **Scheduled Reminders**: Automatic notifications for upcoming bubbles (1 day and 6 hours before)

## Implementation Details

### Dependencies

- `expo-notifications`: For handling push notifications
- `expo-device`: For device-specific functionality

### Key Files

- `utils/notifications.js`: Main notification service
- `contexts/AuthContext.js`: Initializes notifications on login
- `utils/firestore.js`: Integrates notifications with bubble creation and guest responses
- `App.js`: Sets up notification listeners

### Notification Types

1. **Guest Response Notifications**

   - Triggered when: Guest accepts/declines a bubble invite
   - Sent to: Host
   - Content: "{Guest Name} {accepted/declined} your invite to '{Bubble Name}'"

2. **Bubble Invite Notifications**

   - Triggered when: New bubble is created with guests
   - Sent to: All invited guests
   - Content: "You have been invited by {Host Name} to '{Bubble Name}'"

3. **Upcoming Bubble Notifications**
   - Triggered when: 1 day and 6 hours before bubble start time
   - Sent to: All participants (host and guests)
   - Content: "'{Bubble Name}' is starting {tomorrow/in 6 hours}! Don't forget to attend!"

## Setup Instructions

### 1. Expo Project Configuration

The app.json file includes the necessary notification configuration:

```json
{
  "plugins": [
    [
      "expo-notifications",
      {
        "icon": "./assets/notification-icon.png",
        "color": "#ffffff"
      }
    ]
  ],
  "notification": {
    "icon": "./assets/notification-icon.png",
    "color": "#ffffff",
    "iosDisplayInForeground": true,
    "androidMode": "default"
  }
}
```

### 2. Permission Handling

The app automatically requests notification permissions when a user logs in. Users can:

- Grant permissions: Full notification functionality
- Deny permissions: App continues without notifications

### 3. Token Management

- Push tokens are automatically saved to Firestore when users log in
- Tokens are associated with user documents for targeted notifications

## Testing

### Local Notifications

Use the "Test Notification" button in the BubbleView page to test local notifications. Local notifications work on both simulator and device.

### Push Notifications

**Current Development Setup:**

- Push notifications are configured but require a proper Expo project ID
- Local notifications are used as fallback for development
- All notification events will trigger local notifications for testing

**For Production Push Notifications:**

1. Create an Expo project at https://expo.dev
2. Get the project ID from your Expo dashboard
3. Update the project ID in `utils/notifications.js`
4. Use a development build instead of Expo Go
5. Test on a physical device

## Configuration

### Project ID

For development, the app uses local notifications as fallback. For production push notifications:

1. Create an Expo project at https://expo.dev
2. Get your project ID from the Expo dashboard
3. Update the project ID in `utils/notifications.js`:

```javascript
const token = await Notifications.getExpoPushTokenAsync({
  projectId: "your-expo-project-id", // Replace with your actual Expo project ID
});
```

### Notification Icons

- Place notification icons in the `assets/` folder
- Update the paths in `app.json` if needed

## Troubleshooting

### Common Issues

1. **Notifications not working on simulator**

   - Push notifications require a physical device
   - Local notifications work on simulator

2. **Permission denied**

   - Check device settings
   - Reinstall app to reset permissions

3. **Tokens not saving**

   - Check Firebase connection
   - Verify user authentication

4. **Expo Go limitations**
   - Push notifications don't work in Expo Go with SDK 53
   - Use development builds for full push notification functionality
   - Local notifications work in Expo Go for testing

### Debug Steps

1. Check console logs for notification errors
2. Verify push token generation
3. Test local notifications first
4. Check device notification settings

## Future Enhancements

- Rich notifications with images
- Custom notification sounds
- Notification preferences per user
- Batch notifications for multiple events
- Notification history
- Silent notifications for background updates

## Security Considerations

- Push tokens are stored securely in Firestore
- Notifications are sent only to authenticated users
- No sensitive data is included in notification payloads
- User consent is required for notifications

## API Reference

### Main Functions

```javascript
// Initialize notifications for a user
await initializeNotifications(userId);

// Send local notification
await sendLocalNotification(title, body, data);

// Send push notification
await sendPushNotification(token, title, body, data);

// Notify host of guest response
await notifyHostOfGuestResponse(bubbleId, guestEmail, response);

// Notify guest of invite
await notifyGuestOfInvite(guestEmail, bubbleId);

// Schedule upcoming bubble notifications
await scheduleBubbleNotifications(bubbleId);
```

### Event Handlers

```javascript
// Set up notification listeners
const cleanup = setupNotificationListeners();

// Clean up listeners
cleanup();
```
