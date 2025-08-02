# Attendance System with "Attended" Field

## Overview

The attendance system has been enhanced to include an "attended" field that tracks whether guests have actually attended the bubble by scanning the QR code.

## Implementation Details

### 1. Database Structure

- **guestResponses**: A map in the bubble document that stores guest responses
- **attended**: A boolean field that defaults to `false` and becomes `true` when QR is scanned

### 2. Field Structure

```javascript
guestResponses: {
  "guest@email.com": {
    response: "accepted" | "declined" | "confirmed",
    respondedAt: timestamp,
    attended: false, // Default value
    qrScanned: true, // Set when QR is scanned
    qrData: {...}, // QR code data
    confirmedAt: timestamp // Set when attendance is confirmed
  }
}
```

### 3. Functionality

#### For Bubbles with QR Code Required (`needQR: true`)

- When a guest accepts/declines an invitation, `attended` is set to `false`
- When a guest scans the QR code, `attended` is set to `true`
- The attendance status is displayed in the guest list

#### For Bubbles without QR Code Required (`needQR: false`)

- The "attended" field is not shown in the guest list
- Only response status (accepted/declined) is displayed

### 4. Components

#### GuestListDisplay Component

- Displays the guest list with attendance status
- Shows response status (accepted/declined/confirmed)
- Shows attendance status (attended/not attended) for QR-enabled bubbles
- Fetches user names from the database

#### Updated Functions

- `confirmAttendance()`: Sets `attended: true` when QR is scanned
- `updateGuestResponse()`: Sets `attended: false` when guest responds to invitation

### 5. User Interface

#### Host View

- Can see all guests and their attendance status
- Attendance column only appears for bubbles with QR code requirement
- Visual indicators show attendance status

#### Guest View

- Can see their own response status
- Can scan QR code to mark attendance (if bubble requires QR)

### 6. Usage Flow

1. **Host creates bubble** with `needQR: true`
2. **Guests receive invitations** and respond (accept/decline)
3. **Guest responses** are stored with `attended: false`
4. **At the event**, guests scan QR code
5. **Attendance is confirmed** and `attended` is set to `true`
6. **Host can view** attendance status in the guest list

### 7. Technical Implementation

#### Files Modified

- `utils/attendance.js`: Updated `confirmAttendance()` function
- `utils/firestore.js`: Updated `updateGuestResponse()` function
- `components/guest-list-display.js`: New component for displaying guest list
- `pages/BubbleView.js`: Integrated guest list display

#### Key Features

- Automatic attendance tracking when QR is scanned
- Visual indicators for attendance status
- Conditional display based on QR requirement
- Real-time updates when attendance is confirmed

### 8. Testing

To test the functionality:

1. Create a bubble with QR code requirement
2. Invite guests and have them accept
3. View the bubble details to see guest list
4. Have guests scan the QR code
5. Verify that attendance status updates to "Attended"
