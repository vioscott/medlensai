import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AudioRecorder from './AudioRecorder';
import TranscriptDisplay from './TranscriptDisplay';
import ImageUpload from './ImageUpload';
import SessionSummary from './SessionSummary';
import axios from 'axios';
import io from 'socket.io-client';
import './SessionView.css';

const SessionView = () => {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [entities, setEntities] = useState([]);
  const [summary, setSummary] = useState('');
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('recording');

  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const newSocket = io(API_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('transcript-chunk', (data) => {
      setTranscript(prev => prev + ' ' + data.text);
    });

    newSocket.on('transcription-error', (error) => {
      console.error('Transcription error:', error);
      setError(error.error);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch session data
  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/sessions/${sessionId}`);
      const sessionData = response.data.session;
      
      setSession(sessionData);
      setTranscript(sessionData.transcript || '');
      setEntities(sessionData.entities || []);
      setSummary(sessionData.summary || '');
      setImageAnalysis(sessionData.imageAnalysis || null);
    } catch (error) {
      console.error('Failed to fetch session:', error);
      if (error.response?.status === 404) {
        setError('Session not found');
      } else if (error.response?.status === 403) {
        setError('Access denied');
      } else {
        setError('Failed to load session');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartRecording = () => {
    if (socket && session) {
      socket.emit('start-transcription', {
        sessionId: session.id,
        userId: user.uid
      });
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (socket) {
      socket.emit('stop-transcription');
      setIsRecording(false);
    }
  };

  const handleAudioChunk = (audioData, isLast = false) => {
    if (socket && isRecording) {
      socket.emit('audio-chunk', {
        audioData,
        isLast
      });
    }
  };

  const handleImageUpload = async (imageData) => {
    try {
      const response = await axios.post('/api/ai/analyze-image', {
        imageData
      });
      
      setImageAnalysis(response.data.analysis);
      
      // Update session with image analysis
      await updateSession({ imageAnalysis: response.data.analysis });
    } catch (error) {
      console.error('Image analysis failed:', error);
      setError('Failed to analyze image');
    }
  };

  const generateSummary = async () => {
    if (!transcript.trim()) {
      setError('No transcript available to summarize');
      return;
    }

    try {
      const response = await axios.post('/api/ai/summarize', {
        text: transcript
      });
      
      setSummary(response.data.summary);
      
      // Update session with summary
      await updateSession({ summary: response.data.summary });
    } catch (error) {
      console.error('Summarization failed:', error);
      setError('Failed to generate summary');
    }
  };

  const extractEntities = async () => {
    if (!transcript.trim()) {
      setError('No transcript available for entity extraction');
      return;
    }

    try {
      const response = await axios.post('/api/ai/extract-entities', {
        text: transcript
      });
      
      setEntities(response.data.entities);
      
      // Update session with entities
      await updateSession({ entities: response.data.entities });
    } catch (error) {
      console.error('Entity extraction failed:', error);
      setError('Failed to extract entities');
    }
  };

  const updateSession = async (updates) => {
    try {
      await axios.put(`/api/sessions/${sessionId}`, updates);
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  };

  const handleCompleteSession = async () => {
    try {
      await updateSession({ status: 'completed' });
      setSession(prev => ({ ...prev, status: 'completed' }));
    } catch (error) {
      console.error('Failed to complete session:', error);
      setError('Failed to complete session');
    }
  };

  const exportToPDF = async () => {
    try {
      // This would typically call a backend endpoint to generate PDF
      const response = await axios.post(`/api/sessions/${sessionId}/export`, {
        format: 'pdf'
      }, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `session-${sessionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('PDF export failed:', error);
      setError('Failed to export PDF');
    }
  };

  if (loading) {
    return (
      <div className="session-loading">
        <div className="spinner"></div>
        <p>Loading session...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="session-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="session-view">
      <header className="session-header">
        <div className="session-info">
          <button 
            className="back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Back
          </button>
          <div>
            <h1>{session?.patientName}</h1>
            <p>Session ID: {sessionId}</p>
            <span className={`status-badge status-${session?.status}`}>
              {session?.status}
            </span>
          </div>
        </div>
        <div className="session-actions">
          <button 
            className="summary-btn"
            onClick={generateSummary}
            disabled={!transcript.trim()}
          >
            Generate Summary
          </button>
          <button 
            className="entities-btn"
            onClick={extractEntities}
            disabled={!transcript.trim()}
          >
            Extract Entities
          </button>
          <button 
            className="complete-btn"
            onClick={handleCompleteSession}
            disabled={session?.status === 'completed'}
          >
            Complete Session
          </button>
          <button 
            className="export-btn"
            onClick={exportToPDF}
          >
            Export PDF
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="session-content">
        <div className="session-tabs">
          <button 
            className={`tab ${activeTab === 'recording' ? 'active' : ''}`}
            onClick={() => setActiveTab('recording')}
          >
            Recording
          </button>
          <button 
            className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            Analysis
          </button>
          <button 
            className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'recording' && (
            <div className="recording-tab">
              <div className="recording-section">
                <AudioRecorder
                  isRecording={isRecording}
                  onStartRecording={handleStartRecording}
                  onStopRecording={handleStopRecording}
                  onAudioChunk={handleAudioChunk}
                />
                <ImageUpload onImageUpload={handleImageUpload} />
              </div>
              <div className="transcript-section">
                <TranscriptDisplay 
                  transcript={transcript}
                  entities={entities}
                  isRecording={isRecording}
                />
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="analysis-tab">
              <div className="entities-section">
                <h3>Medical Entities</h3>
                {entities.length > 0 ? (
                  <div className="entities-list">
                    {entities.map((entity, index) => (
                      <span 
                        key={index}
                        className={`entity entity-${entity.label.toLowerCase()}`}
                        title={`${entity.label} (${(entity.confidence * 100).toFixed(1)}%)`}
                      >
                        {entity.text}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No entities extracted yet</p>
                )}
              </div>

              {imageAnalysis && (
                <div className="image-analysis-section">
                  <h3>Image Analysis</h3>
                  <div className="analysis-results">
                    {imageAnalysis.map((result, index) => (
                      <div key={index} className="analysis-result">
                        <div className="result-header">
                          <span className="result-label">{result.label}</span>
                          <span className="result-confidence">
                            {(result.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <p className="result-description">{result.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <SessionSummary 
              summary={summary}
              session={session}
              transcript={transcript}
              entities={entities}
              imageAnalysis={imageAnalysis}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionView;
