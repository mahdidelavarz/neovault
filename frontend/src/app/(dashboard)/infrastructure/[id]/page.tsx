"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  useInfrastructure,
  useToggleInfraFavorite,
  useDeleteInfrastructure,
} from "@/features/infrastructure/hooks/useInfrastructure";
import { useItemMembership } from "@/features/projects/hooks/useProjects";
import { useProjectAwareEdit } from "@/features/shared/hooks/useProjectAwareEdit";
import { useVault } from "@/features/settings/security/hooks/useVault";
import { type Infrastructure, type InfraType, INFRA_TYPES } from "@/features/infrastructure/types/infrastructure";
import { maskEnvLine } from "@/features/infrastructure/utils/infraUtils";
import EmptyState from "@/features/shared/ui/EmptyState";
import Badge from "@/features/shared/ui/Badge";
import Button from "@/features/shared/ui/Button";
import CodeBlock from "@/features/shared/ui/CodeBlock";
import CopyButton from "@/features/shared/components/CopyButton";
import TagSection from "@/features/shared/components/TagSection";
import ConfirmDeleteModal from "@/features/shared/components/ConfirmDeleteModal";
import MultiProjectEditWarning from "@/features/projects/components/MultiProjectEditWarning";
import Modal from "@/features/shared/ui/Modal";
import { VaultGuard } from "@/features/settings/security/components/VaultGuard";
import {
  LucideChevronRight,
  LucideEye,
  LucideEyeOff,
  LucideStar,
  LucidePencil,
  LucideTrash2,
  LucideServer,
} from "@/Icons/Icons";
import PageLayout from "@/features/shared/layout/PageLayout";
import InfraForm from "@/features/infrastructure/components/InfraForm";

const INFRA_BADGE_VARIANT: Record<string, any> = {
  env: "cyan",
  server: "purple",
  docker: "cyan",
  deployment: "success",
  database: "warning",
  network: "orange",
};

const CONTENT_BAR_LABELS: Record<InfraType, string> = {
  env: '.env', server: 'connection.sh', docker: 'docker-compose.yml',
  deployment: 'runbook.md', config: 'config.yml',
};
const CONTENT_LANGUAGES: Record<InfraType, string> = {
  env: 'bash', server: 'bash', docker: 'yaml', deployment: 'md', config: 'yaml',
};

const AUTH_TYPE_LABELS: Record<string, string> = {
  password: 'Password', key: 'SSH Key', 'key-passphrase': 'SSH Key + Passphrase',
};
const AUTH_TYPE_VARIANT: Record<string, any> = {
  password: 'default', key: 'cyan', 'key-passphrase': 'purple',
};
const PLATFORM_LABELS: Record<string, string> = {
  kubernetes: 'Kubernetes', 'docker-swarm': 'Docker Swarm', 'aws-ecs': 'AWS ECS',
  vercel: 'Vercel', railway: 'Railway', heroku: 'Heroku', render: 'Render', vps: 'VPS',
};
const ENGINE_LABELS: Record<string, string> = {
  postgresql: 'PostgreSQL', mysql: 'MySQL', sqlite: 'SQLite', mongodb: 'MongoDB', redis: 'Redis', mssql: 'MSSQL',
};

