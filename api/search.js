// api/search.js — Vercel Serverless Function
// Scrapes ML Mexico offers page — no token needed

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q, limit = 50 } = req.query;

  try {
    // Use ML's search with a server-side request (no CORS issues from server)
    const url = q
      ? `https://api.mercadolibre.com/sites/MLM/search?q=${encodeURIComponent(q)}&limit=${limit}&sort=relevance`
      : `https://api.mercadolibre.com/sites/MLM/search?q=ofertas&limit=${limit}&sort=relevance`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-MX,es;q=0.9',
        'Origin': 'https://www.mercadolibre.com.mx',
        'Referer': 'https://www.mercadolibre.com.mx/',
      }
    });

    if (!response.ok) {
      // Fallback: try the offers endpoint
      const fallback = await fetch(`https://api.mercadolibre.com/sites/MLM/search?category=MLM1055&limit=${limit}&sort=price_asc`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.mercadolibre.com.mx/',
        }
      });

      if (!fallback.ok) {
        return res.status(502).json({ error: 'ML error', detail: await response.text() });
      }

      const fallbackData = await fallback.json();
      return res.status(200).json(fallbackData);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
