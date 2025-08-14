# Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `medlens-ai`
4. Enable Google Analytics (optional)
5. Create project

## 2. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Optionally enable **Google** provider for easier sign-in

## 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll add security rules later)
4. Select a location close to your users

## 4. Enable Storage

1. Go to **Storage**
2. Click **Get started**
3. Choose **Start in test mode**
4. Use the same location as Firestore

## 5. Get Configuration Keys

### Frontend Configuration
1. Go to **Project Settings** > **General**
2. Scroll to **Your apps** section
3. Click **Web app** icon (`</>`)
4. Register app with name: `medlens-frontend`
5. Copy the config object values to `frontend/.env`

### Backend Configuration
1. Go to **Project Settings** > **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Extract values to `backend/.env`

## 6. Set User Roles

Run this script in Firebase Console > Firestore > Rules playground to set user roles:

```javascript
// Set custom claims for a user (run in Firebase Functions or Admin SDK)
admin.auth().setCustomUserClaims(uid, { role: 'doctor' });
```

## 7. Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Only doctors can create/read sessions
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        request.auth.token.role == 'doctor';
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Only authenticated doctors can upload files
    match /sessions/{sessionId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.role == 'doctor';
    }
  }
}
```

## 8. Environment Variables

Copy the example files and fill in your values:
- `cp frontend/.env.example frontend/.env`
- `cp backend/.env.example backend/.env`
