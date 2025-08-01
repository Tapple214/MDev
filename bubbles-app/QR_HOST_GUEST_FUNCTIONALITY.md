# 🎯 Host vs Guest QR Code Functionality

## Overview

The QR code system now has different behaviors for hosts and guests:

- **Hosts**: Show QR code for others to scan
- **Guests**: Scan QR code to confirm attendance

## Functionality

### 👑 **For Hosts (Event Organizers)**

**Button**: "Show QR Code" with QR code icon

**Action**: Displays a QR code modal that guests can scan

**Features**:

- Shows unique QR code for the bubble
- QR code contains bubble details and security data
- Share functionality to send QR code to others
- Copy to clipboard option
- Beautiful autumn-themed modal design

**QR Code Data**:

```json
{
  "type": "bubble_entry",
  "bubbleId": "unique-bubble-id",
  "bubbleName": "Coffee Meetup",
  "hostName": "John Doe",
  "schedule": "2024-01-15T18:00:00.000Z",
  "uniqueId": "uuid-v4-string",
  "timestamp": "2024-01-10T10:30:00.000Z"
}
```

### 👥 **For Guests (Event Attendees)**

**Button**: "Scan QR Code" with camera icon

**Action**: Opens QR scanner to scan host's QR code

**Features**:

- Camera-based QR code scanning
- Validates QR code authenticity
- Confirms attendance in database
- Shows attendance confirmation dialog

**Process**:

1. Guest taps "Scan QR Code" button
2. Camera opens for QR scanning
3. Guest scans host's QR code
4. System validates QR code
5. Shows "Confirm Attendance" dialog
6. Guest confirms attendance
7. Attendance is recorded in database

## Implementation Details

### **Button Text & Icon Logic**

```javascript
// Button text changes based on user role
{bubbleData?.needQR
  ? (bubbleDetails.userRole === "host" ? "Show QR Code" : "Scan QR Code")
  : "No QR Required"
}

// Button icon changes based on user role
name={bubbleDetails.userRole === "host" ? "qr-code" : "camera"}
```

### **Action Logic**

```javascript
const handleShowQRCode = () => {
  if (bubbleDetails.userRole === "host") {
    // Host: Show QR code for others to scan
    setShowQRCode(true);
  } else {
    // Guest: Scan QR code to confirm attendance
    setShowQRScanner(true);
  }
};
```

### **Attendance Confirmation**

```javascript
const handleQRCodeScanned = async (qrData) => {
  // Validate QR code
  const validation = validateAttendanceQR(qrData, bubbleId);

  if (!validation.isValid) {
    Alert.alert("Invalid QR Code", validation.message);
    return;
  }

  // Show confirmation dialog
  Alert.alert("Confirm Attendance", "...", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Confirm Attendance",
      onPress: async () => {
        const result = await confirmAttendance(bubbleId, userEmail, qrData);
        // Handle result
      },
    },
  ]);
};
```

## Database Updates

### **Attendance Confirmation**

When a guest confirms attendance, the database is updated:

```javascript
// Updates guestResponses field in bubble document
{
  [`guestResponses.${guestEmail}`]: {
    response: "confirmed",
    confirmedAt: "2024-01-15T18:00:00.000Z",
    qrScanned: true,
    qrData: { /* scanned QR data */ }
  }
}
```

### **QR Code Validation**

QR codes are validated for:

- Correct bubble ID
- Valid timestamp (not expired)
- Proper data structure
- Authentic source

## User Experience Flow

### **Host Flow**

1. Create bubble with `needQR: true`
2. Go to BubbleView
3. See "Show QR Code" button (green)
4. Tap button to display QR code
5. Guests scan the displayed QR code

### **Guest Flow**

1. Go to BubbleView for invited bubble
2. See "Scan QR Code" button (green)
3. Tap button to open camera
4. Scan host's QR code
5. Confirm attendance in dialog
6. Attendance is recorded

## Security Features

### **QR Code Security**

- Unique UUID for each QR code
- Timestamp validation (24-hour expiry)
- Bubble ID verification
- Host authentication

### **Attendance Security**

- QR code must match bubble ID
- Only valid guests can confirm attendance
- Timestamp tracking for audit trail
- QR data stored for verification

## Error Handling

### **Common Scenarios**

1. **Invalid QR Code**

   - Wrong bubble ID
   - Expired QR code
   - Corrupted data

2. **Permission Issues**

   - Camera access denied
   - Network connectivity issues

3. **Database Errors**
   - Failed attendance confirmation
   - Network timeouts

### **User Feedback**

- Clear error messages
- Success confirmations
- Loading states
- Retry options

## Testing Scenarios

### **Host Testing**

- [ ] Create bubble with QR code
- [ ] View QR code in BubbleView
- [ ] Share QR code functionality
- [ ] Copy QR code data

### **Guest Testing**

- [ ] View "Scan QR Code" button
- [ ] Open camera scanner
- [ ] Scan valid QR code
- [ ] Confirm attendance
- [ ] Handle invalid QR codes

### **Edge Cases**

- [ ] QR code for wrong bubble
- [ ] Expired QR code
- [ ] No camera permission
- [ ] Network errors
- [ ] Database failures

## Future Enhancements

### **Planned Features**

- QR code expiration settings
- Multiple QR codes per bubble
- Attendance analytics
- QR code customization
- Offline QR generation

### **Advanced Features**

- Real-time attendance tracking
- QR code usage analytics
- Custom QR code designs
- Bulk attendance confirmation
- Attendance reports

This implementation provides a complete host-guest QR code system with proper security, validation, and user experience flows.
