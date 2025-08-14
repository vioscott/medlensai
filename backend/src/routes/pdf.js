import express from 'express';
import PDFDocument from 'pdfkit';
import { adminDb } from '../config/firebase.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Generate PDF for a session
router.post('/sessions/:sessionId/export', authenticateToken, requireRole('doctor'), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { format = 'pdf' } = req.body;

    // Get session data
    const sessionDoc = await adminDb.collection('sessions').doc(sessionId).get();
    
    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    
    // Check if user owns this session
    if (sessionData.doctorId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (format === 'pdf') {
      const pdfBuffer = await generateSessionPDF(sessionData);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="session-${sessionId}.pdf"`);
      res.send(pdfBuffer);
    } else {
      return res.status(400).json({ error: 'Unsupported format' });
    }

  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ error: 'Failed to export PDF' });
  }
});

const generateSessionPDF = async (sessionData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4'
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(20)
         .fillColor('#2c3e50')
         .text('MedLens AI - Medical Consultation Report', { align: 'center' });
      
      doc.moveDown(0.5);
      doc.fontSize(12)
         .fillColor('#7f8c8d')
         .text(`Generated on ${new Date().toLocaleString()}`, { align: 'center' });

      doc.moveDown(1);

      // Session Information
      addSectionHeader(doc, 'Session Information');
      
      const sessionInfo = [
        ['Patient Name:', sessionData.patientName || 'Unknown'],
        ['Session ID:', sessionData.id || 'Unknown'],
        ['Date:', sessionData.createdAt ? new Date(sessionData.createdAt.toDate()).toLocaleString() : 'Unknown'],
        ['Session Type:', sessionData.sessionType || 'Unknown'],
        ['Status:', sessionData.status || 'Unknown'],
        ['Doctor:', sessionData.doctorName || 'Unknown']
      ];

      sessionInfo.forEach(([label, value]) => {
        doc.fontSize(10)
           .fillColor('#2c3e50')
           .text(label, { continued: true })
           .fillColor('#555')
           .text(` ${value}`);
        doc.moveDown(0.3);
      });

      doc.moveDown(1);

      // AI Generated Summary
      if (sessionData.summary) {
        addSectionHeader(doc, 'AI Generated Summary');
        doc.fontSize(10)
           .fillColor('#555')
           .text(sessionData.summary, {
             align: 'justify',
             lineGap: 2
           });
        doc.moveDown(1);
      }

      // Medical Entities
      if (sessionData.entities && sessionData.entities.length > 0) {
        addSectionHeader(doc, 'Medical Entities Identified');
        
        const groupedEntities = groupEntitiesByType(sessionData.entities);
        
        Object.entries(groupedEntities).forEach(([type, entities]) => {
          doc.fontSize(11)
             .fillColor('#3498db')
             .text(`${type} (${entities.length}):`, { underline: true });
          
          doc.moveDown(0.2);
          
          entities.forEach(entity => {
            doc.fontSize(9)
               .fillColor('#555')
               .text(`• ${entity.text} (${(entity.confidence * 100).toFixed(1)}% confidence)`, {
                 indent: 20
               });
          });
          
          doc.moveDown(0.5);
        });
        
        doc.moveDown(0.5);
      }

      // Image Analysis
      if (sessionData.imageAnalysis && sessionData.imageAnalysis.length > 0) {
        addSectionHeader(doc, 'Image Analysis Results');
        
        sessionData.imageAnalysis.forEach((result, index) => {
          doc.fontSize(10)
             .fillColor('#2c3e50')
             .text(`${index + 1}. ${result.label}`, { continued: true })
             .fillColor('#27ae60')
             .text(` (${(result.confidence * 100).toFixed(1)}% confidence)`);
          
          doc.fontSize(9)
             .fillColor('#555')
             .text(`   ${result.description}`, { indent: 20 });
          
          doc.moveDown(0.3);
        });
        
        doc.moveDown(1);
      }

      // Full Transcript
      if (sessionData.transcript) {
        addSectionHeader(doc, 'Full Transcript');
        doc.fontSize(9)
           .fillColor('#555')
           .text(sessionData.transcript, {
             align: 'justify',
             lineGap: 1
           });
        doc.moveDown(1);
      }

      // Footer
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        
        // Add page number
        doc.fontSize(8)
           .fillColor('#7f8c8d')
           .text(`Page ${i + 1} of ${pageCount}`, 
             50, 
             doc.page.height - 50, 
             { align: 'center' }
           );
        
        // Add disclaimer
        doc.fontSize(7)
           .fillColor('#95a5a6')
           .text('This report was generated by MedLens AI and should be reviewed by a qualified medical professional.', 
             50, 
             doc.page.height - 30, 
             { align: 'center', width: doc.page.width - 100 }
           );
      }

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};

const addSectionHeader = (doc, title) => {
  doc.fontSize(14)
     .fillColor('#2c3e50')
     .text(title, { underline: true });
  doc.moveDown(0.5);
};

const groupEntitiesByType = (entities) => {
  return entities.reduce((groups, entity) => {
    const type = entity.label || 'Other';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(entity);
    return groups;
  }, {});
};

export default router;
