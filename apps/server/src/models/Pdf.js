import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filename: { type: String, required: true },
  pages: { type: Number, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  embedded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Pdf', pdfSchema);
