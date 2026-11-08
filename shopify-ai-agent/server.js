require('dotenv').config();
const path = require('path');
const { handleAIQuery } = require('./aiAgent');

const app = express();
app.use(express.json());

// హోమ్ రూట్ - చాట్ UI చూపించడానికి
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// షాపిఫై ఇన్‌స్టాలేషన్ లూప్ నివారించడానికి /auth రూట్
app.get('/auth', (req, res) => {
  const shop = req.query.shop;
  if (shop) {
    const clientId = process.env.SHOPIFY_API_KEY || 'a5318c699c2e264d019b07e78f5588a';
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=read_products,write_products,read_orders,write_orders,read_customers&redirect_uri=https://sm-ai-shopping-assistant-1.onrender.com/auth/callback`;
    return res.redirect(authUrl);
  }
  return res.status(400).send('Missing shop parameter. Please install from Shopify Partner Dashboard.');
});

// ఇన్‌స్టాలేషన్ పూర్తయ్యాక రీడైరెక్ట్ అయ్యే కాల్‌బ్యాక్ రూట్
app.get('/auth/callback', (req, res) => {
  res.send('Shopify Auth Callback Successful! App is successfully connected to your store.');
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
