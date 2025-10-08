import chromaClient from '../../chromaClient.js';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { ChatOpenAI } from '@langchain/openai';
import dotenv from 'dotenv';
dotenv.config();

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HF_API_KEY, // Optional: Hugging Face Inference API key
  model: 'sentence-transformers/all-MiniLM-L6-v2',
});
const llm = new ChatOpenAI({
  openAIApiKey: process.env.GROQ_API_KEY,
  configuration: {
    baseURL: process.env.GROQ_API_BASE,
  },
  model: 'meta-llama/llama-4-maverick-17b-128e-instruct', // Groq supported model
});

export async function ragSearch({ query, pdfIds, topK = 5 }) {
  // Search across one or more PDF collections
  let results = [];
  for (const pdfId of pdfIds) {
    const collectionName = `pdf_${pdfId}`;
    let collection = await chromaClient.createCollection(collectionName);
    const queryVec = await embeddings.embedQuery(query);
    // Query Chroma REST API
    const docs = await chromaClient.queryCollection(collection, {
      queryEmbeddings: [queryVec],
      nResults: topK,
    });
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
  const answerRaw = await llm.invoke(prompt);
  const answer =
    typeof answerRaw === 'object' &&
    answerRaw !== null &&
    'content' in answerRaw
      ? answerRaw.content
      : answerRaw;
  // Extract citations: {page, quote} from context
  const citations = results.map((r) => ({
    page: r.page,
    quote: r.text.split('. ').slice(0, 2).join('. '),
  }));
  return { answer, citations };
}
