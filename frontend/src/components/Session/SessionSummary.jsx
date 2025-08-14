import React from 'react';
import './SessionSummary.css';

const SessionSummary = ({ summary, session, transcript, entities, imageAnalysis }) => {
  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupEntitiesByType = (entities) => {
    if (!entities || entities.length === 0) return {};
    
    return entities.reduce((groups, entity) => {
      const type = entity.label || 'Other';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(entity);
      return groups;
    }, {});
  };

  const getEntityTypeIcon = (type) => {
    const icons = {
      'DISEASE': '🦠',
      'SYMPTOM': '🩺',
      'MEDICATION': '💊',
      'ANATOMY': '🫀',
      'PROCEDURE': '⚕️',
      'DOSAGE': '📏',
      'FREQUENCY': '⏰',
      'DURATION': '📅'
    };
    return icons[type.toUpperCase()] || '🏷️';
  };

  const exportSummary = () => {
    const summaryText = generateTextSummary();
    const element = document.createElement('a');
    const file = new Blob([summaryText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `session-summary-${session?.id || 'unknown'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateTextSummary = () => {
    const groupedEntities = groupEntitiesByType(entities);
    
    let text = `MEDICAL CONSULTATION SUMMARY\n`;
    text += `${'='.repeat(50)}\n\n`;
    
    text += `Patient: ${session?.patientName || 'Unknown'}\n`;
    text += `Session ID: ${session?.id || 'Unknown'}\n`;
    text += `Date: ${formatDate(session?.createdAt)}\n`;
    text += `Session Type: ${session?.sessionType || 'Unknown'}\n`;
    text += `Status: ${session?.status || 'Unknown'}\n\n`;
    
    if (summary) {
      text += `SUMMARY\n`;
      text += `${'-'.repeat(20)}\n`;
      text += `${summary}\n\n`;
    }
    
    if (Object.keys(groupedEntities).length > 0) {
      text += `MEDICAL ENTITIES\n`;
      text += `${'-'.repeat(20)}\n`;
      Object.entries(groupedEntities).forEach(([type, entityList]) => {
        text += `${type}:\n`;
        entityList.forEach(entity => {
          text += `  - ${entity.text} (${(entity.confidence * 100).toFixed(1)}%)\n`;
        });
        text += '\n';
      });
    }
    
    if (imageAnalysis && imageAnalysis.length > 0) {
      text += `IMAGE ANALYSIS\n`;
      text += `${'-'.repeat(20)}\n`;
      imageAnalysis.forEach((result, index) => {
        text += `${index + 1}. ${result.label} (${(result.confidence * 100).toFixed(1)}%)\n`;
        text += `   ${result.description}\n\n`;
      });
    }
    
    if (transcript) {
      text += `FULL TRANSCRIPT\n`;
      text += `${'-'.repeat(20)}\n`;
      text += `${transcript}\n\n`;
    }
    
    text += `Generated on: ${new Date().toLocaleString()}\n`;
    
    return text;
  };

  const groupedEntities = groupEntitiesByType(entities);

  return (
    <div className="session-summary">
      <div className="summary-header">
        <h3>Session Summary</h3>
        <button 
          className="export-summary-btn"
          onClick={exportSummary}
        >
          📄 Export Summary
        </button>
      </div>

      <div className="summary-content">
        {/* Session Information */}
        <div className="summary-section">
          <h4>Session Information</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Patient:</span>
              <span className="info-value">{session?.patientName || 'Unknown'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date:</span>
              <span className="info-value">{formatDate(session?.createdAt)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Type:</span>
              <span className="info-value">{session?.sessionType || 'Unknown'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`info-value status-${session?.status}`}>
                {session?.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* AI Generated Summary */}
        {summary && (
          <div className="summary-section">
            <h4>AI Generated Summary</h4>
            <div className="summary-text">
              {summary}
            </div>
          </div>
        )}

        {/* Medical Entities */}
        {Object.keys(groupedEntities).length > 0 && (
          <div className="summary-section">
            <h4>Medical Entities Identified</h4>
            <div className="entities-by-type">
              {Object.entries(groupedEntities).map(([type, entityList]) => (
                <div key={type} className="entity-type-group">
                  <h5>
                    <span className="entity-icon">{getEntityTypeIcon(type)}</span>
                    {type} ({entityList.length})
                  </h5>
                  <div className="entity-list">
                    {entityList.map((entity, index) => (
                      <span 
                        key={index}
                        className="entity-tag"
                        title={`Confidence: ${(entity.confidence * 100).toFixed(1)}%`}
                      >
                        {entity.text}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Analysis Results */}
        {imageAnalysis && imageAnalysis.length > 0 && (
          <div className="summary-section">
            <h4>Image Analysis Results</h4>
            <div className="image-analysis-results">
              {imageAnalysis.map((result, index) => (
                <div key={index} className="analysis-result-card">
                  <div className="result-header">
                    <span className="result-rank">#{index + 1}</span>
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

        {/* Session Statistics */}
        <div className="summary-section">
          <h4>Session Statistics</h4>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">
                {transcript ? transcript.trim().split(/\s+/).length : 0}
              </div>
              <div className="stat-label">Words Transcribed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {entities ? entities.length : 0}
              </div>
              <div className="stat-label">Entities Identified</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {Object.keys(groupedEntities).length}
              </div>
              <div className="stat-label">Entity Types</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {imageAnalysis ? imageAnalysis.length : 0}
              </div>
              <div className="stat-label">Image Analyses</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="summary-section">
          <h4>Recommendations</h4>
          <div className="recommendations">
            <div className="recommendation-item">
              <span className="recommendation-icon">📋</span>
              <div>
                <strong>Review Summary:</strong> Verify the AI-generated summary for accuracy and completeness.
              </div>
            </div>
            <div className="recommendation-item">
              <span className="recommendation-icon">🔍</span>
              <div>
                <strong>Validate Entities:</strong> Check identified medical entities for clinical relevance.
              </div>
            </div>
            {imageAnalysis && imageAnalysis.length > 0 && (
              <div className="recommendation-item">
                <span className="recommendation-icon">🖼️</span>
                <div>
                  <strong>Image Analysis:</strong> Consider professional radiological review for definitive diagnosis.
                </div>
              </div>
            )}
            <div className="recommendation-item">
              <span className="recommendation-icon">💾</span>
              <div>
                <strong>Documentation:</strong> Export and save this summary to the patient's medical record.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;
