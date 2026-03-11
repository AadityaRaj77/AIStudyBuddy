# NeuroMap – AI Knowledge Graph Builder for Personalized Learning

### Microsoft AI Unlocked

---

NeuroMap is an AI-powered learning assistant that converts messy study notes into an interactive knowledge graph.
Students upload lecture notes (PDF or text), and the system automatically extracts key concepts, maps relationships between them, and generates a structured visualization of the topic.

Instead of reading notes line-by-line, students can explore the concept network, identify weak areas through quizzes, and receive a personalized revision roadmap.

The goal of NeuroMap is to transform passive reading into visual, concept-driven learning.

## What the App Does

NeuroMap helps students understand complex material faster by:

1. Parsing study notes

- Accepts uploaded lecture notes (PDF/text).

- Extracts readable text from documents.

2. AI Concept Extraction

- Uses an LLM to detect important concepts.

- Identifies relationships between them.

3. Concept Graph Generation

- Constructs a knowledge graph from extracted concepts.

- Displays it visually using an interactive node graph.

4. Interactive Concept Exploration

- Clicking a concept reveals explanation and quiz questions.

5. Weak Concept Detection

- Incorrect quiz answers mark concepts as weak.

6. Personalized Revision Plan

- Generates a roadmap based on weak concepts.

7. Personalized Revision Roadmap

- recommend study order, which topics require review

8. Learning Progress Track

- The system tracks concept mastery and displays overall learning progress to the user.

## Why It Is Useful

Students often struggle with:

- Large volumes of lecture notes

- Identifying the most important concepts

- Understanding relationships between topics

- Knowing what to revise

NeuroMap solves this by converting notes into a visual knowledge map, allowing students to:

- Understand topic structure quickly

- Identify dependencies between concepts

- Focus revision on weak areas

- Learn interactively instead of passively reading notes

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- ReactFlow (concept graph visualization)
- Axios

### Backend

- Node.js
- Express.js
- Prisma ORM

### Database

- PostgreSQL

### AI / NLP

- Groq API (LLM)
- Prompt-based concept extraction
- Retrieval Augmented Generation (RAG)

### Document Parsing

- pdf2json (PDF text extraction)

### Performance Optimization

- Azure Blob Storage - file storage for uploaded notes
- Azure Redis Cache - caching AI-generated quiz and explaination responses

### Deployment

- Backend: Render
- Frontend: Vercel

## Project Structure

```
AIStudyBuddy
│
├── backend
│   ├── routes
│   │   ├── analyzeNote.js
│   │   ├── generateQuiz.js
│   │   ├── revisionRoadmap.js
│   │   └── studySession.js
│   │
│   ├── services
│   │   ├── conceptExtractor.js
│   │   ├── llmClient.js
│   │   ├── retrieval.js
│   │   ├── chunker.js
│   │   ├── blobStorage.js
│   │   └── cache.js
│   │
│   ├── db
│   │   └── prisma.js
│   │
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── ConceptGraph.tsx
│   │   │   ├── ConceptPanel.tsx
│   │   │   └── RevisionPlan.tsx
│   │   │
│   │   ├── pages
│   │   │   └── UploadPage.tsx
│   │   │
│   │   └── App.tsx
│   │
│   └── api
│       └── api.ts
│
└── README.md
```

## System Architecture

```
User
│
▼
React Frontend (Vercel)
│
▼
Express Backend API (Render)
│
├── Document Processing
│     └─ PDF Parsing (pdf2json)
│
├── AI Layer
│     ├─ Concept Extraction
│     └─ Explanation + Quiz Generation
│
├── Retrieval Layer
│     └─ Relevant Note Chunk Retrieval
│
├── Cache Layer
│     └─ Redis (Azure Cache for Redis)
│
├── Storage Layer
│     └─ Azure Blob Storage
│
▼
PostgreSQL Database
│
├── Notes
├── Concepts
├── Relationships
└── Quiz Results
│
▼
Knowledge Graph returned to frontend
│
▼
ReactFlow Visualization
```

## Local Setup Instructions

1. Clone Repository

```bash
   git clone https://github.com/<your-username>/AIStudyBuddy.git
   cd AIStudyBuddy
```

2. Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create .env

```bash
DATABASE_URL=your_postgres_connection
GROQ_API_KEY=your_groq_api_key

AZURE_STORAGE_CONNECTION_STRING=your_blob_connection
AZURE_STORAGE_CONTAINER=notes

REDIS_URL=your_redis_connection

PORT=5000
```

Run server:

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

3.  Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create .env

```bash
VITE_API_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

## API Endpoints

| Method   | Endpoint                     | Description                                                  |
| :------- | :--------------------------- | :----------------------------------------------------------- |
| **POST** | `/api/analyze`               | Uploads PDF/Text, returns nodes and edges.                   |
| **POST** | `/api/quiz`                  | Returns explanation and MCQs for a concept.                  |
| **POST** | `/api/quiz/result`           | Saves score and updates concept strength.                    |
| **GET**  | `/api/roadmap/:noteId`       | Returns a personalized revision plan based on weak concepts. |
| **GET**  | `/api/study-session/:noteId` | Returns the next concept the student should study.           |

## Limitations and Challenges

During development several technical challenges emerged:

1. PDF Parsing Issues

Many PDFs contain irregular encodings, which caused text extraction errors.
These were mitigated using safe decoding and text cleaning.

2. AI Rate Limits

Gemini free-tier API limits caused request failures during testing.
Fallback logic was implemented to prevent crashes when AI responses fail.

3. Noisy Note Content

Lecture PDFs often include formatting artifacts that degrade concept extraction accuracy.

4. Graph Layout

Automatically organizing concept graphs in a readable layout required custom positioning logic.

## Post-MVP Goals (Future Development)

Future improvements planned for NeuroMap include:

1. Better AI Knowledge Graph Extraction

Use structured extraction pipelines (RAG / embeddings) for higher concept accuracy.

2. Semantic Search

Allow students to search concepts directly inside notes using embeddings.

3. Multi-Document Knowledge Graphs

Merge multiple lectures into one connected knowledge map.

4. Smart Study Scheduling

Integrate spaced repetition to optimize revision timing.

5. Advanced Graph Visualization

Cluster related concepts and highlight core topics automatically.

6. Collaborative Learning

Allow students to share concept maps and annotations.

## Conclusion

NeuroMap demonstrates how AI can transform traditional notes into an interactive learning experience.
By combining document parsing, LLM-based concept extraction, and graph visualization, the system provides a powerful way for students to explore and revise complex subjects efficiently.

The current prototype validates the concept and lays the foundation for a scalable AI-driven learning platform.
