import express from 'express';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all dashboard aggregated stats
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const targetUserId = req.params.userId === 'me' ? req.userId : req.params.userId;

    const user = await User.findById(targetUserId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find all modules the user interacted with
    const activeProgresses = await Progress.find({ userId: targetUserId }).populate('moduleId');

    const activeModulesCount = activeProgresses.length;
    const completedModulesCount = activeProgresses.filter(p => p.isCompleted).length;

    // Detailed module list for "Learning Progress section" UI calculation directly on frontend
    const enrolledModulesList = activeProgresses.map(p => {
      return {
        title: p.moduleId ? p.moduleId.title : 'Legacy Module',
        completeCount: p.lessonsCompleted ? p.lessonsCompleted.length : 0,
        totalLessons: p.moduleId && p.moduleId.lessonCount ? p.moduleId.lessonCount : 1,
        percent: p.progressPercentage || 0,
        moduleId: p.moduleId ? p.moduleId._id : null
      };
    });

    res.json({
      activeModules: activeModulesCount,
      completed: completedModulesCount,
      streak: user.streak || 0,
      totalPoints: user.points || 0,
      enrolledModules: enrolledModulesList
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
