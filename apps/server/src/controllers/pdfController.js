import Pdf from '../models/Pdf.js';
import fs from 'fs';
import path from 'path';

export async function uploadPdf(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // For now, just save metadata; page count/embedding handled in ingestion
    const pdf = new Pdf({
      title: req.body.title || req.file.originalname,
      filename: req.file.filename,
      pages: 0, // to be updated after ingestion
      uploadedBy: req.session.userId || null,
      embedded: false,
    });
    await pdf.save();
    res.status(201).json({ id: pdf._id, title: pdf.title, filename: pdf.filename });
  } catch (err) {
    next(err);
  }
}
