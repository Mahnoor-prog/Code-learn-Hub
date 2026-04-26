import express from 'express';
import jwt from 'jsonwebtoken';
import OpenAI from 'openai';
import { authenticate } from '../middleware/auth.js';
import WeeklyReport from '../models/WeeklyReport.js';
import LessonPerformance from '../models/LessonPerformance.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

const router = express.Router();

let openaiClient;
const getOpenAI = () => {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

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

const getWeekBounds = () => {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day + 6) % 7;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diffToMonday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return { weekStart, weekEnd };
};

const parseJson = (text) => {
  if (!text) return null;
  const clean = String(text).replace(/```json|```/gi, '').trim();
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(clean.slice(start, end + 1));
    } catch {
      return null;
    }
  }
  try {
    return JSON.parse(clean);
  } catch {
    return null;
  }
};

const buildPredictedCompletionDate = (progressRows, streak) => {
  const totalPercent = progressRows.reduce((sum, row) => sum + (row.progressPercentage || 0), 0);
  const avgPercent = progressRows.length ? totalPercent / progressRows.length : 0;
  const remaining = Math.max(0, 100 - avgPercent);
  const speedFactor = streak >= 7 ? 1.4 : streak >= 3 ? 1.2 : 1;
  const daysNeeded = Math.max(7, Math.ceil((remaining / 4) / speedFactor));
  const target = new Date();
  target.setDate(target.getDate() + daysNeeded);
  return target.toDateString();
};

const createWeeklyReport = async (userId) => {
  const { weekStart, weekEnd } = getWeekBounds();
  const existing = await WeeklyReport.findOne({ userId, weekStart });
  if (existing) return existing;

  const [perfs, progressRows, user] = await Promise.all([
    LessonPerformance.find({
      userId,
      updatedAt: { $gte: weekStart, $lte: weekEnd }
    }),
    Progress.find({ userId }),
    User.findById(userId)
  ]);

  const totalLessonsCompleted = perfs.filter((p) => p.attempts.some((a) => a.passed)).length;
  const averageQuizScore = perfs.length
    ? Math.round((perfs.reduce((sum, p) => sum + (p.bestScore || 0), 0) / perfs.length) * 20)
    : 0;

  const strongestTopic = perfs.find((p) => p.strongTopic)?.lessonTitle || 'No strong topic yet';
  const weakestTopic = perfs.find((p) => p.weakTopic)?.lessonTitle || 'No weak topic found';
  const predictedCompletionDate = buildPredictedCompletionDate(progressRows, user?.streak || 0);

  const fallback = {
    recommendedFocus: weakestTopic === 'No weak topic found' ? 'Continue current learning pace with consistency.' : `Spend extra revision time on ${weakestTopic}.`,
    motivationalMessage: averageQuizScore >= 70 ? 'Great momentum this week. Keep shipping code daily.' : 'Progress beats perfection. Small daily wins will compound quickly.'
  };

  let aiContent = fallback;
  try {
    const prompt = `Generate a short weekly study recommendation.
Stats:
- lessonsCompleted: ${totalLessonsCompleted}
- avgQuizScore: ${averageQuizScore}
- strongestTopic: ${strongestTopic}
- weakestTopic: ${weakestTopic}
- streak: ${user?.streak || 0}

Return ONLY JSON:
{
  "recommendedFocus":"string",
  "motivationalMessage":"string"
}`;
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.7
    });
    const parsed = parseJson(completion.choices?.[0]?.message?.content);
    if (parsed?.recommendedFocus && parsed?.motivationalMessage) {
      aiContent = parsed;
    }
  } catch {
    aiContent = fallback;
  }

  const report = await WeeklyReport.create({
    userId,
    weekStart,
    weekEnd,
    totalLessonsCompleted,
    averageQuizScore,
    strongestTopic,
    weakestTopic,
    recommendedFocus: aiContent.recommendedFocus,
    motivationalMessage: aiContent.motivationalMessage,
    predictedCompletionDate
  });

  return report;
};

router.use(authenticate);

router.get('/current', async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const report = await createWeeklyReport(userId);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const reports = await WeeklyReport.find({ userId }).sort({ weekStart: -1 }).limit(12);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const report = await createWeeklyReport(userId);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
