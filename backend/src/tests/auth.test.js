import request from 'supertest';
import { jest } from '@jest/globals';

// Mock Firebase Admin
jest.mock('../config/firebase.js', () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
    setCustomUserClaims: jest.fn()
  },
  adminDb: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn()
      }))
    }))
  }
}));

// Mock the server
import app from '../server.js';

describe('Authentication Routes', () => {
  describe('GET /api/auth/verify', () => {
    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/verify');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
    });

    it('should return 403 with invalid token', async () => {
      const { adminAuth } = await import('../config/firebase.js');
      adminAuth.verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    it('should return user data with valid token', async () => {
      const { adminAuth, adminDb } = await import('../config/firebase.js');
      
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        name: 'Test User'
      };

      const mockUserDoc = {
        exists: true,
        data: () => ({
          uid: 'test-uid',
          email: 'test@example.com',
          name: 'Test User',
          role: 'doctor'
        })
      };

      adminAuth.verifyIdToken.mockResolvedValue(mockUser);
      adminDb.collection().doc().get.mockResolvedValue(mockUserDoc);

      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject({
        uid: 'test-uid',
        email: 'test@example.com',
        name: 'Test User',
        role: 'doctor'
      });
    });
  });

  describe('PUT /api/auth/profile', () => {
    it('should update user profile with valid data', async () => {
      const { adminAuth, adminDb } = await import('../config/firebase.js');
      
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com'
      };

      adminAuth.verifyIdToken.mockResolvedValue(mockUser);
      adminDb.collection().doc().update.mockResolvedValue();

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({
          name: 'Updated Name',
          specialization: 'Cardiology'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile updated successfully');
    });
  });
});

describe('Authentication Middleware', () => {
  it('should authenticate valid token', async () => {
    const { adminAuth } = await import('../config/firebase.js');
    
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      role: 'doctor'
    };

    adminAuth.verifyIdToken.mockResolvedValue(mockUser);

    const response = await request(app)
      .get('/api/sessions')
      .set('Authorization', 'Bearer valid-token');
    
    // Should not return 401/403 (authentication passed)
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });

  it('should reject requests without authorization header', async () => {
    const response = await request(app)
      .get('/api/sessions');
    
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Access token required');
  });
});

// Cleanup after tests
afterEach(() => {
  jest.clearAllMocks();
});
