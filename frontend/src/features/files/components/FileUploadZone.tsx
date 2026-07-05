"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { useUploadFile } from "@/features/files/hooks/useFiles";
import { LucideUpload, LucideX, LucideCheck, SolarFileBold } from "@/Icons/Icons";

const MAX_SIZE = 3 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function FileUploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [staged, setStaged] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const upload = useUploadFile();

  const validate = (file: File) => {
    if (file.size > MAX_SIZE) {
      setError(`File too large — max 3 MB (this file is ${formatBytes(file.size)})`);
      return false;
    }
    setError("");
    return true;
  };

  const stage = (file: File) => {
    setDone(false);
    if (validate(file)) setStaged(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) stage(file);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) stage(file);
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!staged) return;
    const fd = new FormData();
    fd.append("file", staged);
    try {
      await upload.mutateAsync(fd);
      setStaged(null);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      setError("Upload failed. Please try again.");
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="fuz">
        <div
          className={["fuz-zone", dragging ? "fuz-zone--drag" : ""].filter(Boolean).join(" ")}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !staged && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && !staged && inputRef.current?.click()}
          aria-label="Upload file"
        >
          <input
            ref={inputRef}
            type="file"
            className="fuz-input"
            onChange={onInputChange}
            aria-hidden="true"
          />

          {staged ? (
            <div className="fuz-staged">
              <SolarFileBold className="fuz-staged-icon" />
              <div className="fuz-staged-info">
                <span className="fuz-staged-name">{staged.name}</span>
                <span className="fuz-staged-size">{formatBytes(staged.size)}</span>
              </div>
              <button
                className="fuz-staged-remove"
                onClick={(e) => { e.stopPropagation(); setStaged(null); setError(""); }}
                aria-label="Remove file"
              >
                <LucideX width={14} />
              </button>
            </div>
          ) : (
            <div className="fuz-placeholder">
              <div className="fuz-icon-wrap">
                {done ? <LucideCheck className="fuz-done-icon" /> : <LucideUpload className="fuz-upload-icon" />}
              </div>
              <p className="fuz-hint-main">{done ? "Uploaded!" : "Drop file here"}</p>
              {!done && <p className="fuz-hint-sub">or click to browse · max 3 MB</p>}
            </div>
          )}
        </div>

        {error && <p className="fuz-error">{error}</p>}

        {staged && (
          <button
            className="fuz-btn"
            onClick={handleUpload}
            disabled={upload.isPending}
          >
            {upload.isPending ? (
              <span className="fuz-spinner" />
            ) : (
              <LucideUpload width={14} />
            )}
            {upload.isPending ? "Uploading…" : "Upload"}
          </button>
        )}
      </div>
    </>
  );
}

const CSS = `
.fuz { display: flex; flex-direction: column; gap: 10px; }

.fuz-zone {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  border: 2px dashed var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
  padding: 20px;
  user-select: none;
}
.fuz-zone:hover { border-color: var(--border-strong); background: var(--bg-elevated); }
.fuz-zone--drag  { border-color: var(--accent); background: var(--accent-muted); }

.fuz-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }

.fuz-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}
.fuz-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px; height: 48px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
}
.fuz-upload-icon { width: 20px; height: 20px; color: var(--text-tertiary); }
.fuz-done-icon   { width: 20px; height: 20px; color: var(--success, #22c55e); }
.fuz-hint-main   { font-size: var(--text-sm); font-weight: 600; color: var(--text-secondary); }
.fuz-hint-sub    { font-size: var(--text-xs); color: var(--text-tertiary); }

.fuz-staged {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  pointer-events: all;
}
.fuz-staged-icon { width: 28px; height: 28px; flex-shrink: 0; color: var(--accent); }
.fuz-staged-info { flex: 1; min-width: 0; }
.fuz-staged-name { display: block; font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fuz-staged-size { display: block; font-size: var(--text-xs); color: var(--text-tertiary); }
.fuz-staged-remove {
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px;
  background: transparent; border: 1px solid transparent;
  border-radius: var(--radius-sm); color: var(--text-tertiary); cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
  flex-shrink: 0;
}
.fuz-staged-remove:hover { background: var(--danger-muted, rgba(239,68,68,.12)); color: var(--danger); border-color: transparent; }

.fuz-error { font-size: var(--text-xs); color: var(--danger); margin: 0; }

.fuz-btn {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  width: 100%;
  height: 36px;
  background: var(--accent);
  color: var(--text-inverse, #000);
  font-size: var(--text-sm); font-weight: 600;
  border: none; border-radius: var(--radius-md);
  cursor: pointer;
  transition: opacity var(--transition-fast);
}
.fuz-btn:hover:not(:disabled) { opacity: 0.88; }
.fuz-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.fuz-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: fuz-spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes fuz-spin { to { transform: rotate(360deg); } }
`;
