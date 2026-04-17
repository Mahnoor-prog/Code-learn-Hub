import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

let _openai;
const getOpenAI = () => {
    if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "missing-api-key" });
    return _openai;
};

export const generateLessonContent = async (topic, language, level) => {
    const prompt = `Create a comprehensive programming lesson about "${topic}" in ${language} for a ${level} level student.
    
    The lesson should include:
    1. A clear, easy-to-understand introduction to the concept.
    2. Real-world analogies if applicable.
    3. Practical code examples with comments.
    4. Common pitfalls or best practices.
    
    Format the output in clean, readable Markdown. Do not include introductory text like "Here is the lesson", just the Markdown content.`;

    const response = await getOpenAI().chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    return response.choices[0].message.content;
};

export const generateQuizAndExercises = async (topic, language, level) => {
    const prompt = `You are a strict programming instructor. Generate an assessment for "${topic}" in ${language} at a ${level} difficulty level.
    
    You must return a raw JSON object strictly adhering to this schema:
    {
      "questions": [
        {
          "questionText": "Question string",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Exact string matching one of the options",
          "explanation": "Why this is correct and others are wrong"
        }
      ],
      "exercises": [
        {
          "title": "Exercise Name",
          "description": "What to build",
          "starterCode": "Initial code if any, or empty string",
          "hints": ["Hint 1", "Hint 2"]
        }
      ]
    }
    
    Requirements:
    - Generate exactly 5 multiple-choice questions.
    - Generate exactly 2 hands-on coding exercises.
    - Validate that the JSON is properly escaped and formatted without any markdown wrappers (like \`\`\`json). Just return the raw JSON string.`;

    const response = await getOpenAI().chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    try {
        // Attempt to parse to ensure it's valid JSON
        const rawContent = response.choices[0].message.content.trim();
        // Remove markdown block if it accidentally included it
        const cleanedContent = rawContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        return JSON.parse(cleanedContent);
    } catch (error) {
        console.error("OpenAI returned invalid JSON:", error);
        throw new Error("Failed to parse AI response into JSON format.");
    }
};

export const explainError = async (code, language, errorMessage) => {
    const prompt = `You are an expert programming tutor helping a student debug their ${language} code.
    
    Student's Code:
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Error Message Encountered:
    ${errorMessage}
    
    Analyze the code and error. Return a raw JSON object strictly adhering to this schema:
    {
        "explanation": "A plain, simple English explanation of why the error occurred, using gentle and encouraging language.",
        "exactLine": "The line of code where the error is likely occurring or originating from, or null if it cannot be determined",
        "correctedCode": "The full corrected code"
    }
    
    Do not include markdown wrappers around the JSON.`;

    const response = await getOpenAI().chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    try {
        const rawContent = response.choices[0].message.content.trim();
        const cleanedContent = rawContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        return JSON.parse(cleanedContent);
    } catch (error) {
        console.error("OpenAI returned invalid JSON:", error);
        throw new Error("Failed to parse AI debug response into JSON format.");
    }
};

export const generateNextLessonRecommendation = async (progressData) => {
    const prompt = `You are a personalized coding tutor. Based on the student's progress, recommend the single best next lesson or topic they should learn.
    
    Student Progress Data:
    ${JSON.stringify(progressData, null, 2)}
    
    If they have no progress yet, recommend a basic starting point like "Introduction to Programming" or similar.
    Provide your response in raw JSON format matching this schema:
    {
       "recommendedTopic": "The specific name of the concept/topic",
       "reason": "A 1-2 sentence encouraging reason why they should learn this next based on their past history"
    }
    
    No markdown formatting around the JSON.`;

    const response = await getOpenAI().chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    try {
        const rawContent = response.choices[0].message.content.trim();
        const cleanedContent = rawContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        return JSON.parse(cleanedContent);
    } catch (error) {
        console.error("OpenAI returned invalid JSON:", error);
        return { recommendedTopic: "Continue Learning", reason: "Keep up the momentum in your current module!" };
    }
};

export const generateProgressCoachMessage = async (stats) => {
    const prompt = `You are an encouraging coding coach. Write a short, personalized, highly motivating 2-3 sentence message reflecting on the student's current stats.
    
    Student Stats:
    ${JSON.stringify(stats, null, 2)}
    
    Mention their streak or earned badges if applicable. Keep it brief, fun, and use an emoji!`;

    const response = await getOpenAI().chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
    });

    return response.choices[0].message.content.trim();
};
