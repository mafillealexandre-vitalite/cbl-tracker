module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = (process.env.CBL || '').trim();
  if (!apiKey) return res.status(500).json({ error: 'Variable Anthropic manquante dans Vercel' });

  const { image, mediaType } = req.body;
  if (!image) return res.status(400).json({ error: 'image manquante' });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image } },
          { type: 'text', text: 'Tu es un assistant calisthenics. Extrais la liste des exercices et leurs répétitions dans cette image de circuit CBL.\nRéponds UNIQUEMENT en JSON valide, sans markdown : {"exercises":[{"name":"Pull-ups","reps":25},...] }\nMaximum 12 exercices. Si rien de visible : {"exercises":[]}.' }
        ]
      }]
    })
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
