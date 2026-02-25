# Lattice - Drop anything. Understand everything.

AI-powered visual knowledge distiller. Upload PDFs, paste YouTube links, drop Word docs, or paste article URLs and Lattice transforms content into beautiful visual summaries using Claude AI.

## Features

- **6 Visual Formats**: Mind Maps, Flowcharts, Timelines, Flashcards, Infographic Summaries, Key Takeaways
- **Multiple Input Types**: PDF, YouTube, Word docs (.docx), article URLs, raw text
- **Interactive Outputs**: Zoomable mind maps and flowcharts (React Flow), flip-card flashcards, animated timelines
- **Export**: PNG, PDF, and clipboard copy
- **Collections**: Organize distills into folders
- **Google Sign-In**: Secure authentication via Firebase

## Tech Stack

- **Frontend**: React (Vite), TailwindCSS v3, Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Visuals**: @xyflow/react, Recharts, custom components

## Setup

### 1. Clone and Install

```bash
git clone <repo-url>
cd lattice
npm install
```

### 2. Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Google Sign-In** in Authentication
3. Create a **Firestore** database
4. Enable **Firebase Storage**
5. Copy your config values

### 3. Anthropic API Key

Get an API key from [console.anthropic.com](https://console.anthropic.com)

### 4. Environment Variables

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

### 5. Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 6. Firebase Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 7. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)
