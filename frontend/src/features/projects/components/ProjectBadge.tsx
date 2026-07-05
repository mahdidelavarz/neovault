"use client";

import { useState } from "react";
import { useItemMembership } from "@/features/projects/hooks/useProjects";
import { type ProjectItemType, PROJECT_COLOR_CSS } from "@/features/projects/types/project";
import AddToProjectModal from "./AddToProjectModal";
import { LucideFolderOpen, SolarFolderFavouriteBookmarkLinear, SolarFolderWithFilesOutline } from "@/Icons/Icons";

interface ProjectBadgeProps {
    itemType: ProjectItemType;
    itemId: number;
}

export default function ProjectBadge({ itemType, itemId }: ProjectBadgeProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const { data: projects, isLoading } = useItemMembership(itemType, itemId);

    if (isLoading || !projects) return null;

    const accentColor = projects[0]
        ? PROJECT_COLOR_CSS[projects[0].color ?? ''] ?? 'var(--cyan-400)'
        : 'var(--text-muted)';

    const label = projects.length === 0
        ? null
        : projects.length === 1
            ? projects[0].title
            : `${projects.length} projects`;

    return (
        <>
            <button
                className="pbadge"
                onClick={e => { e.stopPropagation(); setModalOpen(true); }}
                title={projects.length === 0 ? 'Add to project' : `In: ${projects.map(p => p.title).join(', ')}`}
                style={{ '--pbadge-color': accentColor } as React.CSSProperties}
                type="button"
            >
                <style>{CSS}</style>
                <SolarFolderWithFilesOutline width={16} />
                {label && <span className="pbadge-label">{label}</span>}
            </button>

            <AddToProjectModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                itemType={itemType}
                itemId={itemId}
            />
        </>
    );
}

const CSS = `
.pbadge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px;
    background: transparent;
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    font-size: 10px; font-weight: 500;
    color: var(--pbadge-color, var(--text-muted));
    cursor: pointer;
    white-space: nowrap; max-width: 120px;
    transition: background var(--transition-fast), border-color var(--transition-fast);
    vertical-align: middle;
}
.pbadge:hover { background: var(--bg-elevated); border-color: var(--border-default); }
.pbadge-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;
