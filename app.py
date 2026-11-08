from flask import Flask, render_template, request, jsonify
import os
import requests
import openai

app = Flask(__name__)

# Environment Variables
SHOPIFY_API_KEY = os.getenv("SHOPIFY_API_KEY")
SHOPIFY_API_SECRET = os.getenv("SHOPIFY_API_SECRET")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SHOPIFY_STORE_DOMAIN = "syed-ai-labs.myshopify.com"

openai.api_key = OPENAI_API_KEY

@app.route('/')
def home():
    return render_template('index.html')

# 1. Shopify Store నుండి Products Fetch చేసే API
@app.route('/api/products', methods=['GET'])
def get_products():
    access_token = request.headers.get("X-Shopify-Access-Token") or os.getenv("SHOPIFY_ACCESS_TOKEN")
    
    if not access_token:
        return jsonify({"error": "Access Token దొరకలేదు"}), 401
    
    url = f"https://{SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/products.json"
    headers = {"X-Shopify-Access-Token": access_token}
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Products ఫెచ్ చేయడంలో విఫలమైంది", "details": response.text}), response.status_code

# 2. AI Chatbot API Endpoint
@app.route('/api/chat', methods=['POST'])
def ai_chat():
    data = request.json
    user_message = data.get("message", "")
    
    if not user_message:
        return jsonify({"error": "సందేశం ఖాళీగా ఉంది"}), 400
        
    try:
        # OpenAI GPT Model Call
        completion = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "మీరు Syed AI Labs స్టోర్ యొక్క హెల్ప్‌ఫుల్ AI షాపింగ్ అసిస్టెంట్. కస్టమర్ల ప్రశ్నలకు స్నేహపూర్వకంగా, సహాయకరంగా తెలుగు మరియు ఇంగ్లీష్ లో సమాధానం ఇవ్వండి."},
                {"role": "user", "content": user_message}
            ]
        )
        ai_response = completion.choices[0].message.content
        return jsonify({"response": ai_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
