import express from 'express';
import Module from '../models/Module.js';
import Progress from '../models/Progress.js';
import Lesson from '../models/Lesson.js';
import { authenticate } from '../middleware/auth.js';
import OpenAI from 'openai';
import AICachedLesson from '../models/AICachedLesson.js';

let _openai;
const getOpenAI = () => {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
};

const router = express.Router();

const levelToNumber = (level) => {
  if (level === 'Advanced') return 3;
  if (level === 'Intermediate') return 2;
  return 1;
};

const extractJsonFromText = (text) => {
  if (!text || typeof text !== 'string') return null;
  const cleaned = text.replace(/```(?:json)?/gi, '').trim();

  // Try object first
  const objStart = cleaned.indexOf('{');
  const objEnd = cleaned.lastIndexOf('}');
  if (objStart !== -1 && objEnd !== -1 && objEnd > objStart) {
    const slice = cleaned.slice(objStart, objEnd + 1);
    try {
      return JSON.parse(slice);
    } catch { /* ignore */ }
  }

  // Then array
  const arrStart = cleaned.indexOf('[');
  const arrEnd = cleaned.lastIndexOf(']');
  if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
    const slice = cleaned.slice(arrStart, arrEnd + 1);
    try {
      return JSON.parse(slice);
    } catch { /* ignore */ }
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

const resolveTopicForLesson = (moduleDoc, lessonNumber) => {
  if (Array.isArray(moduleDoc?.lessons) && moduleDoc.lessons[lessonNumber - 1]?.title) {
    return moduleDoc.lessons[lessonNumber - 1].title;
  }
  return `${moduleDoc?.language || 'Programming'} Lesson ${lessonNumber}`;
};

const normalizeLessonPayload = (raw, lessonNumber, topic) => {
  if (!raw) {
    return {
      title: topic,
      content: `# Lesson ${lessonNumber}: ${topic}\n\nLesson content is not available yet. Please try again.`,
      codeExample: '',
      exercise: '',
    };
  }

  if (typeof raw === 'string') {
    return {
      title: topic,
      content: raw,
      codeExample: '',
      exercise: '',
    };
  }

  const content =
    raw.content ||
    raw.explanation ||
    raw.introduction ||
    raw.summary ||
    '';

  return {
    title: raw.title || topic,
    content,
    codeExample: raw.codeExample || '',
    exercise: raw.exercise || '',
  };
};

const normalizeQuizPayload = (rawQuestions) => {
  if (!Array.isArray(rawQuestions)) return [];
  return rawQuestions
    .map((q) => {
      const options = Array.isArray(q?.options) ? q.options.slice(0, 4).map((o) => String(o)) : [];
      let correctAnswer = Number(q?.correctAnswer);
      if (Number.isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
        correctAnswer = 0;
      }
      return {
        question: String(q?.question || q?.questionText || ''),
        options,
        correctAnswer,
      };
    })
    .filter((q) => q.question && q.options.length === 4)
    .slice(0, 5);
};

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

