# Code Learn Hub - Full Stack AI Learning Platform

A modern, highly-advanced AI-powered coding education platform built with React, Node.js, Express, MongoDB, and Firebase.

## 🚀 Key Features & Recent Updates

- **🔥 Firebase Authentication**: Fully integrated Firebase Auth for secure, seamless registration and login, synced with MongoDB profiles.
- **🤖 AI Error Helper (IDE)**: A custom Antigravity AI tutor embedded directly in the browser IDE. It diagnoses errors, provides code snippets, and suggests revision topics using an advanced OpenAI prompt.
- **💻 Secure Code Execution**: A dedicated `execution-server` running Node.js to safely execute user-submitted Python, JS, C++, Java, and C# code.
- **💳 Subscription & Lesson Locking**: Integrated user plans (`free`, `student`, `pro`). Free users are restricted to the first 3 lessons per module.
- **🧠 Personalized Learning Paths**: AI-generated weekly roadmaps, performance reports, and dynamic lesson suggestions based on user progress.
- **🏆 Advanced Gamification**: Real-time leaderboards, dynamic streak tracking, badges, and XP point accumulation.
- **📚 Dynamic Content**: Modules and lessons generated dynamically via the OpenAI API.
- **🎨 Modern UI/UX**: Polished interface with dynamic loading skeletons, glassmorphism design, and responsive mobile sidebars.

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (local or MongoDB Atlas)
- Firebase Project (for Authentication)
- OpenAI API Key

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd code-learn-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install
   cd ../execution-server && npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` in the root (for frontend):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_FIREBASE_API_KEY="your-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-domain"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   ```

   Create a `server/.env` (for backend):
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   OPENAI_API_KEY=sk-...
   FIREBASE_PROJECT_ID=your-project-id
   DEV_BYPASS_AUTH=false
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   This `concurrently` starts:
   - Backend API server on `http://localhost:5000`
   - Code Execution Sandbox on `http://localhost:3000`
   - Frontend Vite server on `http://localhost:5173`

## 📁 Project Structure

```
trywebsite/
├── server/                 # Main Node/Express Backend
│   ├── firebaseAdmin.js   # Firebase Admin initialization
│   ├── models/            # MongoDB schemas (User, Progress, etc)
│   ├── routes/            # API routes (aicontent, auth, gamification)
│   └── middleware/         # Auth verification middleware
├── execution-server/       # Secure Sandbox Environment
│   └── server.js          # Handles /execute requests
├── src/                   # React Frontend
│   ├── components/        # Reusable UI components
│   ├── pages/            # Main views (IDE, Dashboard, LessonPage)
│   ├── context/          # Auth & Personalization Context
│   └── firebase.js       # Firebase client config
└── package.json
```

## 🔌 Core API Endpoints

### Authentication (Firebase Sync)
- `POST /api/auth/register` - Sync Firebase user to MongoDB
- `GET /api/auth/me` - Get current user profile and calculate streaks

### AI Content & Sandbox
- `POST /api/aicontent/debug` - AI Error Helper analysis
- `POST /api/code/run` - Forwards to execution-server for sandboxing

### Personalization & Gamification
- `GET /api/gamification/leaderboard` - Live user rankings
- `GET /api/personalization/roadmap` - AI-generated weekly study plan
- `GET /api/dashboard/performance` - Advanced user analytics

## 📄 License
MIT


