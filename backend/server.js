require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }));
app.use(express.json());

// ─── Multer (memory storage — no disk writes) ─────────────────────────────────
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"), false);
  },
});

// ─── Gemini Client ────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// ─── System Prompt ────────────────────────────────────────────────────────────
const buildPrompt = (resumeText, jobDescription) => `
You are an expert ATS (Applicant Tracking System) analyst and career coach.

Carefully analyze the following RESUME against the JOB DESCRIPTION.

---RESUME---
${resumeText}

---JOB DESCRIPTION---
${jobDescription}

Your task is to return ONLY a valid JSON object (no markdown fences, no explanation) with this exact structure:

{
  "match_percentage": <integer 0–100 representing overall ATS compatibility>,
  "missing_keywords": [<array of specific skills, tools, or qualifications present in the JD but absent in the resume>],
  "strengths": [<array of strings: what the resume does well relative to this role>],
  "suggestions": [<array of actionable, specific improvement tips tailored to this JD>],
  "section_scores": {
    "skills": <integer 0–100>,
    "experience": <integer 0–100>,
    "education": <integer 0–100>,
    "formatting": <integer 0–100>
  },
  "verdict": "<one of: Strong Match | Good Match | Partial Match | Weak Match>"
}

Rules:
- Be honest and precise. Do not inflate scores.
- missing_keywords should contain 3–12 items (terms verbatim from the JD the resume lacks).
- strengths should contain 3–6 items.
- suggestions should contain 4–8 actionable items.
- Return ONLY the JSON. No prose before or after.
`;

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok" }));

app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  try {
    // 1. Validate inputs
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded." });
    }

    let { jobDescription } = req.body;

    if (jobDescription.length > 2000) {
      jobDescription = jobDescription.slice(0, 2000);
    }
    if (!jobDescription || jobDescription.trim().length < 50) {
      return res
        .status(400)
        .json({ error: "Job description must be at least 50 characters." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    // 2. Parse PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text?.trim();


    // 🔥 LIMIT resume length (IMPORTANT)
    if (resumeText.length > 3000) {
      resumeText = resumeText.slice(0, 3000);
    }

    if (!resumeText || resumeText.length < 100) {
      return res
        .status(422)
        .json({ error: "Could not extract readable text from the PDF. Ensure it is not scanned/image-based." });
    }

    // 3. Call Gemini
    const prompt = buildPrompt(
      resumeText,
      jobDescription.trim()
    ).slice(0, 6000); // hard cap
    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    // 4. Parse JSON (strip markdown fences if model adds them anyway)
    const clean = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const analysis = JSON.parse(clean);

    // 5. Return
    return res.json({ success: true, analysis });
  } catch (err) {
    console.error("Analysis error:", err);

    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: "AI returned an unparseable response. Please try again." });
    }

    return res.status(500).json({ error: err.message || "Internal server error." });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Resume Matcher API running on http://localhost:${PORT}`);
});
