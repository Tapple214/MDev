# 📱 QR Code System for Bubbles

## Overview

The QR code system allows bubble hosts to generate unique QR codes for entry verification and enables guests to scan QR codes to join bubbles.

## Features

### 🎯 **QR Code Generation**

- **Automatic Generation**: QR codes are automatically generated when creating bubbles with `needQR: true`
- **Unique Identifiers**: Each QR code contains a unique UUID for security
- **Rich Data**: QR codes contain bubble name, host, schedule, and verification data
- **Two Formats**:
  - **Entry QR Codes**: Full JSON data for entry verification
  - **Share QR Codes**: Simple format for sharing bubble information

### 📱 **QR Code Display**

- **Modal Display**: Clean, centered QR code display with bubble branding
- **Share Functionality**: Share QR codes via native sharing
- **Copy Feature**: Copy QR code data to clipboard
- **Responsive Design**: Adapts to different screen sizes

### 🔍 **QR Code Scanning**

- **Camera Integration**: Uses device camera to scan QR codes
- **Real-time Validation**: Validates QR codes immediately upon scanning
- **Permission Handling**: Manages camera permissions gracefully
- **Error Handling**: Provides clear feedback for invalid QR codes

## How It Works

### 1. **Creating Bubbles with QR Codes**

When creating a bubble, hosts can enable QR code generation:

```javascript
// In CreateBubble.js
const [needQR, setNeedQR] = useState(false);

// The switch in the form
<Switch
  value={needQR}
  onValueChange={setNeedQR}
  trackColor={{ false: "#767577", true: "#81b0ff" }}
  thumbColor={needQR ? "#f5dd4b" : "#f4f3f4"}
/>;
```

### 2. **QR Code Generation Process**

When `needQR: true`, the system automatically:

1. **Generates Unique Data**: Creates a unique JSON object with bubble details
2. **Adds Security**: Includes UUID and timestamp for verification
3. **Stores in Database**: Saves QR code data with the bubble document
4. **Makes Available**: QR code can be displayed in BubbleView

```javascript
// QR Code Data Structure
{
  type: 'bubble_entry',
  bubbleId: 'unique-bubble-id',
  bubbleName: 'Bubble Name',
  hostName: 'Host Name',
  schedule: '2024-01-15T18:00:00.000Z',
  uniqueId: 'uuid-v4-string',
  timestamp: '2024-01-10T10:30:00.000Z'
}
```

### 3. **Displaying QR Codes**

In BubbleView, hosts can display their QR codes:

```javascript
// QR Code Display Component
<QRCodeDisplay
  qrCodeData={bubbleData?.qrCodeData}
  bubbleName={bubbleData?.name}
  isVisible={showQRCode}
  onClose={() => setShowQRCode(false)}
/>
```

### 4. **Scanning QR Codes**

Users can scan QR codes from the Home screen:

```javascript
// QR Scanner Component
<QRCodeScanner
  isVisible={showQRScanner}
  onClose={() => setShowQRScanner(false)}
  onQRCodeScanned={handleQRCodeScanned}
/>
```

## Components

### 📋 **QRCodeDisplay Component**

- **Location**: `components/qr-code-display.js`
- **Purpose**: Displays QR codes in a modal
- **Features**:
  - Clean, centered QR code display
  - Share functionality
  - Copy to clipboard
  - Responsive design
  - Autumn theme integration

### 🔍 **QRCodeScanner Component**

- **Location**: `components/qr-code-scanner.js`
- **Purpose**: Scans QR codes using device camera
- **Features**:
  - Camera permission handling
  - Real-time QR code detection
  - Validation and error handling
  - Visual scanning frame
  - Rescan functionality

### 🛠 **QR Code Utilities**

- **Location**: `utils/qrCode.js`
- **Functions**:
  - `generateBubbleQRData()`: Creates QR code data
  - `validateQRData()`: Validates scanned QR codes
  - `generateEntryQRCode()`: Generates entry QR codes
  - `generateShareQRCode()`: Generates share QR codes

## Usage Examples

### **For Bubble Hosts**

