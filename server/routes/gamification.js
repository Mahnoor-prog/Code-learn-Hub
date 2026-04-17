import express from 'express';
import User from '../models/User.js';
import Badge from '../models/Badge.js';
import Progress from '../models/Progress.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user badges
router.get('/badges', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('badges.badgeId');
    const allBadges = await Badge.find();
    
    const badgesWithStatus = allBadges.map(badge => {
      const userBadge = user.badges.find(b => b.badgeId.toString() === badge._id.toString());
      return {
        id: badge._id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        earned: !!userBadge,
        date: userBadge?.earnedDate || null
      };
    });
    
    res.json(badgesWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('name points avatar')
      .sort({ points: -1 })
      .limit(10);
    
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      points: user.points,
      avatar: user.avatar || '👤'
    }));
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check and award badges
router.post('/check-badges', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const progresses = await Progress.find({ userId: req.userId });
    const allBadges = await Badge.find();
    
    const newBadges = [];
    
    for (const badge of allBadges) {
      const alreadyEarned = user.badges.some(b => b.badgeId.toString() === badge._id.toString());
      if (alreadyEarned) continue;
      
      let earned = false;
      
      switch (badge.criteria.type) {
        case 'lessons_completed':
          const totalLessons = progresses.reduce((sum, p) => sum + p.completedLessons.length, 0);
          earned = totalLessons >= badge.criteria.value;
          break;
        case 'modules_completed':
          const completedModules = progresses.filter(p => p.isCompleted).length;
          earned = completedModules >= badge.criteria.value;
          break;
        case 'streak':
          earned = user.streak >= badge.criteria.value;
          break;
        case 'points':
          earned = user.points >= badge.criteria.value;
          break;
      }
      
      if (earned) {
        user.badges.push({
          badgeId: badge._id,
          earnedDate: new Date()
        });
        user.points += badge.pointsReward;
        newBadges.push(badge);
      }
    }
    
    await user.save();
    
    res.json({ newBadges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;



