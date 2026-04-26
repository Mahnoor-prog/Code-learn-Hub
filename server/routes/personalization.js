import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import UserLearningProfile from '../models/UserLearningProfile.js';
import LearningRoadmap from '../models/LearningRoadmap.js';
import { generatePersonalizedRoadmap } from '../utils/personalization/roadmapGenerator.js';

const router = express.Router();

router.use(authenticate);

const resolveUserId = (req) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return req.userId;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded?.userId || req.userId;
  } catch {
    return req.userId;
  }
};

router.get('/onboarding-status', async (req, res) => {
  try {
    const effectiveUserId = resolveUserId(req);
    const profile = await UserLearningProfile.findOne({ userId: effectiveUserId });
    res.json({
      onboardingCompleted: Boolean(profile?.onboardingCompleted),
      profile: profile || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/onboarding', async (req, res) => {
  try {
    const effectiveUserId = resolveUserId(req);
    const { name, ageGroup, experience, goal, studyHours } = req.body;
    const user = await User.findById(effectiveUserId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = await UserLearningProfile.findOneAndUpdate(
      { userId: effectiveUserId },
      {
        userId: effectiveUserId,
        name: name || user.name,
        ageGroup,
        experience,
        goal,
        studyHours,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const roadmapData = await generatePersonalizedRoadmap(profile);

    const roadmap = await LearningRoadmap.findOneAndUpdate(
      { userId: effectiveUserId },
      {
        ...roadmapData,
        userId: effectiveUserId,
        generatedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ profile, roadmap });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/roadmap', async (req, res) => {
  try {
    const effectiveUserId = resolveUserId(req);
    const roadmap = await LearningRoadmap.findOne({ userId: effectiveUserId });
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not generated yet' });
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/roadmap/regenerate', async (req, res) => {
  try {
    const effectiveUserId = resolveUserId(req);
    const profile = await UserLearningProfile.findOne({ userId: effectiveUserId });
    if (!profile) {
      return res.status(400).json({ message: 'Complete onboarding first' });
    }

    const roadmapData = await generatePersonalizedRoadmap(profile);
    const roadmap = await LearningRoadmap.findOneAndUpdate(
      { userId: effectiveUserId },
      {
        ...roadmapData,
        userId: effectiveUserId,
        generatedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
