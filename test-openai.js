import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';

// Load env from server/.env
dotenv.config({ path: path.resolve('server/.env') });

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("No OPENAI_API_KEY found in server/.env");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

async function testKey() {
  try {
    console.log("Testing OpenAI API key...");
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say 'Hello World' if you can hear me." }],
      max_tokens: 10,
    });
    console.log("Success! API is working. Response:");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Failed to connect or authenticate with OpenAI API:");
    console.error(error.message);
  }
}

testKey();
