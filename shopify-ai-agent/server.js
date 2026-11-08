require('dotenv').config();
const express = require('express');
const { handleAIQuery } = require('./aiAgent');

const app = express();
app.use(express.json());

// హోమ్ రూట్ టెస్టింగ్ కోసం
app.get('/', (req, res) => {
  res.send('SM AI Shopping Assistant Backend is Running Live!');
});

// షాపిఫై స్టోర్ నుండి వచ్చే చాట్ / ప్రొడక్ట్ ప్రశ్నలను హ్యాండిల్ చేయడానికి ఎండ్ పాయింట్
app.post('/api/chat', async (req, res) => {
  try {
    const { userMessage, storeProducts } = req.body;
    
    // AI ఏజెంట్ నుండి రెస్పాన్స్ పొందడం
    const aiResponse = await handleAIQuery(userMessage, storeProducts);
    
    res.json({ success: true, reply: aiResponse });
  } catch (error) {
    console.error('Error handling AI query:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
