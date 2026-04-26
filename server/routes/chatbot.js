import express from 'express';
import OpenAI from 'openai';
import ChatHistory from '../models/ChatHistory.js';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import UserLearningProfile from '../models/UserLearningProfile.js';
import LessonPerformance from '../models/LessonPerformance.js';

const router = express.Router();

const buildPerformanceSnapshot = async (userId) => {
  const rows = await LessonPerformance.find({ userId }).sort({ updatedAt: -1 }).limit(30);
  const weakAreas = rows.filter((r) => r.weakTopic).map((r) => r.lessonTitle).slice(0, 5);
  const strongAreas = rows.filter((r) => r.strongTopic).map((r) => r.lessonTitle).slice(0, 5);
  const recentScores = rows
    .map((r) => r.attempts[r.attempts.length - 1])
    .filter(Boolean)
    .slice(0, 5)
    .map((a) => `${a.score}/${a.totalQuestions}`);
  return { weakAreas, strongAreas, recentScores };
};

// Get chat history
router.get('/history', authenticate, async (req, res) => {
  try {
    let chatHistory = await ChatHistory.findOne({ userId: req.userId });

    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId: req.userId,
        messages: [{
          text: "Hello! I'm your AI coding assistant powered by GPT. I can help you with Python, C++, C#, Java, and React. What would you like to learn today?",
          sender: 'ai'
        }]
      });
      await chatHistory.save();
    }

    res.json(chatHistory.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/message', authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    const user = await User.findById(req.userId);
    const profile = await UserLearningProfile.findOne({ userId: req.userId });
    const perf = await buildPerformanceSnapshot(req.userId);

    let chatHistory = await ChatHistory.findOne({ userId: req.userId });

    if (!chatHistory) {
      chatHistory = new ChatHistory({ userId: req.userId, messages: [] });
    }

    // Add user message
    chatHistory.messages.push({
      text,
      sender: 'user',
      timestamp: new Date()
    });

    // Build conversation history for OpenAI
    const recentMessages = chatHistory.messages.slice(-10);
    const conversationHistory = recentMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    // Call OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert programming tutor helping students learn Python, C++, C#, Java, and React. 
          You explain concepts clearly with code examples. 
          Keep responses concise and educational. 
          Always include working code examples when relevant.
          Format code with proper markdown code blocks using the correct language identifier.
          Be encouraging and supportive to students.
          Personalize responses with this user context:
          - Name: ${user?.name || 'Student'}
          - Goal: ${profile?.goal || 'Learn for Fun'}
          - Experience: ${profile?.experience || 'Complete Beginner'}
          - Weak areas: ${perf.weakAreas.join(', ') || 'none'}
          - Strong areas: ${perf.strongAreas.join(', ') || 'none'}
          - Recent quiz scores: ${perf.recentScores.join(', ') || 'none'}
          If user asks what to learn next, recommend a concrete next topic based on weak areas and goal.`
        },
        ...conversationHistory
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Add AI response to history
    chatHistory.messages.push({
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    });

    await chatHistory.save();

    res.json({
      response: aiResponse,
      aiMessage: chatHistory.messages[chatHistory.messages.length - 1],
      userMessage: chatHistory.messages[chatHistory.messages.length - 2]
    });
  } catch (error) {
    console.error('Chatbot Error:', error);
    res.status(500).json({ message: 'Failed to get AI response. Check your OpenAI API key.' });
  }
});

// Analyze user performance with AI summary
router.get('/analyze-performance', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const profile = await UserLearningProfile.findOne({ userId: req.userId });
    const perf = await buildPerformanceSnapshot(req.userId);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `Analyze student performance and provide concise guidance.
User: ${user?.name || 'Student'}
Goal: ${profile?.goal || 'Learn for Fun'}
Experience: ${profile?.experience || 'Complete Beginner'}
Weak areas: ${perf.weakAreas.join(', ') || 'none'}
Strong areas: ${perf.strongAreas.join(', ') || 'none'}
Recent quiz scores: ${perf.recentScores.join(', ') || 'none'}

Return plain text with:
1) current level assessment
2) 3 concrete next actions
3) a motivational closing line`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    });

    const analysis = completion.choices?.[0]?.message?.content || 'Performance analysis is currently unavailable.';
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ message: 'Failed to analyze performance' });
  }
});

// Clear chat history
router.delete('/history', authenticate, async (req, res) => {
  try {
    await ChatHistory.findOneAndDelete({ userId: req.userId });
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;