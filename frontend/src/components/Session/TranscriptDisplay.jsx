import React, { useEffect, useRef } from 'react';
import './TranscriptDisplay.css';

const TranscriptDisplay = ({ transcript, entities, isRecording }) => {
  const transcriptRef = useRef(null);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Highlight entities in the transcript
  const highlightEntities = (text) => {
    if (!entities || entities.length === 0) {
      return text;
    }

    let highlightedText = text;
    const entityMap = new Map();

    // Group entities by text to avoid duplicate highlighting
    entities.forEach(entity => {
      if (!entityMap.has(entity.text)) {
        entityMap.set(entity.text, entity);
      }
    });

    // Sort entities by length (longest first) to avoid partial matches
    const sortedEntities = Array.from(entityMap.values())
      .sort((a, b) => b.text.length - a.text.length);

    sortedEntities.forEach(entity => {
      const regex = new RegExp(`\\b${entity.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, (match) => {
        const entityClass = getEntityClass(entity.label);
        return `<span class="entity-highlight ${entityClass}" title="${entity.label} (${(entity.confidence * 100).toFixed(1)}%)">${match}</span>`;
      });
    });

    return highlightedText;
  };

  const getEntityClass = (label) => {
    const labelMap = {
      'DISEASE': 'entity-disease',
      'SYMPTOM': 'entity-symptom',
      'MEDICATION': 'entity-medication',
      'ANATOMY': 'entity-anatomy',
      'PROCEDURE': 'entity-procedure',
      'DOSAGE': 'entity-dosage',
      'FREQUENCY': 'entity-frequency',
      'DURATION': 'entity-duration'
    };
    
    return labelMap[label.toUpperCase()] || 'entity-other';
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy transcript:', err);
    }
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="transcript-display">
      <div className="transcript-header">
        <h3>Live Transcript</h3>
        <div className="transcript-actions">
          <button 
            className="copy-btn"
            onClick={copyToClipboard}
            disabled={!transcript.trim()}
            title="Copy transcript"
          >
            📋
          </button>
          <button 
            className="download-btn"
            onClick={downloadTranscript}
            disabled={!transcript.trim()}
            title="Download transcript"
          >
            💾
          </button>
        </div>
      </div>

      <div className="transcript-container">
        <div 
          ref={transcriptRef}
          className="transcript-content"
        >
          {transcript.trim() ? (
            <div 
              className="transcript-text"
              dangerouslySetInnerHTML={{ 
                __html: highlightEntities(transcript) 
              }}
            />
          ) : (
            <div className="transcript-placeholder">
              {isRecording ? (
                <div className="listening-indicator">
                  <div className="listening-animation">
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                  </div>
                  <p>Listening... Start speaking to see live transcription</p>
                </div>
              ) : (
                <div className="start-recording-prompt">
                  <div className="mic-icon">🎤</div>
                  <p>Click the record button to start transcribing</p>
                </div>
              )}
            </div>
          )}
        </div>

        {isRecording && transcript.trim() && (
          <div className="recording-status">
            <span className="recording-dot"></span>
            Transcribing...
          </div>
        )}
      </div>

      {entities && entities.length > 0 && (
        <div className="entity-legend">
          <h4>Entity Types:</h4>
          <div className="legend-items">
            <span className="legend-item">
              <span className="legend-color entity-disease"></span>
              Disease
            </span>
            <span className="legend-item">
              <span className="legend-color entity-symptom"></span>
              Symptom
            </span>
            <span className="legend-item">
              <span className="legend-color entity-medication"></span>
              Medication
            </span>
            <span className="legend-item">
              <span className="legend-color entity-anatomy"></span>
              Anatomy
            </span>
            <span className="legend-item">
              <span className="legend-color entity-procedure"></span>
              Procedure
            </span>
            <span className="legend-item">
              <span className="legend-color entity-other"></span>
              Other
            </span>
          </div>
        </div>
      )}

      <div className="transcript-stats">
        <div className="stat">
          <span className="stat-label">Words:</span>
          <span className="stat-value">
            {transcript.trim() ? transcript.trim().split(/\s+/).length : 0}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Characters:</span>
          <span className="stat-value">{transcript.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Entities:</span>
          <span className="stat-value">{entities ? entities.length : 0}</span>
        </div>
      </div>
    </div>
  );
};

export default TranscriptDisplay;
