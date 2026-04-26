import express from 'express';
import Activity from '../models/Activity.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get recent activities for a user
router.get('/:userId', authenticate, async (req, res) => {
    try {
        const targetUserId = req.params.userId === 'me' ? req.userId : req.params.userId;

        const activities = await Activity.find({ userId: targetUserId })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Save a new activity
router.post('/', authenticate, async (req, res) => {
    try {
        const { action, item, icon } = req.body;

        const activity = new Activity({
            userId: req.userId,
            action,
            item,
            icon: icon || '🔔'
        });

        await activity.save();
        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
