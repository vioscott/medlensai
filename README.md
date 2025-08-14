# MedLens AI - Medical Consultation Platform

A comprehensive web application for medical professionals to record consultations, analyze medical images, and generate AI-powered summaries.

## 🌟 Features

- 🎙️ **Live Audio Recording** - Real-time transcription during consultations
- 🔍 **Medical Entity Extraction** - AI-powered identification of medical terms
- 📝 **Automatic Summarization** - Generate structured consultation notes
- 🖼️ **Medical Image Analysis** - AI analysis of uploaded medical images
- 📄 **PDF Export** - Professional consultation reports
- 🔐 **Secure Authentication** - Firebase-based user management
- 💾 **Session Management** - Save and retrieve consultation sessions
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **CSS Modules** for component-scoped styling
- **Firebase Authentication** for secure user management
- **Socket.io Client** for real-time transcription
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **Node.js** with Express framework
- **Socket.io** for WebSocket connections
- **Firebase Admin SDK** for authentication and database
- **Hugging Face API** integration for AI services
- **PDFKit** for PDF generation
- **Multer** for file uploads

### AI Services
- **Audio-to-Text** transcription using Whisper
- **Medical Named Entity Recognition (NER)** using BioBERT
- **Text summarization** using BART
- **Medical image classification** using ResNet

### Database & Storage
- **Firestore** for session data and user management
- **Firebase Storage** for audio files and medical images
- **Firebase Authentication** for user security

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase project set up
- Hugging Face API key

### 1. Clone and Install
```bash
git clone <repository-url>
cd medlens-ai
npm run install:all
```

### 2. Environment Setup

#### Frontend Environment (.env)
```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_URL=http://localhost:3001
```

#### Backend Environment (.env)
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=3001
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# Hugging Face API
HUGGINGFACE_API_KEY=your-huggingface-api-key

# CORS Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Firebase Setup
Follow the detailed guide in `docs/firebase-setup.md` to:
- Create a Firebase project
- Enable Authentication, Firestore, and Storage
- Generate service account credentials
- Set up security rules

### 4. Start Development Servers
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### 5. Create Your First Account
1. Navigate to http://localhost:5173
2. Click "Sign up" to create a new account
3. Use a valid email address (you'll need to verify it)
4. Start creating consultation sessions!

## 📁 Project Structure

```
medlens-ai/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Auth/        # Authentication components
│   │   │   ├── Dashboard/   # Dashboard components
│   │   │   └── Session/     # Session management components
│   │   ├── contexts/        # React contexts
│   │   ├── config/          # Configuration files
│   │   └── App.jsx          # Main app component
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── config/          # Configuration files
│   │   ├── sockets/         # Socket.io handlers
│   │   └── server.js        # Main server file
│   └── package.json         # Backend dependencies
├── docs/                     # Documentation
│   └── firebase-setup.md    # Firebase setup guide
├── .gitignore               # Git ignore rules
├── package.json             # Root workspace configuration
└── README.md                # This file
```

## 🔧 Development

### Available Scripts

#### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run install:all` - Install dependencies for all packages

#### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Backend
- `npm run dev` - Start with nodemon for auto-restart
- `npm run start` - Start in production mode
- `npm test` - Run tests

### API Endpoints

#### Authentication
- `GET /api/auth/verify` - Verify user token
- `POST /api/auth/set-role` - Set user role (admin only)
- `PUT /api/auth/profile` - Update user profile

#### Sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions` - Get user's sessions
- `GET /api/sessions/:id` - Get specific session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

#### AI Services
- `POST /api/ai/transcribe` - Transcribe audio
- `POST /api/ai/extract-entities` - Extract medical entities
- `POST /api/ai/summarize` - Generate summary
- `POST /api/ai/analyze-image` - Analyze medical image
- `POST /api/ai/analyze-session` - Complete session analysis

#### File Upload
- `POST /api/upload/audio` - Upload audio file
- `POST /api/upload/image` - Upload image file
- `GET /api/upload/file/:sessionId/:fileType/:fileId` - Get file
- `DELETE /api/upload/file/:sessionId/:fileType/:fileId` - Delete file

#### PDF Export
- `POST /api/sessions/:sessionId/export` - Export session as PDF

### WebSocket Events

#### Client to Server
- `start-transcription` - Start real-time transcription
- `audio-chunk` - Send audio data for transcription
- `stop-transcription` - Stop transcription

#### Server to Client
- `transcription-started` - Transcription session started
- `transcript-chunk` - New transcript text
- `transcription-stopped` - Transcription session ended
- `transcription-error` - Transcription error occurred

## 🔒 Security Features

- **Firebase Authentication** with email/password
- **Role-based access control** (doctor/admin roles)
- **Secure API endpoints** with JWT token verification
- **CORS protection** with configurable origins
- **Input validation** and sanitization
- **File upload restrictions** with type and size limits
- **Firestore security rules** for data protection

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder to your hosting service
3. Set environment variables in your hosting dashboard

### Backend (Railway/Heroku/DigitalOcean)
1. Set up your hosting service
2. Configure environment variables
3. Deploy the backend folder
4. Ensure your Firebase project allows the production domain

### Environment Variables for Production
Make sure to update:
- `VITE_API_URL` to your production backend URL
- `CORS_ORIGINS` to include your production frontend URL
- All Firebase credentials for your production project

## 📚 Documentation

- [Firebase Setup Guide](docs/firebase-setup.md) - Detailed Firebase configuration
- [API Documentation](docs/api.md) - Complete API reference (coming soon)
- [Deployment Guide](docs/deployment.md) - Production deployment instructions (coming soon)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

If you encounter any issues:

1. Check the [Firebase Setup Guide](docs/firebase-setup.md)
2. Ensure all environment variables are correctly set
3. Verify your Hugging Face API key is valid
4. Check the browser console and server logs for errors

For additional support, please create an issue in the repository.

---

**Built with ❤️ for healthcare professionals**
