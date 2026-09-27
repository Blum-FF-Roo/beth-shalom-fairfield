import '@testing-library/jest-dom'

// Mock Next.js environment variables
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-firebase-api-key';
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789';
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'test-app-id';

// Mock window.alert and console.error
global.alert = jest.fn();
global.console.error = jest.fn();

// Mock fetch and Response for Firebase
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200
  })
);

global.Response = function(body, init) {
  this.body = body;
  this.status = init?.status || 200;
  this.ok = this.status >= 200 && this.status < 300;
  this.json = () => Promise.resolve(body ? JSON.parse(body) : {});
};

// Mock Firebase
jest.mock('@/app/utils/firebase', () => ({
  db: {},
  auth: {},
  storage: {}
}));