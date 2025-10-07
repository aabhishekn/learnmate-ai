import { ragSearch } from '../services/rag.js';
import Pdf from '../models/Pdf.js';

export async function ragQuery(req, res, next) {
  try {
    const { query, pdfIds } = req.body;
    if (!query) return res.status(400).json({ error: 'query required' });
    let ids = pdfIds;
    if (!ids || !ids.length) {
      const all = await Pdf.find({ embedded: true });
      ids = all.map(p => p._id);
    }
    const { answer, citations } = await ragSearch({ query, pdfIds: ids });
    res.json({ answer, citations });
  } catch (err) {
    next(err);
  }
}
