// api/search.js — Vercel Serverless Function

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q, limit = 50 } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query param: q' });

  const CLIENT_ID     = process.env.ML_CLIENT_ID;
  const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;

  try {
    // Step 1: Get token with client_credentials
    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    });

    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) {
      return res.status(502).json({ error: 'Token error', detail: tokenText });
    }

    const { access_token } = JSON.parse(tokenText);

    // Step 2: Search products with token
    const searchRes = await fetch(
      `https://api.mercadolibre.com/sites/MLM/search?q=${encodeURIComponent(q)}&limit=${limit}&sort=relevance`,
      { headers: { 'Authorization': `Bearer ${access_token}` } }
    );

    const searchText = await searchRes.text();
    if (!searchRes.ok) {
      return res.status(502).json({ error: 'ML search error', detail: searchText });
    }

    return res.status(200).json(JSON.parse(searchText));

  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
