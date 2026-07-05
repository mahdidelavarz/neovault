"use client";

import { useState } from "react";
import Link from "next/link";
import { type RecentItem } from "@/features/dashboard/hooks/useDashboard";
import {
  SolarLinkMinimalisticBold,
  SolarNotesLineDuotone,
  SolarCodeSquareLineDuotone,
  FluentPrompt16Regular,
  SolarServerSquareCloudLinear,
  LucideStar,
  LucidePin,
  LucideCopy,
  LucideCheck,
  SolarClockCircleLineDuotone,
  SolarBoltLineDuotone,
  LucideChevronDown,
  LucideChevronUp,
} from "@/Icons/Icons";

const TYPE_META: Record<RecentItem["type"], { icon: typeof SolarLinkMinimalisticBold; color: string; href: string }> = {
  link:           { icon: SolarLinkMinimalisticBold,   color: "var(--type-link)",    href: "/links"          },
  note:           { icon: SolarNotesLineDuotone,       color: "var(--type-note)",    href: "/notes"          },
  snippet:        { icon: SolarCodeSquareLineDuotone,  color: "var(--type-snippet)", href: "/snippets"        },
  prompt:         { icon: FluentPrompt16Regular,        color: "var(--type-prompt)",  href: "/prompts"         },
  infrastructure: { icon: SolarServerSquareCloudLinear, color: "var(--type-infra)",  href: "/infrastructure"  },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDetail(item: RecentItem): string {
  switch (item.type) {
    case "link":
      try { return new URL(item.url ?? "").hostname.replace("www.", ""); }
      catch { return item.url ?? ""; }
    case "snippet":
      return item.language ? item.language.toUpperCase() : (item.snippetType ?? "Snippet");
    case "prompt":
      return item.promptType ?? "Prompt";
    case "infrastructure":
      return item.infraType ?? "Infra";
    case "note":
    default:
      return item.category ?? "";
  }
}

function RecentCard({ item }: { item: RecentItem }) {
  const meta = TYPE_META[item.type] ?? TYPE_META.link;
  const Icon = meta.icon;
  const [copied, setCopied] = useState(false);
  const detail = getDetail(item);
  const copyValue = item.type === "link" ? item.url : item.content;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!copyValue) return;
    navigator.clipboard.writeText(copyValue).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Link href={meta.href} className="rag-card">
      <div className="rag-card-top">
        <Icon width={22} height={22} className="rag-card-icon" style={{ color: meta.color }} />
        <div className="rag-card-info">
          <p className="rag-card-title">{item.title}</p>
          {detail && <p className="rag-card-detail">{detail}</p>}
        </div>
        {item.isFavorite && <LucideStar width={11} className="rag-card-badge rag-card-badge--star" />}
        {item.isPinned && <LucidePin width={11} className="rag-card-badge rag-card-badge--pin" />}
      </div>
      <div className="rag-card-footer">
        <span className="rag-card-time">{timeAgo(item.updatedAt)}</span>
        {copyValue && (
          <button
            className={["rag-card-copy", copied ? "rag-card-copy--copied" : ""].filter(Boolean).join(" ")}
            onClick={handleCopy}
            type="button"
            aria-label="Copy"
            title={copied ? "Copied!" : "Copy"}
          >
            {copied ? <LucideCheck width={12} /> : <LucideCopy width={12} />}
          </button>
        )}
      </div>
    </Link>
  );
}

interface RecentActivityGridProps {
  items: RecentItem[];
  isLoading: boolean;
}

