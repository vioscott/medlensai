import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { adminDb } from '../config/firebase.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create new session
router.post('/', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { patientName, patientId, sessionType = 'consultation' } = req.body;
    
    if (!patientName) {
      return res.status(400).json({ error: 'Patient name is required' });
    }
    
    const sessionId = uuidv4();
    const sessionData = {
      id: sessionId,
      doctorId: req.user.uid,
      doctorName: req.user.name || req.user.email,
      patientName,
      patientId: patientId || null,
      sessionType,
      status: 'active',
      transcript: '',
      entities: [],
      summary: '',
      imageAnalysis: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await adminDb.collection('sessions').doc(sessionId).set(sessionData);
    
    res.status(201).json({ session: sessionData });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get all sessions for current doctor
router.get('/', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { limit = 20, offset = 0, status } = req.query;
    
    let query = adminDb.collection('sessions')
      .where('doctorId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.get();
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
    
    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to retrieve sessions' });
  }
});

// Get specific session
router.get('/:sessionId', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const sessionDoc = await adminDb.collection('sessions').doc(sessionId).get();
    
    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const sessionData = sessionDoc.data();
    
    // Check if user owns this session
    if (sessionData.doctorId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({
      session: {
        id: sessionDoc.id,
        ...sessionData,
        createdAt: sessionData.createdAt?.toDate(),
        updatedAt: sessionData.updatedAt?.toDate()
      }
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

// Update session
router.put('/:sessionId', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { transcript, entities, summary, imageAnalysis, status } = req.body;
    
    // Check if session exists and user owns it
    const sessionDoc = await adminDb.collection('sessions').doc(sessionId).get();
    
    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const sessionData = sessionDoc.data();
    if (sessionData.doctorId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const updateData = {
      ...(transcript !== undefined && { transcript }),
      ...(entities !== undefined && { entities }),
      ...(summary !== undefined && { summary }),
      ...(imageAnalysis !== undefined && { imageAnalysis }),
      ...(status !== undefined && { status }),
      updatedAt: new Date()
    };
    
    await adminDb.collection('sessions').doc(sessionId).update(updateData);
    
    res.json({ message: 'Session updated successfully' });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Delete session
router.delete('/:sessionId', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Check if session exists and user owns it
    const sessionDoc = await adminDb.collection('sessions').doc(sessionId).get();
    
    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const sessionData = sessionDoc.data();
    if (sessionData.doctorId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await adminDb.collection('sessions').doc(sessionId).delete();
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;
