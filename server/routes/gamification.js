import express from 'express';
import User from '../models/User.js';
import Badge from '../models/Badge.js';
import Progress from '../models/Progress.js';
import Activity from '../models/Activity.js';
import LessonPerformance from '../models/LessonPerformance.js';
import Module from '../models/Module.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const getXpTitle = (points) => {
  if (points >= 6000) return { title: 'Legend', icon: '👑', min: 6000, max: 999999 };
  if (points >= 3000) return { title: 'Expert', icon: '⚡', min: 3000, max: 6000 };
  if (points >= 1500) return { title: 'Developer', icon: '🚀', min: 1500, max: 3000 };
  if (points >= 500) return { title: 'Coder', icon: '💻', min: 500, max: 1500 };
  return { title: 'Newbie', icon: '🌱', min: 0, max: 500 };
};

const getWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = (day + 6) % 7;
  const start = new Date(now);
  start.setDate(now.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

// -----------------------------------------
// GET /status/me — MUST be before /:userId to avoid route shadowing
// XP title + weekly missions
// -----------------------------------------
router.get('/status/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const xp = user.points || 0;
    const xpMeta = getXpTitle(xp);
    const xpProgress = Math.min(
      100,
      Math.round(((xp - xpMeta.min) / Math.max(xpMeta.max - xpMeta.min, 1)) * 100)
    );

    const weekStart = getWeekStart();
    const [progresses, perfs, recentActivities] = await Promise.all([
      Progress.find({ userId: req.userId }),
      LessonPerformance.find({ userId: req.userId, updatedAt: { $gte: weekStart } }),
      Activity.find({ userId: req.userId, createdAt: { $gte: weekStart } }).sort({ createdAt: -1 })
    ]);

    const lessonsCompletedThisWeek = recentActivities.filter((a) => a.action.includes('Completed lesson')).length;
    const hasPerfectScore = perfs.some((p) => p.attempts.some((at) => at.score === at.totalQuestions));
    const streak7 = (user.streak || 0) >= 7;

    const attemptedModuleIds = new Set(progresses.map((p) => String(p.moduleId)));
    const allModulesCount = await Module.countDocuments();
    const triedNewModule = attemptedModuleIds.size >= Math.min(2, allModulesCount);

    const missions = [
      { key: 'complete_5_lessons', label: 'Complete 5 lessons this week', completed: lessonsCompletedThisWeek >= 5, bonusXp: 150 },
      { key: 'perfect_score', label: 'Score 100% on any quiz', completed: hasPerfectScore, bonusXp: 200 },
      { key: 'login_7_days', label: 'Login 7 days in a row', completed: streak7, bonusXp: 200 },
      { key: 'try_new_module', label: 'Try a new module', completed: triedNewModule, bonusXp: 100 }
    ];

    res.json({
      totalPoints: xp,
      xpTitle: xpMeta.title,
      xpIcon: xpMeta.icon,
      xpProgress,
      pointsToNextTitle: Math.max(0, xpMeta.max - xp),
      missions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------
// POST /check - Check and assign new badges
// -----------------------------------------
router.post('/check', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const progresses = await Progress.find({ userId: req.userId }).populate('moduleId');
    const allBadges = await Badge.find();

    const newBadges = [];
    let updatedPoints = user.points || 0;

    for (const badge of allBadges) {
      const alreadyEarned = user.badges.some(b => b.badgeId.toString() === badge._id.toString());
      if (alreadyEarned) continue;

      let earned = false;

      switch (badge.name) {
        case 'First Step':
          earned = progresses.some(p => p.lessonsCompleted && p.lessonsCompleted.length >= 1);
          break;

        case 'Python Rookie':
          earned = progresses.some(p => p.moduleId && p.moduleId.title === 'Python Beginner' && p.isCompleted);
          break;

        case 'Python Master':
          earned = progresses.some(p => p.moduleId && p.moduleId.title === 'Python Advanced' && p.isCompleted);
          break;

        case 'React Developer':
          earned = progresses.some(p => p.moduleId && p.moduleId.title.includes('React') && p.isCompleted);
          break;

        case 'Code Warrior':
          const completedCount = progresses.filter(p => p.isCompleted).length;
          earned = completedCount >= 5;
          break;

        case 'Streak Master':
          earned = (user.streak || 0) >= 7;
          break;

        case 'Perfect Score':
          earned = progresses.some(p => p.progressPercentage === 100 && p.isCompleted);
          break;

        default:
          break;
      }

      if (earned) {
        user.badges.push({ badgeId: badge._id, earnedDate: new Date() });
        updatedPoints += badge.points;
        newBadges.push(badge);

        await new Activity({ userId: req.userId, action: 'Earned badge', item: badge.name, icon: badge.icon }).save();
      }
    }

    if (newBadges.length > 0) {
      user.points = updatedPoints;
      await user.save();
    }

    res.json({ newBadges, totalPoints: user.points, streak: user.streak });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------
// POST /seed - Seed Badges
// -----------------------------------------
router.post('/seed', async (req, res) => {
  try {
    const seedBadges = [
      { name: "First Step", description: "Complete your first lesson", icon: "🌱", requirement: "1 lesson", points: 10 },
      { name: "Python Rookie", description: "Complete all Python Beginner lessons", icon: "🐍", requirement: "Python Beginner 100%", points: 50 },
      { name: "Python Master", description: "Complete all Python Advanced lessons", icon: "👑", requirement: "Python Advanced 100%", points: 100 },
      { name: "React Developer", description: "Complete all React lessons", icon: "⚛️", requirement: "Any React Module 100%", points: 100 },
      { name: "Code Warrior", description: "Complete 5 modules", icon: "⚔️", requirement: "5 Modules", points: 200 },
      { name: "Streak Master", description: "7 day learning streak", icon: "🔥", requirement: "7 Days", points: 150 },
      { name: "Perfect Score", description: "Score 100% on any module", icon: "⭐", requirement: "100%", points: 75 },
    ];

    await Badge.deleteMany({});
    await Badge.insertMany(seedBadges);
    res.json({ message: "Badges Seeded Successfully", badges: seedBadges });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------------
// GET /leaderboard - Return top users by points
// -----------------------------------------
router.get('/leaderboard', authenticate, async (req, res) => {
  try {
    const topUsers = await User.find({ points: { $gt: 0 } })
      .sort({ points: -1 })
      .limit(10)
      .select('name points streak badges');

    const leaderboard = topUsers.map((u, i) => ({
      rank: i + 1,
      name: u.name || 'Anonymous',
      points: u.points || 0,
      streak: u.streak || 0,
      badgeCount: u.badges?.length || 0
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------
// GET /:userId - Return all badges for a user (MUST be last to avoid shadowing)
// -----------------------------------------
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const requestedUserId = req.params.userId === 'me' ? req.userId : req.params.userId;

    const user = await User.findById(requestedUserId).populate('badges.badgeId');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const allBadges = await Badge.find();

    const badgesWithStatus = allBadges.map(badge => {
      const userBadge = user.badges.find(b => b.badgeId && String(b.badgeId._id) === String(badge._id));
      return {
        _id: badge._id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        requirement: badge.requirement,
        points: badge.points,
        earned: !!userBadge,
        date: userBadge?.earnedDate || null
      };
    });

    res.json(badgesWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
