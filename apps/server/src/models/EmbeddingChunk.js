import mongoose from 'mongoose';

const embeddingChunkSchema = new mongoose.Schema({
  pdfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pdf', required: true },
  page: { type: Number, required: true },
  text: { type: String, required: true },
  vectorRef: { type: String, required: true },
});

export default mongoose.model('EmbeddingChunk', embeddingChunkSchema);
