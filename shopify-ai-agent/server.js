const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// Shopify Auth Route to handle installation loop
app.get('/auth', (req, res) => {
  const shop = req.query.shop;
  if (shop) {
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=a5318c699c2e264d019b07e78f5588a&scope=read_products,write_products,read_orders,write_orders,read_customers&redirect_uri=https://sm-ai-shopping-assistant-1.onrender.com/auth/callback`;
    return res.redirect(authUrl);
  }
  return res.status(400).send('Missing shop parameter. Please install from Shopify Partner Dashboard.');
});

app.get('/auth/callback', (req, res) => {
  res.send('Shopify Auth Callback Successful! App is connected.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