function renderTypeRows(item: Infrastructure) {
  const m = item.metadata;
  if (!m) return null;

  switch (item.infraType) {
    case 'env':
      return m.environment ? (
        <div className="id-meta-row">
          <span className="id-meta-key">Environment</span>
          <span className="id-meta-val">{m.environment.charAt(0).toUpperCase() + m.environment.slice(1)}</span>
        </div>
      ) : null;

    case 'server':
      return (
        <>
          {m.host && (
            <div className="id-meta-row">
              <span className="id-meta-key">Host</span>
              <span className="id-meta-val">{m.host}</span>
            </div>
          )}
          {m.port != null && (
            <div className="id-meta-row">
              <span className="id-meta-key">Port</span>
              <span className="id-meta-val">{m.port}</span>
            </div>
          )}
          {m.username && (
            <div className="id-meta-row">
              <span className="id-meta-key">Username</span>
              <span className="id-meta-val">{m.username}</span>
            </div>
          )}
          {m.authType && (
            <div className="id-meta-row">
              <span className="id-meta-key">Auth type</span>
              <span className="id-meta-val">
                <Badge variant={AUTH_TYPE_VARIANT[m.authType] ?? 'default'} size="sm">
                  {AUTH_TYPE_LABELS[m.authType] ?? m.authType}
                </Badge>
              </span>
            </div>
          )}
        </>
      );

    case 'docker':
      return m.composeVersion ? (
        <div className="id-meta-row">
          <span className="id-meta-key">Compose version</span>
          <span className="id-meta-val">v{m.composeVersion}</span>
        </div>
      ) : null;

    case 'deployment':
      return m.platform ? (
        <div className="id-meta-row">
          <span className="id-meta-key">Platform</span>
          <span className="id-meta-val">{PLATFORM_LABELS[m.platform] ?? m.platform}</span>
        </div>
      ) : null;

    case 'config':
      return (
        <>
          {m.engine && (
            <div className="id-meta-row">
              <span className="id-meta-key">Engine</span>
              <span className="id-meta-val">
                <Badge variant="cyan" size="sm">{ENGINE_LABELS[m.engine] ?? m.engine}</Badge>
              </span>
            </div>
          )}
          {m.host && (
            <div className="id-meta-row">
              <span className="id-meta-key">Host</span>
              <span className="id-meta-val">{m.host}</span>
            </div>
          )}
          {m.port != null && (
            <div className="id-meta-row">
              <span className="id-meta-key">Port</span>
              <span className="id-meta-val">{m.port}</span>
            </div>
          )}
          {m.database && (
            <div className="id-meta-row">
              <span className="id-meta-key">Database</span>
              <span className="id-meta-val">{m.database}</span>
            </div>
          )}
        </>
      );

    default:
      return null;
  }
}