// Get all lessons for a specific module
router.get('/:moduleId/lessons', async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    
    // Instead of DB lessons, we always return 10 static lesson definitions.
    // The content will be dynamically loaded by the frontend.
    const lessons = Array.from({ length: 10 }, (_, i) => ({
      _id: `${module._id}_lesson_${i + 1}`,
      moduleId: module._id,
      title: `Lesson ${i + 1}`,
      language: module.language,
      level: module.difficulty,
      order: i + 1,
      isDynamic: true
    }));
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate or fetch cached AI lesson
router.post('/:moduleId/lessons/generate', async (req, res) => {
  try {
    const { lessonNumber, language, level } = req.body;
    const moduleDoc = await Module.findById(req.params.moduleId);
    if (!moduleDoc) return res.status(404).json({ message: 'Module not found' });

    const topic = resolveTopicForLesson(moduleDoc, Number(lessonNumber));
    const numericLevel = levelToNumber(level);
    const cacheKey = `Lesson ${lessonNumber}: ${topic}`;

    // Check backend cache just in case
    const cachedLesson = await AICachedLesson.findOne({
      topic: cacheKey,
      language,
      level: numericLevel,
    });
    if (cachedLesson) {
      const normalizedCachedLesson = normalizeLessonPayload(cachedLesson.content, lessonNumber, topic);
      return res.json(normalizedCachedLesson);
    }

    const promptText = `You are an expert programming tutor. Generate Lesson ${lessonNumber} for ${language} ${level} students on "${topic}".
You MUST return a raw JSON object strictly matching this schema:
{
  "title": "Short lesson title",
  "content": "The full markdown explanation of the topic, including code examples and analogies.",
  "codeExample": "A clean working code example as plain text",
  "exercise": "One practical exercise for the learner"
}
Requirements:
1. "content" MUST be formatted in clean, readable Markdown.
2. Keep the difficulty ${String(level || '').toLowerCase()}-friendly.
3. Keep the content practical and beginner friendly for self-study.`;

    let lessonData = null;
    try {
      const response = await getOpenAI().chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: promptText }],
        temperature: 0.7,
        max_tokens: 2000
      });
      
      const rawContent = response.choices?.[0]?.message?.content?.trim() || '';
      lessonData = extractJsonFromText(rawContent);
      
      // Ensure the structure is correct
      if (!lessonData || (!lessonData.content && !lessonData.explanation && !lessonData.introduction)) {
        throw new Error("Invalid AI JSON structure returned");
      }
    } catch (aiError) {
      console.error("AI Generation Error:", aiError);
      return res.status(500).json({ message: "Failed to generate AI lesson." });
    }

    // Save to backend cache
    const newCache = new AICachedLesson({
      topic: cacheKey,
      language,
      level: numericLevel,
      content: lessonData
    });
    await newCache.save();

    res.json(normalizeLessonPayload(lessonData, lessonNumber, topic));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate lesson quiz (5 MCQs, 4 options each) for a specific lesson topic/level
router.post('/:moduleId/lessons/:lessonNumber/quiz', async (req, res) => {
  try {
    const { moduleId, lessonNumber } = req.params;
    const { language, level } = req.body;
    const moduleDoc = await Module.findById(moduleId);
    if (!moduleDoc) return res.status(404).json({ message: 'Module not found' });

    const topic = resolveTopicForLesson(moduleDoc, Number(lessonNumber));
    const promptText = `Create exactly 5 MCQ quiz questions for ${language} learners.
Topic: "${topic}"
Difficulty level: ${level}

Return ONLY a JSON object in this exact shape:
{
  "quiz": [
    {
      "question": "Question text",
      "options": ["A option", "B option", "C option", "D option"],
      "correctAnswer": 0
    }
  ]
}

Rules:
- Exactly 5 questions.
- Exactly 4 options per question.
- correctAnswer must be an integer from 0 to 3.
- Questions must match the requested level and topic.`;

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: promptText }],
      temperature: 0.6,
      max_tokens: 1600
    });

    const rawContent = response.choices?.[0]?.message?.content?.trim() || '';
    const parsed = extractJsonFromText(rawContent);
    const quiz = normalizeQuizPayload(parsed?.quiz);

    if (quiz.length !== 5) {
      return res.status(500).json({ message: 'Failed to generate a valid 5-question quiz.' });
    }

    res.json({ topic, level, language, quiz });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to generate quiz.' });
  }
});

