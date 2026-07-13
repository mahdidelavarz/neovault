"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  usePrompt,
  useDeletePrompt,
  useTogglePromptFavorite,
  useIncrementPromptUsage,
  useUpdatePrompt,
} from "@/features/prompts/hooks/usePrompt";
import { usePromptCollectionMembership } from "@/features/prompts/hooks/usePromptCollections";
import { useItemMembership } from "@/features/projects/hooks/useProjects";
import { useProjectAwareEdit } from "@/features/shared/hooks/useProjectAwareEdit";
import {
  type Prompt,
  type PromptType,
  type AIPlatform,
  type PromptVersion,
  PROMPT_TYPES,
  AI_PLATFORMS,
} from "@/features/prompts/types/prompt";
import { PROJECT_COLOR_CSS } from "@/features/projects/types/project";
import {
  extractVariables,
  replaceVariables,
  copyToClipboard,
  sendToAI,
} from "@/features/prompts/utils/promptUtils";
import PageLayout from "@/features/shared/layout/PageLayout";
import EmptyState from "@/features/shared/ui/EmptyState";
import Badge from "@/features/shared/ui/Badge";
import Button from "@/features/shared/ui/Button";
import Alert from "@/features/shared/ui/Alert";
import TagSection from "@/features/shared/components/TagSection";
import ConfirmDeleteModal from "@/features/shared/components/ConfirmDeleteModal";
import MultiProjectEditWarning from "@/features/projects/components/MultiProjectEditWarning";
import Modal from "@/features/shared/ui/Modal";
import PromptForm from "@/features/prompts/components/PromptForm";
import VariableForm from "@/features/prompts/components/VariableForm";
import AddToCollectionModal from "@/features/prompts/components/AddToCollectionModal";
import {
  LucideChevronRight,
  LucideMessageSquare,
  LucideStar,
  LucidePencil,
  LucideTrash2,
  LucideLayers,
  LucideCopy,
  LucideCheck,
  LucideExternalLink,
  LucideFolder,
  LucideBarChart3,
  LucidePlus,
  LucideRefreshCw,
  LucideBot,
  LucideBrain,
  LucideSparkles,
  LucideGem,
  LucideMoreHorizontal,
  HugeiconsChatGpt,
  HugeiconsDeepseek,
  HugeiconsClaude,
  HugeiconsGoogleGemini,
} from "@/Icons/Icons";

const platformIcons: Record<string, React.ComponentType<{ width?: number }>> = {
  chatgpt: LucideBot,
  deepseek: LucideBrain,
  claude: LucideSparkles,
  gemini: LucideGem,
};

