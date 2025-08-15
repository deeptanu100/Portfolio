const fetch = require('node-fetch');

exports.handler = async function (event) {
  // Get the data sent from your website
  const { originalText, tone, langName } = JSON.parse(event.body);
  
  // Securely get the secret API key from Netlify's settings
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `Rewrite the following text for a portfolio "About Me" section in a ${tone.toLowerCase()} tone. The response MUST be in ${langName}. Make it engaging and professional, keeping it to 2-4 sentences. Original text: "${originalText}"`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      }),
    });

    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText };
    }

    const result = await response.json();
    const newText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    return {
      statusCode: 200,
      body: JSON.stringify({ newText }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};