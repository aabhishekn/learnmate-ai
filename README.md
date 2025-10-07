# Learnmate AI

> Submission-ready fullstack assignment: React + Vite (JS), Express, MongoDB, Chroma, RAG, PDF quiz, chat, and more. See below for setup, features, and deployment.

## Features (see rubric)
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

**Continue reading for full setup, architecture, and feature mapping.**
