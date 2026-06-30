# 🤖 ResumeAI — ATS Resume Matcher

An AI-powered full-stack web app that compares your resume against a job description and returns an ATS compatibility score, missing keywords, strengths, and actionable suggestions — powered by **Gemini 1.5 Flash**.

---

## 📁 Project Structure

```
resume-matcher/
├── backend/
│   ├── server.js          # Express API (PDF upload + Gemini)
│   ├── package.json
│   └── .env.example       # Copy → .env and add your key
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── UploadZone.jsx       # Drag-and-drop PDF uploader
    │   │   ├── ScoreRing.jsx        # Animated circular progress bar
    │   │   └── ResultsDashboard.jsx # Full analysis results UI
    │   ├── App.js                   # Main app shell + state
    │   └── index.css                # Tailwind + CSS variables
    ├── package.json
    └── tailwind.config.js
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js ≥ 18
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env → add your GEMINI_API_KEY
npm install
npm run dev          # starts on http://localhost:5000
```

**Backend NPM Dependencies:**
| Package | Purpose |
|---|---|
| `express` | HTTP server & routing |
| `cors` | Allow React dev server requests |
| `multer` | Multipart file upload handling |
| `pdf-parse` | Extract text from PDF buffer |
| `@google/generative-ai` | Official Gemini SDK |
| `dotenv` | Load `.env` variables |
| `nodemon` *(dev)* | Auto-restart on changes |

---

### 2. Frontend

```bash
cd frontend
npm install
npm start            # starts on http://localhost:3000
```

**Frontend NPM Dependencies:**
| Package | Purpose |
|---|---|
| `react`, `react-dom` | UI framework |
| `react-scripts` | CRA build tooling |
| `react-dropzone` | Drag-and-drop file zone |
| `axios` | HTTP requests to backend |
| `tailwindcss` | Utility-first CSS framework |

> The `"proxy": "http://localhost:5000"` field in `frontend/package.json` routes `/api/*` requests to the backend automatically during development.

---

## 🚀 How It Works

```
User uploads PDF  →  multer buffers it  →  pdf-parse extracts text
                                                     ↓
                          Gemini 1.5 Flash analyses resume vs JD
                                                     ↓
                     Returns structured JSON with score + insights
                                                     ↓
                     React renders score ring, keyword badges, tips
```

### AI Prompt Returns:
```json
{
  "match_percentage": 72,
  "missing_keywords": ["Kubernetes", "CI/CD", "GraphQL"],
  "strengths": ["Strong Python background", "Relevant domain experience"],
  "suggestions": ["Add a Skills section with exact JD keywords", "..."],
  "section_scores": { "skills": 65, "experience": 80, "education": 90, "formatting": 70 },
  "verdict": "Good Match"
}
```

---

## 🎨 Design System

- **Theme**: Fintech-grade dark mode with teal accent (`#14b8a6`)
- **Light mode**: Toggle via sun/moon button in header
- **Font**: DM Sans (display) + JetBrains Mono (scores)
- **Score colors**: 🟢 ≥75 teal · 🟡 50–74 amber · 🔴 <50 red

---

## 🔒 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Your Google Gemini API key |
| `PORT` | Optional | Backend port (default: 5000) |

---

## 📦 Production Build

```bash
# Frontend
cd frontend && npm run build   # outputs to frontend/build/

# Serve static build via Express (add to server.js):
# app.use(express.static(path.join(__dirname, '../frontend/build')));
```
