# Deployment Guide

This guide covers deploying MedLens AI to production environments.

## Prerequisites

- Completed Firebase setup (see [firebase-setup.md](firebase-setup.md))
- Valid Hugging Face API key
- Domain name (optional but recommended)
- SSL certificate (handled by most hosting providers)

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build and Deploy:**
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

3. **Environment Variables:**
   In Vercel dashboard, add:
   ```
   VITE_FIREBASE_API_KEY=your-production-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_API_URL=https://your-backend-domain.com
   ```

### Option 2: Netlify

1. **Build the project:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Environment Variables:**
   In Netlify dashboard, add the same variables as above.

### Option 3: Firebase Hosting

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize hosting:**
   ```bash
   cd frontend
   firebase init hosting
   ```

3. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Connect GitHub repository to Railway**

2. **Set environment variables:**
   ```
   PORT=3001
   NODE_ENV=production
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-key\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   HUGGINGFACE_API_KEY=your-hf-api-key
   CORS_ORIGINS=https://your-frontend-domain.com
   ```

3. **Deploy:**
   Railway will automatically deploy when you push to your main branch.

### Option 2: Heroku

1. **Install Heroku CLI and login:**
   ```bash
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set FIREBASE_PROJECT_ID=your-project-id
   # ... set all other environment variables
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

1. **Create new app in DigitalOcean dashboard**

2. **Connect your GitHub repository**

3. **Configure build settings:**
   - Build command: `npm install`
   - Run command: `npm start`
   - Environment: Node.js

4. **Set environment variables in the dashboard**

## Database and Storage

### Firestore Security Rules

Update your Firestore rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Only doctors can create and access sessions
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        request.auth.token.role == 'doctor';
      
      // Doctors can only access their own sessions
      allow read, write: if request.auth != null && 
        request.auth.token.role == 'doctor' &&
        resource.data.doctorId == request.auth.uid;
    }
  }
}
```

### Firebase Storage Rules

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

## Domain Configuration

### Custom Domain Setup

1. **Add domain to your hosting provider**
2. **Update DNS records:**
   - For Vercel: Add CNAME record pointing to `cname.vercel-dns.com`
   - For Netlify: Add CNAME record pointing to your Netlify subdomain
   - For Railway: Add CNAME record pointing to your Railway domain

3. **Update Firebase Auth domains:**
   - Go to Firebase Console > Authentication > Settings
   - Add your production domain to "Authorized domains"

4. **Update CORS origins:**
   - Update `CORS_ORIGINS` environment variable in backend
   - Include your production domain

## SSL/HTTPS

Most hosting providers handle SSL automatically. Ensure:
- Your frontend is served over HTTPS
- Your backend API is served over HTTPS
- Firebase Auth is configured for HTTPS domains

## Environment-Specific Configuration

### Production Optimizations

1. **Frontend optimizations:**
   ```bash
   # In frontend/vite.config.js
   export default {
     build: {
       minify: 'terser',
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
           }
         }
       }
     }
   }
   ```

2. **Backend optimizations:**
   - Enable gzip compression
   - Set up proper caching headers
   - Use production logging levels

### Monitoring and Logging

1. **Set up error tracking:**
   - Sentry for error monitoring
   - LogRocket for session replay

2. **Performance monitoring:**
   - Firebase Performance Monitoring
   - Google Analytics

3. **Health checks:**
   - Use the `/api/health` endpoint for monitoring

## Security Checklist

- [ ] All environment variables are set correctly
- [ ] Firebase security rules are configured
- [ ] CORS is properly configured
- [ ] HTTPS is enabled everywhere
- [ ] API keys are not exposed in frontend code
- [ ] File upload limits are enforced
- [ ] Rate limiting is implemented (if needed)

## Backup and Recovery

1. **Firestore backup:**
   - Enable automatic backups in Firebase Console
   - Set up export schedules for critical data

2. **Storage backup:**
   - Firebase Storage has built-in redundancy
   - Consider additional backup for critical files

## Scaling Considerations

1. **Frontend scaling:**
   - CDN distribution (handled by hosting providers)
   - Image optimization
   - Code splitting

2. **Backend scaling:**
   - Horizontal scaling (multiple instances)
   - Database connection pooling
   - Caching layer (Redis)

3. **AI API limits:**
   - Monitor Hugging Face API usage
   - Implement request queuing for high traffic
   - Consider upgrading to paid Hugging Face plans

## Troubleshooting

### Common Issues

1. **CORS errors:**
   - Check `CORS_ORIGINS` environment variable
   - Ensure frontend domain is included

2. **Firebase authentication errors:**
   - Verify authorized domains in Firebase Console
   - Check API keys and configuration

3. **API timeout errors:**
   - Increase timeout limits for AI processing
   - Implement retry logic for failed requests

4. **File upload failures:**
   - Check Firebase Storage rules
   - Verify file size limits

### Debugging

1. **Check logs:**
   - Frontend: Browser console
   - Backend: Server logs in hosting dashboard

2. **Test API endpoints:**
   ```bash
   curl https://your-api-domain.com/api/health
   ```

3. **Verify environment variables:**
   - Check all required variables are set
   - Ensure no typos in variable names

## Maintenance

1. **Regular updates:**
   - Update dependencies monthly
   - Monitor security advisories

2. **Performance monitoring:**
   - Track API response times
   - Monitor error rates

3. **Cost optimization:**
   - Monitor Firebase usage
   - Optimize Hugging Face API calls

---

For additional support, check the main [README.md](../README.md) or create an issue in the repository.
