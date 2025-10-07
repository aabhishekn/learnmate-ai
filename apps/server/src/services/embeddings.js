import { ChromaClient } from 'chroma-client';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import dotenv from 'dotenv';
dotenv.config();

const chroma = new ChromaClient({ baseUrl: process.env.CHROMA_URL });
const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });

export async function embedChunks(pdfId, chunks) {
  // Create collection if not exists
  const collectionName = `pdf_${pdfId}`;
  let collection = await chroma.getOrCreateCollection({ name: collectionName });
  const texts = chunks.map(c => c.text);
  const vectors = await embeddings.embedDocuments(texts);
  const ids = await collection.add({
    ids: chunks.map((c, i) => `${pdfId}_${c.page}_${i}`),
    embeddings: vectors,
    metadatas: chunks.map(c => ({ page: c.page })),
    documents: texts,
  });
  return ids;
}
