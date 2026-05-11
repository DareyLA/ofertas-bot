// api/search.js — Vercel Serverless Function

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q, limit = 50 } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query param: q' });

  const CLIENT_ID = process.env.ML_CLIENT_ID;

  try {
    // ML public search — works with just the App ID as identifier
    // No token needed for public product search
    const searchUrl = `https://api.mercadolibre.com/sites/MLM/search?q=${encodeURIComponent(q)}&limit=${limit}&sort=relevance&app_id=${CLIENT_ID}`;

    const searchRes = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      }
    });

    if (!searchRes.ok) {
      const err = await searchRes.text();
      return res.status(502).json({ error: 'ML search error', detail: err });
    }

    const data = await searchRes.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
