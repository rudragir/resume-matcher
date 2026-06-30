import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const UploadZone = ({ file, onFile }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (accepted) => {
      setDragActive(false);
      if (accepted.length > 0) onFile(accepted[0]);
    },
    [onFile]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const formatSize = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

  return (
    <div
      {...getRootProps()}
      className="relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 flex flex-col items-center justify-center gap-4 min-h-[220px] group"
      style={{
        borderColor: dragActive
          ? "var(--accent)"
          : file
          ? "var(--accent)"
          : "var(--border)",
        background: dragActive
          ? "var(--accent-glow)"
          : file
          ? "var(--accent-glow)"
          : "transparent",
      }}
    >
      <input {...getInputProps()} />

      {/* Animated ring on hover/drag */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: "inset 0 0 30px var(--accent-glow)",
        }}
      />

      {file ? (
        <>
          {/* PDF Icon */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent-glow)", border: "1px solid var(--accent)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="14,2 14,8 20,8" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="9" y1="15" x2="15" y2="15" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="9" y1="12" x2="12" y2="12" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              {file.name}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {formatSize(file.size)} · PDF · Click to replace
            </p>
          </div>
        </>
      ) : (
        <>
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ background: "var(--border)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17 8 12 3 7 8" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              Drop your resume here
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              PDF format · max 10 MB · or click to browse
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadZone;
