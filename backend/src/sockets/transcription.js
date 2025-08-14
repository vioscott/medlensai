import axios from 'axios';
import { adminDb } from '../config/firebase.js';

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Store active transcription sessions
const activeSessions = new Map();

export const handleTranscriptionSocket = (socket, io) => {
  // Start transcription session
  socket.on('start-transcription', async (data) => {
    try {
      const { sessionId, userId } = data;
      
      if (!sessionId || !userId) {
        socket.emit('transcription-error', { error: 'Session ID and User ID are required' });
        return;
      }
      
      // Verify session exists and user has access
      const sessionDoc = await adminDb.collection('sessions').doc(sessionId).get();
      
      if (!sessionDoc.exists) {
        socket.emit('transcription-error', { error: 'Session not found' });
        return;
      }
      
      const sessionData = sessionDoc.data();
      if (sessionData.doctorId !== userId) {
        socket.emit('transcription-error', { error: 'Access denied' });
        return;
      }
      
      // Store session info
      activeSessions.set(socket.id, {
        sessionId,
        userId,
        transcript: sessionData.transcript || '',
        lastUpdate: Date.now()
      });
      
      socket.emit('transcription-started', { sessionId });
      console.log(`Transcription started for session ${sessionId}`);
      
    } catch (error) {
      console.error('Start transcription error:', error);
      socket.emit('transcription-error', { error: 'Failed to start transcription' });
    }
  });
  
  // Handle audio chunks for real-time transcription
  socket.on('audio-chunk', async (data) => {
    try {
      const sessionInfo = activeSessions.get(socket.id);
      
      if (!sessionInfo) {
        socket.emit('transcription-error', { error: 'No active transcription session' });
        return;
      }
      
      const { audioData, isLast = false } = data;
      
      if (!audioData) {
        socket.emit('transcription-error', { error: 'Audio data is required' });
        return;
      }
      
      // Convert base64 to buffer
      const audioBuffer = Buffer.from(audioData, 'base64');
      
      // Call Hugging Face Whisper API
      const response = await axios.post(
        `${HUGGINGFACE_API_URL}/openai/whisper-large-v3`,
        audioBuffer,
        {
          headers: {
            'Authorization': `Bearer ${HF_API_KEY}`,
            'Content-Type': 'audio/wav'
          }
        }
      );
      
      const transcriptChunk = response.data.text || '';
      
      if (transcriptChunk.trim()) {
        // Update session transcript
        sessionInfo.transcript += ' ' + transcriptChunk;
        sessionInfo.lastUpdate = Date.now();
        
        // Emit the new transcript chunk
        socket.emit('transcript-chunk', {
          text: transcriptChunk,
          timestamp: Date.now(),
          isLast
        });
        
        // Update database every few seconds or on last chunk
        const timeSinceLastUpdate = Date.now() - sessionInfo.lastUpdate;
        if (timeSinceLastUpdate > 5000 || isLast) {
          await updateSessionTranscript(sessionInfo.sessionId, sessionInfo.transcript);
        }
      }
      
    } catch (error) {
      console.error('Audio chunk processing error:', error);
      socket.emit('transcription-error', { 
        error: 'Failed to process audio chunk',
        details: error.response?.data || error.message
      });
    }
  });
  
  // Stop transcription session
  socket.on('stop-transcription', async () => {
    try {
      const sessionInfo = activeSessions.get(socket.id);
      
      if (!sessionInfo) {
        socket.emit('transcription-error', { error: 'No active transcription session' });
        return;
      }
      
      // Final update to database
      await updateSessionTranscript(sessionInfo.sessionId, sessionInfo.transcript);
      
      // Clean up
      activeSessions.delete(socket.id);
      
      socket.emit('transcription-stopped', {
        sessionId: sessionInfo.sessionId,
        finalTranscript: sessionInfo.transcript
      });
      
      console.log(`Transcription stopped for session ${sessionInfo.sessionId}`);
      
    } catch (error) {
      console.error('Stop transcription error:', error);
      socket.emit('transcription-error', { error: 'Failed to stop transcription' });
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', async () => {
    try {
      const sessionInfo = activeSessions.get(socket.id);
      
      if (sessionInfo) {
        // Save final transcript
        await updateSessionTranscript(sessionInfo.sessionId, sessionInfo.transcript);
        activeSessions.delete(socket.id);
        console.log(`Client disconnected, saved transcript for session ${sessionInfo.sessionId}`);
      }
    } catch (error) {
      console.error('Disconnect cleanup error:', error);
    }
  });
};

// Helper function to update session transcript in database
const updateSessionTranscript = async (sessionId, transcript) => {
  try {
    await adminDb.collection('sessions').doc(sessionId).update({
      transcript: transcript.trim(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Failed to update session transcript:', error);
    throw error;
  }
};

// Clean up inactive sessions (run periodically)
setInterval(() => {
  const now = Date.now();
  const timeout = 30 * 60 * 1000; // 30 minutes
  
  for (const [socketId, sessionInfo] of activeSessions.entries()) {
    if (now - sessionInfo.lastUpdate > timeout) {
      console.log(`Cleaning up inactive session: ${sessionInfo.sessionId}`);
      activeSessions.delete(socketId);
    }
  }
}, 5 * 60 * 1000); // Check every 5 minutes