type PendingAction = { kind: "copy" } | { kind: "send"; platform: AIPlatform } | null;

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string, 10);

  const { data: item, isLoading } = usePrompt(id);
  const toggleFav = useTogglePromptFavorite();
  const deletePrompt = useDeletePrompt();
  const incrementUsage = useIncrementPromptUsage();
  const updatePrompt = useUpdatePrompt();
  const { data: projects } = useItemMembership('prompt', id);
  const { data: collections } = usePromptCollectionMembership(id);

  const [formOpen, setFormOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sentToAI, setSentToAI] = useState<AIPlatform | null>(null);
  const [varModalOpen, setVarModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { handleEdit, confirmEdit, cancelEdit, isWarnOpen, projectNames } =
    useProjectAwareEdit<Prompt>({ itemType: 'prompt', itemId: id, onEdit: () => setFormOpen(true) });

  const variables = item ? extractVariables(item.content).map(v => ({
    ...v,
    defaultValue: item.variables?.find(sv => sv.name === v.name)?.defaultValue ?? v.defaultValue,
  })) : [];

  const doCopy = async (text: string) => {
    if (!item) return;
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      incrementUsage.mutate(item.id);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const doSend = (text: string, platform: AIPlatform) => {
    if (!item) return;
    const success = sendToAI(text, platform);
    if (success) {
      setSentToAI(platform);
      incrementUsage.mutate(item.id);
      setTimeout(() => setSentToAI(null), 3000);
    }
  };

  const handleCopyClick = () => {
    if (!item) return;
    if (variables.length > 0) {
      setPendingAction({ kind: "copy" });
      setVarModalOpen(true);
    } else {
      doCopy(item.content);
    }
  };

  const handleSendClick = (platform: AIPlatform) => {
    if (!item) return;
    if (variables.length > 0) {
      setPendingAction({ kind: "send", platform });
      setVarModalOpen(true);
    } else {
      doSend(item.content, platform);
    }
  };

  const handleVariablesFilled = (values: Record<string, string>) => {
    if (!item) return;
    const replaced = replaceVariables(item.content, values);
    setVarModalOpen(false);
    if (pendingAction?.kind === "copy") {
      doCopy(replaced);
    } else if (pendingAction?.kind === "send") {
      doSend(replaced, pendingAction.platform);
    }
    setPendingAction(null);
  };

  const closeVarModal = () => {
    setVarModalOpen(false);
    setPendingAction(null);
  };

  const handleRestore = (ver: PromptVersion) => {
    if (!item) return;
    updatePrompt.mutate({
      id: item.id,
      title: ver.title,
      content: ver.content,
      description: ver.description,
      promptType: ver.promptType as PromptType,
      targetAI: ver.targetAI as AIPlatform | undefined,
      expectedOutput: ver.expectedOutput,
      variables: ver.variables,
    });
  };

  if (isLoading) {
    return (
      <PageLayout top={<div className="ppd-skeleton-block ppd-skeleton-head" />}>
        <div className="ppd-layout">
          <div className="ppd-main">
            <div className="ppd-skeleton-block" style={{ height: 320 }} />
          </div>
          <div className="ppd-sidebar">
            <div className="ppd-skeleton-block" style={{ height: 160 }} />
            <div className="ppd-skeleton-block" style={{ height: 100 }} />
          </div>
        </div>
        <style>{CSS}</style>
      </PageLayout>
    );
  }

  if (!item) {
    return (
      <PageLayout top={null}>
        <EmptyState
          icon={LucideMessageSquare}
          title="Prompt not found"
          subtitle="This prompt may have been deleted."
          action={<Button onClick={() => router.push('/prompts')}>Back to prompts</Button>}
        />
        <style>{CSS}</style>
      </PageLayout>
    );
  }

  const promptType = PROMPT_TYPES[item.promptType];
  const aiPlatform = item.targetAI ? AI_PLATFORMS[item.targetAI] : null;
  const PlatformIcon = item.targetAI ? platformIcons[item.targetAI] : null;
  const versions = item.versions ?? [];

  return (
    <>
      <style>{CSS}</style>
      <PageLayout
        top={
          <>
            <nav className="ppd-crumbs">
              <Link href="/prompts">Prompts</Link>
              <LucideChevronRight width={12} />
              <span>{promptType?.label}</span>
              <LucideChevronRight width={12} />
              <span className="ppd-crumb-current">{item.title}</span>
            </nav>

            <div className="ppd-head">
              <div className="ppd-head-main">
                <div className="ppd-head-badges">
                  <Badge variant="default">{promptType?.icon} {promptType?.label}</Badge>
                  {aiPlatform && (
                    <Badge variant="default">
                      {PlatformIcon && <PlatformIcon width={11} />} {aiPlatform.name}
                    </Badge>
                  )}
                  <button
                    className={['ppd-fav-chip', item.isFavorite ? 'ppd-fav-chip--active' : ''].filter(Boolean).join(' ')}
                    onClick={() => toggleFav.mutate(item.id)}
                    disabled={toggleFav.isPending}
                    type="button"
                  >
                    <LucideStar width={13} />
                    {item.isFavorite ? 'Favorite' : 'Add to favorites'}
                  </button>
                </div>
                <h1 className="ppd-title">{item.title}</h1>
                {item.description && <p className="ppd-desc">{item.description}</p>}
              </div>

              <div className="ppd-actions">
                <Button
                  variant="secondary"
                  leftIcon={copied ? LucideCheck : LucideCopy}
                  onClick={handleCopyClick}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>

                {aiPlatform && item.targetAI ? (
                  <Button
                    variant="secondary"
                    leftIcon={LucideExternalLink}
                    onClick={() => handleSendClick(item.targetAI as AIPlatform)}
                  >
                    Send to {aiPlatform.name}
                  </Button>
                ) : (
                  <div className="ppd-quick-send">
                    <button onClick={() => handleSendClick("chatgpt")} className="quick-send-btn quick-send-btn--white" title="Send to ChatGPT">
                      <HugeiconsChatGpt width={24} />
                    </button>
                    <button onClick={() => handleSendClick("deepseek")} className="quick-send-btn quick-send-btn--blue" title="Send to DeepSeek">
                      <HugeiconsDeepseek width={24} />
                    </button>
                    <button onClick={() => handleSendClick("claude")} className="quick-send-btn quick-send-btn--orange" title="Send to Claude">
                      <HugeiconsClaude width={24} />
                    </button>
                    <button onClick={() => handleSendClick("gemini")} className="quick-send-btn quick-send-btn--blue" title="Send to Gemini">
                      <HugeiconsGoogleGemini width={24} />
                    </button>
                  </div>
                )}

                <details className="ppd-action-menu">
                  <summary className="ppd-action-menu-trigger" aria-label="More prompt actions">
                    <LucideMoreHorizontal width={16} />
                  </summary>
                  <div className="ppd-action-menu-popover">
                    <button type="button" className="ppd-action-menu-item" onClick={() => setCloneOpen(true)}>
                      <LucideLayers width={14} />
                      Clone
                    </button>
                    <button type="button" className="ppd-action-menu-item" onClick={() => handleEdit(item)}>
                      <LucidePencil width={14} />
                      Edit
                    </button>
                    <button type="button" className="ppd-action-menu-item ppd-action-menu-item--danger" onClick={() => setConfirmDelete(true)}>
                      <LucideTrash2 width={14} />
                      Delete
                    </button>
                  </div>
                </details>
              </div>
            </div>

            {sentToAI && (
              <div className="ppd-alert">
                <Alert type="info" message={`Opening ${AI_PLATFORMS[sentToAI].name}...`} />
              </div>
            )}
          </>
        }
      >
        <div className="ppd-layout">
          {/* ── Left column ── */}
          <div className="ppd-main">
            <div className="ppd-content-block">
              <div className="ppd-content-bar">
                <span className="ppd-content-bar-label">Prompt content</span>
              </div>
              <div className="ppd-content-scroll">
                <pre className="ppd-content-text">{item.content}</pre>
              </div>
            </div>

            {item.expectedOutput && (
              <div className="ppd-panel">
                <h3 className="ppd-panel-title">Expected Output</h3>
                <p className="ppd-panel-text">{item.expectedOutput}</p>
              </div>
            )}

            {variables.length > 0 && (
              <div className="ppd-panel">
                <h3 className="ppd-panel-title">Variables ({variables.length})</h3>
                {variables.map((v) => (
                  <div className="ppd-vars-row" key={v.name}>
                    <span className="ppd-var-name">{`{{${v.name}}}`}</span>
                    <span className="ppd-var-value">{v.defaultValue || '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="ppd-sidebar">
            <div className="ppd-meta-card">
              <h3 className="ppd-meta-title">Details</h3>
              <div className="ppd-meta-row">
                <span className="ppd-meta-key">Type</span>
                <span className="ppd-meta-val">{promptType?.label}</span>
              </div>
              {aiPlatform && (
                <div className="ppd-meta-row">
                  <span className="ppd-meta-key">Target AI</span>
                  <span className="ppd-meta-val">{aiPlatform.name}</span>
                </div>
              )}
              {item.category && (
                <div className="ppd-meta-row">
                  <span className="ppd-meta-key">Category</span>
                  <span className="ppd-meta-val"><LucideFolder width={11} /> {item.category.name}</span>
                </div>
              )}
              <div className="ppd-meta-row">
                <span className="ppd-meta-key">Used</span>
                <span className="ppd-meta-val"><LucideBarChart3 width={11} /> {item.usageCount}x</span>
              </div>
              {item.lastUsedAt && (
                <div className="ppd-meta-row">
                  <span className="ppd-meta-key">Last used</span>
                  <span className="ppd-meta-val">{new Date(item.lastUsedAt).toLocaleDateString()}</span>
                </div>
              )}
              <div className="ppd-meta-row">
                <span className="ppd-meta-key">Created</span>
                <span className="ppd-meta-val">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="ppd-meta-row">
                <span className="ppd-meta-key">Updated</span>
                <span className="ppd-meta-val">{new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {!!item.tags?.length && (
              <div className="ppd-meta-card">
                <h3 className="ppd-meta-title">Tags</h3>
                <TagSection tags={item.tags} />
              </div>
            )}

            {!!projects?.length && (
              <div className="ppd-meta-card">
                <h3 className="ppd-meta-title">In projects</h3>
                {projects.map((p) => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="ppd-project-row">
                    <span>{p.emoji || '📁'}</span>
                    <span>{p.title}</span>
                  </Link>
                ))}
              </div>
            )}

            <div className="ppd-meta-card">
              <div className="ppd-meta-title-row">
                <h3 className="ppd-meta-title">In collections</h3>
                <button className="ppd-collections-manage" onClick={() => setCollectionsOpen(true)} title="Manage collections">
                  <LucidePlus width={13} />
                </button>
              </div>
              {collections?.length ? (
                collections.map((c) => (
                  <div key={c.id} className="ppd-collection-row">
                    <span className="ppd-collection-color" style={{ background: PROJECT_COLOR_CSS[c.color ?? ''] ?? 'var(--cyan-400)' }} />
                    <span>{c.title}</span>
                  </div>
                ))
              ) : (
                <p className="ppd-empty-text">Not in any collection yet</p>
              )}
            </div>

            <div className="ppd-meta-card">
              <h3 className="ppd-meta-title">
                Version history
                {versions.length > 0 && <span className="ppd-versions-count">{versions.length}</span>}
              </h3>
              {versions.length > 0 ? (
                <div className="ppd-versions-list">
                  {versions.map((ver, idx) => (
                    <div className="ppd-version-item" key={idx}>
                      <div className="ppd-version-meta">
                        <span className="ppd-version-title">{ver.title}</span>
                        <span className="ppd-version-date">
                          {new Date(ver.savedAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <pre className="ppd-version-preview">{ver.content}</pre>
                      <button
                        type="button"
                        className="ppd-version-restore"
                        disabled={updatePrompt.isPending}
                        onClick={() => handleRestore(ver)}
                      >
                        <LucideRefreshCw width={11} />
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ppd-empty-text">No history yet — versions are saved automatically when you update this prompt.</p>
              )}
            </div>
          </div>
        </div>
      </PageLayout>

      {/* ── Modals ── */}
      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title="Edit Prompt" size="lg">
        <PromptForm prompt={item} onClose={() => setFormOpen(false)} />
      </Modal>

      <Modal isOpen={cloneOpen} onClose={() => setCloneOpen(false)} title="Duplicate Prompt" size="lg">
        <PromptForm prompt={null} initialValues={item} onClose={() => setCloneOpen(false)} />
      </Modal>

      <ConfirmDeleteModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        itemName={item.title}
        isLoading={deletePrompt.isPending}
        onConfirm={() => deletePrompt.mutate(item.id, { onSuccess: () => router.push('/prompts') })}
      />

      <MultiProjectEditWarning
        isOpen={isWarnOpen}
        projectNames={projectNames}
        onConfirm={confirmEdit}
        onCancel={cancelEdit}
      />

      <AddToCollectionModal
        isOpen={collectionsOpen}
        onClose={() => setCollectionsOpen(false)}
        promptId={item.id}
      />

      <Modal isOpen={varModalOpen} onClose={closeVarModal} size="sm">
        <VariableForm variables={variables} onSubmit={handleVariablesFilled} onCancel={closeVarModal} />
      </Modal>
    </>
  );
}

const CSS = `
/* Breadcrumb */
.ppd-crumbs {
  display: flex; align-items: center; gap: 6px;
  font-size: var(--text-xs); color: var(--text-tertiary);
}
.ppd-crumbs a { color: var(--text-tertiary); text-decoration: none; transition: color var(--transition-fast); }
.ppd-crumbs a:hover { color: var(--text-primary); }
.ppd-crumbs svg { flex-shrink: 0; opacity: 0.6; }
.ppd-crumb-current {
  color: var(--text-secondary); font-weight: 500;
  max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* Head */
.ppd-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 20px; flex-wrap: wrap;
}
.ppd-head-main { display: flex; flex-direction: column; gap: 8px; min-width: 0; flex: 1; }
.ppd-head-badges { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.ppd-fav-chip {
  display: flex; align-items: center; gap: 5px;
  height: 24px; padding: 0 10px;
  background: var(--bg-overlay); border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  color: var(--text-tertiary); font-size: var(--text-xs); font-family: var(--font-sans); font-weight: 500;
  cursor: pointer; transition: all var(--transition-fast);
}
.ppd-fav-chip:hover { border-color: var(--border-strong); color: var(--text-secondary); }
.ppd-fav-chip--active { background: var(--warning-muted); border-color: rgba(245,158,11,0.3); color: #fbbf24; }
.ppd-title { font-size: clamp(var(--text-xl), 2vw, var(--text-3xl)); font-weight: 700; color: var(--text-primary); margin: 0; letter-spacing: -0.02em; }
.ppd-desc  { font-size: var(--text-sm); color: var(--text-secondary); margin: 0; line-height: var(--leading-relaxed); }
.ppd-actions { display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; flex-shrink: 0; }
.ppd-action-menu { position: relative; flex-shrink: 0; }
.ppd-action-menu-trigger {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px;
  background: var(--bg-overlay); border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  list-style: none;
  transition: background var(--transition-fast), border-color var(--transition-fast);
}
.ppd-action-menu-trigger::-webkit-details-marker { display: none; }
.ppd-action-menu-trigger:hover { background: var(--bg-subtle); border-color: var(--border-strong); }
.ppd-action-menu[open] .ppd-action-menu-trigger { background: var(--bg-subtle); border-color: var(--border-strong); }
.ppd-action-menu-popover {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 20;
  min-width: 156px;
  padding: 6px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}
.ppd-action-menu-item {
  display: flex; align-items: center; gap: 8px;
  width: 100%;
  height: 32px;
  padding: 0 10px;
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font: inherit;
  font-size: var(--text-sm);
  text-align: left;
  cursor: pointer;
}
.ppd-action-menu-item:hover { background: var(--bg-overlay); color: var(--text-primary); }
.ppd-action-menu-item--danger { color: var(--danger); }
.ppd-action-menu-item--danger:hover { background: var(--danger-muted); color: var(--danger); }

.ppd-alert { margin-top: 8px; }

/* Layout */
.ppd-layout {
  display: grid;
  grid-template-columns: minmax(0,1fr) 310px;
  gap: 24px;
  align-items: start;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}
@media (max-width: 860px) {
  .ppd-layout { grid-template-columns: 1fr; }
}

.ppd-main { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

/* Content block */
.ppd-content-block {
  background: var(--bg-surface); border: 1px solid var(--border-default);
  border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm);
}
.ppd-content-bar {
  display: flex; align-items: center; justify-content: space-between;
  min-height: 38px; padding: 8px 16px; border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
}
.ppd-content-bar-label { font-size: var(--text-xs); font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.06em; }
.ppd-content-scroll { max-height: min(64vh, 720px); overflow-y: auto; background: var(--code-bg); }
.ppd-content-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
.ppd-content-scroll::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }
.ppd-content-text {
  margin: 0; padding: 20px;
  font-family: var(--font-mono, monospace);
  font-size: var(--text-sm);
  line-height: 1.75;
  color: var(--ct-fg);
  background: var(--code-bg);
  border: 0;
  border-radius: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Panels */
.ppd-panel {
  background: var(--bg-surface); border: 1px solid var(--border-default);
  border-radius: var(--radius-lg); padding: 16px;
  display: flex; flex-direction: column; gap: 10px;
}
.ppd-panel-title { font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); margin: 0; }
.ppd-panel-text { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); margin: 0; white-space: pre-wrap; }

.ppd-vars-row {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 8px 10px;
  background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
}
.ppd-var-name { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--cyan-300); }
.ppd-var-value { font-size: var(--text-xs); color: var(--text-secondary); text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60%; }

/* Quick send */
.ppd-quick-send { display: flex; gap: 2px; }
.quick-send-btn {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           36px;
  height:          36px;
  padding:         0;
  border:          none;
  border-radius:   var(--radius-md);
  cursor:          pointer;
  transition:      all var(--transition-fast);
}
.quick-send-btn--green  { background: rgba(16,185,129,0.1);  color: #10b981; }
.quick-send-btn--teal   { background: rgba(20,184,166,0.1);  color: #14b8a6; }
.quick-send-btn--orange { background: rgba(249,115,22,0.1);  color: #f97316; }
.quick-send-btn--blue   { background: rgba(59,130,246,0.1);  color: #3b82f6; }
.quick-send-btn:hover   { filter: brightness(0.9); transform: scale(1.1); }

/* Sidebar */
.ppd-sidebar { display: flex; flex-direction: column; gap: 14px; }
.ppd-meta-card {
  background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-lg);
  padding: 16px; display: flex; flex-direction: column; gap: 11px; box-shadow: var(--shadow-sm);
}
.ppd-meta-title {
  font-size: var(--text-xs); font-weight: 600; color: var(--text-tertiary);
  text-transform: uppercase; letter-spacing: 0.06em; margin: 0;
  display: flex; align-items: center; gap: 6px;
}
.ppd-meta-title-row { display: flex; align-items: center; justify-content: space-between; }
.ppd-meta-title-row .ppd-meta-title { margin: 0; }
.ppd-meta-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: var(--text-sm); padding-bottom: 9px; border-bottom: 1px solid var(--border-subtle); }
.ppd-meta-row:last-child { padding-bottom: 0; border-bottom: 0; }
.ppd-meta-key { color: var(--text-tertiary); }
.ppd-meta-val { color: var(--text-primary); font-weight: 500; text-align: right; display: flex; align-items: center; gap: 4px; justify-content: flex-end; }

.ppd-project-row {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 8px; border-radius: var(--radius-md);
  color: var(--text-secondary); font-size: var(--text-sm); text-decoration: none;
  transition: background var(--transition-fast), color var(--transition-fast);
}
.ppd-project-row:hover { background: var(--bg-overlay); color: var(--text-primary); }

/* Collections */
.ppd-collections-manage {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px;
  background: var(--bg-overlay); border: 1px solid var(--border-default); border-radius: var(--radius-sm);
  color: var(--text-tertiary); cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}
.ppd-collections-manage:hover { color: var(--text-primary); border-color: var(--border-strong); }
.ppd-collection-row {
  display: flex; align-items: center; gap: 8px;
  font-size: var(--text-sm); color: var(--text-secondary);
}
.ppd-collection-color { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.ppd-empty-text { font-size: var(--text-xs); color: var(--text-tertiary); font-style: italic; margin: 0; }

/* Version history */
.ppd-versions-count {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  background: var(--bg-overlay); border: 1px solid var(--border-subtle); border-radius: 50%;
  font-size: 10px; color: var(--text-tertiary);
  text-transform: none; letter-spacing: normal;
}
.ppd-versions-list { display: flex; flex-direction: column; gap: 8px; }
.ppd-version-item {
  display: flex; flex-direction: column; gap: 6px;
  padding: 10px 12px;
  background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
}
.ppd-version-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.ppd-version-title {
  font-size: var(--text-xs); font-weight: 600; color: var(--text-primary);
  flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ppd-version-date { font-size: var(--text-xs); color: var(--text-tertiary); white-space: nowrap; flex-shrink: 0; }
.ppd-version-preview {
  font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary);
  line-height: var(--leading-relaxed); white-space: pre-wrap; word-break: break-word;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
  margin: 0; padding: 0; background: transparent; border: 0;
}
.ppd-version-restore {
  display: inline-flex; align-items: center; gap: 5px; align-self: flex-start;
  padding: 4px 10px;
  background: transparent; border: 1px solid var(--border-default); border-radius: var(--radius-sm);
  color: var(--text-secondary); font-size: var(--text-xs); font-family: var(--font-sans);
  cursor: pointer; transition: all var(--transition-fast);
}
.ppd-version-restore:hover { border-color: var(--accent-border); color: var(--accent); }
.ppd-version-restore:disabled { opacity: 0.5; cursor: not-allowed; }

/* Skeleton */
.ppd-skeleton-head  { height: 90px; }
.ppd-skeleton-block {
  background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);
  animation: ppd-skeleton-pulse 1.5s ease-in-out infinite;
}
@keyframes ppd-skeleton-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

@media (max-width: 639px) {
  .ppd-crumbs > span:not(.ppd-crumb-current),
  .ppd-crumbs > svg:first-of-type { display: none; }
  .ppd-crumb-current { max-width: min(68vw, 260px); }
  .ppd-head { gap: 12px; }
  .ppd-head-main { gap: 6px; }
  .ppd-title { font-size: var(--text-xl); line-height: 1.25; }
  .ppd-desc { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
  .ppd-actions {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr) 34px;
    align-items: center;
    gap: 6px;
  }
  .ppd-actions > .btn {
    min-width: 0;
    padding-inline: 6px;
  }
  .ppd-actions > .btn span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ppd-quick-send {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
    width: 100%;
  }
  .ppd-action-menu { justify-self: end; }
  .ppd-action-menu-popover { right: 0; }
  .quick-send-btn { width: 100%; height: 34px; }
  .ppd-layout { gap: 12px; }
  .ppd-main, .ppd-sidebar { gap: 12px; }
  .ppd-content-block, .ppd-panel, .ppd-meta-card { border-radius: var(--radius-md); box-shadow: none; }
  .ppd-content-scroll {
    max-height: min(42dvh, 320px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .ppd-content-text { padding: 14px; font-size: var(--text-xs); line-height: 1.65; }
  .ppd-panel, .ppd-meta-card { padding: 13px; }
  .ppd-vars-row { align-items: flex-start; }
  .ppd-var-value { white-space: normal; overflow-wrap: anywhere; max-width: 55%; }
}
`;
