# Development Notification Setup

This guide explains the current notification setup for development and testing.

## Current Status

✅ **Working Features:**

- Local notifications (work on simulator and device)
- Notification permissions
- Notification settings page
- Test notifications
- Event-triggered notifications (guest responses, invites, reminders)

⚠️ **Development Limitations:**

- Push notifications require proper Expo project ID
- Expo Go doesn't support push notifications in SDK 53
- Using local notifications as fallback

## Testing the Notification System

### 1. Test Local Notifications

1. Open the app
2. Navigate to any bubble view
3. Tap the "Test Notification" button
4. You should see a local notification appear

### 2. Test Event Notifications

1. Create a new bubble with guests
2. Accept/decline bubble invites
3. Check for local notifications for these events

### 3. Test Notification Settings

1. Navigate to "Notification Settings" from the home screen
2. Check permission status
3. Toggle notification preferences
4. Test the "Send Test Notification" button

## Development Workflow

### Current Setup

- All notification events trigger local notifications
- Push token generation is disabled for development
- Notifications work in both simulator and device

### To Enable Push Notifications

1. **Create Expo Project:**

   ```bash
   # Create a new Expo project
   npx create-expo-app@latest bubbles-push-notifications
   cd bubbles-push-notifications
   ```

2. **Get Project ID:**

   - Go to https://expo.dev
   - Create a new project
   - Copy the project ID from the dashboard

3. **Update Configuration:**

   ```javascript
   // In utils/notifications.js
   const token = await Notifications.getExpoPushTokenAsync({
     projectId: "your-actual-expo-project-id",
   });
   ```

4. **Use Development Build:**

   ```bash
   # Install EAS CLI
   npm install -g @expo/eas-cli

   # Login to Expo
   eas login

   # Configure development build
   eas build:configure

   # Build for development
   eas build --profile development --platform ios
   ```

## Troubleshooting

### Common Issues

1. **"Invalid uuid" error:**

   - This is expected in development
   - Local notifications will still work

2. **No notifications appearing:**

   - Check notification permissions
   - Ensure device/simulator notifications are enabled
   - Try the test notification button

3. **Expo Go warnings:**
   - These are expected warnings
   - Local notifications work fine in Expo Go

### Debug Steps

1. **Check Console Logs:**

   ```javascript
   // Look for these messages:
   "Push token generation requires a proper Expo project ID";
   "For development, using local notifications only";
   "Sending local notification for guest response";
   ```

2. **Test Permission Flow:**

   - Go to Notification Settings
   - Check permission status
   - Request permissions if needed

3. **Verify Event Triggers:**
   - Create bubbles with guests
   - Accept/decline invites
   - Check for notification logs

## Next Steps for Production

1. **Set up proper Expo project**
2. **Configure development builds**
3. **Test on physical devices**
4. **Deploy with push notifications**

## Current Notification Events

✅ **Implemented:**

- Guest accepts/declines bubble → Host notification
- New bubble created → Guest notifications
- Upcoming bubble reminders → All participants
- Test notifications → Manual testing

✅ **Working in Development:**

- All events trigger local notifications
- Notification settings page
- Permission handling
- Event logging

The notification system is fully functional for development and testing with local notifications. Push notifications can be enabled later when you're ready to set up the proper Expo project configuration.
