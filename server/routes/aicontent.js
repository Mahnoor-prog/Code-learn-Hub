import express from 'express';
import OpenAI from 'openai';
import { authenticate } from '../middleware/auth.js';
import Progress from '../models/Progress.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';

const router = express.Router();

let openai;
router.use((req, res, next) => {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  next();
});

// Generate AI Lesson
router.post('/lesson', authenticate, async (req, res) => {
  try {
    const { topic, language, level } = req.body;

    // Check if lesson already exists in MongoDB
    const existingLesson = await Lesson.findOne({ topic, language, level });
    if (existingLesson) {
      return res.json(existingLesson);
    }

    const prompt = `You are an expert programming teacher. Generate a detailed lesson about "${topic}" in ${language} for ${level} level students.

Structure your response as JSON with this exact format:
{
  "title": "lesson title",
  "introduction": "brief introduction paragraph",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "codeExample": "complete working code example",
  "explanation": "explanation of the code example",
  "summary": "brief summary of what was learned"
}

Make the lesson clear, practical and educational. Include real working code examples.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7
    });

    const responseText = completion.choices[0].message.content;
    let lessonData;

    try {
      lessonData = JSON.parse(responseText);
    } catch {
      lessonData = {
        title: `${topic} in ${language}`,
        introduction: responseText,
        keyPoints: [],
        codeExample: '',
        explanation: '',
        summary: ''
      };
    }

    // Save to MongoDB so we don't regenerate
    const lesson = new Lesson({
      topic,
      language,
      level,
      content: lessonData
    });
    await lesson.save();

    res.json(lessonData);
  } catch (error) {
    console.error('AI Lesson Error:', error);
    res.status(500).json({ message: 'Failed to generate lesson. Check your OpenAI API key.' });
  }
});

// Generate AI Quiz
router.post('/quiz', authenticate, async (req, res) => {
  try {
    const { topic, language, level } = req.body;

    // Check if quiz already exists
    const existingQuiz = await Quiz.findOne({ topic, language, level });
    if (existingQuiz) {
      return res.json(existingQuiz.questions);
    }

    const prompt = `Generate 5 multiple choice quiz questions about "${topic}" in ${language} for ${level} level students.

Return ONLY a JSON array with this exact format:
[
  {
    "question": "question text",
    "options": ["option A", "option B", "option C", "option D"],
    "correctAnswer": 0,
    "explanation": "why this answer is correct"
  }
]

correctAnswer is the index (0-3) of the correct option. Make questions practical and educational.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7
    });

    const responseText = completion.choices[0].message.content;
    let questions;

    try {
      const clean = responseText.replace(/```json|```/g, '').trim();
      questions = JSON.parse(clean);
    } catch {
      questions = [];
    }

    // Save to MongoDB
    const quiz = new Quiz({
      topic,
      language,
      level,
      questions
    });
    await quiz.save();

    res.json(questions);
  } catch (error) {
    console.error('AI Quiz Error:', error);
    res.status(500).json({ message: 'Failed to generate quiz. Check your OpenAI API key.' });
  }
});

// Generate AI Exercises
router.post('/exercises', authenticate, async (req, res) => {
  try {
    const { topic, language, level } = req.body;

    const prompt = `Generate 2 hands-on coding exercises about "${topic}" in ${language} for ${level} level students.

Return ONLY a JSON array with this exact format:
[
  {
    "title": "exercise title",
    "description": "what the student needs to do",
    "starterCode": "starter code template with comments",
    "hint": "a helpful hint",
    "expectedOutput": "what the output should look like"
  }
]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7
    });

    const responseText = completion.choices[0].message.content;
    let exercises;

    try {
      const clean = responseText.replace(/```json|```/g, '').trim();
      exercises = JSON.parse(clean);
    } catch {
      exercises = [];
    }

    res.json(exercises);
  } catch (error) {
    console.error('AI Exercise Error:', error);
    res.status(500).json({ message: 'Failed to generate exercises.' });
  }
});

// AI Code Debugging
router.post('/debug', authenticate, async (req, res) => {
  try {
    const { code, language, error } = req.body;

    const prompt = `You are an expert ${language} programmer and teacher. A student has the following code with an error:

CODE:
${code}

ERROR:
${error || 'No specific error message provided'}

Please provide:
1. What is wrong with the code
2. Which line has the issue
3. Why it is wrong
4. The corrected code

Return ONLY a JSON object with this format:
{
  "issue": "brief description of the problem",
  "errorLine": "the specific line with the error",
  "explanation": "clear explanation of why it is wrong",
  "fixedCode": "the complete corrected code",
  "tip": "a helpful tip to avoid this error in future"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.3
    });

    const responseText = completion.choices[0].message.content;
    let debugResult;

    try {
      const clean = responseText.replace(/```json|```/g, '').trim();
      debugResult = JSON.parse(clean);
    } catch {
      debugResult = {
        issue: 'Code analysis complete',
        errorLine: '',
        explanation: responseText,
        fixedCode: code,
        tip: 'Review your code carefully'
      };
    }

    res.json(debugResult);
  } catch (error) {
    console.error('AI Debug Error:', error);
    res.status(500).json({ message: 'Failed to debug code.' });
  }
});

// AI Personalized Recommendation
router.get('/recommendation', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const userProgress = await Progress.find({ userId }).populate('moduleId');

    const completedTopics = userProgress
      .filter(p => p.isCompleted)
      .map(p => p.moduleId?.title || 'Unknown');

    const weakAreas = userProgress
      .filter(p => p.progressPercentage < 50 && p.progressPercentage > 0)
      .map(p => p.moduleId?.title || 'Unknown');

    const prompt = `A student learning programming has completed these topics: ${completedTopics.join(', ') || 'none yet'}.
Their weak areas are: ${weakAreas.join(', ') || 'none identified yet'}.

Recommend what they should learn next and why. Keep it encouraging and specific.

Return ONLY a JSON object:
{
  "recommendation": "what to learn next",
  "reason": "why this is recommended",
  "encouragement": "motivational message for the student"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    });

    const responseText = completion.choices[0].message.content;
    let recommendation;

    try {
      const clean = responseText.replace(/```json|```/g, '').trim();
      recommendation = JSON.parse(clean);
    } catch {
      recommendation = {
        recommendation: 'Continue with your current modules',
        reason: 'Practice makes perfect',
        encouragement: 'You are doing great! Keep going!'
      };
    }

    res.json(recommendation);
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    res.status(500).json({ message: 'Failed to get recommendation.' });
  }
});

// Generate AI content (legacy route - keep for compatibility)
router.post('/generate', authenticate, async (req, res) => {
  try {
    const { topic, language, difficulty, contentType } = req.body;

    const prompt = `Generate ${contentType || 'lesson'} content about "${topic}" in ${language} for ${difficulty || 'Beginner'} level. Make it educational and practical.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7
    });

    res.json({
      content: completion.choices[0].message.content,
      personalized: true,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;