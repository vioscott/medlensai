import request from 'supertest';
import { jest } from '@jest/globals';

// Mock Firebase Admin
jest.mock('../config/firebase.js', () => ({
  adminAuth: {
    verifyIdToken: jest.fn()
  },
  adminDb: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      })),
      where: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          limit: jest.fn(() => ({
            offset: jest.fn(() => ({
              get: jest.fn()
            }))
          }))
        }))
      }))
    }))
  }
}));

import app from '../server.js';

describe('Session Routes', () => {
  const mockAuthUser = {
    uid: 'test-doctor-uid',
    email: 'doctor@test.com',
    role: 'doctor'
  };

  beforeEach(() => {
    const { adminAuth } = require('../config/firebase.js');
    adminAuth.verifyIdToken.mockResolvedValue(mockAuthUser);
  });

  describe('POST /api/sessions', () => {
    it('should create a new session with valid data', async () => {
      const { adminDb } = await import('../config/firebase.js');
      adminDb.collection().doc().set.mockResolvedValue();

      const sessionData = {
        patientName: 'John Doe',
        patientId: 'P123',
        sessionType: 'consultation'
      };

      const response = await request(app)
        .post('/api/sessions')
        .set('Authorization', 'Bearer valid-token')
        .send(sessionData);
      
      expect(response.status).toBe(201);
      expect(response.body.session).toMatchObject({
        doctorId: mockAuthUser.uid,
        patientName: 'John Doe',
        sessionType: 'consultation',
        status: 'active'
      });
      expect(response.body.session.id).toBeDefined();
    });

    it('should return 400 without patient name', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .set('Authorization', 'Bearer valid-token')
        .send({
          sessionType: 'consultation'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Patient name is required');
    });

    it('should require doctor role', async () => {
      const { adminAuth } = await import('../config/firebase.js');
      adminAuth.verifyIdToken.mockResolvedValue({
        uid: 'test-uid',
        role: 'patient'
      });

      const response = await request(app)
        .post('/api/sessions')
        .set('Authorization', 'Bearer valid-token')
        .send({
          patientName: 'John Doe'
        });
      
      expect(response.status).toBe(403);
      expect(response.body.error).toContain('doctor role required');
    });
  });

  describe('GET /api/sessions', () => {
    it('should return user sessions', async () => {
      const { adminDb } = await import('../config/firebase.js');
      
      const mockSessions = [
        {
          id: 'session1',
          data: () => ({
            doctorId: mockAuthUser.uid,
            patientName: 'John Doe',
            createdAt: { toDate: () => new Date() }
          })
        }
      ];

      adminDb.collection().where().orderBy().limit().offset().get.mockResolvedValue({
        docs: mockSessions
      });

      const response = await request(app)
        .get('/api/sessions')
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(200);
      expect(response.body.sessions).toHaveLength(1);
      expect(response.body.sessions[0].patientName).toBe('John Doe');
    });
  });

  describe('GET /api/sessions/:sessionId', () => {
    it('should return specific session for owner', async () => {
      const { adminDb } = await import('../config/firebase.js');
      
      const mockSession = {
        exists: true,
        data: () => ({
          doctorId: mockAuthUser.uid,
          patientName: 'John Doe',
          createdAt: { toDate: () => new Date() }
        })
      };

      adminDb.collection().doc().get.mockResolvedValue(mockSession);

      const response = await request(app)
        .get('/api/sessions/test-session-id')
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(200);
      expect(response.body.session.patientName).toBe('John Doe');
    });

    it('should return 404 for non-existent session', async () => {
      const { adminDb } = await import('../config/firebase.js');
      
      adminDb.collection().doc().get.mockResolvedValue({
        exists: false
      });

      const response = await request(app)
        .get('/api/sessions/non-existent')
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Session not found');
    });

    it('should return 403 for non-owner access', async () => {
      const { adminDb } = await import('../config/firebase.js');
      
      const mockSession = {
        exists: true,
        data: () => ({
          doctorId: 'different-doctor-uid',
          patientName: 'John Doe'
        })
      };

      adminDb.collection().doc().get.mockResolvedValue(mockSession);

      const response = await request(app)
        .get('/api/sessions/test-session-id')
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Access denied');
    });
  });

  describe('PUT /api/sessions/:sessionId', () => {
    it('should update session for owner', async () => {
      const { adminDb } = await import('../config/firebase.js');
      
      const mockSession = {
        exists: true,
        data: () => ({
          doctorId: mockAuthUser.uid,
          patientName: 'John Doe'
        })
      };

      adminDb.collection().doc().get.mockResolvedValue(mockSession);
      adminDb.collection().doc().update.mockResolvedValue();

      const response = await request(app)
        .put('/api/sessions/test-session-id')
        .set('Authorization', 'Bearer valid-token')
        .send({
          transcript: 'Updated transcript',
          status: 'completed'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Session updated successfully');
    });
  });

  describe('DELETE /api/sessions/:sessionId', () => {
    it('should delete session for owner', async () => {
      const { adminDb } = await import('../config/firebase.js');
      
      const mockSession = {
        exists: true,
        data: () => ({
          doctorId: mockAuthUser.uid,
          patientName: 'John Doe'
        })
      };

      adminDb.collection().doc().get.mockResolvedValue(mockSession);
      adminDb.collection().doc().delete.mockResolvedValue();

      const response = await request(app)
        .delete('/api/sessions/test-session-id')
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Session deleted successfully');
    });
  });
});

// Cleanup after tests
afterEach(() => {
  jest.clearAllMocks();
});
