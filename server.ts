import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI on the server side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Recommendation Route
app.post('/api/ai/recommend', async (req: Request, res: Response) => {
  const { mood, genres, runtimePref, customPrompt, candidateMovies } = req.body;

  if (!ai) {
    // Graceful fallback when Gemini API key is not configured
    return res.json({
      success: true,
      source: 'local',
      recommendations: candidateMovies.slice(0, 3).map((movie: any, idx: number) => ({
        movieId: movie.id,
        score: 95 - idx * 3,
        reason: `Matches your interest in ${movie.genres.join(', ')} with an immersive narrative arc and stellar performance.`,
        directorNote: `Directed by ${movie.director} with signature visual precision.`,
      })),
    });
  }

  try {
    const candidateSummary = (candidateMovies || []).map((m: any) => ({
      id: m.id,
      title: m.title,
      year: m.year,
      rating: m.rating,
      genres: m.genres,
      director: m.director,
      moods: m.moods,
      synopsis: m.synopsis,
    }));

    const promptText = `
You are CineScope's master cinephile and film recommendation engine.
The user has specified the following movie taste preferences:
- Desired Mood: "${mood || 'Any'}"
- Preferred Genres: ${(genres || []).join(', ') || 'Any'}
- Runtime Preference: "${runtimePref || 'Any'}"
- User's Specific Custom Prompt / Request: "${customPrompt || 'Suggest the best match'}"

Here is the database of candidate films:
${JSON.stringify(candidateSummary, null, 2)}

Select the Top 3 best matching films strictly from the candidate films provided.
For each selected film, provide:
1. "movieId": exactly matching the "id" from the candidates list.
2. "score": a number between 85 and 99 representing percentage match.
3. "reason": a compelling, poetic 1-2 sentence cinephile explanation of why this film fits their mood and request.
4. "vibeHighlight": a short 3-5 word phrase describing the film's atmosphere (e.g. "Anamorphic neon-drenched melancholy", "Kinetic adrenaline-fueled spectacle").
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are an elite cinema curator. Recommend films from the provided candidate list with deep artistic insight. Return only valid JSON conforming to the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  movieId: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  reason: { type: Type.STRING },
                  vibeHighlight: { type: Type.STRING },
                },
                required: ['movieId', 'score', 'reason', 'vibeHighlight'],
              },
            },
            curatorSummary: { type: Type.STRING },
          },
          required: ['recommendations', 'curatorSummary'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      source: 'gemini',
      recommendations: parsed.recommendations || [],
      curatorSummary: parsed.curatorSummary || 'Curated tailored matches based on your mood profile.',
    });
  } catch (error: any) {
    console.error('Gemini Recommendation Error:', error);
    // Graceful fallback if API fails
    return res.json({
      success: true,
      source: 'local-fallback',
      recommendations: (candidateMovies || []).slice(0, 3).map((movie: any, idx: number) => ({
        movieId: movie.id,
        score: 94 - idx * 4,
        reason: `Rich ${movie.genres.join('/')} narrative matching your mood and pacing preferences.`,
        vibeHighlight: movie.tagline || 'Essential cinematic experience',
      })),
      curatorSummary: 'Curated based on your selected genre and mood parameters.',
    });
  }
});

// AI Cinephile Insight Route
app.post('/api/ai/insight', async (req: Request, res: Response) => {
  const { title, director, year, synopsis, questionType } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      insight: `${title} (${year}), directed by ${director}, is celebrated for its striking visual language and resonant emotional core. It stands as a defining work in contemporary cinema.`,
    });
  }

  try {
    const prompt = `Give a concise, 2-3 sentence expert cinephile insight for "${title}" (${year}) directed by ${director}.
Synopsis: ${synopsis}
Insight Focus: ${questionType || 'Why this film is a must-watch and what makes its cinematography or direction unique.'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an award-winning film critic and scholar. Be eloquent, concise, and passionate.',
      },
    });

    return res.json({
      success: true,
      insight: response.text || 'An exceptional cinematic achievement that rewards undivided attention.',
    });
  } catch (err: any) {
    console.error('Gemini Insight Error:', err);
    return res.json({
      success: true,
      insight: `${title} (${year}) directed by ${director} showcases extraordinary storytelling and masterclass craft.`,
    });
  }
});

// Mount Vite in Dev or serve static in Prod
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CineScope server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
