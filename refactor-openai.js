import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
    'server/services/openai.js',
    'server/routes/chatbot.js',
    'server/routes/aicontent.js',
    'server/routes/modules.js',
    'server/routes/weeklyReports.js',
    'server/routes/performance.js',
    'server/utils/personalization/roadmapGenerator.js'
];

files.forEach(file => {
    const filePath = path.resolve(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace OpenAI initialization
        content = content.replace(
            /apiKey:\s*process\.env\.GROK_API_KEY\s*\|\|\s*process\.env\.OPENAI_API_KEY(\s*\|\|\s*"missing-api-key")?,/g,
            'apiKey: process.env.GITHUB_AI_TOKEN || process.env.GROK_API_KEY || process.env.OPENAI_API_KEY$1,'
        );

        content = content.replace(
            /baseURL:\s*process\.env\.GROK_API_KEY\s*\?\s*"https:\/\/api\.x\.ai\/v1"\s*:\s*undefined/g,
            'baseURL: process.env.GITHUB_AI_ENDPOINT || (process.env.GROK_API_KEY ? "https://api.x.ai/v1" : undefined)'
        );

        // Replace model string
        content = content.replace(
            /model:\s*process\.env\.GROK_API_KEY\s*\?\s*"grok-beta"\s*:\s*"gpt-4o-mini"/g,
            'model: process.env.GITHUB_AI_MODEL || (process.env.GROK_API_KEY ? "grok-beta" : "gpt-4o-mini")'
        );

        // specific edge case for chatbot.js line 133 and other files with single-line OpenAI instantiation
        content = content.replace(
            /new\s+OpenAI\(\{\s*apiKey:\s*process\.env\.GROK_API_KEY\s*\|\|\s*process\.env\.OPENAI_API_KEY,\s*baseURL:\s*process\.env\.GROK_API_KEY\s*\?\s*"https:\/\/api\.x\.ai\/v1"\s*:\s*undefined\s*\}\)/g,
            'new OpenAI({ apiKey: process.env.GITHUB_AI_TOKEN || process.env.GROK_API_KEY || process.env.OPENAI_API_KEY, baseURL: process.env.GITHUB_AI_ENDPOINT || (process.env.GROK_API_KEY ? "https://api.x.ai/v1" : undefined) })'
        );

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
});
