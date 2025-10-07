import mongoose from 'mongoose';

const citationSchema = new mongoose.Schema({
  page: Number,
  quote: String,
}, { _id: false });

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  cites: [citationSchema],
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pdfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pdf' },
  title: { type: String },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Chat', chatSchema);
