import fs from 'fs';
import path from 'path';

const filesToFix = [
  'server/services/openai.js',
  'server/routes/chatbot.js',
  'server/utils/personalization/roadmapGenerator.js',
  'server/routes/weeklyReports.js',
  'server/routes/performance.js',
  'server/routes/modules.js',
  'server/routes/aicontent.js'
];

filesToFix.forEach(relPath => {
  const fullPath = path.resolve('e:/Code-hub', relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace baseURL
    content = content.replace(/baseURL:\s*["']https:\/\/api\.x\.ai\/v1["']/g, 'baseURL: process.env.GROK_API_KEY ? "https://api.x.ai/v1" : undefined');
    
    // Replace model
    content = content.replace(/model:\s*["']grok-beta["']/g, 'model: process.env.GROK_API_KEY ? "grok-beta" : "gpt-4o-mini"');
    
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${relPath}`);
  } else {
    console.log(`File not found: ${relPath}`);
  }
});
