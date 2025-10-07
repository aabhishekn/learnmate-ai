import { searchYouTube } from '../services/youtube.js';

export async function youtubeSearch(req, res, next) {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'q required' });
    const results = await searchYouTube(q);
    res.json(results);
  } catch (err) {
    next(err);
  }
}
