// chromaClient.js
// Simple ChromaDB REST API client using axios
// Update CHROMA_API_URL if needed (default: Docker Compose chroma service)

// ChromaDB JS client integration
import { ChromaClient } from 'chromadb';

const client = new ChromaClient({
  path: process.env.CHROMA_URL || 'http://localhost:8000',
});

const chromaClient = {
  async createCollection(name) {
    // Will create or get existing collection
    return await client.getOrCreateCollection({ name });
  },
  async addDocuments(collection, documents) {
    // collection: Chroma collection object
    // documents: [{id, embedding, metadata, document}]
    // Chroma expects: ids, embeddings, metadatas, documents arrays
    const ids = documents.map((d) => d.id);
    const embeddings = documents.map((d) => d.embedding);
    const metadatas = documents.map((d) => d.metadata);
    const docs = documents.map((d) => d.document);
    return await collection.add({
      ids,
      embeddings,
      metadatas,
      documents: docs,
    });
  },
  async queryCollection(collection, query) {
    // query: { queryEmbeddings: [[...]], nResults }
    return await collection.query({
      queryEmbeddings: query.queryEmbeddings,
      nResults: query.nResults,
    });
  },
};

export default chromaClient;
