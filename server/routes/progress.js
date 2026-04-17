import express from 'express';
import Progress from '../models/Progress.js';
import Module from '../models/Module.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user progress for a module
router.get('/module/:moduleId', authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.userId,
      moduleId: req.params.moduleId
    });

    if (!progress) {
      return res.json({
        progressPercentage: 0,
        completedLessons: [],
        isCompleted: false
      });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update progress
router.post('/module/:moduleId', authenticate, async (req, res) => {
  try {
    const { lessonId, score } = req.body;
    const module = await Module.findById(req.params.moduleId);

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    let progress = await Progress.findOne({
      userId: req.userId,
      moduleId: req.params.moduleId
    });

    if (!progress) {
      progress = new Progress({
        userId: req.userId,
        moduleId: req.params.moduleId
      });
    }

    // Check if lesson already completed
    const existingLesson = progress.completedLessons.find(
      l => l.lessonId === lessonId
    );

    if (!existingLesson) {
      progress.completedLessons.push({
        lessonId,
        score: score || 0,
        completedAt: new Date()
      });
    }

    // Auto-award "Perfect Score Badge" if quiz score is 100
    if (score === 100 && !progress.badges.includes("Perfect Score Badge")) {
      progress.badges.push("Perfect Score Badge");
    }

    // Calculate progress percentage
    const totalLessons = module.totalLessons || module.lessons.length || 1;
    progress.progressPercentage = Math.round(
      (progress.completedLessons.length / totalLessons) * 100
    );

    // Calculate streak days (basic rough logic: check diff against lastAccessedAt)
    const today = new Date();
    const lastAccess = progress.lastAccessedAt ? new Date(progress.lastAccessedAt) : today;
    const diffTime = Math.abs(today - lastAccess);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If accessed yesterday (diff = 1), increment streak, if 0 it's same day, > 1 reset
    if (diffDays === 1) {
      progress.streakDays = (progress.streakDays || 0) + 1;
    } else if (diffDays > 1) {
      progress.streakDays = 1;
    } else if (!progress.streakDays) {
      progress.streakDays = 1; // initial hit
    }

    if (progress.streakDays >= 7 && !progress.badges.includes("7 Day Streak Badge")) {
      progress.badges.push("7 Day Streak Badge");
    }

    // Check if module is completed
    if (progress.progressPercentage >= 100 && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date();

      // Award points
      const user = await User.findById(req.userId);
      user.points = (user.points || 0) + 500; // Points for completing a module
      await user.save();

      // Award Completion Badge specific to difficulty
      if (module.difficulty === 'Beginner' && !progress.badges.includes("Beginner Badge")) {
        progress.badges.push("Beginner Badge");
      } else if (module.difficulty === 'Intermediate' && !progress.badges.includes("Intermediate Badge")) {
        progress.badges.push("Intermediate Badge");
      } else if (module.difficulty === 'Advanced' && !progress.badges.includes("Advanced Badge")) {
        progress.badges.push("Advanced Badge");
      }
    }

    progress.lastAccessedAt = today;
    await progress.save();

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all user progress
router.get('/all', authenticate, async (req, res) => {
  try {
    const progresses = await Progress.find({ userId: req.userId })
      .populate('moduleId', 'title language difficulty icon')
      .sort({ lastAccessedAt: -1 });

    res.json(progresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


