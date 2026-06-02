require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// 1. Enable secure CORS for cookies sharing
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Blockaded by CORS Policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 2. Request Parsers Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. API Core Endpoints

// Root Status check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'FinVerse Core OAuth Engine' });
});

app.post('/api/gemini/advice', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const { promptText, context = {} } = req.body || {};

  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY.' });
  }

  if (!promptText || typeof promptText !== 'string') {
    return res.status(400).json({ error: 'promptText is required.' });
  }

  const geminiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  try {
    const response = await fetch(`${geminiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${promptText}\n\nContext of user app:\nBudget: ${context.budget} USD\nDuration: ${context.days} days\nDestination: ${context.destination}\nTarget Currency: ${context.currency}. Give professional, detailed, structural response using clean markdown formatting.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data?.error?.message || 'Gemini API Error' });
    }

    const advice = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!advice) {
      return res.status(502).json({ error: 'Empty response from Gemini.' });
    }

    return res.status(200).json({ advice });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Failed to fetch Gemini response.',
    });
  }
});

// 5. Spin up server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Node backend active on port ${PORT} [NODE_ENV=${process.env.NODE_ENV || 'development'}]`);
});
