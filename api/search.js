// api/search.js — Vercel Serverless Function
// This runs on the server, so Client Secret is never exposed to the browser.

export default async function handler(req, res) {
  // Allow requests from your GitHub Pages site
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q, limit = 50 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query param: q' });
  }

  const CLIENT_ID     = process.env.ML_CLIENT_ID;
  const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).json({ error: 'Missing ML credentials in environment variables' });
  }

  try {
    // Step 1: Get access token using client credentials
    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type:    'client_credentials',
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      return res.status(502).json({ error: 'ML token error', detail: err });
    }

    const { access_token } = await tokenRes.json();

    // Step 2: Search products
    const searchUrl = `https://api.mercadolibre.com/sites/MLM/search?q=${encodeURIComponent(q)}&limit=${limit}&sort=relevance`;
    const searchRes = await fetch(searchUrl, {
      headers: { 'Authorization': `Bearer ${access_token}` },
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
