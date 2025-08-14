import express from 'express';
import { adminAuth, adminDb } from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Verify token and get user info
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const { uid, email, name } = req.user;
    
    // Get user document from Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get();
    let userData = { uid, email, name };
    
    if (userDoc.exists) {
      userData = { ...userData, ...userDoc.data() };
    } else {
      // Create user document if it doesn't exist
      const newUserData = {
        uid,
        email,
        name: name || email.split('@')[0],
        role: 'doctor', // Default role
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      await adminDb.collection('users').doc(uid).set(newUserData);
      userData = { ...userData, ...newUserData };
    }
    
    res.json({ user: userData });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ error: 'Failed to verify authentication' });
  }
});

// Set user role (admin only)
router.post('/set-role', authenticateToken, async (req, res) => {
  try {
    const { targetUserId, role } = req.body;
    
    // Check if current user is admin
    const currentUserDoc = await adminDb.collection('users').doc(req.user.uid).get();
    const currentUser = currentUserDoc.data();
    
    if (currentUser?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    // Set custom claims
    await adminAuth.setCustomUserClaims(targetUserId, { role });
    
    // Update user document
    await adminDb.collection('users').doc(targetUserId).update({
      role,
      updatedAt: new Date()
    });
    
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Set role error:', error);
    res.status(500).json({ error: 'Failed to set user role' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, specialization, licenseNumber } = req.body;
    const uid = req.user.uid;
    
    const updateData = {
      ...(name && { name }),
      ...(specialization && { specialization }),
      ...(licenseNumber && { licenseNumber }),
      updatedAt: new Date()
    };
    
    await adminDb.collection('users').doc(uid).update(updateData);
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
