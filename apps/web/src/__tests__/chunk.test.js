import { chunkText } from '../../../../../apps/server/src/services/chunk.js';

describe('chunkText', () => {
  it('chunks text with overlap', () => {
    const pages = [{ page: 1, text: 'a'.repeat(3000) }];
    const chunks = chunkText(pages, 1000, 200);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].text.length).toBe(1000);
    expect(chunks[1].text.length).toBe(1000);
    expect(chunks[1].text.slice(0, 200)).toBe(chunks[0].text.slice(800));
  });
});
