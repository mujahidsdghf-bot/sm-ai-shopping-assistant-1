require('dotenv').config();
const express = require('express');
const path = require('path');
const { handleAIQuery } = require('./aiAgent');

const app = express();
app.use(express.json());

// హోమ్ రూట్ మరియు చాట్ రూట్ రెండింటిలోనూ ఒకేసారి UI లేదా మెసేజ్ వచ్చేలా
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>SM AI Shopping Assistant</title></head>
      <body style="font-family: Arial; padding: 20px; background: #f4f4f9;">
        <h2>SM AI Shopping Assistant is Live! 🚀</h2>
        <p>Backend & AI Agent are successfully connected.</p>
      </body>
    </html>
  `);
});

app.get('/chat', (req, res) => {
  // ఒకవేళ templates/index.html సరిగ్గా రీచ్ కాకపోతే ఇక్కడ నేరుగా టెస్ట్ చేయవచ్చు
  try {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
  } catch (err) {
    res.send('Index file path error: ' + err.message);
  }
});

// షాపిఫై ఇన్‌స్టాలేషన్ రూట్స్
app.get('/auth', (req, res) => {
  const shop = req.query.shop;
  if (shop) {
    const clientId = process.env.SHOPIFY_API_KEY || 'a5318c699c2e264d019b07e78f5588a';
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=read_products,write_products,read_orders,write_orders,read_customers&redirect_uri=https://sm-ai-shopping-assistant-1.onrender.com/auth/callback`;
    return res.redirect(authUrl);
  }
  return res.status(400).send('Missing shop parameter.');
});

app.get('/auth/callback', (req, res) => {
  res.send('Shopify Auth Callback Successful!');
});

app.post('/api/chat', async (req, res) => {
  try {
    const { userMessage, storeProducts } = req.body;
    const aiResponse = await handleAIQuery(userMessage, storeProducts);
    res.json({ success: true, reply: aiResponse });
  } catch (error) {
    console.error('Error handling AI query:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
