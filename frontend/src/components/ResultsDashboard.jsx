import React from "react";
import ScoreRing from "./ScoreRing";

const SectionCard = ({ title, icon, children }) => (
  <div className="card">
    <div className="flex items-center gap-2.5 mb-4">
      <span className="text-lg">{icon}</span>
      <h3 className="font-semibold text-sm tracking-wide" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const KeywordBadge = ({ word, type = "missing" }) => {
  const styles = {
    missing: {
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.3)",
      color: "#f87171",
    },
    strength: {
      bg: "rgba(20,184,166,0.1)",
      border: "rgba(20,184,166,0.3)",
      color: "#14b8a6",
    },
  };
  const s = styles[type];
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
    >
      {type === "missing" ? "✕" : "✓"} {word}
    </span>
  );
};

const SuggestionItem = ({ text, index }) => (
  <div
    className="flex gap-3 p-3.5 rounded-xl mb-2 last:mb-0 transition-colors duration-150"
    style={{ background: "var(--bg-secondary)" }}
  >
    <span
      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
      style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--accent)" }}
    >
      {index + 1}
    </span>
    <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)", opacity: 0.85 }}>
      {text}
    </p>
  </div>
);

const MiniBar = ({ label, value }) => {
  const color =
    value >= 75 ? "#14b8a6" : value >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        <span className="text-xs font-bold font-mono" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${value}%`,
            background: color,
            boxShadow: `0 0 6px ${color}88`,
          }}
        />
      </div>
    </div>
  );
};

const ResultsDashboard = ({ analysis }) => {
  const { match_percentage, missing_keywords, strengths, suggestions, section_scores, verdict } = analysis;

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-1 h-7 rounded-full"
          style={{ background: "var(--accent)" }}
        />
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Analysis Results
        </h2>
        <span
          className="ml-auto text-xs font-semibold px-3 py-1 rounded-full"
          style={{
            background: "var(--accent-glow)",
            color: "var(--accent)",
            border: "1px solid var(--accent)",
          }}
        >
          {verdict}
        </span>
      </div>

      {/* Score row */}
      <div className="card mb-5">
        <div className="flex flex-wrap items-center justify-around gap-6 py-2">
          <ScoreRing score={match_percentage} label="Overall ATS Score" size="lg" />

          {section_scores && (
            <div className="flex-1 min-w-[200px]">
              <p className="section-label mb-4">Section Breakdown</p>
              {Object.entries(section_scores).map(([key, val]) => (
                <MiniBar key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={val} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3-col grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Missing Keywords */}
        <SectionCard title="Missing Keywords" icon="⚠️">
          <div className="flex flex-wrap">
            {missing_keywords.map((kw, i) => (
              <KeywordBadge key={i} word={kw} type="missing" />
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
            Add these terms to increase your ATS match rate.
          </p>
        </SectionCard>

        {/* Strengths */}
        <SectionCard title="Resume Strengths" icon="✅">
          <div className="flex flex-col gap-2">
            {strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-sm" style={{ color: "var(--accent)" }}>◆</span>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)", opacity: 0.85 }}>
                  {s}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Suggestions */}
      <SectionCard title="Actionable Suggestions" icon="💡">
        {suggestions.map((s, i) => (
          <SuggestionItem key={i} text={s} index={i} />
        ))}
      </SectionCard>
    </div>
  );
};

export default ResultsDashboard;
