# Code Learn Hub - Full Stack Learning Platform

A modern, AI-powered coding education platform built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **5 Core Languages**: Python, C++, C#, Java, React
- **AI-Powered Learning**: Personalized content generation and chatbot assistance
- **Progress Tracking**: Real-time progress tracking and analytics
- **Gamification**: Badges, points, leaderboards, and achievements
- **Interactive IDE**: Practice coding directly in the browser
- **User Authentication**: Secure registration and login system
- **Dashboard**: Comprehensive learning analytics

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd trywebsite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/codelearnhub
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Start MongoDB**
   - If using local MongoDB, make sure it's running
   - Or use MongoDB Atlas and update `MONGODB_URI` in `.env`

5. **Seed the database (optional)**
   ```bash
   node server/seed.js
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both:
   - Backend server on `http://localhost:5000`
   - Frontend dev server on `http://localhost:5173`

## 📁 Project Structure

```
trywebsite/
├── server/                 # Backend code
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/         # Auth middleware
│   ├── index.js           # Server entry point
│   └── seed.js            # Database seeder
├── src/                   # Frontend code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── context/          # React context (Auth)
│   ├── utils/            # Utilities (API, dummyData)
│   └── styles/           # CSS styles
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Modules
- `GET /api/modules` - Get all modules (with filters)
- `GET /api/modules/:id` - Get single module
- `GET /api/modules/:id/progress` - Get module with user progress

### Progress
- `GET /api/progress/module/:moduleId` - Get user progress for module
- `POST /api/progress/module/:moduleId` - Update progress
- `GET /api/progress/all` - Get all user progress

### Dashboard
- `GET /api/dashboard` - Get dashboard stats

### Chatbot
- `GET /api/chatbot/history` - Get chat history
- `POST /api/chatbot/message` - Send message

### Gamification
- `GET /api/gamification/badges` - Get user badges
- `GET /api/gamification/leaderboard` - Get leaderboard
- `POST /api/gamification/check-badges` - Check and award badges

## 🎯 Usage

1. **Register/Login**: Create an account or login
2. **Browse Modules**: Explore modules for Python, C++, C#, Java, and React
3. **Track Progress**: Your progress is automatically saved
4. **Use Chatbot**: Ask questions about coding concepts
5. **Earn Badges**: Complete lessons to unlock achievements
6. **View Dashboard**: See your learning statistics

## 🛡️ Authentication

The app uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and automatically included in API requests.

## 📝 Notes

- The chatbot uses a rule-based system (can be replaced with OpenAI API)
- Progress is tracked automatically when lessons are completed
- Badges are awarded automatically based on achievements
- All API endpoints require authentication except registration/login

## 🚀 Production Build

```bash
npm run build
```

The frontend will be built to the `dist` folder.

## 📄 License

MIT


