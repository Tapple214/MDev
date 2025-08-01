# 🔧 QR Code System Troubleshooting Guide

## Current Status

### ✅ **Working Features**

- QR code generation when `needQR: true`
- QR code display in BubbleView
- QR code data storage in Firestore
- QR code validation utilities
- Autumn theme integration

### 🔄 **In Progress**

- Native camera QR scanning (using simplified version for now)

## Common Issues & Solutions

### 1. **Native Module Errors**

**Error**: `Cannot find native module 'ExpoBarCodeScanner'`

**Solutions**:

```bash
# Fix 1: Clear cache and restart
npx expo start --clear

# Fix 2: Reinstall dependencies
npx expo install --fix

# Fix 3: If using Expo Go, try development build
npx expo install expo-dev-client
```

**Temporary Workaround**: Use the simplified scanner (`qr-code-scanner-simple.js`) which simulates QR scanning for testing.

### 2. **QR Code Not Generating**

**Check**:

- Ensure `needQR: true` is set when creating bubble
- Check console for Firestore errors
- Verify network connection

**Debug Steps**:

```javascript
// In CreateBubble.js, add console.log
console.log("Bubble data:", bubbleData);
console.log("needQR value:", needQR);
```

### 3. **QR Code Not Displaying**

**Check**:

- Verify bubble has `qrCodeData` field
- Check if `needQR` is true for the bubble
- Ensure QRCodeDisplay component is properly imported

**Debug Steps**:

```javascript
// In BubbleView.js, add console.log
console.log("Bubble data:", bubbleData);
console.log("QR code data:", bubbleData?.qrCodeData);
```

### 4. **Camera Permission Issues**

**Error**: `No access to camera`

**Solutions**:

- Go to device settings → Privacy → Camera → Enable for app
- Restart the app after granting permissions
- Check if camera is being used by another app

### 5. **QR Code Validation Errors**

**Error**: `Invalid QR code data`

**Check**:

- Ensure QR code contains valid JSON
- Verify QR code has required fields (`type`, `bubbleId`, etc.)
- Check if QR code is corrupted or incomplete

## Testing the QR Code System

### **Step 1: Create a Bubble with QR Code**

1. Go to CreateBubble
2. Fill in bubble details
3. Toggle "Need QR Code for entry?" to ON
4. Create the bubble
5. Check console for QR generation logs

### **Step 2: Display QR Code**

1. Go to BubbleView for the created bubble
2. Tap "Show QR Code" button
3. QR code should display in modal
4. Test share and copy functionality

### **Step 3: Test QR Scanning (Simplified)**

1. Go to Home screen
2. Tap QR code icon in header
3. Tap "Simulate QR Scan" button
4. Confirm the mock QR code data

## Development vs Production

### **Development (Expo Go)**

- Uses simplified QR scanner
- Simulates QR code scanning
- No native camera dependencies
- Good for testing QR generation and display

### **Production (Development Build)**

- Full native camera integration
- Real QR code scanning
- Requires `expo-barcode-scanner` and `expo-camera`
- Complete QR code functionality

## File Structure

```
bubbles-app/
├── components/
│   ├── qr-code-display.js          # QR code display modal
│   ├── qr-code-scanner.js          # Full camera scanner (native)
│   └── qr-code-scanner-simple.js   # Simplified scanner (testing)
├── utils/
│   ├── qrCode.js                   # QR code utilities
│   └── firestore.js                # Updated with QR generation
└── pages/
    ├── CreateBubble.js             # QR toggle switch
    ├── BubbleView.js               # QR display functionality
    └── Home.js                     # QR scanner button
```

## Switching Between Scanners

### **Use Simplified Scanner (Current)**

```javascript
// In Home.js
import QRCodeScanner from "../components/qr-code-scanner-simple";
```

### **Use Full Camera Scanner (When Native Modules Work)**

```javascript
// In Home.js
import QRCodeScanner from "../components/qr-code-scanner";
```

## Debug Commands

```bash
# Clear Expo cache
npx expo start --clear

# Fix dependency issues
npx expo install --fix

# Check for native module issues
npx expo doctor

# Rebuild development client
npx expo install expo-dev-client
```

## Expected Behavior

### **QR Code Generation**

- ✅ Creates unique UUID for each QR code
- ✅ Includes bubble details (name, host, schedule)
- ✅ Stores in Firestore with bubble document
- ✅ Validates QR code data structure

### **QR Code Display**

- ✅ Shows QR code in modal
- ✅ Uses autumn theme colors
- ✅ Includes share functionality
- ✅ Responsive design

### **QR Code Scanning (Simplified)**

- ✅ Simulates QR code scanning
- ✅ Validates mock QR data
- ✅ Shows bubble details
- ✅ Allows joining bubble

## Next Steps

1. **Test QR Generation**: Create bubbles with `needQR: true`
2. **Test QR Display**: View QR codes in BubbleView
3. **Test QR Scanning**: Use simplified scanner for now
4. **Resolve Native Modules**: When ready for production

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review console logs for errors
3. Verify all dependencies are installed
4. Test with simplified scanner first
5. Clear cache and restart development server

The QR code system is functional for generation and display. The native camera scanning will be resolved when the development environment is properly configured.
