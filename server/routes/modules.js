import express from 'express';
import Module from '../models/Module.js';
import Progress from '../models/Progress.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all modules
router.get('/', async (req, res) => {
  try {
    const { language, difficulty } = req.query;
    let query = {};
    
    if (language && language !== 'All') {
      query.language = language;
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    const modules = await Module.find(query).sort({ createdAt: -1 });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single module
router.get('/:id', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get module with user progress
router.get('/:id/progress', authenticate, async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const progress = await Progress.findOne({
      userId: req.userId,
      moduleId: req.params.id
    });

    res.json({
      module,
      progress: progress || {
        progressPercentage: 0,
        completedLessons: [],
        isCompleted: false
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create module (admin only)
router.post('/', async (req, res) => {
  try {
    const module = new Module(req.body);
    await module.save();
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


