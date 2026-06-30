import React, { useEffect, useState } from "react";

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const getColor = (score) => {
  if (score >= 75) return "#14b8a6";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
};

const getVerdict = (score) => {
  if (score >= 75) return "Strong Match";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Partial Match";
  return "Weak Match";
};

const ScoreRing = ({ score, label, size = "lg" }) => {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimated(score);
    }, 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const offset = CIRCUMFERENCE - (animated / 100) * CIRCUMFERENCE;
  const color = getColor(score);
  const isMain = size === "lg";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: isMain ? 140 : 90, height: isMain ? 140 : 90 }}>
        <svg
          width={isMain ? 140 : 90}
          height={isMain ? 140 : 90}
          viewBox="0 0 120 120"
          className="rotate-[-90deg]"
        >
          {/* Track */}
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="var(--border)"
            strokeWidth={isMain ? 10 : 8}
          />
          {/* Progress */}
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={isMain ? 10 : 8}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
              filter: `drop-shadow(0 0 ${isMain ? 10 : 6}px ${color}88)`,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold leading-none"
            style={{
              fontSize: isMain ? 28 : 18,
              color,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {Math.round(animated)}
          </span>
          {isMain && (
            <span className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              / 100
            </span>
          )}
        </div>
      </div>

      <div className="text-center">
        <p
          className="font-semibold text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          {label}
        </p>
        {isMain && (
          <span
            className="text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 inline-block"
            style={{
              background: `${color}22`,
              color,
              border: `1px solid ${color}44`,
            }}
          >
            {getVerdict(score)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ScoreRing;
