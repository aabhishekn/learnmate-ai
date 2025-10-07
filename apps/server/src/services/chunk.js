// Token-aware chunking with overlap (simple JS, not real tokens)
export function chunkText(pages, chunkSize = 1500, overlap = 200) {
  const chunks = [];
  for (const { page, text } of pages) {
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunk = text.slice(start, end);
      chunks.push({ page, text: chunk });
      start += chunkSize - overlap;
    }
  }
  return chunks;
}
