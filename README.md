# 🎯 AI Virtual Interviewer

An intelligent, full-stack, hackathon-ready platform that conducts **real-time adaptive mock interviews**. Candidates select target job roles, experience levels, and interview styles. The AI adjusts question difficulty on the fly based on response quality and generates deep performance reports complete with granular scoring, skill-gap analysis, and actionable learning roadmaps.

---

## 🌟 Key Features

1. **GitHub Repository Code & Architecture Defense**:
   - **Live Repository Ingestion**: Paste any public GitHub repo URL (`https://github.com/owner/repo`).
   - **Deep Project Analysis**: Inspects repository file trees, README, dependencies (`package.json`, `requirements.txt`, `pom.xml`), and key architecture layers.
   - **Code Grilling**: The AI formulates questions specifically targeting your project decisions, file layouts, scaling bottlenecks, and design trade-offs.

2. **Interactive Audio & Voice-Command System**:
   - **AI Voice-Out (TTS)**: The AI speaks questions aloud with natural inflection, speed controls, and an animated audio waveform equalizer.
   - **Candidate Mic Speech-to-Text (STT)**: Speak answers naturally into your microphone with real-time transcription into the answer box.
   - **Hands-Free Voice Commands**: Speak commands aloud during the interview:
     - *"Submit answer"* $\to$ Automatically evaluates response and advances to next challenge.
     - *"Repeat question"* $\to$ AI speaks the current question aloud again.
     - *"Clear answer"* $\to$ Clears current transcription.

3. **Real-Time Adaptive Difficulty**:
   - **Performance-Driven Transitions**: High performance ($\ge 80$) moves difficulty up to probe edge cases; moderate answers ($50-79$) maintain level; struggling responses ($< 50$) step down to evaluate foundational concepts.
   - **Context-Aware Deduplication**: Tracks previous questions and answers to prevent duplicates.

4. **Multi-Metric Instant Evaluation**:
   - Granular scoring out of 100 for **Technical Accuracy**, **Problem Solving**, **Communication Clarity**, and **Relevance**.
   - Immediate feedback on exact strengths, weaknesses, and omitted concepts.

5. **In-Depth Performance Dashboard**:
   - Circular visual SVG score gauge and competency breakdown.
   - **Skill-Gap Matrix**: Pinpoints missed concepts with severity tags (`High`, `Medium`, `Low`).
   - **Actionable 4-Step Roadmap**: Personalized learning steps tailored to the interview.

6. **Multi-AI Provider & Zero-Failure Demo Mode**:
   - **Google Gemini API** (`gemini-1.5-flash`) for dynamic LLM generation and evaluation.
   - **Intelligent Mock / Offline Engine** with domain question banks and heuristic evaluation for 100% reliable offline presentations.

---

## 🏛️ Architecture & Tech Stack

```
+-------------------------------------------------------------------------+
|                               FRONTEND                                  |
|  React 18 + Vite + Lucide Icons + Dark Glassmorphism CSS Design System |
|  - Landing Page            - Interview Setup Room                       |
|  - Auth (Login/Register)   - Live Adaptive Room + Timer                 |
|  - Report Dashboard        - Session History                            |
+------------------------------------+------------------------------------+
                                     | REST API (JSON)
                                     v
+-------------------------------------------------------------------------+
|                               BACKEND                                   |
|  Node.js + Express.js REST API Layer (CORS, JWT Auth, Error Handler)   |
|  - /api/auth/*     - /api/roles     - /api/interviews/*                 |
+------------------------------------+------------------------------------+
                                     |
    +--------------------------------+--------------------------------+
    |                                                                 |
    v                                                                 v
+-----------------------+                         +-----------------------+
|    AI & ADAPTIVE      |                         |      DATA LAYER       |
|       ENGINE          |                         |  Prisma ORM + SQLite  |
| - Gemini Provider     |                         | - User                |
| - Mock/Fallback Engine|                         | - Interview           |
| - Difficulty Tuner    |                         | - Question            |
| - Skill Gap Analyzer  |                         | - Answer              |
|                       |                         | - InterviewReport     |
+-----------------------+                         +-----------------------+
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.x or v20.x+)
- npm

### 1. Installation
In the project root, run:
```bash
# Install backend dependencies
cd backend
npm install
npx prisma db push
node src/prisma/seed.js

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment (Optional)
A pre-configured `.env` is already created in `backend/.env`.
```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET=super_secret_jwt_key_hackathon_2025_interview
NODE_ENV=development

# (Optional) Add your Google Gemini API key:
GEMINI_API_KEY=
```
*Note: If `GEMINI_API_KEY` is omitted, the platform automatically utilizes its intelligent built-in mock engine with domain question banks.*

