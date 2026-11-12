const { GoogleGenAI } = require('@google/genai');

// Google Gen AI క్లైంట్ ఇనిషియలైజ్ చేయడం (RENDER లో GEMINI_API_KEY సెట్ చేసి ఉండాలి)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

        // Gemini మోడల్ కాల్ చేయడం
    const response = await ai.models.generateContent({
      model: 'models/gemini-3.8-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return 'క్షమించండి, ప్రస్తుతం మా సర్వీస్‌లో సాంకేతిక సమస్య ఉంది. దయచేసి కొద్దిసేపు ఆగి ప్రయత్నించండి.';
  }
}

module.exports = { handleAIQuery };
