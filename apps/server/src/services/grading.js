import { OpenAIEmbeddings } from '@langchain/openai';
import { cosineSimilarity } from 'langchain/util/math';
import dotenv from 'dotenv';
dotenv.config();

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export async function gradeAttempt(quiz, responses) {
  let correct = 0;
  let total = quiz.questions.length;
  let details = [];
  for (let i = 0; i < quiz.questions.length; ++i) {
    const q = quiz.questions[i];
    const userAns = responses[i];
    let isCorrect = false;
    if (q.type === 'MCQ') {
      isCorrect = userAns === q.answer;
    } else {
      // SAQ/LAQ: cosine similarity on embeddings
      const [aVec, uVec] = await Promise.all([
        embeddings.embedQuery(q.answer),
        embeddings.embedQuery(userAns || ''),
      ]);
      isCorrect = cosineSimilarity(aVec, uVec) > 0.75;
    }
    if (isCorrect) correct++;
    details.push({ idx: i, isCorrect });
  }
  return { scorePct: Math.round((correct / total) * 100), details };
}
