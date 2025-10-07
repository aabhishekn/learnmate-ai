import mongoose from 'mongoose';

const citationSchema = new mongoose.Schema({
  page: Number,
  quote: String,
}, { _id: false });

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['MCQ', 'SAQ', 'LAQ'], required: true },
  prompt: { type: String, required: true },
  options: [String],
  answer: mongoose.Schema.Types.Mixed,
  explanation: String,
  cites: [citationSchema],
}, { _id: false });

const quizSchema = new mongoose.Schema({
  pdfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pdf', required: true },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Quiz', quizSchema);
