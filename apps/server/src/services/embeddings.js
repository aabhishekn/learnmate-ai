import chromaClient from '../../chromaClient.js';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import dotenv from 'dotenv';
dotenv.config();

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HF_API_KEY, // Optional: Hugging Face Inference API key
  model: 'sentence-transformers/all-MiniLM-L6-v2',
});

export async function embedChunks(pdfId, chunks) {
  // Create collection if not exists
  const collectionName = `pdf_${pdfId}`;
  let collection = await chromaClient.createCollection(collectionName);
  const texts = chunks.map((c) => c.text);
  const vectors = await embeddings.embedDocuments(texts);
  // Prepare documents for Chroma REST API
  const docs = texts.map((text, i) => ({
    id: `${pdfId}_${chunks[i].page}_${i}`,
    embedding: vectors[i],
    metadata: { page: chunks[i].page },
    document: text,
  }));
  await chromaClient.addDocuments(collection, docs);
  return docs.map((d) => d.id);
}
