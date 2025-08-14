import { useState } from 'react';
import { 
  MicrophoneIcon, 
  StopIcon,
  PlayIcon,
  DocumentTextIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import './DemoPage.css';

export default function DemoPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [entities, setEntities] = useState([]);

  const mockTranscript = `Patient presents with chest pain that started this morning. Pain is described as sharp, 7/10 intensity, located in the left chest area. Patient has a history of hypertension and takes Lisinopril 10mg daily. No known allergies. Physical examination reveals normal heart sounds, blood pressure 140/90 mmHg. Recommend ECG and chest X-ray to rule out cardiac causes.`;

  const mockEntities = [
    { text: 'chest pain', label: 'symptom', confidence: 0.95 },
    { text: 'hypertension', label: 'condition', confidence: 0.92 },
    { text: 'Lisinopril', label: 'medication', confidence: 0.98 },
    { text: '10mg', label: 'dosage', confidence: 0.89 },
    { text: 'ECG', label: 'test', confidence: 0.94 },
    { text: 'chest X-ray', label: 'test', confidence: 0.91 },
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript('');
    setEntities([]);
    
    // Simulate real-time transcription
    setTimeout(() => {
      setTranscript('Patient presents with chest pain...');
    }, 1000);
    
    setTimeout(() => {
      setTranscript('Patient presents with chest pain that started this morning. Pain is described as sharp...');
    }, 3000);
    
    setTimeout(() => {
      setTranscript(mockTranscript);
      setEntities(mockEntities);
      setIsRecording(false);
    }, 6000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setTranscript(mockTranscript);
    setEntities(mockEntities);
  };

  const getEntityColor = (label) => {
    const colors = {
      symptom: 'entity-symptom',
      condition: 'entity-condition',
      medication: 'entity-medication',
      dosage: 'entity-dosage',
      test: 'entity-test',
      procedure: 'entity-procedure',
      anatomy: 'entity-anatomy',
    };
    return colors[label] || 'entity-symptom';
  };

  return (
    <div className="demo-page">
      {/* Header */}
      <header className="demo-header">
        <div className="container">
          <div className="demo-header-content">
            <div>
              <h1 className="demo-title">MedLens Demo</h1>
              <p className="demo-subtitle">Experience AI-powered medical transcription</p>
            </div>
            <a href="/" className="btn btn-outline">← Back to Home</a>
          </div>
        </div>
      </header>

      <main className="demo-main">
        <div className="container">
          <div className="demo-grid">
            {/* Recording Section */}
            <div className="demo-card">
              <div className="demo-card-header">
                <h2 className="demo-card-title">Audio Recording</h2>
              </div>
              <div className="demo-card-body">
                <div className="recording-section">
                  <div className="recording-visual">
                    {isRecording ? (
                      <div className="recording-active">
                        <div className="recording-indicator"></div>
                        <p className="recording-status">Recording in progress...</p>
                      </div>
                    ) : (
                      <div className="recording-idle">
                        <MicrophoneIcon className="recording-icon" />
                      </div>
                    )}
                  </div>

                  <div className="recording-controls">
                    {!isRecording ? (
                      <button
                        onClick={handleStartRecording}
                        className="btn btn-primary btn-lg"
                      >
                        <PlayIcon className="btn-icon" />
                        Start Demo Recording
                      </button>
                    ) : (
                      <button
                        onClick={handleStopRecording}
                        className="btn btn-error btn-lg"
                      >
                        <StopIcon className="btn-icon" />
                        Stop Recording
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Transcript */}
            <div className="demo-card">
              <div className="demo-card-header">
                <h2 className="demo-card-title">Live Transcript</h2>
              </div>
              <div className="demo-card-body">
                <div className="transcript-area">
                  {transcript ? (
                    <p className="transcript-text">{transcript}</p>
                  ) : (
                    <p className="transcript-placeholder">Start recording to see live transcription...</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Medical Entities */}
          {entities.length > 0 && (
            <div className="demo-card entities-card">
              <div className="demo-card-header">
                <h2 className="demo-card-title">Extracted Medical Entities</h2>
              </div>
              <div className="demo-card-body">
                <div className="entities-container">
                  {Object.entries(
                    entities.reduce((acc, entity) => {
                      if (!acc[entity.label]) acc[entity.label] = [];
                      acc[entity.label].push(entity);
                      return acc;
                    }, {})
                  ).map(([label, entityList]) => (
                    <div key={label} className="entity-group">
                      <h3 className="entity-group-title">
                        {label}s
                      </h3>
                      <div className="entity-tags">
                        {entityList.map((entity, index) => (
                          <span
                            key={index}
                            className={`entity-tag ${getEntityColor(entity.label)}`}
                          >
                            {entity.text}
                            <span className="entity-confidence">
                              ({Math.round(entity.confidence * 100)}%)
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Generated Summary */}
          {transcript && (
            <div className="summary-grid">
              <div className="demo-card">
                <div className="demo-card-header">
                  <h2 className="demo-card-title">Doctor Summary</h2>
                </div>
                <div className="demo-card-body">
                  <div className="summary-content">
                    <p><strong>Chief Complaint:</strong> Chest pain</p>
                    <p><strong>Assessment:</strong> Acute chest pain, rule out cardiac etiology</p>
                    <p><strong>Plan:</strong> ECG, chest X-ray, monitor vital signs</p>
                    <p><strong>Medications:</strong> Continue Lisinopril 10mg daily</p>
                  </div>
                </div>
              </div>

              <div className="demo-card">
                <div className="demo-card-header">
                  <h2 className="demo-card-title">Patient Summary</h2>
                </div>
                <div className="demo-card-body">
                  <div className="summary-content">
                    <p>
                      You came in today because of chest pain that started this morning. 
                      The pain is sharp and located on the left side of your chest. 
                      We will do some tests including an ECG (heart test) and chest X-ray 
                      to make sure your heart is okay. Please continue taking your blood 
                      pressure medicine as usual.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Showcase */}
          <div className="demo-card features-card">
            <div className="demo-card-header">
              <h2 className="demo-card-title">MedLens Features</h2>
            </div>
            <div className="demo-card-body">
              <div className="features-grid">
                <div className="feature-item">
                  <MicrophoneIcon className="feature-icon feature-icon-primary" />
                  <h3 className="feature-title">Real-time Transcription</h3>
                  <p className="feature-description">
                    Live audio-to-text conversion with medical terminology recognition
                  </p>
                </div>
                <div className="feature-item">
                  <DocumentTextIcon className="feature-icon feature-icon-success" />
                  <h3 className="feature-title">Entity Extraction</h3>
                  <p className="feature-description">
                    Automatic identification of symptoms, medications, and medical terms
                  </p>
                </div>
                <div className="feature-item">
                  <PhotoIcon className="feature-icon feature-icon-warning" />
                  <h3 className="feature-title">Image Analysis</h3>
                  <p className="feature-description">
                    AI-powered analysis of medical images and scans
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="demo-cta">
            <h2 className="demo-cta-title">Ready to Get Started?</h2>
            <p className="demo-cta-subtitle">
              Experience the full power of MedLens AI in your medical practice
            </p>
            <div className="demo-cta-actions">
              <a href="/login" className="btn btn-primary btn-lg">
                Start Free Trial
              </a>
              <a href="/" className="btn btn-outline btn-lg">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
