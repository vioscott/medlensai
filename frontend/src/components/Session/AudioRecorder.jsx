import React, { useState, useRef, useEffect } from 'react';
import './AudioRecorder.css';

const AudioRecorder = ({ isRecording, onStartRecording, onStopRecording, onAudioChunk }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  // Request microphone permission on component mount
  useEffect(() => {
    requestMicrophonePermission();
    return () => {
      cleanup();
    };
  }, []);

  // Handle recording state changes
  useEffect(() => {
    if (isRecording) {
      startRecording();
      startTimer();
    } else {
      stopRecording();
      stopTimer();
    }
  }, [isRecording]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      setHasPermission(true);
      setError(null);
      
      // Store stream for later use
      streamRef.current = stream;
      
      // Set up audio analysis
      setupAudioAnalysis(stream);
      
    } catch (err) {
      console.error('Microphone permission denied:', err);
      setError('Microphone access is required for recording');
      setHasPermission(false);
    }
  };

  const setupAudioAnalysis = (stream) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      // Start audio level monitoring
      monitorAudioLevel();
    } catch (err) {
      console.error('Audio analysis setup failed:', err);
    }
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average audio level
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalizedLevel = Math.min(average / 128, 1);
      
      setAudioLevel(normalizedLevel);
      
      if (isRecording) {
        animationRef.current = requestAnimationFrame(updateLevel);
      }
    };
    
    updateLevel();
  };

  const startRecording = async () => {
    try {
      if (!streamRef.current) {
        await requestMicrophonePermission();
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Convert blob to base64 and send to parent
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            onAudioChunk(base64Data);
          };
          reader.readAsDataURL(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setError('Recording error occurred');
      };

      // Start recording with time slices for real-time processing
      mediaRecorder.start(1000); // 1 second chunks
      
      // Resume audio context if suspended
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      // Start audio level monitoring
      monitorAudioLevel();
      
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop audio level monitoring
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setAudioLevel(0);
  };

  const startTimer = () => {
    setRecordingTime(0);
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const cleanup = () => {
    stopRecording();
    stopTimer();
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  if (!hasPermission) {
    return (
      <div className="audio-recorder">
        <div className="permission-request">
          <div className="mic-icon">🎤</div>
          <h3>Microphone Access Required</h3>
          <p>Please allow microphone access to record audio</p>
          {error && <p className="error-text">{error}</p>}
          <button 
            className="permission-btn"
            onClick={requestMicrophonePermission}
          >
            Grant Permission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="audio-recorder">
      <div className="recorder-header">
        <h3>Audio Recording</h3>
        {isRecording && (
          <div className="recording-indicator">
            <span className="recording-dot"></span>
            Recording
          </div>
        )}
      </div>

      <div className="recorder-controls">
        <div className="audio-visualizer">
          <div className="visualizer-container">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="visualizer-bar"
                style={{
                  height: `${Math.max(5, audioLevel * 100 * (Math.random() * 0.5 + 0.5))}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="control-buttons">
          <button
            className={`record-btn ${isRecording ? 'recording' : ''}`}
            onClick={handleToggleRecording}
            disabled={!hasPermission}
          >
            {isRecording ? (
              <div className="stop-icon">⏹</div>
            ) : (
              <div className="record-icon">🎤</div>
            )}
          </button>
        </div>

        <div className="recording-info">
          <div className="timer">
            {formatTime(recordingTime)}
          </div>
          <div className="audio-level">
            <div className="level-label">Level:</div>
            <div className="level-bar">
              <div 
                className="level-fill"
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="recorder-tips">
        <h4>Recording Tips:</h4>
        <ul>
          <li>Speak clearly and at a normal pace</li>
          <li>Keep background noise to a minimum</li>
          <li>Position microphone 6-12 inches from your mouth</li>
          <li>Recording will be transcribed in real-time</li>
        </ul>
      </div>
    </div>
  );
};

export default AudioRecorder;
