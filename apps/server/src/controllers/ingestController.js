import path from 'path';
import Pdf from '../models/Pdf.js';
import EmbeddingChunk from '../models/EmbeddingChunk.js';
import { extractPdfText } from '../services/pdf.js';
import { chunkText } from '../services/chunk.js';
import { embedChunks } from '../services/embeddings.js';

export async function ingestPdf(req, res, next) {
  try {
    const { pdfId } = req.query;
    if (!pdfId) return res.status(400).json({ error: 'pdfId required' });
    const pdf = await Pdf.findById(pdfId);
    if (!pdf) return res.status(404).json({ error: 'PDF not found' });
    const filePath = path.join(process.cwd(), 'apps/server/uploads', pdf.filename);
    const { numPages, pages } = await extractPdfText(filePath);
    const chunks = chunkText(pages);
    await embedChunks(pdfId, chunks);
    await EmbeddingChunk.deleteMany({ pdfId });
    await EmbeddingChunk.insertMany(
      chunks.map((c, i) => ({ pdfId, page: c.page, text: c.text, vectorRef: `${pdfId}_${c.page}_${i}` }))
    );
    pdf.pages = numPages;
    pdf.embedded = true;
    await pdf.save();
    res.json({ ok: true, numPages, chunks: chunks.length });
  } catch (err) {
    next(err);
  }
}
