import React, { useState, useCallback } from "react";
import axios from "axios";
import UploadZone from "./components/UploadZone";
import ResultsDashboard from "./components/ResultsDashboard";

// ─── Spinner ─────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg
    className="animate-spin"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = useCallback(async () => {
    if (!resumeFile) {
      setError("Please upload your resume PDF.");
      return;
    }
    if (jobDescription.trim().length < 50) {
      setError("Please paste a job description (at least 50 characters).");
      return;
    }

    setError("");
    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription.trim());

    try {
      const { data } = await axios.post("/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysis(data.analysis);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [resumeFile, jobDescription]);

  const handleReset = () => {
    setResumeFile(null);
    setJobDescription("");
    setAnalysis(null);
    setError("");
  };

  return (
    <div className={darkMode ? "" : "light-mode"} style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(20,184,166,0.06) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(20,184,166,0.04) 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 min-h-screen">
        {/* ─── Header ─────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-50 px-6 py-4"
          style={{
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--accent)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                  ResumeAI
                </span>
                <span
                  className="ml-2 text-xs px-1.5 py-0.5 rounded font-medium"
                  style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
                >
                  ATS Matcher
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>
                Powered by Gemini 1.5 Flash
              </span>

              {/* Dark / light toggle */}
              <button
                onClick={() => setDarkMode((d) => !d)}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200"
                style={{
                  background: "var(--border)",
                  color: "var(--text-muted)",
                }}
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* ─── Main content ───────────────────────────────────── */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

          {!analysis ? (
            <>
              {/* Hero */}
              <div className="text-center mb-10">
                <h1
                  className="text-3xl sm:text-4xl font-bold mb-3 leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  Match your resume to{" "}
                  <span style={{ color: "var(--accent)" }}>any job</span>
                </h1>
                <p
                  className="text-base max-w-xl mx-auto"
                  style={{ color: "var(--text-muted)" }}
                >
                  Get an instant ATS compatibility score, discover missing keywords,
                  and receive AI-powered suggestions to land more interviews.
                </p>
              </div>

              {/* Input grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Resume upload */}
                <div className="card">
                  <p className="section-label mb-4">01 · Resume</p>
                  <UploadZone file={resumeFile} onFile={setResumeFile} />
                </div>

                {/* JD textarea */}
                <div className="card flex flex-col">
                  <p className="section-label mb-4">02 · Job Description</p>
                  <textarea
                    className="flex-1 w-full rounded-xl p-4 text-sm leading-relaxed resize-none outline-none transition-colors duration-200 min-h-[220px]"
                    placeholder="Paste the full job description here…"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--accent)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--border)";
                    }}
                  />
                  <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                    {jobDescription.length} characters
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#f87171",
                  }}
                >
                  ⚠ {error}
                </div>
              )}

              {/* CTA */}
              <div className="flex justify-center">
                <button
                  className="btn-primary text-base px-10 py-4"
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Analyzing with Gemini…
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"/>
                      </svg>
                      Analyze Resume
                    </>
                  )}
                </button>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-3 mt-10">
                {[
                  "ATS Score",
                  "Missing Keywords",
                  "Strength Analysis",
                  "Actionable Tips",
                  "Section Scores",
                  "Instant Results",
                ].map((f) => (
                  <span
                    key={f}
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <ResultsDashboard analysis={analysis} />

              {/* Reset */}
              <div className="flex justify-center mt-10">
                <button
                  className="btn-primary"
                  onClick={handleReset}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    boxShadow: "none",
                  }}
                >
                  ← Analyze Another Resume
                </button>
              </div>
            </>
          )}
        </main>

        {/* ─── Footer ─────────────────────────────────────────── */}
        <footer
          className="text-center py-6 text-xs mt-10"
          style={{
            color: "var(--text-muted)",
            borderTop: "1px solid var(--border)",
          }}
        >
          ResumeAI · Built with Gemini 1.5 Flash · Not a substitute for professional career advice
        </footer>
      </div>
    </div>
  );
}
