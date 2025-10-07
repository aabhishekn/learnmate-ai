import { ragSearch } from '../services/rag.js';

export async function chatAsk(req, res, next) {
  try {
    const { pdfId, message } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });
    const { answer, citations } = await ragSearch({ query: message, pdfIds: pdfId ? [pdfId] : [] });
    res.json({ answer, citations });
  } catch (err) {
    next(err);
  }
}
