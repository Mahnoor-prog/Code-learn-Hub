import OpenAI from 'openai';
import Module from '../../models/Module.js';

let openaiClient;
const getOpenAI = () => {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

const safeParseJson = (text) => {
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

const buildFallbackRoadmap = (profile, modules) => {
  const preferredLevel =
    profile.experience === 'Advanced'
      ? 'Advanced'
      : profile.experience === 'Intermediate' || profile.experience === 'Know Basics'
        ? 'Intermediate'
        : 'Beginner';

  const filtered = modules.filter((m) => m.difficulty === preferredLevel);
  const pick = (filtered.length ? filtered : modules).slice(0, 4);

  const steps = pick.map((m, index) => ({
    title: `Step ${index + 1}: ${m.title}`,
    language: m.language,
    level: m.difficulty,
    moduleId: m._id,
    moduleTitle: m.title,
    estimatedDays: 7,
    dailyPlan: `Spend ${profile.studyHours} on ${m.title}: concept review, coding practice, and recap.`,
    priority: index + 1
  }));

  return {
    startLanguage: steps[0]?.language || 'Python',
    startLevel: steps[0]?.level || preferredLevel,
    estimatedCompletionTime: `${Math.max(steps.length * 7, 14)} days`,
    dailyStudyPlan: `Study ${profile.studyHours} daily. Start with core concepts and practice every session.`,
    aiSummary: `Roadmap tuned for your goal: ${profile.goal}.`,
    steps
  };
};

export const generatePersonalizedRoadmap = async (profile) => {
  const modules = await Module.find().sort({ createdAt: -1 });
  if (!modules.length) return buildFallbackRoadmap(profile, []);

  const modulesPayload = modules.map((m) => ({
    id: String(m._id),
    title: m.title,
    language: m.language,
    difficulty: m.difficulty
  }));

  const prompt = `You are an AI learning coach. Build a personalized roadmap from available modules.
User profile:
- Name: ${profile.name}
- Age group: ${profile.ageGroup}
- Coding experience: ${profile.experience}
- Goal: ${profile.goal}
- Daily study time: ${profile.studyHours}

Available modules:
${JSON.stringify(modulesPayload)}

Return ONLY JSON:
{
  "startLanguage":"string",
  "startLevel":"Beginner|Intermediate|Advanced",
  "estimatedCompletionTime":"string",
  "dailyStudyPlan":"string",
  "aiSummary":"string",
  "steps":[
    {
      "title":"string",
      "language":"string",
      "level":"Beginner|Intermediate|Advanced",
      "moduleId":"id from list",
      "moduleTitle":"string",
      "estimatedDays":7,
      "dailyPlan":"string",
      "priority":1
    }
  ]
}
Rules: include 4-6 steps ordered by priority; align with user goal and experience.`;

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1800,
      temperature: 0.7
    });

    const raw = completion.choices?.[0]?.message?.content;
    const parsed = safeParseJson(raw);
    if (!parsed || !Array.isArray(parsed.steps) || !parsed.steps.length) {
      return buildFallbackRoadmap(profile, modules);
    }

    const steps = parsed.steps.slice(0, 6).map((step, index) => ({
      title: step.title || `Step ${index + 1}`,
      language: step.language || modules[0].language,
      level: ['Beginner', 'Intermediate', 'Advanced'].includes(step.level) ? step.level : 'Beginner',
      moduleId: modules.find((m) => String(m._id) === String(step.moduleId))?._id || null,
      moduleTitle: step.moduleTitle || '',
      estimatedDays: Number(step.estimatedDays) > 0 ? Number(step.estimatedDays) : 7,
      dailyPlan: step.dailyPlan || `Spend ${profile.studyHours} daily for this step.`,
      priority: Number(step.priority) > 0 ? Number(step.priority) : index + 1
    }));

    return {
      startLanguage: parsed.startLanguage || steps[0]?.language || modules[0].language,
      startLevel: ['Beginner', 'Intermediate', 'Advanced'].includes(parsed.startLevel) ? parsed.startLevel : (steps[0]?.level || 'Beginner'),
      estimatedCompletionTime: parsed.estimatedCompletionTime || `${steps.reduce((sum, s) => sum + s.estimatedDays, 0)} days`,
      dailyStudyPlan: parsed.dailyStudyPlan || `Study ${profile.studyHours} daily with focus and consistency.`,
      aiSummary: parsed.aiSummary || `Personalized roadmap generated for ${profile.goal}.`,
      steps
    };
  } catch (error) {
    return buildFallbackRoadmap(profile, modules);
  }
};