### 3. Run the Full Stack App
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Vite dev server running at http://localhost:5173
```

Navigate to `http://localhost:5173` in your browser.

---

## 🔑 Demo Account Credentials

You can register any new account or use the pre-seeded demo account:
- **Email**: `demo@interviewai.dev`
- **Password**: `demo1234`
*(Or click the "Fast Demo Login" button on the Login page).*

---

## 📡 REST API Contract Documentation

All endpoints return a standardized JSON envelope:

### Success Response Format:
```json
{
  "success": true,
  "data": {},
  "message": "Human readable status message"
}
```

### Error Response Format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | NOT_FOUND | SERVER_ERROR",
    "message": "Clear user-facing error message"
  }
}
```

### Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new candidate `{ name, email, password }` | No |
| `POST` | `/api/auth/login` | Login candidate `{ email, password }` -> returns `{ token, user }` | No |
| `GET` | `/api/auth/me` | Fetch active user profile | Yes (Bearer) |
| `GET` | `/api/roles` | Retrieve list of preset interview roles, skill tags, and presets | No |
| `POST` | `/api/interviews` | Create session `{ role, experienceLevel, interviewType, totalQuestions }` | Yes (Bearer) |
| `GET` | `/api/interviews` | Get user's session history | Yes (Bearer) |
| `GET` | `/api/interviews/:id` | Get interview overview and question list | Yes (Bearer) |
| `POST` | `/api/interviews/:id/start` | Start interview session & generate question 1 | Yes (Bearer) |
| `GET` | `/api/interviews/:id/current-question` | Retrieve active pending question | Yes (Bearer) |
| `POST` | `/api/interviews/:id/answers` | Submit answer `{ questionId, answerText }` -> evaluates & triggers next adaptive step | Yes (Bearer) |
| `GET` | `/api/interviews/:id/results` | Fetch complete performance report, skill-gap analysis, and score breakdown | Yes (Bearer) |

---

## 🧪 Testing Backend Logic

Run the automated test suite for the Adaptive Difficulty Engine and AI evaluation logic:
```bash
cd backend
npm test
```

Test coverage includes:
- Initial difficulty mapping (`Beginner` $\to$ `Easy`, `Intermediate` $\to$ `Medium`, `Advanced` $\to$ `Hard`).
- Difficulty step-ups for scores $\ge 80$.
- Difficulty maintenance for scores $50-79$.
- Difficulty step-downs for scores $< 50$.
- Upper and lower difficulty boundary constraints.
- Evaluation heuristics and skill-gap extraction.

---

## 📂 Project Structure

```text
AI Virtual Interviewer/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema definition
│   │   └── dev.db                 # SQLite database
│   ├── src/
│   │   ├── ai/
│   │   │   ├── aiManager.js       # Provider resolver singleton
│   │   │   ├── aiProvider.interface.js
│   │   │   ├── geminiProvider.js  # Gemini LLM provider
│   │   │   └── mockProvider.js    # Domain question bank & heuristic evaluation
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── interviewController.js
│   │   │   └── roleController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── prisma/
│   │   │   ├── client.js
│   │   │   └── seed.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── interviewRoutes.js
│   │   │   └── roleRoutes.js
│   │   ├── services/
│   │   │   ├── adaptiveEngine.js  # Difficulty tuning & question progression
│   │   │   ├── authService.js
│   │   │   ├── interviewService.js
│   │   │   └── reportService.js   # Score weighting, gaps & plan generation
│   │   ├── tests/
│   │   │   ├── adaptiveEngine.test.js
│   │   │   └── mockProvider.test.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js          # Unified REST API client
│   │   ├── components/
│   │   │   ├── DifficultyBadge.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── QuestionTimer.jsx
│   │   │   └── ScoreGauge.jsx     # SVG animated circular meter
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── HistoryPage.jsx
│   │   │   ├── InterviewSetupPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LiveInterviewPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ReportDashboardPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css              # Custom modern dark glassmorphism styling
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── README.md
└── package.json
```
