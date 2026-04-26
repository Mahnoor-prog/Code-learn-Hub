# Code Learn Hub - Full Stack AI Learning Platform

A modern, AI-powered coding education platform built with React, Node.js, Express, MongoDB, and Firebase.

## 🚀 Features

- **5 Core Languages**: Python, C++, C#, Java, React
- **🔥 Firebase Authentication**: Fully integrated Firebase Auth for secure registration and login, synced with MongoDB profiles.
- **🤖 AI-Powered Learning & IDE**: Personalized content generation, an AI Error Helper embedded in the browser IDE, and chatbot assistance.
- **💻 Secure Code Execution**: A dedicated sandboxed execution server running Node.js to safely execute user-submitted code.
- **💳 Subscription & Lesson Locking**: Integrated user plans (`free`, `student`, `pro`) with lesson restriction logic.
- **🧠 Personalized Learning Paths**: AI-generated weekly roadmaps, performance reports, and dynamic lesson suggestions.
- **Progress Tracking**: Real-time progress tracking and analytics
- **Gamification**: Badges, points, live leaderboards, streaks, and achievements
- **Dashboard**: Comprehensive learning analytics

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

3. **Set up environment variables**
   Create a `.env` file in the root directory (for frontend):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_FIREBASE_API_KEY="your-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-domain"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   ```

   Create a `server/.env` file (for backend):
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   OPENAI_API_KEY=sk-...
   JWT_SECRET=your-secret
   FIREBASE_PROJECT_ID=your-project-id
   DEV_BYPASS_AUTH=false
   ```

4. **Start MongoDB**
   - If using local MongoDB, make sure it's running
   - Or use MongoDB Atlas and update `MONGODB_URI` in `.env`

5. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start concurrently:
   - Backend API server on `http://localhost:5000`
   - Code Execution Sandbox on `http://localhost:3000`
   - Frontend Vite server on `http://localhost:5173`

## 📁 Project Structure

```
code-learn-hub/
├── server/                 # Backend Node/Express Server
│   ├── firebaseAdmin.js   # Firebase Admin initialization
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/         # Auth middleware
│   ├── index.js           # Server entry point
│   └── seed.js            # Database seeder
├── execution-server/       # Secure Sandbox Environment
│   └── server.js          # Handles /execute requests
├── src/                   # Frontend React Code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── context/          # React context (Auth & Personalization)
│   ├── firebase.js       # Firebase client config
│   ├── utils/            # Utilities (API, dummyData)
│   └── styles/           # CSS styles
└── package.json
```

## 🔌 API Endpoints

### Authentication (Firebase)
- `POST /api/auth/register` - Register new user (Syncs Firebase to MongoDB)
- `GET /api/auth/me` - Get current user profile & streak data

### Modules & Sandbox
- `GET /api/modules` - Get all modules (with filters)
- `GET /api/modules/:id` - Get single module
- `POST /api/code/run` - Forwards to execution-server for code execution
- `POST /api/aicontent/debug` - AI Error Helper analysis

### Progress & Dashboard
- `GET /api/progress/module/:moduleId` - Get user progress for module
- `POST /api/progress/module/:moduleId` - Update progress
- `GET /api/dashboard/performance` - Get advanced dashboard stats

### Chatbot
- `GET /api/chatbot/history` - Get chat history
- `POST /api/chatbot/message` - Send message

### Gamification & Personalization
- `GET /api/gamification/badges` - Get user badges
- `GET /api/gamification/leaderboard` - Get live leaderboard
- `POST /api/gamification/check-badges` - Check and award badges
- `GET /api/personalization/roadmap` - AI-generated weekly study plan

## 🎯 Usage

1. **Register/Login**: Create an account or login
2. **Browse Modules**: Explore modules for Python, C++, C#, Java, and React
3. **Track Progress**: Your progress is automatically saved
4. **Interactive IDE**: Practice coding and use the AI Error Helper when you get stuck
5. **Use Chatbot**: Ask questions about coding concepts
6. **Earn Badges**: Complete lessons to unlock achievements
7. **View Dashboard**: See your learning statistics

## 🛡️ Authentication

The app uses Firebase Authentication. Users log in on the frontend to get an ID Token, which is passed in the `Authorization: Bearer <token>` header to the backend. The backend verifies this using the Firebase Admin SDK.

## 📝 Notes

- Progress is tracked automatically when lessons are completed
- Badges and streaks are awarded automatically based on achievements
- All API endpoints require authentication except registration/login/leaderboard

## 🚀 Production Build

```bash
npm run build
```

The frontend will be built to the `dist` folder.

## 📄 License

MIT
