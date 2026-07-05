"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type Infrastructure, INFRA_TYPES } from "@/features/infrastructure/types/infrastructure";
import { useToggleInfraFavorite } from "@/features/infrastructure/hooks/useInfrastructure";
import { maskEnvLine } from "@/features/infrastructure/utils/infraUtils";
import Badge from "@/features/shared/ui/Badge";
import FavoriteButton from "@/features/shared/components/FavoriteButton";
import CopyButton from "@/features/shared/components/CopyButton";
import TagSection from "@/features/shared/components/TagSection";
import { VaultGuard } from "@/features/settings/security/components/VaultGuard";
import { useVault } from "@/features/settings/security/hooks/useVault";
import ProjectBadge from "@/features/projects/components/ProjectBadge";
import {
  LucideContainer,
  LucideDatabase,
  LucideEye,
  LucideEyeOff,
  LucideGlobe,
  LucideKeyRound,
  LucideNetwork,
  LucideRocket,
  LucideServer,
  LucideSettings,
} from "@/Icons/Icons";

// ─── Type → Iconify icon map ──────────────────────────────────────────────────

const INFRA_ICONS = {
  env: LucideKeyRound,
  server: LucideServer,
  docker: LucideContainer,
  deployment: LucideRocket,
  database: LucideDatabase,
  network: LucideNetwork,
} as const;

type InfraIconKey = keyof typeof INFRA_ICONS;

const INFRA_BADGE_VARIANT: Record<string, any> = {
  env: "cyan",
  server: "purple",
  docker: "cyan",
  deployment: "success",
  database: "warning",
  network: "orange",
};

interface InfraCardProps {
  item: Infrastructure;
}

export default function InfraCard({ item }: InfraCardProps) {
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);
  const [vaultContent, setVaultContent] = useState<string | null>(null);

  const { isEnabled, isUnlocked, decrypt } = useVault();
  const toggleFav = useToggleInfraFavorite();

  const typeConfig = INFRA_TYPES[item.infraType];
  const Icon = INFRA_ICONS[item.infraType as InfraIconKey] ?? (
    <LucideSettings />
  );
  const badgeVar = INFRA_BADGE_VARIANT[item.infraType] ?? "default";
  const isEnv = item.infraType === "env";

  const isVaultProtected = isEnv && isEnabled &&
    (!item.content || item.content === 'vault:encrypted');

  useEffect(() => {
    if (!isVaultProtected || !isUnlocked) { setVaultContent(null); return; }
    decrypt('infrastructure', String(item.id), 'content').then(v => setVaultContent(v));
  }, [isUnlocked, isVaultProtected, item.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Use decrypted content if available; never expose the sentinel string as visible text
  const rawContent = isVaultProtected ? (vaultContent ?? '') : item.content;
  const displayContent = rawContent === 'vault:encrypted' ? '' : rawContent;

  const allLines = displayContent.split("\n");
  const displayLines = isEnv && !revealed ? allLines.map(maskEnvLine) : allLines;

  const goToDetail = () => router.push(`/infrastructure/${item.id}`);

  return (
    <>
      <style>{CSS}</style>
      <div className="ic">
        {/* ── Header ── */}
        <div className="ic-header">
          <div className="ic-icon-wrap">
            <Icon width={16} />
          </div>

          <div className="ic-title-wrap">
            <h3 className="ic-title">{item.title}</h3>
            <div className="ic-meta">
              <Badge variant={badgeVar} size="sm">
                {typeConfig?.label ?? item.infraType}
              </Badge>
              {item.metadata?.environment && (
                <Badge
                  variant={
                    item.metadata.environment === "production"
                      ? "danger"
                      : item.metadata.environment === "staging"
                        ? "warning"
                        : "default"
                  }
                  size="sm"
                >
                  {item.metadata.environment}
                </Badge>
              )}
              {item.metadata?.host && (
                <span className="ic-host">
                  <LucideGlobe width={11} />
                  {item.metadata.host}
                  {item.metadata.port ? `:${item.metadata.port}` : ""}
                </span>
              )}
            </div>
          </div>

          <FavoriteButton
            active={item.isFavorite}
            pending={toggleFav.isPending}
            onToggle={() => toggleFav.mutate(item.id)}
          />
        </div>

        {/* ── Description ── */}
        {item.description && <p className="ic-desc">{item.description}</p>}

        {/* ── Content preview ── */}
        {/* Guard ALL env items when vault is enabled — not just vault-encrypted ones */}
        <VaultGuard enabled={isEnv && isEnabled}>
          <div
            className="ic-code-wrap"
            role="button"
            tabIndex={0}
            onClick={goToDetail}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToDetail() }
            }}
          >
            {/* ENV reveal toggle */}
            {isEnv && (
              <button
                className="ic-reveal-btn"
                onClick={(e) => { e.stopPropagation(); setRevealed((p) => !p) }}
                aria-label={revealed ? "Mask values" : "Reveal values"}
              >
                {revealed ? (
                  <LucideEyeOff width={12} />
                ) : (
                  <LucideEye width={12} />
                )}
                {revealed ? "Mask" : "Reveal"}
              </button>
            )}

            <pre className="ic-code">
              <code>{displayLines.join("\n")}</code>
            </pre>
          </div>
        </VaultGuard>

        {/* ── Tags ── */}
        <TagSection tags={item.tags} category={item.category} />

        {/* ── Footer: copy + actions ── */}
        <div className="ic-footer">
          {!(isEnv && isEnabled && !isUnlocked) && (
            <CopyButton text={displayContent} label="Copy" />
          )}
          <div className="ic-actions">
            <ProjectBadge itemType="infrastructure" itemId={item.id} />
          </div>
        </div>
      </div>
    </>
  );
}

