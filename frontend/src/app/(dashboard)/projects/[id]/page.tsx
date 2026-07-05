"use client";

import { useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProject, useRemoveFromProject, useReorderProjectItems, useUpdateProject, useDeleteProject } from "@/features/projects/hooks/useProjects";
import { type ProjectItem, type ProjectItemType, PROJECT_COLOR_CSS, ITEM_TYPE_LABELS } from "@/features/projects/types/project";
import PageLayout from "@/features/shared/layout/PageLayout";
import CardGrid from "@/features/shared/components/CardGrid";
import EmptyState from "@/features/shared/ui/EmptyState";
import Button from "@/features/shared/ui/Button";
import Modal from "@/features/shared/ui/Modal";
import ConfirmDeleteModal from "@/features/shared/components/ConfirmDeleteModal";
import ProjectItemWrapper from "@/features/projects/components/ProjectItemWrapper";
import ProjectForm from "@/features/projects/components/ProjectForm";
import AddToProjectModal from "@/features/projects/components/AddToProjectModal";
import LinkCard from "@/features/links/components/LinkCard";
import NoteCard from "@/features/notes/components/NoteCard";
import PromptCard from "@/features/prompts/components/PromptCard";
import InfraCard from "@/features/infrastructure/components/InfraCard";
import NoteForm from "@/features/notes/components/NoteForm";

import {
    LucideBox,
    LucideChevronLeft,
    LucidePencil,
    LucidePlus,
    LucideTrash2,
} from "@/Icons/Icons";
import SnippetCard from "@/features/snippets/components/SnippetCard";
import InfraForm from "@/features/infrastructure/components/InfraForm";
import SnippetForm from "@/features/snippets/components/SnippetForm";

type FilterType = ProjectItemType | 'all';

