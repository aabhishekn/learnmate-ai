import Attempt from '../models/Attempt.js';
import Quiz from '../models/Quiz.js';
import { gradeAttempt } from '../services/grading.js';

export async function submitAttempt(req, res, next) {
  try {
    const { quizId, responses, timeSpentSec } = req.body;
    if (!quizId || !responses) return res.status(400).json({ error: 'quizId and responses required' });
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    const { scorePct, details } = await gradeAttempt(quiz, responses);
    const attempt = new Attempt({
      userId: req.session.userId || null,
      quizId,
      responses,
      scorePct,
      timeSpentSec: timeSpentSec || 0,
    });
    await attempt.save();
    res.status(201).json({ id: attempt._id, scorePct, details });
  } catch (err) {
    next(err);
  }
}
