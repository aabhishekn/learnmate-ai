import { ChatOpenAI } from '@langchain/openai';
import Pdf from '../models/Pdf.js';
import EmbeddingChunk from '../models/EmbeddingChunk.js';
import dotenv from 'dotenv';
dotenv.config();

const llm = new ChatOpenAI({
  openAIApiKey: process.env.GROQ_API_KEY,
  configuration: {
    baseURL: process.env.GROQ_API_BASE,
  },
  model: 'meta-llama/llama-4-maverick-17b-128e-instruct', // Groq supported model
});

export async function generateQuiz({
  pdfId,
  counts = { mcq: 3, saq: 2, laq: 1 },
}) {
  // Get all chunks for the PDF
  const chunks = await EmbeddingChunk.find({ pdfId });
  const context = chunks
    .map((c) => `Page ${c.page}: ${c.text}`)
    .join('\n---\n');
  const prompt = `Given the following coursebook content, generate ${counts.mcq} MCQs, ${counts.saq} SAQs, and ${counts.laq} LAQs. For each question, provide:\n- type (MCQ/SAQ/LAQ)\n- prompt\n- options (for MCQ)\n- answer\n- explanation\n- citations: page number and a 2-3 line quote\n\nContent:\n${context}\n\nReturn as JSON array.`;
  const raw = await llm.invoke(prompt);
  const text =
    typeof raw === 'object' && raw !== null && 'content' in raw
      ? raw.content
      : raw;
  // Try to parse JSON from LLM output
  let questions = [];
  try {
    questions = JSON.parse(text.match(/\[.*\]/s)[0]);
  } catch {
    throw new Error('Failed to parse quiz from LLM');
  }
  return questions;
}
