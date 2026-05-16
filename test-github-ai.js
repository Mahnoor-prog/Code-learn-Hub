import OpenAI from 'openai';

const token = "YOUR_GITHUB_TOKEN_HERE";
const endpoint = "https://models.inference.ai.azure.com"; // User provided https://models.github.ai/inference, but standard github models use azure endpoint. Let's try what user provided first.
const endpointUser = "https://models.github.ai/inference";
const modelName = "gpt-4o";

async function testKey(baseURL) {
  try {
    console.log(`Testing GitHub AI token with endpoint: ${baseURL}`);
    const openai = new OpenAI({ 
        baseURL: baseURL,
        apiKey: token 
    });
    
    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [{ role: "user", content: "Say 'Hello GitHub Models' if you can hear me." }],
      max_tokens: 15,
    });
    console.log("Success! Response:");
    console.log(response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error(`Failed with endpoint ${baseURL}:`);
    console.error(error.message);
    return false;
  }
}

async function run() {
    let success = await testKey(endpointUser);
    if (!success) {
        console.log("Trying alternative Azure endpoint...");
        await testKey(endpoint);
    }
}

run();
