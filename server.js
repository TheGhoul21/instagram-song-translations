require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

// Initialize Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/translate', async (req, res) => {
  const { lyrics, artist } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompt = `Translate the following song lyrics to Italian. Follow these guidelines:
- IMPORTANT: Process sections in the EXACT ORDER they appear in the original lyrics
- For each verse/section, provide BOTH the original English text AND the Italian translation
- Format each section as: [ORIGINAL]original text here[/ORIGINAL][ITALIAN]translated text here[/ITALIAN]
- Maintain the original meaning and emotional tone in translation
- Keep the poetic flow and rhythm when possible
- Use natural, contemporary Italian
- Split into logical verses/stanzas using '|||' as separator between sections
- TRANSLATE THE ENTIRE SONG - do not skip any verses, choruses, or bridges
- Each section should be suitable for an Instagram post slide
- Preserve line breaks in both original and translated text
- No introductory phrases, just the formatted content
- START with the very first verse/line of the song and proceed chronologically

Song: ${artist || 'Unknown'}
Lyrics:
${lyrics}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translation = response.text();
    res.json({ translation });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Failed to translate lyrics' });
  }
});

app.post('/generate-metadata', async (req, res) => {
  const { lyrics, artist } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompt = `Create an engaging Instagram post caption for a song translation post. Include:
- Brief introduction about the song and artist
- Why this song resonates (emotional connection)
- Mention it's translated to Italian
- Include relevant hashtags in Italian and English
- Keep it authentic and engaging
- Use emojis appropriately
- Maximum 300 words

Song: ${artist}
Original lyrics theme: ${lyrics.substring(0, 200)}...

Write in a mix of Italian and English, appealing to music lovers and Italian language enthusiasts.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const metadata = response.text();
    res.json({ metadata });
  } catch (error) {
    console.error('Metadata generation error:', error);
    res.status(500).json({ error: 'Failed to generate metadata' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});