1. **Create a Bubble with QR Code**:

   ```javascript
   // In CreateBubble form
   const bubbleData = {
     name: "Coffee Meetup",
     needQR: true, // Enable QR code generation
     // ... other bubble data
   };
   ```

2. **Display QR Code**:
   ```javascript
   // In BubbleView
   const handleShowQRCode = () => {
     if (bubbleData?.needQR && bubbleData?.qrCodeData) {
       setShowQRCode(true);
     }
   };
   ```

### **For Bubble Guests**

1. **Scan QR Code**:
   ```javascript
   // From Home screen
   const handleQRCodeScanned = (qrData) => {
     Alert.alert(
       "QR Code Scanned!",
       `Bubble: ${qrData.bubbleName}\nHost: ${qrData.hostName}`,
       [
         { text: "Cancel", style: "cancel" },
         { text: "Join Bubble", onPress: () => joinBubble(qrData) },
       ]
     );
   };
   ```

## Security Features

### 🔐 **QR Code Security**

- **Unique UUIDs**: Each QR code has a unique identifier
- **Timestamp Validation**: QR codes include creation timestamps
- **Data Validation**: Scanned QR codes are validated before processing
- **Type Verification**: Only valid bubble entry QR codes are accepted

### 🛡 **Permission Handling**

- **Camera Permissions**: Properly requests and handles camera access
- **Graceful Fallbacks**: Shows appropriate messages when permissions denied
- **User Feedback**: Clear error messages for permission issues

## Integration with Existing System

### 🔗 **Firestore Integration**

- **Automatic Storage**: QR codes are stored with bubble documents
- **Real-time Updates**: QR codes update when bubble data changes
- **Data Consistency**: QR codes maintain consistency with bubble data

### 🎨 **Theme Integration**

- **Autumn Colors**: QR components use the autumn color system
- **Consistent Styling**: Matches the overall app design
- **Accessible Design**: Proper contrast and readable text

## Future Enhancements

### 🚀 **Planned Features**

- **QR Code Expiration**: Time-based QR code expiration
- **Multiple QR Types**: Different QR codes for different purposes
- **QR Code Analytics**: Track QR code usage and effectiveness
- **Offline Support**: Generate QR codes without internet connection
- **Custom QR Designs**: Allow hosts to customize QR code appearance

### 🔧 **Technical Improvements**

- **Performance Optimization**: Faster QR code generation and scanning
- **Error Recovery**: Better handling of scanning errors
- **Accessibility**: Enhanced accessibility features for QR scanning
- **Testing**: Comprehensive testing for QR code functionality

## Troubleshooting

### ❓ **Common Issues**

1. **QR Code Not Generating**:

   - Ensure `needQR: true` is set when creating bubble
   - Check that bubble creation completed successfully
   - Verify network connection

2. **QR Code Not Scanning**:

   - Check camera permissions
   - Ensure QR code is clearly visible
   - Verify QR code is valid bubble entry code

3. **Permission Denied**:
   - Go to device settings and enable camera access
   - Restart the app after granting permissions
   - Check if camera is being used by another app

### 🛠 **Debug Information**

- QR codes include debug information for troubleshooting
- Console logs show QR code generation and validation steps
- Error messages provide specific guidance for issues

## API Reference

### 📚 **QR Code Functions**

```javascript
// Generate QR code data for bubble entry
generateBubbleQRData(bubbleId, bubbleName, hostName, schedule);

// Validate scanned QR code data
validateQRData(qrDataString);

// Generate entry QR code
generateEntryQRCode(bubbleData);

// Generate share QR code
generateShareQRCode(bubbleData);
```

### 🎯 **Component Props**

```javascript
// QRCodeDisplay props
{
  qrCodeData: string,      // QR code data to display
  bubbleName: string,      // Name of the bubble
  isVisible: boolean,      // Whether modal is visible
  onClose: function,       // Close modal callback
  onShare: function        // Share QR code callback
}

// QRCodeScanner props
{
  isVisible: boolean,      // Whether scanner is visible
  onClose: function,       // Close scanner callback
  onQRCodeScanned: function // QR code scanned callback
}
```

This QR code system provides a complete solution for bubble entry verification, making it easy for hosts to manage entry and for guests to join bubbles seamlessly.
