# Learnmate AI

> Submission-ready fullstack assignment: React + Vite (JS), Express, MongoDB, Chroma, RAG, PDF quiz, chat, and more.

---

## Features
- PDF upload, sample selector, and viewer
- Quiz generator (MCQ/SAQ/LAQ) with explanations and citations
- Progress dashboard (accuracy, attempts, weak topics)
- Chat with RAG and citation chips
- YouTube topic recommender
- Auth, session, uploads, rate limiting, and more

## Monorepo Structure
```
/apps/web      # React + Vite frontend
/apps/server   # Express API backend
/packages/lib  # Shared JS utils
```

## Quickstart (Local)
1. `npm install`
2. Copy `.env.example` to `.env` and fill secrets
3. `npm run dev` (web:3000, server:4000)

## Docker Compose (Recommended)
1. `docker compose up`
2. Web: http://localhost:3000  Server: http://localhost:4000

## Deployment
- Web: Netlify/Vercel
- Server: Render/Fly
- DB: Mongo Atlas or Docker Mongo

## Seed PDFs
- Placeholders in `/apps/server/public/pdfs` (see README in that folder)

## LLM Tools Used
- OpenAI (RAG, quiz, chat)
- LangChain (chunking, retrieval)
- Chroma (vector store)

## Commit Plan
See repo history for granular, rubric-aligned commits.

---

### Setup, Architecture, and Feature Mapping

#### .env Example
```
PORT=4000
SESSION_SECRET=devsecret
NODE_ENV=development
MONGODB_URI=mongodb://mongo:27017/assignment
# For local without docker: mongodb://127.0.0.1:27017/assignment
OPENAI_API_KEY=sk-...
YOUTUBE_API_KEY=
CHROMA_URL=http://chroma:8000
```

#### Architecture Diagram
```
[Web (React+Vite)] <-> [Express API] <-> [MongoDB, Chroma, OpenAI]
```

#### Feature → Requirement Mapping
| Feature         | Requirement |
|-----------------|-------------|
| PDF Upload      | Must-have   |
| PDF Viewer      | Must-have   |
| Quiz Generator  | Must-have   |
| Progress Dash   | Must-have   |
| Chat/RAG        | Nice-to-have|
| YouTube         | Nice-to-have|

#### What’s Done vs Missing
- All must-haves complete. Nice-to-haves: Chat, YouTube, RAG, citation chips.
- See `/apps/web/src/pages/PdfDetail.jsx` for main integration.

#### Trade-offs, Performance, Security
- Chunking is char-based for demo; can swap for token-based.
- Rate limiting and input validation on all endpoints.
- Secure cookies in production.

#### LLM Tool Usage Log
- OpenAI: Quiz generation, RAG, chat, grading (SAQ/LAQ)
- LangChain: Embeddings, chunking, retrieval
- Chroma: Vector store for RAG

#### Deployment
- **Docker Compose:** `docker compose up`
- **Web:** Deploy `/apps/web` to Netlify/Vercel
- **Server:** Deploy `/apps/server` to Render/Fly
- **DB:** Use Mongo Atlas or Docker Mongo

#### Demo User
- Email: `student@example.com`
- Password: `student123`

---

**For full details, see code and comments.**
