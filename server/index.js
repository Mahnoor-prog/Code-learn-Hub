import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import moduleRoutes from './routes/modules.js';
import progressRoutes from './routes/progress.js';
import dashboardRoutes from './routes/dashboard.js';
import chatbotRoutes from './routes/chatbot.js';
import gamificationRoutes from './routes/gamification.js';
import aicontentRoutes from './routes/aicontent.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration - allow requests from frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codelearnhub';

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    const dbName = MONGODB_URI.includes('@') 
      ? MONGODB_URI.split('@')[1]?.split('/')[1]?.split('?')[0] || 'Atlas Database'
      : 'Local MongoDB';
    console.log('✅ MongoDB Connected successfully!');
    console.log(`   Database: ${dbName}`);
    console.log(`   Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting'}`);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('\n💡 Troubleshooting Steps:');
    console.log('   1. Check if .env file exists with correct MONGODB_URI');
    console.log('   2. MongoDB Atlas Network Access allows your IP (0.0.0.0/0 for all)');
    console.log('   3. Database user has correct permissions');
    console.log('   4. Wait 2-5 minutes after changing Network Access settings');
    console.log('   5. Verify connection string format is correct\n');
  });

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed through app termination');
  process.exit(0);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/aicontent', aicontentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Code Learn Hub API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      modules: '/api/modules',
      progress: '/api/progress',
      dashboard: '/api/dashboard',
      chatbot: '/api/chatbot',
      gamification: '/api/gamification'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({ 
    status: dbStatus === 1 ? 'OK' : 'WARNING',
    message: 'Server is running',
    database: {
      status: dbStates[dbStatus] || 'unknown',
      connected: dbStatus === 1
    }
  });
});

// 404 Handler - catch all undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: {
      root: '/',
      health: '/api/health',
      auth: '/api/auth',
      modules: '/api/modules',
      progress: '/api/progress',
      dashboard: '/api/dashboard',
      chatbot: '/api/chatbot',
      gamification: '/api/gamification'
    }
  });
});

// Start server with error handling
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log(`\n💡 Solutions:`);
    console.log(`   1. Stop the other process using port ${PORT}`);
    console.log(`   2. Change PORT in .env file to a different port (e.g., 5001)`);
    console.log(`   3. Find and kill the process: netstat -ano | findstr :${PORT}`);
    console.log(`\n   To kill process on Windows:`);
    console.log(`   taskkill /PID <process_id> /F`);
  } else {
    console.error(`❌ Server error:`, err.message);
  }
  process.exit(1);
});