// Seed modules and AI lessons
router.post('/seed', authenticate, async (req, res) => {
  try {
    const seedData = [
      {
        title: 'Python Beginner', language: 'Python', difficulty: 'Beginner',
        description: 'Master the fundamentals of Python programming.', icon: '🐍',
        topics: ['Variables', 'Data Types', 'Loops', 'Functions', 'Lists', 'Dictionaries', 'File Handling', 'Error Handling', 'OOP Basics', 'Modules']
      },
      {
        title: 'Python Advanced', language: 'Python', difficulty: 'Advanced',
        description: 'Advanced Python concepts and architecture.', icon: '🐍',
        topics: ['Decorators', 'Generators', 'Async/Await', 'Threading', 'Meta Classes', 'Design Patterns', 'Testing', 'Performance', 'Data Structures', 'Algorithms']
      },
      {
        title: 'React Beginner', language: 'React', difficulty: 'Beginner',
        description: 'Learn modern React development.', icon: '⚛️',
        topics: ['JSX', 'Components', 'Props', 'State', 'Events', 'Hooks', 'useEffect', 'Forms', 'Lists', 'Routing']
      },
      {
        title: 'React Advanced', language: 'React', difficulty: 'Advanced',
        description: 'Master advanced React patterns.', icon: '⚛️',
        topics: ['Context API', 'Redux', 'Custom Hooks', 'Performance', 'Testing', 'SSR', 'TypeScript with React', 'Animations', 'Code Splitting', 'Security']
      },
      {
        title: 'JavaScript Beginner', language: 'JavaScript', difficulty: 'Beginner',
        description: 'Core concepts of JavaScript.', icon: '📜',
        topics: ['Variables', 'Functions', 'Arrays', 'Objects', 'DOM', 'Events', 'Fetch API', 'Promises', 'ES6', 'Error Handling']
      },
      {
        title: 'C++ Beginner', language: 'C++', difficulty: 'Beginner',
        description: 'Start programming in C++.', icon: '⚙️',
        topics: ['Syntax', 'Variables', 'Loops', 'Functions', 'Arrays', 'Pointers', 'OOP', 'Inheritance', 'STL', 'File I/O']
      },
      {
        title: 'Java Beginner', language: 'Java', difficulty: 'Beginner',
        description: 'Learn Java syntax and OOP.', icon: '☕',
        topics: ['Syntax', 'OOP', 'Inheritance', 'Interfaces', 'Collections', 'Exceptions', 'Threads', 'File I/O', 'Generics', 'Streams']
      },
      {
        title: 'C# Beginner', language: 'C#', difficulty: 'Beginner',
        description: 'Introduction to C# and .NET.', icon: '🔷',
        topics: ['Syntax', 'OOP', 'LINQ', 'Delegates', 'Async/Await', 'Collections', 'Generics', 'Events', 'File I/O', 'Unity Basics']
      }
    ];

    // Response immediately to avoid timeout
    res.json({ message: 'Seeding started in the background. This will take several minutes to generate all 80 lessons.' });

    // Background process
    (async () => {
      try {
        console.log('Background Seeding Started...');
        await Module.deleteMany({});
        await Lesson.deleteMany({});

        for (const data of seedData) {
          const mod = new Module({
            title: data.title,
            language: data.language,
            difficulty: data.difficulty,
            description: data.description,
            icon: data.icon,
            lessonCount: data.topics.length,
            totalLessons: data.topics.length
          });
          await mod.save();
          console.log(`Created module: ${mod.title}`);

          let order = 1;
          for (const topic of data.topics) {
            const prompt = `You are an expert programming teacher. Create a detailed lesson for ${data.language} at ${data.difficulty} level on topic: ${topic}. Include: clear explanation, real code example with comments, and a practice exercise. Format as JSON with fields: title, explanation, codeExample, exercise`;

            try {
              const response = await getOpenAI().chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 1500
              });

              const output = response.choices[0].message.content.trim();
              const jsonStr = output.replace(/^```json\s*/, '').replace(/\s*```$/, '');
              const parsed = JSON.parse(jsonStr);

              const lesson = new Lesson({
                moduleId: mod._id,
                title: parsed.title || topic,
                content: parsed.explanation || 'Content missing',
                codeExample: parsed.codeExample || '',
                exercise: parsed.exercise || null,
                language: data.language,
                order: order
              });
              await lesson.save();
              console.log(`  - Generated lesson: ${topic}`);
            } catch (err) {
              console.error(`Failed to generate lesson ${topic}:`, err.message);
            }
            order++;
            // Sleep 1 second to avoid hitting aggressive rate limits
            await new Promise(r => setTimeout(r, 1000));
          }
        }
        console.log('Background Seeding Completed!');
      } catch (err) {
        console.error('Background Seeding Failed:', err);
      }
    })();
  } catch (error) {
    console.error(error);
  }
});

export default router;


