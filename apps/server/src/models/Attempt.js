import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  responses: { type: mongoose.Schema.Types.Mixed, required: true },
  scorePct: { type: Number, required: true },
  timeSpentSec: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Attempt', attemptSchema);
