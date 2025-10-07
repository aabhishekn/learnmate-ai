import express from 'express';
import { upload } from '../middleware/upload.js';
import { uploadPdf } from '../controllers/pdfController.js';
import Pdf from '../models/Pdf.js';
import { ingestPdf } from '../controllers/ingestController.js';
import { ragQuery } from '../controllers/ragController.js';
import { createQuiz } from '../controllers/quizController.js';
import { submitAttempt } from '../controllers/attemptController.js';
import { getProgress } from '../controllers/progressController.js';
import { chatAsk } from '../controllers/chatController.js';
import { youtubeSearch } from '../controllers/youtubeController.js';

const router = express.Router();

// List all PDFs
router.get('/pdfs', async (req, res, next) => {
	try {
		const pdfs = await Pdf.find().sort({ createdAt: -1 });
		res.json(pdfs.map(pdf => ({
			id: pdf._id,
			title: pdf.title,
			filename: pdf.filename,
			embedded: pdf.embedded,
			createdAt: pdf.createdAt,
		})));
	} catch (err) {
		next(err);
	}
});

router.post('/upload', upload.single('pdf'), uploadPdf);

// Ingest PDF (extract, chunk, embed)
router.post('/ingest', ingestPdf);

// RAG search
router.post('/rag', ragQuery);

// Quiz generation
router.post('/quiz/create', createQuiz);

// Quiz attempt
router.post('/quiz/attempt', submitAttempt);

// Progress dashboard
router.get('/progress', getProgress);

// Chat dock RAG answer
router.post('/chat/ask', chatAsk);

// YouTube topic search
router.get('/youtube/search', youtubeSearch);

export default router;
