import express from 'express';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import Module from '../models/Module.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const progresses = await Progress.find({ userId: req.userId });
    
    const completedModules = progresses.filter(p => p.isCompleted).length;
    const totalModules = await Module.countDocuments();
    const activeModules = progresses.filter(p => !p.isCompleted && p.progressPercentage > 0).length;
    
    // Calculate average score
    let totalScore = 0;
    let totalLessons = 0;
    progresses.forEach(progress => {
      progress.completedLessons.forEach(lesson => {
        totalScore += lesson.score;
        totalLessons++;
      });
    });
    const averageScore = totalLessons > 0 ? Math.round(totalScore / totalLessons) : 0;

    // Weekly progress data (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayProgress = progresses.filter(p => {
        const completed = p.completedLessons.filter(l => {
          const lessonDate = new Date(l.completedAt);
          return lessonDate >= date && lessonDate < nextDate;
        });
        return completed.length > 0;
      }).length;
      
      weeklyData.push({
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: dayProgress * 20 // Mock percentage
      });
    }

    res.json({
      stats: {
        activeModules,
        completedModules,
        totalModules,
        averageScore,
        streak: user.streak,
        points: user.points,
        level: user.level
      },
      weeklyProgress: weeklyData,
      recentActivity: progresses
        .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt))
        .slice(0, 5)
        .map(p => ({
          moduleId: p.moduleId,
          progress: p.progressPercentage,
          lastAccessed: p.lastAccessedAt
        }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


