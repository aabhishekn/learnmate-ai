import Quiz from '../models/Quiz.js';
import { generateQuiz } from '../services/quiz.js';

export async function createQuiz(req, res, next) {
  try {
    const { pdfId, counts } = req.body;
    if (!pdfId) return res.status(400).json({ error: 'pdfId required' });
    const questions = await generateQuiz({ pdfId, counts });
    const quiz = new Quiz({ pdfId, questions });
    await quiz.save();
    res.status(201).json({ id: quiz._id, questions });
  } catch (err) {
    next(err);
  }
}
