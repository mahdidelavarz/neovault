"use client";

import { useState, useEffect } from "react";
import { UploadedFile } from "@/features/files/types/file";
import { useUpdateFile } from "@/features/files/hooks/useFiles";
import Modal from "@/features/shared/ui/Modal";
import Button from "@/features/shared/ui/Button";

interface Props {
  file: UploadedFile | null;
  onClose: () => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function FileInfoModal({ file, onClose }: Props) {
  const [desc, setDesc] = useState(file?.description ?? "");
  const [saved, setSaved] = useState(false);
  const update = useUpdateFile();

  useEffect(() => {
    setDesc(file?.description ?? "");
    setSaved(false);
  }, [file]);

  if (!file) return null;

  const handleSave = async () => {
    await update.mutateAsync({ id: file.id, description: desc });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const date = new Date(file.createdAt).toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <style>{CSS}</style>
      <Modal isOpen={!!file} onClose={onClose} title="File info" size="sm">
        <div className="fim">
          <div className="fim-row">
            <span className="fim-label">Name</span>
            <span className="fim-value">{file.originalName}</span>
          </div>
          <div className="fim-row">
            <span className="fim-label">Type</span>
            <span className="fim-value">{file.mimetype}</span>
          </div>
          <div className="fim-row">
            <span className="fim-label">Size</span>
            <span className="fim-value">{formatBytes(file.size)}</span>
          </div>
          <div className="fim-row">
            <span className="fim-label">Uploaded</span>
            <span className="fim-value">{date}</span>
          </div>

          <div className="fim-desc-block">
            <label className="fim-label" htmlFor="fim-desc">Description</label>
            <textarea
              id="fim-desc"
              className="fim-textarea"
              value={desc}
              onChange={(e) => { setDesc(e.target.value); setSaved(false); }}
              placeholder="Add a description…"
              rows={3}
              maxLength={500}
            />
            <div className="fim-desc-footer">
              <span className="fim-char-count">{desc.length}/500</span>
              <Button
                size="sm"
                variant={saved ? "secondary" : "primary"}
                isLoading={update.isPending}
                onClick={handleSave}
              >
                {saved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

const CSS = `
.fim { display: flex; flex-direction: column; gap: 12px; }

.fim-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-subtle);
}
.fim-row:last-of-type { border-bottom: none; }

.fim-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  width: 80px;
  padding-top: 1px;
}

.fim-value {
  font-size: var(--text-sm);
  color: var(--text-primary);
  word-break: break-all;
}

.fim-desc-block { display: flex; flex-direction: column; gap: 6px; }

.fim-textarea {
  width: 100%;
  padding: 8px 10px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  resize: vertical;
  transition: border-color var(--transition-fast);
  box-sizing: border-box;
}
.fim-textarea:focus { outline: none; border-color: var(--border-focus); }
.fim-textarea::placeholder { color: var(--text-tertiary); }

.fim-desc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fim-char-count { font-size: var(--text-xs); color: var(--text-tertiary); }
`;
