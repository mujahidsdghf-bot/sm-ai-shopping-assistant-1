const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function handleAIQuery(userMessage, storeProducts) {
  try {
    const prompt = `
    You are an intelligent e-commerce shopping assistant for a Shopify store.
    Here is the list of available products in the store:
    ${JSON.stringify(storeProducts)}

    Customer Question: "${userMessage}"

    Instructions:
    - Help the customer find the right product based on their query.
    - Be polite, helpful, and concise.
    - Recommend specific products from the list if they match.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Error:', error);
    return 'క్షమించండి, ప్రస్తుతం మా సర్వీస్‌లో సాంకేతిక సమస్య ఉంది. దయచేసి కొద్దిసేపు ఆగి ప్రయత్నించండి.';
  }
}

module.exports = { handleAIQuery };
