"use client";

import { useState } from "react";
import { UploadedFile } from "@/features/files/types/file";
import { useDeleteFile } from "@/features/files/hooks/useFiles";
import FileInfoModal from "./FileInfoModal";
import FilePreviewModal from "./FilePreviewModal";
import Modal from "@/features/shared/ui/Modal";
import Button from "@/features/shared/ui/Button";
import ProjectBadge from "@/features/projects/components/ProjectBadge";
import {
  LucideInfo,
  LucideEye,
  LucideDownload,
  LucideTrash2,
  LucideFileText,
  LucideFileCode2,
  LucideImage,
  LucideMusic,
  LucideFilm,
  SolarFileBold,
} from "@/Icons/Icons";

interface Props {
  file: UploadedFile;
}

function getFileIcon(mimetype: string) {
  if (mimetype.startsWith("image/"))       return LucideImage;
  if (mimetype.startsWith("video/"))       return LucideFilm;
  if (mimetype.startsWith("audio/"))       return LucideMusic;
  if (mimetype.startsWith("text/"))        return LucideFileText;
  if (mimetype === "application/pdf")      return LucideFileText;
  if (mimetype.includes("javascript") || mimetype.includes("json") || mimetype.includes("xml"))
                                           return LucideFileCode2;
  return SolarFileBold;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function FileCard({ file }: Props) {
  const [infoOpen, setInfoOpen]       = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteFile = useDeleteFile();

  const Icon = getFileIcon(file.mimetype);
  const date = new Date(file.createdAt).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });

  const handleDelete = async () => {
    await deleteFile.mutateAsync(file.id);
    setConfirmDelete(false);
  };

  return (
    <>
      <style>{CSS}</style>

      <div className="fcard">
        <button
          className="fcard-info-btn"
          onClick={() => setInfoOpen(true)}
          title="File info"
          aria-label="File info"
        >
          <LucideInfo width={13} />
        </button>

        <div className="fcard-icon-wrap">
          <Icon className="fcard-icon" />
        </div>

        <div className="fcard-meta">
          <p className="fcard-name" title={file.originalName}>{file.originalName}</p>
          <p className="fcard-size">{formatBytes(file.size)}</p>
        </div>

        {file.description && (
          <p className="fcard-desc">{file.description}</p>
        )}

        <div className="fcard-footer">
          <div className="fcard-footer-left">
            <ProjectBadge itemType="file" itemId={file.id} />
            <span className="fcard-date">{date}</span>
          </div>
          <div className="fcard-actions">
            <button
              className="fcard-action-btn"
              onClick={() => setPreviewOpen(true)}
              title="Preview"
            >
              <LucideEye width={15} />
            </button>
            <a
              className="fcard-action-btn"
              href={file.path}
              download={file.originalName}
              title="Download"
              onClick={(e) => e.stopPropagation()}
            >
              <LucideDownload width={15} />
            </a>
            <button
              className="fcard-action-btn fcard-action-btn--danger"
              onClick={() => setConfirmDelete(true)}
              title="Delete"
            >
              <LucideTrash2 width={15} />
            </button>
          </div>
        </div>
      </div>

      <FileInfoModal file={infoOpen ? file : null} onClose={() => setInfoOpen(false)} />
      <FilePreviewModal file={previewOpen ? file : null} onClose={() => setPreviewOpen(false)} />

      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete file" size="sm">
        <div className="fcard-confirm">
          <p className="fcard-confirm-msg">
            Delete <strong>{file.originalName}</strong>? This cannot be undone.
          </p>
          <div className="fcard-confirm-actions">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" isLoading={deleteFile.isPending} onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

const CSS = `
.fcard {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.fcard:hover { border-color: var(--border-strong); box-shadow: var(--shadow-md); }

.fcard-info-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
  z-index: 1;
}
.fcard-info-btn:hover { background: var(--bg-overlay); color: var(--text-primary); border-color: var(--border-default); }

.fcard-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--accent-muted);
  border: 1px solid var(--accent-border);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}
.fcard-icon { width: 22px; height: 22px; color: var(--accent); }

.fcard-meta { display: flex; flex-direction: column; gap: 2px; }
.fcard-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  padding-right: 28px;
}
.fcard-size { font-size: var(--text-xs); color: var(--text-tertiary); margin: 0; }

.fcard-desc {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fcard-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border-subtle);
}
.fcard-footer-left { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; overflow: hidden; }
.fcard-date { font-size: var(--text-xs); color: var(--text-tertiary); white-space: nowrap; flex-shrink: 0; }

.fcard-actions { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }

.fcard-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  cursor: pointer;
  text-decoration: none;
  transition: background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}
.fcard-action-btn:hover { background: var(--bg-overlay); color: var(--text-primary); border-color: var(--border-default); }
.fcard-action-btn--danger:hover { background: var(--danger-muted, rgba(239,68,68,.12)); color: var(--danger); border-color: transparent; }

.fcard-confirm { display: flex; flex-direction: column; gap: 16px; }
.fcard-confirm-msg { font-size: var(--text-sm); color: var(--text-secondary); margin: 0; }
.fcard-confirm-msg strong { color: var(--text-primary); }
.fcard-confirm-actions { display: flex; gap: 8px; justify-content: flex-end; }
`;
