import express from 'express';
import admin from '../firebaseAdmin.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register: Sync Firebase User to MongoDB
router.post('/register', async (req, res) => {
  try {
    const { name, email } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user in MongoDB linked to Firebase
    const user = new User({ 
      name, 
      email, 
      firebaseUid: decodedToken.uid 
    });
    await user.save();

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Registration Sync Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get current user (this handles the login sync technically, since /me is fetched after Firebase login)
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update login streak
    const now = new Date();
    let isModified = false;

    if (user.lastLoginDate) {
      const last = new Date(user.lastLoginDate);
      const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfLast = new Date(last.getFullYear(), last.getMonth(), last.getDate());
      const diffDays = Math.floor((startOfNow - startOfLast) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.streak = (user.streak || 0) + 1;
        isModified = true;
      } else if (diffDays > 1) {
        user.streak = 1;
        isModified = true;
      }
    } else {
      user.streak = 1;
      isModified = true;
    }

    if (isModified) {
        if ((user.streak || 0) >= 7 && (user.streakBonusClaimed || 0) < 7) {
          user.points = (user.points || 0) + 200; // 7-day streak bonus XP
          user.streakBonusClaimed = 7;
        } else if ((user.streak || 0) < 7) {
          user.streakBonusClaimed = 0;
        }
        user.lastLoginDate = now;
        await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;


