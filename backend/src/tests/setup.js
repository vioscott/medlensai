// Test setup file
import { jest } from '@jest/globals';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.FIREBASE_PROJECT_ID = 'test-project';
process.env.HUGGINGFACE_API_KEY = 'test-key';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock Firebase Admin SDK globally
jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn()
  },
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn(),
    setCustomUserClaims: jest.fn()
  })),
  firestore: jest.fn(() => ({
    collection: jest.fn()
  })),
  storage: jest.fn(() => ({
    bucket: jest.fn()
  }))
}));

// Mock Hugging Face API calls
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
  defaults: {
    baseURL: '',
    headers: {
      common: {}
    }
  }
}));

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