const CSS = `
.ic {
  display:        flex;
  flex-direction: column;
  gap:            12px;
  padding:        16px;
  min-width:      0;          /* respect the grid track; never grow to fit content */
  overflow:       hidden;     /* clip anything that can't shrink (long code lines) */
  background:     var(--bg-surface);
  border:         1px solid var(--border-default);
  border-radius:  var(--radius-lg);
  cursor:         default;
  transition:     border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.ic:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }

/* Header */
.ic-header    { display: flex; align-items: flex-start; gap: 10px;}
.ic-icon-wrap {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           34px; height: 34px;
  background:      var(--accent-muted);
  border:          1px solid var(--accent-border);
  border-radius:   var(--radius-md);
  color:           var(--cyan-400);
  flex-shrink:     0;
}
.ic-title-wrap { flex: 1; min-width: 0; }
.ic-title      { font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 5px; }
.ic-meta       { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; }
.ic-host       { display: flex; align-items: center; gap: 3px; font-size: var(--text-xs); color: var(--text-tertiary); font-family: var(--font-mono); }

/* Description */
.ic-desc {
  font-size: var(--text-xs); color: var(--text-secondary);
  line-height: var(--leading-snug);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

/* Code block */
.ic-code-wrap {
  position:      relative;
  min-width:     0;
  background:    var(--bg-elevated);
  border:        1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow:      hidden;
  cursor:        pointer;
  transition:    border-color var(--transition-fast);
}
.ic-code-wrap:hover { border-color: rgba(255,255,255,0.18); }
.ic-reveal-btn {
  display:     flex;
  align-items: center;
  gap:         4px;
  position:    absolute;
  top:         7px; right: 8px;
  font-size:   10px; font-family: var(--font-sans); font-weight: 500;
  color:       var(--text-tertiary);
  background:  var(--bg-overlay);
  border:      1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding:     2px 8px;
  cursor:      pointer;
  z-index:     1;
  transition:  color var(--transition-fast), background var(--transition-fast);
}
.ic-reveal-btn:hover { color: var(--text-primary); background: var(--bg-subtle); }

.ic-code {
  display:     block;
  padding:     10px 12px;
  margin:      0;
  font-family: var(--font-mono);
  font-size:   var(--text-xs);
  line-height: var(--leading-relaxed);
  color:       var(--cyan-200);
  white-space: pre;
  overflow-x:  auto;
  max-height:  200px;
  overflow-y:  auto;
}
.ic-code::-webkit-scrollbar { width: 4px; height: 4px; }
.ic-code::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }

/* Footer */
.ic-footer {
  display:     flex; align-items: center; gap: 8px;
  padding-top: 12px;
  border-top:  1px solid var(--border-subtle);
}

.ic-actions { display: flex; align-items: center; gap: 4px; margin-left: auto; }

/* Mobile: tighten spacing so cards fit narrow screens */
@media (max-width: 639px) {
  .ic         { padding: 12px; gap: 10px; }
  .ic-code    { max-height: 160px; }
}
`;