export default function RecentActivityGrid({ items, isLoading }: RecentActivityGridProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = items.slice(0, 16);

  return (
    <>
      <style>{CSS}</style>
      <div className="rag-section dp-card">
        <div className="dp-card-header">
          <SolarBoltLineDuotone width={14} className="dp-card-header-icon" />
          <h2 className="dp-card-title">Recent activity</h2>
        </div>

        {isLoading ? (
          <div className="rag-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rag-card-skel">
                <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="skeleton" style={{ height: 12, width: "70%", marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 10, width: "40%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="rag-empty">
            <SolarClockCircleLineDuotone width={28} />
            <p>No recent activity yet.</p>
            <span>Start by adding a link, snippet, or prompt.</span>
          </div>
        ) : (
          <>
            <div className={["rag-grid", expanded ? "" : "collapsed"].filter(Boolean).join(" ")}>
              {visibleItems.map((item, idx) => (
                <RecentCard key={`${item.type}-${item.id}-${idx}`} item={item} />
              ))}
            </div>
            {visibleItems.length > 2 && (
              <button className="rag-more" type="button" onClick={() => setExpanded((p) => !p)}>
                {expanded ? <>See less <LucideChevronUp width={14} /></> : <>See more <LucideChevronDown width={14} /></>}
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}

const CSS = `
.rag-section { display: flex; flex-direction: column; }

.rag-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 12px 16px;
}
.rag-grid.collapsed > *:nth-child(n+3) { display: none; }

@media (min-width: 640px) {
  .rag-grid { grid-template-columns: repeat(2, 1fr); }
  .rag-grid.collapsed > *:nth-child(n+3) { display: flex; }
  .rag-grid.collapsed > *:nth-child(n+5) { display: none; }
}
@media (min-width: 1024px) {
  .rag-grid { grid-template-columns: repeat(3, 1fr); }
  .rag-grid.collapsed > *:nth-child(n+5) { display: flex; }
  .rag-grid.collapsed > *:nth-child(n+7) { display: none; }
}
@media (min-width: 1440px) {
  .rag-grid { grid-template-columns: repeat(4, 1fr); }
  .rag-grid.collapsed > *:nth-child(n+7) { display: flex; }
  .rag-grid.collapsed > *:nth-child(n+9) { display: none; }
}

.rag-card {
  display:         flex;
  flex-direction:  column;
  gap:             8px;
  padding:         10px 12px;
  background:      var(--bg-subtle);
  border:          1px solid var(--border-subtle);
  border-radius:   var(--radius-md);
  text-decoration: none;
  transition:      border-color var(--transition-fast), background var(--transition-fast);
  min-width:       0;
}
.rag-card:hover { border-color: var(--border-strong); background: var(--bg-overlay); }

.rag-card-top { display: flex; align-items: flex-start; gap: 8px; min-width: 0; }
.rag-card-icon {
  flex-shrink: 0;
  margin-top:  1px;
}
.rag-card-info  { flex: 1; min-width: 0; }
.rag-card-title {
  font-size: var(--text-sm); font-weight: 500; color: var(--text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color var(--transition-fast);
}
.rag-card:hover .rag-card-title { color: var(--primary); }
.rag-card-detail {
  font-size: var(--text-xs); color: var(--text-tertiary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;
}
.rag-card-badge { flex-shrink: 0; margin-top: 2px; }
.rag-card-badge--star { color: #f59e0b; }
.rag-card-badge--pin  { color: var(--text-tertiary); }

.rag-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.rag-card-time { font-size: var(--text-xs); color: var(--text-tertiary); white-space: nowrap; }
.rag-card-copy {
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: none; color: var(--text-tertiary);
  cursor: pointer; padding: 2px; border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}
.rag-card-copy:hover { color: var(--text-primary); }
.rag-card-copy--copied { color: var(--success); }

.rag-card-skel {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
}

.rag-more {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  margin: 4px 16px 12px;
  padding: 8px;
  background: transparent;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--text-xs); font-weight: 500;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}
.rag-more:hover { background: var(--bg-overlay); color: var(--text-primary); }

.rag-empty {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 48px 24px; color: var(--text-tertiary); text-align: center;
}
.rag-empty p    { font-size: var(--text-sm); font-weight: 500; color: var(--text-secondary); margin: 0; }
.rag-empty span { font-size: var(--text-xs); }
`;
