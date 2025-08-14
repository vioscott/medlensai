import express from 'express';
import axios from 'axios';
import FormData from 'form-data';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Helper function to make HuggingFace API requests
const callHuggingFaceAPI = async (modelName, data, isFile = false) => {
  const url = `${HUGGINGFACE_API_URL}/${modelName}`;
  
  const config = {
    headers: {
      'Authorization': `Bearer ${HF_API_KEY}`,
      ...(isFile ? {} : { 'Content-Type': 'application/json' })
    }
  };
  
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`HuggingFace API error for ${modelName}:`, error.response?.data || error.message);
    throw new Error(`AI service temporarily unavailable: ${error.response?.data?.error || error.message}`);
  }
};

// Audio to text transcription
router.post('/transcribe', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { audioData } = req.body; // Base64 encoded audio
    
    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required' });
    }
    
    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioData, 'base64');
    
    // Use Whisper model for transcription
    const result = await callHuggingFaceAPI(
      'openai/whisper-large-v3',
      audioBuffer,
      true
    );
    
    const transcript = result.text || '';
    
    res.json({ transcript });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: error.message || 'Failed to transcribe audio' });
  }
});

// Named Entity Recognition for medical terms
router.post('/extract-entities', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Use BioBERT or similar medical NER model
    const result = await callHuggingFaceAPI(
      'dmis-lab/biobert-base-cased-v1.2-ner',
      { inputs: text }
    );
    
    // Process and filter medical entities
    const entities = result
      .filter(entity => entity.score > 0.5) // Filter by confidence
      .map(entity => ({
        text: entity.word,
        label: entity.entity_group || entity.entity,
        confidence: entity.score,
        start: entity.start,
        end: entity.end
      }));
    
    res.json({ entities });
  } catch (error) {
    console.error('Entity extraction error:', error);
    res.status(500).json({ error: error.message || 'Failed to extract entities' });
  }
});

// Text summarization
router.post('/summarize', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { text, maxLength = 150, minLength = 50 } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Use BART or T5 model for summarization
    const result = await callHuggingFaceAPI(
      'facebook/bart-large-cnn',
      {
        inputs: text,
        parameters: {
          max_length: maxLength,
          min_length: minLength,
          do_sample: false
        }
      }
    );
    
    const summary = result[0]?.summary_text || result.summary_text || '';
    
    res.json({ summary });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate summary' });
  }
});

// Medical image classification
router.post('/analyze-image', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { imageData } = req.body; // Base64 encoded image
    
    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' });
    }
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imageData, 'base64');
    
    // Use medical image classification model
    const result = await callHuggingFaceAPI(
      'microsoft/resnet-50', // You might want to use a medical-specific model
      imageBuffer,
      true
    );
    
    // Process results
    const analysis = result
      .sort((a, b) => b.score - a.score) // Sort by confidence
      .slice(0, 5) // Top 5 predictions
      .map(item => ({
        label: item.label,
        confidence: item.score,
        description: getImageAnalysisDescription(item.label)
      }));
    
    res.json({ analysis });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze image' });
  }
});

// Helper function to provide medical context for image analysis
const getImageAnalysisDescription = (label) => {
  const descriptions = {
    'normal': 'No abnormalities detected in the image.',
    'abnormal': 'Potential abnormalities detected. Further examination recommended.',
    'fracture': 'Possible bone fracture detected. Immediate medical attention required.',
    'pneumonia': 'Signs consistent with pneumonia. Antibiotic treatment may be necessary.',
    'tumor': 'Suspicious mass detected. Biopsy and further testing recommended.'
  };
  
  return descriptions[label.toLowerCase()] || 'Analysis result requires professional medical interpretation.';
};

// Batch processing endpoint for complete session analysis
router.post('/analyze-session', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { transcript, imageData } = req.body;
    
    const results = {};
    
    // Extract entities if transcript provided
    if (transcript) {
      try {
        const entitiesResult = await callHuggingFaceAPI(
          'dmis-lab/biobert-base-cased-v1.2-ner',
          { inputs: transcript }
        );
        
        results.entities = entitiesResult
          .filter(entity => entity.score > 0.5)
          .map(entity => ({
            text: entity.word,
            label: entity.entity_group || entity.entity,
            confidence: entity.score
          }));
      } catch (error) {
        console.error('Entity extraction failed:', error);
        results.entities = [];
      }
      
      // Generate summary
      try {
        const summaryResult = await callHuggingFaceAPI(
          'facebook/bart-large-cnn',
          { inputs: transcript }
        );
        
        results.summary = summaryResult[0]?.summary_text || summaryResult.summary_text || '';
      } catch (error) {
        console.error('Summarization failed:', error);
        results.summary = '';
      }
    }
    
    // Analyze image if provided
    if (imageData) {
      try {
        const imageBuffer = Buffer.from(imageData, 'base64');
        const imageResult = await callHuggingFaceAPI(
          'microsoft/resnet-50',
          imageBuffer,
          true
        );
        
        results.imageAnalysis = imageResult
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(item => ({
            label: item.label,
            confidence: item.score,
            description: getImageAnalysisDescription(item.label)
          }));
      } catch (error) {
        console.error('Image analysis failed:', error);
        results.imageAnalysis = [];
      }
    }
    
    res.json(results);
  } catch (error) {
    console.error('Session analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze session' });
  }
});

export default router;
