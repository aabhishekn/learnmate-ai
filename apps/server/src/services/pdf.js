import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

export async function extractPdfText(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  // Returns array of { page, text }
  const pages = data.text.split(/\f/).map((text, i) => ({ page: i + 1, text: text.trim() }));
  return { numPages: data.numpages, pages };
}
