# TalkTube RAG

A YouTube RAG (Retrieval-Augmented Generation) app: paste a YouTube URL, load the video, then ask questions, get a summary, or view the transcript. Powered by LangChain, Google embeddings, and TubeOnAI for transcription.

## Features

- **Load any YouTube video** – Paste a URL or pick a sample (TED Talk, Tech Review).
- **Generate Summary** – Get a concise summary of the video.
- **View Transcript** – See the cleaned transcript.
- **Chat** – Ask anything about the video; answers are based on semantic search over the transcript.

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Node.js, Express
- **Transcription:** TubeOnAI API
- **Embeddings & RAG:** LangChain, Google Generative AI (Gemini embeddings), in-memory vector store

## Project Structure

```
talktube-RAG/
├── client/                 # Next.js frontend
│   ├── app/
│   │   ├── api/            # API route proxy (store-transcript)
│   │   ├── components/     # ChatInput, ChatMessage, VideoPanel, icons
│   │   └── page.tsx
│   └── package.json
├── server/                 # Express backend
│   ├── routes/             # storeDocumentsRoutes
│   ├── services/           # storeDocumentService (transcript + embeddings + retrieval)
│   ├── index.js
│   └── package.json
└── README.md
```

## Setup

### 1. Install dependencies

```bash
# Backend
cd server && pnpm install

# Frontend
cd client && pnpm install
```

### 2. Environment variables

**Server** (`server/.env`):

```env
PORT=5001
TUBEONAI_API_KEY=your_tubeonai_api_key
GOOGLE_API_KEY=your_google_api_key
```

Get keys from:

- [TubeOnAI](https://app.tubeonai.com) – transcription
- [Google AI Studio](https://aistudio.google.com/apikey) – embeddings (Gemini)

### 3. Run the app

**Terminal 1 – backend**

```bash
cd server && pnpm run dev
```

Server runs at **http://localhost:5001**.

**Terminal 2 – frontend**

```bash
cd client && pnpm run dev
```

App runs at **http://localhost:3000**.

## Usage

1. Open http://localhost:3000.
2. Paste a YouTube URL in the sidebar and click **Load**, or click **TED Talk** / **Tech Review** to load a sample.
3. Use **Generate Summary** or **View Transcript**, or type a question in the chat and send.

## API

- **POST /store-transcript**  
  Body: `{ "url": "https://www.youtube.com/watch?v=...", "question": "optional question" }`  
  Fetches transcript via TubeOnAI, chunks and embeds it, runs similarity search if `question` is provided, and returns the answer or processed result.

The frontend uses the Next.js route **/api/store-transcript** as a proxy to the backend to avoid CORS.

## License

ISC
