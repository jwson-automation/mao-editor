# Setup Guide

## Prerequisites

- Node.js 18+
- Firebase account
- OpenAI API key

## 1. Install Dependencies

```bash
npm install
```

Install all required packages.

## 2. Environment Variables

```bash
cp .env.example .env
```

Copy the example environment file.

## 3. Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" and follow the wizard
3. Enable Firestore Database in your project

### Get Firebase Config

1. Project Settings → General → Your apps → Web app
2. Copy the Firebase configuration values
3. Add to `.env` file:

```env
NUXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NUXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Configure Firestore Rules

1. Go to Firestore Database → Rules
2. Use these rules for development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /documents/{sessionId}/files/{fileId} {
      allow read, write: if true;
    }
  }
}
```

**Warning**: These rules allow anyone to read/write. Use proper authentication in production.

### Add OpenAI API Key

Get your OpenAI API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

Add to `.env`:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

## 4. Run Development Server

```bash
npm run dev
```

App will be available at `http://localhost:3000`

## 5. Build for Production

```bash
npm run build
```

Creates optimized production build in `.output/` directory.

## Troubleshooting

### Firebase connection issues
- Check if your Firebase config is correct
- Verify Firestore is enabled in Firebase Console

### OpenAI API errors
- Confirm `OPENAI_API_KEY` is set in `.env`
- Restart dev server after changing `.env`

### Port already in use
```bash
npm run dev -- --port 3001
```
Run on a different port.