export default function InfrastructureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string, 10);

  const { data: item, isLoading } = useInfrastructure(id);
  const toggleFav = useToggleInfraFavorite();
  const deleteInfra = useDeleteInfrastructure();
  const { data: projects } = useItemMembership('infrastructure', id);

  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [vaultContent, setVaultContent] = useState<string | null>(null);
  const { isEnabled, isUnlocked, decrypt } = useVault();

  const { handleEdit, confirmEdit, cancelEdit, isWarnOpen, projectNames } =
    useProjectAwareEdit<Infrastructure>({
      itemType: 'infrastructure',
      itemId: id,
      onEdit: () => setFormOpen(true),
    });

  const isEnv = item?.infraType === 'env';
  const isVaultProtected = isEnv && isEnabled &&
    (!item?.content || item?.content === 'vault:encrypted');

  useEffect(() => {
    if (!item || !isVaultProtected || !isUnlocked) { setVaultContent(null); return; }
    decrypt('infrastructure', String(item.id), 'content').then(v => setVaultContent(v));
  }, [isUnlocked, isVaultProtected, item?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const rawContent = isVaultProtected ? (vaultContent ?? '') : (item?.content ?? '');
  const displayContent = rawContent === 'vault:encrypted' ? '' : rawContent;
  const allLines = displayContent.split('\n');
  const linesToShow = isEnv && !revealed ? allLines.map(maskEnvLine) : allLines;

  if (isLoading) {
    return (
      <PageLayout top={<div className="id-skeleton-block id-skeleton-head" />}>
        <div className="id-layout">
          <div className="id-main">
            <div className="id-skeleton-block" style={{ height: 320 }} />
          </div>
          <div className="id-sidebar">
            <div className="id-skeleton-block" style={{ height: 160 }} />
            <div className="id-skeleton-block" style={{ height: 100 }} />
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
          icon={LucideServer}
          title="Config not found"
          subtitle="This infrastructure item may have been deleted."
          action={<Button onClick={() => router.push('/infrastructure')}>Back to infrastructure</Button>}
        />
        <style>{CSS}</style>
      </PageLayout>
    );
  }

  const typeConfig = INFRA_TYPES[item.infraType];
  const badgeVar = INFRA_BADGE_VARIANT[item.infraType] ?? 'default';

  const sshCmd = `ssh ${item.metadata?.username || 'user'}@${item.metadata?.host}${item.metadata?.port ? ` -p ${item.metadata.port}` : ''}`;
  const connStr = `${item.metadata?.engine ?? 'db'}://${item.metadata?.host ?? 'host'}${item.metadata?.port ? `:${item.metadata.port}` : ''}${item.metadata?.database ? `/${item.metadata.database}` : ''}`;

  return (
    <>
      <style>{CSS}</style>
      <PageLayout
        top={
          <>
            <nav className="id-crumbs">
              <Link href="/infrastructure">Infrastructure</Link>
              <LucideChevronRight width={12} />
              <span>{typeConfig?.label}</span>
              <LucideChevronRight width={12} />
              <span className="id-crumb-current">{item.title}</span>
            </nav>

            <div className="id-head">
              <div className="id-head-main">
                <div className="id-head-badges">
                  <Badge variant={badgeVar}>{typeConfig?.label ?? item.infraType}</Badge>
                  {item.metadata?.environment && (
                    <Badge
                      variant={
                        item.metadata.environment === 'production'
                          ? 'danger'
                          : item.metadata.environment === 'staging'
                            ? 'warning'
                            : 'default'
                      }
                    >
                      {item.metadata.environment}
                    </Badge>
                  )}
                  <button
                    className={['id-fav-chip', item.isFavorite ? 'id-fav-chip--active' : ''].filter(Boolean).join(' ')}
                    onClick={() => toggleFav.mutate(item.id)}
                    disabled={toggleFav.isPending}
                    type="button"
                  >
                    <LucideStar width={13} />
                    {item.isFavorite ? 'Favorite' : 'Add to favorites'}
                  </button>
                </div>
                <h1 className="id-title">{item.title}</h1>
                {item.description && <p className="id-desc">{item.description}</p>}
              </div>

              <div className="id-actions">
                {!(isEnv && isEnabled && !isUnlocked) && (
                  <CopyButton text={displayContent} label="Copy" />
                )}
                <Button variant="secondary" leftIcon={LucidePencil} onClick={() => handleEdit(item)}>Edit</Button>
                <Button variant="danger" leftIcon={LucideTrash2} onClick={() => setConfirmDelete(true)}>Delete</Button>
              </div>
            </div>
          </>
        }
      >
        <div className="id-layout">
          {/* ── Left column ── */}
          <div className="id-main">
            <div className="id-code-block">
              <VaultGuard enabled={isEnv && isEnabled}>
                <div className="id-code-bar">
                  <span className="id-code-bar-label">{CONTENT_BAR_LABELS[item.infraType]}</span>
                  <div className="id-code-bar-actions">
                    {isEnv && (
                      <button
                        className="id-reveal-btn"
                        onClick={() => setRevealed((p) => !p)}
                        type="button"
                        aria-label={revealed ? "Mask values" : "Reveal values"}
                      >
                        {revealed ? <LucideEyeOff width={12} /> : <LucideEye width={12} />}
                        {revealed ? 'Mask' : 'Reveal'}
                      </button>
                    )}
                  </div>
                </div>
                <div className="id-code-scroll">
                  <CodeBlock code={linesToShow.join('\n')} language={CONTENT_LANGUAGES[item.infraType]} />
                </div>
              </VaultGuard>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="id-sidebar">
            <div className="id-meta-card">
              <h3 className="id-meta-title">Details</h3>
              <div className="id-meta-row">
                <span className="id-meta-key">Type</span>
                <span className="id-meta-val">{typeConfig?.label}</span>
              </div>
              {item.category && (
                <div className="id-meta-row">
                  <span className="id-meta-key">Category</span>
                  <span className="id-meta-val">{item.category.name}</span>
                </div>
              )}
              {renderTypeRows(item)}
              <div className="id-meta-row">
                <span className="id-meta-key">Created</span>
                <span className="id-meta-val">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="id-meta-row">
                <span className="id-meta-key">Updated</span>
                <span className="id-meta-val">{new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {item.infraType === 'server' && item.metadata?.host && (
              <div className="id-meta-card">
                <h3 className="id-meta-title">Connection</h3>
                <div className="id-conn-row">
                  <code className="id-conn-cmd">{sshCmd}</code>
                  <CopyButton text={sshCmd} size="sm" />
                </div>
              </div>
            )}

            {item.infraType === 'config' && (item.metadata?.host || item.metadata?.database) && (
              <div className="id-meta-card">
                <h3 className="id-meta-title">Database</h3>
                <div className="id-conn-row">
                  <code className="id-conn-cmd">{connStr}</code>
                  <CopyButton text={connStr} size="sm" />
                </div>
              </div>
            )}

            {!!item.tags?.length && (
              <div className="id-meta-card">
                <h3 className="id-meta-title">Tags</h3>
                <TagSection tags={item.tags} />
              </div>
            )}

            {!!projects?.length && (
              <div className="id-meta-card">
                <h3 className="id-meta-title">In projects</h3>
                {projects.map((p) => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="id-project-row">
                    <span>{p.emoji || '📁'}</span>
                    <span>{p.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageLayout>

      {/* ── Modals ── */}
      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title="Edit config" size="lg">
        <InfraForm item={item} onClose={() => setFormOpen(false)} />
      </Modal>

      <ConfirmDeleteModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        itemName={item.title}
        isLoading={deleteInfra.isPending}
        onConfirm={() => deleteInfra.mutate(item.id, { onSuccess: () => router.push('/infrastructure') })}
      />

      <MultiProjectEditWarning
        isOpen={isWarnOpen}
        projectNames={projectNames}
        onConfirm={confirmEdit}
        onCancel={cancelEdit}
      />
    </>
  );
}

const CSS = `
/* Breadcrumb */
.id-crumbs {
  display: flex; align-items: center; gap: 6px;
  font-size: var(--text-xs); color: var(--text-tertiary);
}
.id-crumbs a { color: var(--text-tertiary); text-decoration: none; transition: color var(--transition-fast); }
.id-crumbs a:hover { color: var(--text-primary); }
.id-crumbs svg { flex-shrink: 0; opacity: 0.6; }
.id-crumb-current {
  color: var(--text-secondary); font-weight: 500;
  max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* Head */
.id-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 20px; flex-wrap: wrap;
}
.id-head-main { display: flex; flex-direction: column; gap: 8px; min-width: 0; flex: 1; }
.id-head-badges { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.id-fav-chip {
  display: flex; align-items: center; gap: 5px;
  height: 24px; padding: 0 10px;
  background: var(--bg-overlay); border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  color: var(--text-tertiary); font-size: var(--text-xs); font-family: var(--font-sans); font-weight: 500;
  cursor: pointer; transition: all var(--transition-fast);
}
.id-fav-chip:hover { border-color: var(--border-strong); color: var(--text-secondary); }
.id-fav-chip--active { background: var(--warning-muted); border-color: rgba(245,158,11,0.3); color: #fbbf24; }
.id-title { font-size: clamp(var(--text-xl), 2vw, var(--text-3xl)); font-weight: 700; color: var(--text-primary); margin: 0; letter-spacing: -0.02em; }
.id-desc  { font-size: var(--text-sm); color: var(--text-secondary); margin: 0; line-height: var(--leading-relaxed); }
.id-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex-shrink: 0; }

/* Layout */
.id-layout {
  display: grid;
  grid-template-columns: minmax(0,1fr) 310px;
  gap: 24px;
  align-items: start;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}
@media (max-width: 860px) {
  .id-layout { grid-template-columns: 1fr; }
}

.id-main { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

/* Code block */
.id-code-block {
  background: var(--bg-surface); border: 1px solid var(--border-default);
  border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm);
}
.id-code-bar {
  display: flex; align-items: center; justify-content: space-between;
  min-height: 38px; padding: 8px 16px; border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
}
.id-code-bar-label { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; color: var(--text-secondary); }
.id-code-bar-actions { display: flex; align-items: center; gap: 8px; }
.id-code-scroll { max-height: min(64vh, 720px); overflow: auto; background: var(--code-bg); }
.id-code-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
.id-code-scroll::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }

.id-reveal-btn {
  display: flex; align-items: center; gap: 4px;
  font-size: 10px; font-family: var(--font-sans); font-weight: 500;
  color: var(--text-tertiary);
  background: var(--bg-overlay); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 2px 8px; cursor: pointer;
  transition: color var(--transition-fast), background var(--transition-fast);
}
.id-reveal-btn:hover { color: var(--text-primary); background: var(--bg-subtle); }

/* Sidebar */
.id-sidebar { display: flex; flex-direction: column; gap: 14px; position: sticky; top: 0; }
.id-meta-card {
  background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-lg);
  padding: 16px; display: flex; flex-direction: column; gap: 11px; box-shadow: var(--shadow-sm);
}
.id-meta-title {
  font-size: var(--text-xs); font-weight: 600; color: var(--text-tertiary);
  text-transform: uppercase; letter-spacing: 0.06em; margin: 0;
}
.id-meta-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: var(--text-sm); padding-bottom: 9px; border-bottom: 1px solid var(--border-subtle); }
.id-meta-row:last-child { padding-bottom: 0; border-bottom: 0; }
.id-meta-key { color: var(--text-tertiary); }
.id-meta-val { color: var(--text-primary); font-weight: 500; text-align: right; }

.id-conn-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.id-conn-cmd { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary); word-break: break-all; }

.id-project-row {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 8px; border-radius: var(--radius-md);
  color: var(--text-secondary); font-size: var(--text-sm); text-decoration: none;
  transition: background var(--transition-fast), color var(--transition-fast);
}
.id-project-row:hover { background: var(--bg-overlay); color: var(--text-primary); }

/* Skeleton */
.id-skeleton-head  { height: 90px; }
.id-skeleton-block {
  background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);
  animation: id-skeleton-pulse 1.5s ease-in-out infinite;
}
@keyframes id-skeleton-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

@media (max-width: 860px) {
  .id-sidebar { position: static; }
}

@media (max-width: 639px) {
  .id-crumbs > span:not(.id-crumb-current),
  .id-crumbs > svg:first-of-type { display: none; }
  .id-crumb-current { max-width: min(68vw, 260px); }
  .id-head { gap: 12px; }
  .id-head-main { gap: 6px; }
  .id-title { font-size: var(--text-xl); line-height: 1.25; }
  .id-desc { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
  .id-actions {
    width: 100%; flex-wrap: nowrap; gap: 6px; overflow-x: auto;
    padding: 2px 0 4px; scrollbar-width: none;
  }
  .id-actions::-webkit-scrollbar { display: none; }
  .id-layout { gap: 12px; }
  .id-main, .id-sidebar { gap: 12px; }
  .id-code-block, .id-meta-card { border-radius: var(--radius-md); box-shadow: none; }
  .id-code-scroll {
    max-height: min(42dvh, 320px);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .id-code-scroll pre { padding: 12px !important; font-size: 10px !important; }
  .id-meta-card { padding: 13px; }
  .id-conn-row { align-items: flex-start; }
}
`;
