import express from 'express';
import jwt from 'jsonwebtoken';
import OpenAI from 'openai';
import { authenticate } from '../middleware/auth.js';
import LessonPerformance from '../models/LessonPerformance.js';
import Module from '../models/Module.js';
import ChatHistory from '../models/ChatHistory.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

const router = express.Router();

let openaiClient;
const getOpenAI = () => {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
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

const generateExtraPractice = async ({ language, level, lessonTitle }) => {
  const fallback = [
    { title: `${lessonTitle} - Practice A`, content: `Review ${lessonTitle} fundamentals in ${language}. Build one small snippet and explain each line.` },
    { title: `${lessonTitle} - Practice B`, content: `Create a mini exercise for ${lessonTitle} at ${level} level. Focus on correctness first, then readability.` }
  ];

  try {
    const prompt = `Create 2 extra practice lessons for weak topic.
Language: ${language}
Level: ${level}
Topic: ${lessonTitle}
Return ONLY JSON:
{
  "lessons":[
    {"title":"string","content":"string"},
    {"title":"string","content":"string"}
  ]
}`;
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 900,
      temperature: 0.7
    });
    const parsed = parseJson(completion.choices?.[0]?.message?.content);
    const lessons = Array.isArray(parsed?.lessons) ? parsed.lessons.slice(0, 2) : [];
    if (lessons.length === 2) return lessons;
    return fallback;
  } catch {
    return fallback;
  }
};

const pushEncouragementToChat = async (userId, lessonTitle, language) => {
  const message = `I noticed you've had multiple retries on "${lessonTitle}". You're improving with every attempt. Let's simplify it: revisit fundamentals, solve one tiny exercise first, then return to the quiz. I can also suggest beginner-friendly ${language} resources if you want.`;
  let chat = await ChatHistory.findOne({ userId });
  if (!chat) {
    chat = new ChatHistory({ userId, messages: [] });
  }
  chat.messages.push({
    text: message,
    sender: 'ai',
    timestamp: new Date()
  });
  await chat.save();
};

router.use(authenticate);

router.post('/lesson-attempt', async (req, res) => {
  try {
    const effectiveUserId = resolveUserId(req);
    const {
      moduleId,
      lessonId,
      lessonTitle,
      language,
      level,
      score,
      totalQuestions,
      passed,
      timeSpentSeconds,
      isModuleFinalLesson
    } = req.body;

    let perf = await LessonPerformance.findOne({ userId: effectiveUserId, moduleId, lessonId });
    if (!perf) {
      perf = new LessonPerformance({
        userId: effectiveUserId,
        moduleId,
        lessonId,
        lessonTitle,
        language,
        level,
        attempts: []
      });
    }

    perf.lessonTitle = lessonTitle || perf.lessonTitle;
    perf.language = language || perf.language;
    perf.level = level || perf.level;
    perf.attempts.push({
      score: Number(score) || 0,
      totalQuestions: Number(totalQuestions) || 5,
      passed: Boolean(passed),
      timeSpentSeconds: Number(timeSpentSeconds) || 0,
      submittedAt: new Date()
    });
    perf.bestScore = Math.max(perf.bestScore || 0, Number(score) || 0);
    perf.totalRetakes = Math.max(0, perf.attempts.length - 1);
    perf.failStreak = passed ? 0 : (perf.failStreak || 0) + 1;
    perf.weakTopic = (Number(score) / Math.max(Number(totalQuestions) || 5, 1)) < 0.6;
    perf.strongTopic = Number(score) === Number(totalQuestions);
    await perf.save();

    const adaptive = {
      extraPracticeLessons: [],
      fastLearnerMessage: '',
      encouragementTriggered: false,
      nextModuleSuggestion: ''
    };

    if (!passed && Number(score) < 3) {
      adaptive.extraPracticeLessons = await generateExtraPractice({
        language: language || perf.language,
        level: level || perf.level,
        lessonTitle: lessonTitle || perf.lessonTitle || 'Current Topic'
      });
    }

    if (Number(score) === 5 && Number(totalQuestions) === 5) {
      adaptive.fastLearnerMessage = 'You are a fast learner! Consider jumping to next level';
      const user = await User.findById(effectiveUserId);
      if (user) {
        user.points = (user.points || 0) + 150; // Perfect score bonus
        await user.save();
      }
    }

    if (passed && perf.attempts.length === 1) {
      const user = await User.findById(effectiveUserId);
      if (user) {
        user.points = (user.points || 0) + 100; // Pass quiz first try
        await user.save();
      }
      await new Activity({
        userId: effectiveUserId,
        action: 'Passed quiz first try',
        item: lessonTitle || 'Lesson Quiz',
        icon: '🎯'
      }).save();
    }

    if (!passed && perf.failStreak >= 3) {
      await pushEncouragementToChat(effectiveUserId, lessonTitle || perf.lessonTitle || 'this lesson', language || perf.language || 'programming');
      adaptive.encouragementTriggered = true;
    }

    if (passed && isModuleFinalLesson) {
      const currentModule = await Module.findById(moduleId);
      const allModules = await Module.find().sort({ createdAt: -1 });
      const suggestion = allModules.find((m) => String(m._id) !== String(moduleId) && (m.language === currentModule?.language || m.difficulty !== currentModule?.difficulty));
      if (suggestion) {
        adaptive.nextModuleSuggestion = `Great job completing this module. Next best module: ${suggestion.title}.`;
      }
    }

    res.json({
      saved: true,
      attempts: perf.attempts.length,
      failStreak: perf.failStreak,
      adaptive
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const effectiveUserId = resolveUserId(req);
    const rows = await LessonPerformance.find({ userId: effectiveUserId });
    const totalAttempts = rows.reduce((sum, row) => sum + row.attempts.length, 0);
    const avgQuizScore = rows.length
      ? Math.round((rows.reduce((sum, row) => sum + (row.bestScore || 0), 0) / rows.length) * 20)
      : 0;
    const weakAreas = rows.filter((r) => r.weakTopic).map((r) => r.lessonTitle);
    const strongAreas = rows.filter((r) => r.strongTopic).map((r) => r.lessonTitle);
    const totalTimeSpentSeconds = rows.reduce(
      (sum, row) => sum + row.attempts.reduce((inner, at) => inner + (at.timeSpentSeconds || 0), 0),
      0
    );

    const user = await User.findById(effectiveUserId);

    res.json({
      totalAttempts,
      averageQuizScorePercentage: avgQuizScore,
      weakAreas,
      strongAreas,
      totalTimeSpentSeconds,
      currentStreak: user?.streak || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
