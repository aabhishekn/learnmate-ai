import chromaClient from '../../chromaClient.js';
import { OpenAIEmbeddings, OpenAI } from '@langchain/openai';
import dotenv from 'dotenv';
dotenv.config();

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});
const llm = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });

export async function ragSearch({ query, pdfIds, topK = 5 }) {
  // Search across one or more PDF collections
  let results = [];
  for (const pdfId of pdfIds) {
    const collectionName = `pdf_${pdfId}`;
    let collection = await chromaClient.createCollection(collectionName);
    const queryVec = await embeddings.embedQuery(query);
    // Query Chroma REST API
    const docs = await chromaClient.queryCollection(
      collection.id || collection.collection?.id,
      {
        queryEmbeddings: [queryVec],
        nResults: topK,
      }
    );
    if (docs && docs.documents && docs.documents[0]) {
      results = results.concat(
        docs.documents[0].map((text, i) => ({
          text,
          page: docs.metadatas?.[0]?.[i]?.page,
          vectorRef: docs.ids?.[0]?.[i],
        }))
      );
    }
  }
  // Compose context for LLM
  const context = results
    .map((r) => `Page ${r.page}: ${r.text}`)
    .join('\n---\n');
  const prompt = `Answer the question using only the context below. Cite page numbers and quote 2-3 lines for each fact.\n\nContext:\n${context}\n\nQuestion: ${query}\n\nAnswer (with citations):`;
  const answer = await llm.call(prompt);
  // Extract citations: {page, quote} from context
  const citations = results.map((r) => ({
    page: r.page,
    quote: r.text.split('. ').slice(0, 2).join('. '),
  }));
  return { answer, citations };
}
