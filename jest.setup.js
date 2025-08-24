// Mock dynamic imports for Jest
global.dynamicImportMock = {
  "./local-storage": {
    cacheBubbleDetails: jest.fn().mockResolvedValue(undefined),
    getCachedUserBubbles: jest.fn().mockResolvedValue([]),
    updateLastSyncTime: jest.fn().mockResolvedValue(undefined),
    getLastSyncTime: jest.fn().mockResolvedValue(null),
    storeOfflineAttendance: jest.fn().mockResolvedValue(undefined),
  },
  "./offline-manager": {
    queueOperation: jest.fn().mockResolvedValue("mock-operation-id"),
  },
  "./firestore": {
    createBubble: jest.fn().mockResolvedValue({ id: "mock-bubble-id" }),
    updateBubble: jest.fn().mockResolvedValue({ success: true }),
    deleteBubble: jest.fn().mockResolvedValue({ success: true }),
    updateGuestResponse: jest.fn().mockResolvedValue({ success: true }),
  },
  "./attendance": {
    confirmAttendanceByQR: jest.fn().mockResolvedValue({ success: true }),
    confirmAttendanceByPin: jest.fn().mockResolvedValue({ success: true }),
  },
  "./notifications/core": {
    sendPushNotification: jest.fn().mockResolvedValue({ success: true }),
  },
};

// Mock the dynamic import function
global.import = jest.fn((modulePath) => {
  return Promise.resolve(global.dynamicImportMock[modulePath] || {});
});

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
  getAllKeys: jest.fn(),
}));

// Mock NetInfo
jest.mock("@react-native-community/netinfo", () => ({
  addEventListener: jest.fn(),
}));

// Mock Firebase
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
}));

// Mock Firebase app
jest.mock("./firebase", () => ({
  db: {},
}));
