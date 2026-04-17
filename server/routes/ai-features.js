import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { generateLessonContent, generateQuizAndExercises, explainError, generateNextLessonRecommendation, generateProgressCoachMessage } from '../services/openai.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

const router = express.Router();

// Generate or fetch a lesson
router.post('/lesson', authenticate, async (req, res) => {
    try {
        const { topic, language, level = 1 } = req.body;

        if (!topic || !language) {
            return res.status(400).json({ message: "Topic and language are required" });
        }

        // Check if lesson exists
        let lesson = await Lesson.findOne({
            topic: { $regex: new RegExp(`^${topic}$`, 'i') },
            language: { $regex: new RegExp(`^${language}$`, 'i') },
            level
        });

        if (lesson) {
            return res.json({ message: "Loaded from cache", data: lesson });
        }

        // Generate lesson using AI
        const content = await generateLessonContent(topic, language, level);

        // Save to DB
        lesson = new Lesson({
            topic,
            language,
            level,
            content
        });
        await lesson.save();

        res.json({ message: "Generated successfully", data: lesson });
    } catch (error) {
        console.error("AI Lesson Error:", error);
        res.status(500).json({ message: error.message || "Failed to generate lesson" });
    }
});

// Generate or fetch a quiz and exercises
router.post('/quiz', authenticate, async (req, res) => {
    try {
        const { topic, language, level = 1 } = req.body;

        if (!topic || !language) {
            return res.status(400).json({ message: "Topic and language are required" });
        }

        // Check if quiz exists
        let quizDoc = await Quiz.findOne({
            topic: { $regex: new RegExp(`^${topic}$`, 'i') },
            language: { $regex: new RegExp(`^${language}$`, 'i') },
            level
        });

        if (quizDoc) {
            return res.json({ message: "Loaded from cache", data: quizDoc });
        }

        // Generate quiz & exercises via OpenAI
        const assessment = await generateQuizAndExercises(topic, language, level);

        // Format to match Mongoose schema
        const questionsForDb = assessment.questions.map(q => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer
        }));

        quizDoc = new Quiz({
            topic,
            language,
            level,
            questions: questionsForDb
        });
        await quizDoc.save();

        // Returning assessment which includes exercises (exercises aren't stored in DB per schema, just returned dynamically for now)
        res.json({
            message: "Generated successfully",
            data: {
                quizId: quizDoc._id,
                ...assessment
            }
        });
    } catch (error) {
        console.error("AI Quiz Error:", error);
        res.status(500).json({ message: error.message || "Failed to generate quiz" });
    }
});

// Smart Debug using AI
router.post('/debug', authenticate, async (req, res) => {
    try {
        const { code, language, errorMessage } = req.body;

        if (!code || !language || !errorMessage) {
            return res.status(400).json({ message: "Code, language, and errorMessage are required" });
        }

        const debugInfo = await explainError(code, language, errorMessage);

        res.json({ message: "Analysis complete", data: debugInfo });
    } catch (error) {
        console.error("AI Debug Error:", error);
        res.status(500).json({ message: error.message || "Failed to analyze error" });
    }
});

// personalized next lesson recommendation
router.get('/recommendation', authenticate, async (req, res) => {
    try {
        const progresses = await Progress.find({ userId: req.userId }).populate('moduleId', 'title language difficulty');

        const simplifiedProgress = progresses.map(p => ({
            module: p.moduleId ? p.moduleId.title : 'Unknown',
            language: p.moduleId ? p.moduleId.language : 'Unknown',
            level: p.moduleId ? p.moduleId.difficulty : 'Unknown',
            progressPercentage: p.progressPercentage,
            completedLessonsCount: p.completedLessons.length
        }));

        const recommendation = await generateNextLessonRecommendation(simplifiedProgress);
        res.json({ data: recommendation });
    } catch (error) {
        console.error("AI Recommendation Error:", error);
        res.status(500).json({ message: error.message || "Failed to generate recommendation" });
    }
});

// get AI progressive coach message
router.get('/coach', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const progresses = await Progress.find({ userId: req.userId });

        let totalCompletedLessons = 0;
        let totalExercisesDone = 0;
        progresses.forEach(p => {
            totalCompletedLessons += p.completedLessons.length;
            totalExercisesDone += p.exercisesDone || 0;
        });

        const stats = {
            badges: progresses[0]?.badges || [], // user-level badges tracked inside progress
            streakDays: progresses[0]?.streakDays || 0,
            totalCompletedLessons,
            totalExercisesDone
        };

        const message = await generateProgressCoachMessage(stats);
        res.json({ message });
    } catch (error) {
        console.error("AI Coach Error:", error);
        res.status(500).json({ message: "Keep up the great work! You're doing amazing." });
    }
});

export default router;
