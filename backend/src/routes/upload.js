import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { adminStorage } from '../config/firebase.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow audio and image files
    const allowedTypes = [
      'audio/wav',
      'audio/mp3',
      'audio/mpeg',
      'audio/webm',
      'audio/ogg',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio and image files are allowed.'));
    }
  }
});

// Upload audio file
router.post('/audio', authenticateToken, requireRole('doctor'), upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }
    
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const fileId = uuidv4();
    const fileName = `sessions/${sessionId}/audio/${fileId}_${req.file.originalname}`;
    
    // Upload to Firebase Storage
    const bucket = adminStorage.bucket();
    const file = bucket.file(fileName);
    
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          uploadedBy: req.user.uid,
          sessionId: sessionId,
          originalName: req.file.originalname
        }
      }
    });
    
    // Get download URL
    const [downloadURL] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.json({
      fileId,
      fileName,
      downloadURL,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ error: 'Failed to upload audio file' });
  }
});

// Upload image file
router.post('/image', authenticateToken, requireRole('doctor'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const fileId = uuidv4();
    const fileName = `sessions/${sessionId}/images/${fileId}_${req.file.originalname}`;
    
    // Upload to Firebase Storage
    const bucket = adminStorage.bucket();
    const file = bucket.file(fileName);
    
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          uploadedBy: req.user.uid,
          sessionId: sessionId,
          originalName: req.file.originalname
        }
      }
    });
    
    // Get download URL
    const [downloadURL] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.json({
      fileId,
      fileName,
      downloadURL,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image file' });
  }
});

// Get file from storage
router.get('/file/:sessionId/:fileType/:fileId', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { sessionId, fileType, fileId } = req.params;
    
    // Validate file type
    if (!['audio', 'images'].includes(fileType)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }
    
    const bucket = adminStorage.bucket();
    const files = await bucket.getFiles({
      prefix: `sessions/${sessionId}/${fileType}/${fileId}`
    });
    
    if (files[0].length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const file = files[0][0];
    
    // Get download URL
    const [downloadURL] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000 // 1 hour
    });
    
    res.json({ downloadURL });
  } catch (error) {
    console.error('File retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
});

// Delete file from storage
router.delete('/file/:sessionId/:fileType/:fileId', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { sessionId, fileType, fileId } = req.params;
    
    // Validate file type
    if (!['audio', 'images'].includes(fileType)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }
    
    const bucket = adminStorage.bucket();
    const files = await bucket.getFiles({
      prefix: `sessions/${sessionId}/${fileType}/${fileId}`
    });
    
    if (files[0].length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const file = files[0][0];
    await file.delete();
    
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// List files for a session
router.get('/files/:sessionId', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const bucket = adminStorage.bucket();
    const [files] = await bucket.getFiles({
      prefix: `sessions/${sessionId}/`
    });
    
    const fileList = await Promise.all(
      files.map(async (file) => {
        const [metadata] = await file.getMetadata();
        return {
          name: file.name,
          size: metadata.size,
          contentType: metadata.contentType,
          created: metadata.timeCreated,
          updated: metadata.updated
        };
      })
    );
    
    res.json({ files: fileList });
  } catch (error) {
    console.error('File listing error:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

export default router;
