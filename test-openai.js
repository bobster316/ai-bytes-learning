
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    console.log('Testing OpenAI API key...');
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say "API key works!"' }],
      max_tokens: 10,
    });
    console.log('✅ SUCCESS:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

test();