export default function ProjectDashboardPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = parseInt(params.id as string, 10);

    const { data: project, isLoading } = useProject(projectId);
    const removeItem = useRemoveFromProject();
    const reorderItems = useReorderProjectItems();
    const updateProject = useUpdateProject();
    const deleteProject = useDeleteProject();

    const [filter, setFilter] = useState<FilterType>('all');
    const [editFormOpen, setEditFormOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [addItemOpen, setAddItemOpen] = useState(false);

    // ── Per-item edit state ────────────────────────────────────────────────────
    const [editingItem, setEditingItem] = useState<{ type: ProjectItemType; item: any } | null>(null);

    // ── Drag state ─────────────────────────────────────────────────────────────
    const [items, setItems] = useState<ProjectItem[]>([]);
    const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
    const isSynced = useRef(false);

    // Sync items from server once (then user manages local order for drag)
    if (project && !isSynced.current) {
        setItems(project.items ?? []);
        isSynced.current = true;
    }
    // Reset sync when project data changes (e.g., after addItem)
    if (project && project.items.length !== items.length) {
        setItems(project.items ?? []);
    }

    const accentColor = PROJECT_COLOR_CSS[project?.color ?? ''] ?? 'var(--cyan-400)';

    // ── Filter ─────────────────────────────────────────────────────────────────
    const displayItems = filter === 'all' ? items : items.filter(pi => pi.itemType === filter);
    const typeCounts = items.reduce<Record<string, number>>((acc, pi) => {
        acc[pi.itemType] = (acc[pi.itemType] ?? 0) + 1;
        return acc;
    }, {});
    const activeTypes = Object.keys(typeCounts) as ProjectItemType[];

    // ── Drag handlers ──────────────────────────────────────────────────────────
    const handleDragStart = (idx: number) => setDraggingIdx(idx);
    const handleDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        setDragOverIdx(idx);
    };
    const handleDrop = useCallback((dropIdx: number) => {
        if (draggingIdx === null || draggingIdx === dropIdx) {
            setDraggingIdx(null); setDragOverIdx(null); return;
        }
        const reordered = [...items];
        const [moved] = reordered.splice(draggingIdx, 1);
        reordered.splice(dropIdx, 0, moved);
        const withOrder = reordered.map((pi, i) => ({ ...pi, sortOrder: i }));
        setItems(withOrder);
        setDraggingIdx(null); setDragOverIdx(null);
        reorderItems.mutate({
            projectId,
            order: withOrder.map(pi => ({ itemType: pi.itemType, itemId: pi.itemId, sortOrder: pi.sortOrder })),
        });
    }, [draggingIdx, items, projectId, reorderItems]);

    // ── Remove ─────────────────────────────────────────────────────────────────
    const handleRemove = (itemType: ProjectItemType, itemId: number) => {
        isSynced.current = false;
        removeItem.mutate({ projectId, itemType, itemId });
    };

    // ── Render item card ───────────────────────────────────────────────────────
    const renderCard = (pi: ProjectItem) => {
        const openEdit = (item: any) => setEditingItem({ type: pi.itemType, item });
        if (!pi.item) return <div className="pd-missing">Item no longer exists</div>;

        switch (pi.itemType) {
            case 'link':        return <LinkCard link={pi.item} />;
            case 'note':        return <NoteCard note={pi.item} isActive={false} onSelect={() => {}} onEditDetails={() => openEdit(pi.item)} />;
            case 'snippet':     return <SnippetCard snippet={pi.item} onDuplicate={() => {}} />;
            case 'prompt':      return <PromptCard prompt={pi.item} />;
            case 'infrastructure': return <InfraCard item={pi.item} />;
            default:            return null;
        }
    };

    if (isLoading) return (
        <PageLayout top={<div className="pd-back-bar"><div className="pd-skeleton-header" /></div>}>
            <CardGrid>{[...Array(4)].map((_, i) => <div key={i} className="pd-skeleton-card" />)}</CardGrid>
        </PageLayout>
    );

    if (!project) return (
        <PageLayout top={null}>
            <EmptyState icon={LucideBox} title="Project not found" subtitle="This project may have been deleted." />
        </PageLayout>
    );

    return (
        <>
            <style>{CSS}</style>
            <PageLayout
                top={
                    <div className="pd-header" style={{ '--pd-accent': accentColor } as React.CSSProperties}>
                        <div className="pd-header-accent" />
                        <div className="pd-header-body">
                            <button className="pd-back" onClick={() => router.push('/projects')} aria-label="Back to projects">
                                <LucideChevronLeft width={16} />
                            </button>
                            <span className="pd-emoji">{project.emoji || '📁'}</span>
                            <div className="pd-title-wrap">
                                <h1 className="pd-title">{project.title}</h1>
                                {project.description && <p className="pd-desc">{project.description}</p>}
                            </div>
                            <div className="pd-actions">
                                <Button variant="ghost" size="sm" onClick={() => setEditFormOpen(true)}>
                                    <LucidePencil width={14} />
                                    Edit
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)}>
                                    <LucideTrash2 width={14} />
                                </Button>
                                <Button size="sm" onClick={() => setAddItemOpen(true)}
                                    style={{ '--accent': accentColor, '--accent-hover': accentColor } as React.CSSProperties}>
                                    <LucidePlus width={14} />
                                    Add items
                                </Button>
                            </div>
                        </div>

                        {/* Stats + filter tabs */}
                        <div className="pd-tabs">
                            <button
                                className={['pd-tab', filter === 'all' ? 'pd-tab--active' : ''].filter(Boolean).join(' ')}
                                onClick={() => setFilter('all')}
                            >
                                All <span className="pd-tab-count">{items.length}</span>
                            </button>
                            {activeTypes.map(type => (
                                <button
                                    key={type}
                                    className={['pd-tab', filter === type ? 'pd-tab--active' : ''].filter(Boolean).join(' ')}
                                    onClick={() => setFilter(type)}
                                >
                                    {ITEM_TYPE_LABELS[type]} <span className="pd-tab-count">{typeCounts[type]}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                }
            >
                {displayItems.length === 0 ? (
                    <EmptyState
                        icon={LucideBox}
                        title={filter === 'all' ? 'No items yet' : `No ${ITEM_TYPE_LABELS[filter as ProjectItemType]} yet`}
                        subtitle={filter === 'all' ? 'Click "Add items" to add links, notes, snippets, and more.' : 'Try switching to "All" or add items of this type.'}
                        action={filter === 'all' ? (
                            <Button onClick={() => setAddItemOpen(true)}
                                style={{ '--accent': accentColor, '--accent-hover': accentColor } as React.CSSProperties}>
                                <LucidePlus width={14} />
                                Add items
                            </Button>
                        ) : undefined}
                    />
                ) : (
                    <CardGrid>
                        {displayItems.map((pi, idx) => (
                            <ProjectItemWrapper
                                key={`${pi.itemType}-${pi.itemId}`}
                                onRemove={() => handleRemove(pi.itemType as ProjectItemType, pi.itemId)}
                                isDragging={draggingIdx === idx}
                                onDragStart={() => handleDragStart(idx)}
                                onDragOver={e => handleDragOver(e, idx)}
                                onDrop={() => handleDrop(idx)}
                                onDragEnd={() => { setDraggingIdx(null); setDragOverIdx(null); }}
                            >
                                <div className={dragOverIdx === idx && draggingIdx !== idx ? 'pd-drop-target' : ''}>
                                    {renderCard(pi)}
                                </div>
                            </ProjectItemWrapper>
                        ))}
                    </CardGrid>
                )}
            </PageLayout>

            {/* Edit project modal */}
            <Modal isOpen={editFormOpen} onClose={() => setEditFormOpen(false)} title="Edit project">
                <ProjectForm project={project} onClose={() => setEditFormOpen(false)} />
            </Modal>

            {/* Delete project modal */}
            <ConfirmDeleteModal
                isOpen={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                itemName={project.title}
                isLoading={deleteProject.isPending}
                onConfirm={() => deleteProject.mutate(project.id, {
                    onSuccess: () => router.push('/projects'),
                })}
            />

            {/* Add items modal */}
            <AddToProjectModal
                isOpen={addItemOpen}
                projectId={projectId}
                onClose={() => { setAddItemOpen(false); isSynced.current = false; }}
            />

            {/* Per-item edit modals */}
            {editingItem?.type === 'note' && (
                <Modal isOpen onClose={() => setEditingItem(null)} title="Edit note">
                    <NoteForm note={editingItem.item} onClose={() => setEditingItem(null)} />
                </Modal>
            )}
            {editingItem?.type === 'snippet' && (
                <Modal isOpen onClose={() => setEditingItem(null)} title="Edit snippet">
                    <SnippetForm snippet={editingItem.item} onClose={() => setEditingItem(null)} />
                </Modal>
            )}
            {editingItem?.type === 'infrastructure' && (
                <Modal isOpen onClose={() => setEditingItem(null)} title="Edit config">
                    <InfraForm item={editingItem.item} onClose={() => setEditingItem(null)} />
                </Modal>
            )}
        </>
    );
}

const CSS = `
.pd-header {
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border-subtle);
    margin-bottom: 4px;
}
.pd-header-accent {
    height: 3px;
    background: var(--pd-accent, var(--cyan-400));
}
.pd-header-body {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px 10px;
    flex-wrap: wrap;
}
.pd-back {
    display: flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; flex-shrink: 0;
    background: transparent; border: 1px solid var(--border-default);
    border-radius: var(--radius-md); color: var(--text-secondary);
    cursor: pointer; transition: all var(--transition-fast);
}
.pd-back:hover { background: var(--bg-elevated); color: var(--text-primary); }
.pd-emoji { font-size: 24px; flex-shrink: 0; }
.pd-title-wrap { flex: 1; min-width: 0; }
.pd-title { font-size: var(--text-lg); font-weight: 700; color: var(--text-primary); margin: 0; }
.pd-desc { font-size: var(--text-xs); color: var(--text-secondary); margin: 2px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pd-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

.pd-tabs {
    display: flex; align-items: center; gap: 2px;
    padding: 0 12px 0;
    overflow-x: auto; scrollbar-width: none;
}
.pd-tabs::-webkit-scrollbar { display: none; }
.pd-tab {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 12px;
    font-size: var(--text-xs); font-weight: 500;
    color: var(--text-secondary); background: transparent; border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer; white-space: nowrap;
    transition: color var(--transition-fast), border-color var(--transition-fast);
}
.pd-tab:hover { color: var(--text-primary); }
.pd-tab--active { color: var(--text-accent); border-bottom-color: var(--accent); font-weight: 600; }
.pd-tab-count {
    padding: 1px 6px;
    background: var(--bg-elevated); border-radius: 99px;
    font-size: 10px; font-weight: 600; color: var(--text-tertiary);
}
.pd-tab--active .pd-tab-count { background: var(--accent-muted); color: var(--cyan-300); }

.pd-drop-target { outline: 2px dashed var(--accent); border-radius: var(--radius-lg); }
.pd-missing {
    padding: 12px; background: var(--bg-elevated); border: 1px dashed var(--border-subtle);
    border-radius: var(--radius-md); font-size: var(--text-xs); color: var(--text-tertiary); text-align: center;
}

.pd-back-bar { padding: 12px 16px; }
.pd-skeleton-header { height: 80px; background: var(--bg-elevated); border-radius: var(--radius-md); animation: skeleton-pulse 1.5s ease-in-out infinite; }
.pd-skeleton-card  { height: 120px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); animation: skeleton-pulse 1.5s ease-in-out infinite; }
@keyframes skeleton-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
`;
