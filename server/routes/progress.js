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

    // Calculate progress percentage
    const totalLessons = module.totalLessons || module.lessons.length;
    progress.progressPercentage = Math.round(
      (progress.completedLessons.length / totalLessons) * 100
    );

    // Check if module is completed
    if (progress.progressPercentage >= 100 && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
      
      // Award points
      const user = await User.findById(req.userId);
      user.points += 500; // Points for completing a module
      await user.save();
    }

    progress.lastAccessedAt = new Date();
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


