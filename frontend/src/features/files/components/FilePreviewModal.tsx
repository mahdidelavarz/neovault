"use client";

import { useState, useEffect } from "react";
import { UploadedFile } from "@/features/files/types/file";
import Modal from "@/features/shared/ui/Modal";
import { LucideDownload } from "@/Icons/Icons";

interface Props {
  file: UploadedFile | null;
  onClose: () => void;
}

export default function FilePreviewModal({ file, onClose }: Props) {
  const [textContent, setTextContent] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    setTextContent(null);
    if (file.mimetype.startsWith("text/")) {
      fetch(file.path)
        .then((r) => r.text())
        .then(setTextContent)
        .catch(() => setTextContent("Could not load file content."));
    }
  }, [file]);

  if (!file) return null;

  const isImage = file.mimetype.startsWith("image/");
  const isPdf   = file.mimetype === "application/pdf";
  const isText  = file.mimetype.startsWith("text/");

  return (
    <>
      <style>{CSS}</style>
      <Modal isOpen={!!file} onClose={onClose} title={file.originalName} size="lg">
        <div className="fpm">
          {isImage && (
            <div className="fpm-img-wrap">
              <img src={file.path} alt={file.originalName} className="fpm-img" />
            </div>
          )}

          {isPdf && (
            <iframe
              src={file.path}
              className="fpm-iframe"
              title={file.originalName}
            />
          )}

          {isText && (
            <pre className="fpm-text">
              {textContent ?? "Loading…"}
            </pre>
          )}

          {!isImage && !isPdf && !isText && (
            <div className="fpm-no-preview">
              <p className="fpm-no-preview-msg">No preview available for this file type.</p>
              <a
                className="fpm-download-link"
                href={file.path}
                download={file.originalName}
              >
                <LucideDownload width={14} />
                Download file
              </a>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

const CSS = `
.fpm { display: flex; flex-direction: column; }

.fpm-img-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 70vh;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
}
.fpm-img { max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: var(--radius-md); }

.fpm-iframe {
  width: 100%;
  height: 70vh;
  border: none;
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
}

.fpm-text {
  max-height: 70vh;
  overflow: auto;
  padding: 12px 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
}

.fpm-no-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 40px 20px;
  text-align: center;
}
.fpm-no-preview-msg { font-size: var(--text-sm); color: var(--text-tertiary); margin: 0; }
.fpm-download-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}
.fpm-download-link:hover { background: var(--bg-overlay); border-color: var(--border-strong); }
`;
