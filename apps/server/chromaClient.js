// chromaClient.js
// Simple ChromaDB REST API client using axios
// Update CHROMA_API_URL if needed (default: Docker Compose chroma service)

import axios from 'axios';

const CHROMA_API_URL = process.env.CHROMA_API_URL || 'http://localhost:8000';

const chromaClient = {
  async createCollection(name) {
    const res = await axios.post(`${CHROMA_API_URL}/api/v1/collections`, {
      name,
    });
    return res.data;
  },

  async addDocuments(collectionId, documents) {
    const res = await axios.post(
      `${CHROMA_API_URL}/api/v1/collections/${collectionId}/documents`,
      { documents }
    );
    return res.data;
  },

  async queryCollection(collectionId, query) {
    const res = await axios.post(
      `${CHROMA_API_URL}/api/v1/collections/${collectionId}/query`,
      query
    );
    return res.data;
  },
};

export default chromaClient;
