import Attempt from '../models/Attempt.js';
import Quiz from '../models/Quiz.js';

export async function getProgress(req, res, next) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const attempts = await Attempt.find({ userId }).populate('quizId');
    // Accuracy by type
    const typeStats = { MCQ: [], SAQ: [], LAQ: [] };
    attempts.forEach(a => {
      a.quizId.questions.forEach((q, i) => {
        if (typeStats[q.type]) {
          typeStats[q.type].push(a.responses[i] === q.answer ? 1 : 0);
        }
      });
    });
    const accuracyByType = Object.entries(typeStats).map(([type, arr]) => ({
      type,
      accuracy: arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) : 0,
    }));
    // Attempts timeline
    const attemptsTimeline = attempts.map(a => ({
      date: a.createdAt.toISOString().slice(0, 10),
      score: a.scorePct,
    }));
    // Weak topics (stub: just random for now)
    const weakTopics = ['Kinematics', 'Thermodynamics'];
    res.json({ accuracyByType, attemptsTimeline, weakTopics });
  } catch (err) {
    next(err);
  }
}
