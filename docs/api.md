# API Documentation

This document provides detailed information about the MedLens AI API endpoints.

## Base URL

- Development: `http://localhost:3001`
- Production: `https://your-api-domain.com`

## Authentication

All API endpoints (except health check) require authentication using Firebase ID tokens.

### Headers
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

### Error Responses
```json
{
  "error": "Error message"
}
```

## Authentication Endpoints

### Verify Token
Verify user authentication and get user data.

**GET** `/api/auth/verify`

**Response:**
```json
{
  "user": {
    "uid": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "doctor",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Profile
Update user profile information.

**PUT** `/api/auth/profile`

**Request Body:**
```json
{
  "name": "Updated Name",
  "specialization": "Cardiology",
  "licenseNumber": "MD123456"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully"
}
```

### Set User Role
Set user role (admin only).

**POST** `/api/auth/set-role`

**Request Body:**
```json
{
  "targetUserId": "user-id",
  "role": "doctor"
}
```

**Response:**
```json
{
  "message": "User role updated successfully"
}
```

## Session Management

### Create Session
Create a new consultation session.

**POST** `/api/sessions`

**Request Body:**
```json
{
  "patientName": "John Doe",
  "patientId": "P123456",
  "sessionType": "consultation"
}
```

**Response:**
```json
{
  "session": {
    "id": "session-uuid",
    "doctorId": "doctor-uid",
    "doctorName": "Dr. Smith",
    "patientName": "John Doe",
    "patientId": "P123456",
    "sessionType": "consultation",
    "status": "active",
    "transcript": "",
    "entities": [],
    "summary": "",
    "imageAnalysis": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Sessions
Get all sessions for the current doctor.

**GET** `/api/sessions`

**Query Parameters:**
- `limit` (optional): Number of sessions to return (default: 20)
- `offset` (optional): Number of sessions to skip (default: 0)
- `status` (optional): Filter by session status

**Response:**
```json
{
  "sessions": [
    {
      "id": "session-uuid",
      "doctorId": "doctor-uid",
      "patientName": "John Doe",
      "sessionType": "consultation",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Session
Get a specific session by ID.

**GET** `/api/sessions/:sessionId`

**Response:**
```json
{
  "session": {
    "id": "session-uuid",
    "doctorId": "doctor-uid",
    "doctorName": "Dr. Smith",
    "patientName": "John Doe",
    "transcript": "Patient reports...",
    "entities": [...],
    "summary": "Summary text...",
    "imageAnalysis": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Session
Update session data.

**PUT** `/api/sessions/:sessionId`

**Request Body:**
```json
{
  "transcript": "Updated transcript",
  "entities": [...],
  "summary": "Updated summary",
  "imageAnalysis": [...],
  "status": "completed"
}
```

**Response:**
```json
{
  "message": "Session updated successfully"
}
```

### Delete Session
Delete a session.

**DELETE** `/api/sessions/:sessionId`

**Response:**
```json
{
  "message": "Session deleted successfully"
}
```

## AI Services

### Transcribe Audio
Convert audio to text.

**POST** `/api/ai/transcribe`

**Request Body:**
```json
{
  "audioData": "base64-encoded-audio-data"
}
```

**Response:**
```json
{
  "transcript": "Transcribed text from audio"
}
```

### Extract Entities
Extract medical entities from text.

**POST** `/api/ai/extract-entities`

**Request Body:**
```json
{
  "text": "Patient has chest pain and shortness of breath"
}
```

**Response:**
```json
{
  "entities": [
    {
      "text": "chest pain",
      "label": "SYMPTOM",
      "confidence": 0.95,
      "start": 12,
      "end": 22
    },
    {
      "text": "shortness of breath",
      "label": "SYMPTOM",
      "confidence": 0.92,
      "start": 27,
      "end": 46
    }
  ]
}
```

### Summarize Text
Generate a summary of the consultation text.

**POST** `/api/ai/summarize`

**Request Body:**
```json
{
  "text": "Long consultation transcript...",
  "maxLength": 150,
  "minLength": 50
}
```

**Response:**
```json
{
  "summary": "Patient presented with chest pain and shortness of breath. Examination revealed..."
}
```

### Analyze Image
Analyze medical images for abnormalities.

**POST** `/api/ai/analyze-image`

**Request Body:**
```json
{
  "imageData": "base64-encoded-image-data"
}
```

**Response:**
```json
{
  "analysis": [
    {
      "label": "normal",
      "confidence": 0.85,
      "description": "No abnormalities detected in the image."
    },
    {
      "label": "pneumonia",
      "confidence": 0.12,
      "description": "Signs consistent with pneumonia. Antibiotic treatment may be necessary."
    }
  ]
}
```

### Analyze Complete Session
Perform complete AI analysis on session data.

**POST** `/api/ai/analyze-session`

**Request Body:**
```json
{
  "transcript": "Consultation transcript...",
  "imageData": "base64-encoded-image-data"
}
```

**Response:**
```json
{
  "entities": [...],
  "summary": "Generated summary...",
  "imageAnalysis": [...]
}
```

## File Upload

### Upload Audio
Upload audio file for a session.

**POST** `/api/upload/audio`

**Request Body:** (multipart/form-data)
- `audio`: Audio file
- `sessionId`: Session ID

**Response:**
```json
{
  "fileId": "file-uuid",
  "fileName": "sessions/session-id/audio/file-uuid_recording.wav",
  "downloadURL": "https://storage.googleapis.com/...",
  "size": 1024000,
  "mimetype": "audio/wav"
}
```

### Upload Image
Upload medical image for a session.

**POST** `/api/upload/image`

**Request Body:** (multipart/form-data)
- `image`: Image file
- `sessionId`: Session ID

**Response:**
```json
{
  "fileId": "file-uuid",
  "fileName": "sessions/session-id/images/file-uuid_xray.jpg",
  "downloadURL": "https://storage.googleapis.com/...",
  "size": 2048000,
  "mimetype": "image/jpeg"
}
```

### Get File
Get download URL for a file.

**GET** `/api/upload/file/:sessionId/:fileType/:fileId`

**Response:**
```json
{
  "downloadURL": "https://storage.googleapis.com/..."
}
```

### Delete File
Delete a file from storage.

**DELETE** `/api/upload/file/:sessionId/:fileType/:fileId`

**Response:**
```json
{
  "message": "File deleted successfully"
}
```

### List Files
List all files for a session.

**GET** `/api/upload/files/:sessionId`

**Response:**
```json
{
  "files": [
    {
      "name": "sessions/session-id/audio/file-uuid_recording.wav",
      "size": 1024000,
      "contentType": "audio/wav",
      "created": "2024-01-01T00:00:00.000Z",
      "updated": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## PDF Export

### Export Session PDF
Generate and download PDF report for a session.

**POST** `/api/sessions/:sessionId/export`

**Request Body:**
```json
{
  "format": "pdf"
}
```

**Response:** PDF file download

## WebSocket Events

### Connection
Connect to WebSocket server for real-time transcription.

**URL:** `ws://localhost:3001` or `wss://your-api-domain.com`

### Client Events

#### Start Transcription
```json
{
  "event": "start-transcription",
  "data": {
    "sessionId": "session-uuid",
    "userId": "user-uid"
  }
}
```

#### Send Audio Chunk
```json
{
  "event": "audio-chunk",
  "data": {
    "audioData": "base64-audio-chunk",
    "isLast": false
  }
}
```

#### Stop Transcription
```json
{
  "event": "stop-transcription"
}
```

### Server Events

#### Transcription Started
```json
{
  "event": "transcription-started",
  "data": {
    "sessionId": "session-uuid"
  }
}
```

#### Transcript Chunk
```json
{
  "event": "transcript-chunk",
  "data": {
    "text": "Transcribed text chunk",
    "timestamp": 1640995200000,
    "isLast": false
  }
}
```

#### Transcription Stopped
```json
{
  "event": "transcription-stopped",
  "data": {
    "sessionId": "session-uuid",
    "finalTranscript": "Complete transcription text"
  }
}
```

#### Transcription Error
```json
{
  "event": "transcription-error",
  "data": {
    "error": "Error message",
    "details": "Additional error details"
  }
}
```

## Health Check

### Health Status
Check API health status.

**GET** `/api/health`

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## Error Codes

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Rate Limits

- Authentication endpoints: 100 requests/minute
- AI processing endpoints: 10 requests/minute
- File upload endpoints: 20 requests/minute
- Other endpoints: 200 requests/minute

## File Size Limits

- Audio files: 10MB maximum
- Image files: 10MB maximum
- PDF exports: No limit (generated server-side)

---

For more information, see the main [README.md](../README.md) or [deployment guide](deployment.md).
