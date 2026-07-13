"use client";

import { useMemo } from "react";
import type { ComponentType } from "react";
import { useAdminOverview, useMakeUserAdmin, type AdminActivityEvent, type AdminUserOverview } from "@/features/admin/hooks/useAdminOverview";
import {
  LucideBarChart3,
  LucideClock,
  LucideEye,
  LucideFileText,
  LucideList,
  LucideRadio,
  LucideShield,
  LucideShieldCheck,
  LucideUser,
  LucideZap,
} from "@/Icons/Icons";

const CONTENT_COLUMNS: { key: keyof AdminUserOverview; label: string }[] = [
  { key: "linksCount", label: "Links" },
  { key: "notesCount", label: "Notes" },
  { key: "snippetsCount", label: "Snippets" },
  { key: "promptsCount", label: "Prompts" },
  { key: "apiCollectionsCount", label: "API" },
  { key: "infrastructureCount", label: "Infra" },
  { key: "projectsCount", label: "Projects" },
];

function formatDate(value?: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatJoined(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function timeAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function contentTotal(user: AdminUserOverview) {
  return CONTENT_COLUMNS.reduce((sum, col) => sum + Number(user[col.key] ?? 0), 0);
}

function eventTone(type: AdminActivityEvent["type"]) {
  if (type === "login") return "auth";
  if (type === "app_open") return "open";
  if (type === "delete") return "danger";
  if (type === "create") return "create";
  if (type === "update" || type === "favorite") return "update";
  return "neutral";
}

export default function AdminPage() {
  const { data, isLoading, error } = useAdminOverview();
  const makeUserAdmin = useMakeUserAdmin();

  const totals = useMemo(() => {
    const users = data?.users ?? [];
    return {
      content: users.reduce((sum, user) => sum + contentTotal(user), 0),
      actions: users.reduce((sum, user) => sum + user.actionCount, 0),
      activeUsers: users.filter((user) => user.lastSeenAt).length,
    };
  }, [data?.users]);

  return (
    <div className="admin-page">
      <style>{CSS}</style>

      <header className="admin-hero">
        <div className="admin-hero-icon">
          <LucideShield width={22} />
        </div>
        <div className="admin-hero-copy">
          <h1>Admin Operations</h1>
          <p>User engagement, login history, app opens, and recent activity across the vault.</p>
        </div>
      </header>

      {error ? (
        <section className="admin-state admin-state--denied">
          <LucideShield width={22} />
          <div>
            <strong>Access denied</strong>
            <span>This page is available to admin users only.</span>
          </div>
        </section>
      ) : isLoading ? (
        <section className="admin-state">
          <LucideClock width={22} />
          <div>
            <strong>Loading admin data</strong>
            <span>Collecting user and activity metrics.</span>
          </div>
        </section>
      ) : (
        <>
          <section className="admin-kpis">
            <Metric icon={LucideUser} label="Total users" value={data?.totalUsers ?? 0} hint={`${totals.activeUsers} with activity`} tone="cyan" />
            <Metric icon={LucideEye} label="App opens today" value={data?.appOpensToday ?? 0} hint="Tracked once per browser tab" tone="green" />
            <Metric icon={LucideZap} label="Logins today" value={data?.loginsToday ?? 0} hint={`${data?.totalEvents ?? 0} lifetime events`} tone="amber" />
            <Metric icon={LucideFileText} label="Vault items" value={totals.content} hint={`${totals.actions} recorded actions`} tone="rose" />
          </section>

          <section className="admin-grid">
            <div className="admin-panel admin-panel--users">
              <div className="admin-panel-head">
                <div>
                  <h2>User Activity</h2>
                  <p>Open frequency, login cadence, content size, and last seen timestamps.</p>
                </div>
                <span className="admin-pill"><LucideBarChart3 width={13} /> {data?.eventsToday ?? 0} today</span>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Joined</th>
                      <th>App opens</th>
                      <th>Logins</th>
                      <th>Actions</th>
                      <th>Last login</th>
                      <th>Last seen</th>
                      <th>Items</th>
                      <th>Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.users.map((user) => (
                      <tr key={user.id}>
                        <td data-label="User">
                          <div className="admin-user-cell">
                            <span className="admin-avatar">{user.username?.slice(0, 1).toUpperCase() || "U"}</span>
                            <span>
                              <strong>{user.username}</strong>
                              {user.email && <small>{user.email}</small>}
                            </span>
                          </div>
                        </td>
                        <td data-label="Joined">{formatJoined(user.createdAt)}</td>
                        <td data-label="App opens">{user.appOpenCount}</td>
                        <td data-label="Logins">{user.loginCount}</td>
                        <td data-label="Actions">{user.actionCount}</td>
                        <td data-label="Last login">{formatDate(user.lastLoginAt)}</td>
                        <td data-label="Last seen">{formatDate(user.lastSeenAt)}</td>
                        <td data-label="Items">
                          <span className="admin-items-total">{contentTotal(user)}</span>
                        </td>
                        <td data-label="Admin">
                          {user.isAdmin ? (
                            <span className="admin-role-badge">
                              <LucideShieldCheck width={13} />
                              Admin
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="admin-promote-btn"
                              disabled={makeUserAdmin.isPending}
                              onClick={() => makeUserAdmin.mutate(user.id)}
                            >
                              <LucideShieldCheck width={13} />
                              Make admin
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="admin-panel admin-panel--activity">
              <div className="admin-panel-head admin-panel-head--compact">
                <div>
                  <h2>Recent Activity</h2>
                  <p>Latest tracked events.</p>
                </div>
                <LucideRadio width={18} />
              </div>

              <div className="admin-activity-list">
                {data?.recentActivity?.length ? data.recentActivity.map((event) => (
                  <div className="admin-activity" key={event.id}>
                    <span className={`admin-event-dot admin-event-dot--${eventTone(event.type)}`} />
                    <div className="admin-activity-body">
                      <div className="admin-activity-top">
                        <strong>{event.user.username}</strong>
                        <time>{timeAgo(event.createdAt)}</time>
                      </div>
                      <p>{event.action}</p>
                      <div className="admin-activity-meta">
                        <span>{event.module}</span>
                        <span>{event.method}</span>
                        <span>{formatDate(event.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="admin-empty">
                    <LucideList width={20} />
                    <span>No activity has been recorded yet.</span>
                  </div>
                )}
              </div>
            </aside>
          </section>
        </>
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: ComponentType<{ width?: number }>;
  label: string;
  value: number;
  hint: string;
  tone: "cyan" | "green" | "amber" | "rose";
}) {
  return (
    <div className={`admin-metric admin-metric--${tone}`}>
      <div className="admin-metric-icon"><Icon width={18} /></div>
      <div>
        <span className="admin-metric-label">{label}</span>
        <strong className="admin-metric-value">{value.toLocaleString()}</strong>
        <span className="admin-metric-hint">{hint}</span>
      </div>
    </div>
  );
}

const CSS = `
.admin-page {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 22px 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.admin-hero {
  display: flex;
  align-items: center;
  gap: 14px;
}
.admin-hero-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--accent) 13%, transparent);
  border: 1px solid var(--accent-border);
  color: var(--cyan-400);
}
.admin-hero-copy h1 {
  margin: 0;
  font-size: var(--text-2xl);
  color: var(--text-primary);
  font-weight: 700;
}
.admin-hero-copy p {
  margin: 3px 0 0;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}
.admin-state {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
}
.admin-state strong,
.admin-state span { display: block; }
.admin-state strong { color: var(--text-primary); margin-bottom: 2px; }
.admin-state--denied { border-color: color-mix(in srgb, var(--danger) 35%, var(--border-default)); }
.admin-kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 12px;
}
.admin-metric {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
.admin-metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}
.admin-metric--cyan .admin-metric-icon { color: var(--cyan-400); background: rgba(34, 211, 238, 0.1); }
.admin-metric--green .admin-metric-icon { color: #34d399; background: rgba(52, 211, 153, 0.1); }
.admin-metric--amber .admin-metric-icon { color: #fbbf24; background: rgba(251, 191, 36, 0.1); }
.admin-metric--rose .admin-metric-icon { color: #fb7185; background: rgba(251, 113, 133, 0.1); }
.admin-metric-label,
.admin-metric-hint {
  display: block;
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}
.admin-metric-value {
  display: block;
  margin: 2px 0;
  color: var(--text-primary);
  font-size: var(--text-2xl);
}
.admin-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 16px;
  align-items: start;
}
.admin-panel {
  min-width: 0;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
.admin-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--border-subtle);
}
.admin-panel-head h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-md);
  font-weight: 700;
}
.admin-panel-head p {
  margin: 3px 0 0;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}
.admin-panel-head--compact { align-items: center; }
.admin-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px;
  border-radius: var(--radius-full);
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  white-space: nowrap;
}
.admin-table-wrap { overflow-x: auto; }
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}
.admin-table th,
.admin-table td {
  padding: 12px 14px;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid var(--border-subtle);
}
.admin-table th {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
}
.admin-table tbody tr:hover td { background: var(--bg-elevated); }
.admin-table tbody tr:last-child td { border-bottom: 0; }
.admin-user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.admin-user-cell strong {
  display: block;
  color: var(--text-primary);
  font-weight: 600;
}
.admin-user-cell small {
  display: block;
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}
.admin-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  font-size: var(--text-xs);
  font-weight: 700;
}
.admin-items-total {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 24px;
  padding: 0 8px;
  border-radius: var(--radius-full);
  color: var(--accent);
  background: var(--accent-muted);
  border: 1px solid var(--accent-border);
  font-size: var(--text-xs);
  font-weight: 700;
}
.admin-role-badge,
.admin-promote-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 28px;
  padding: 0 10px;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: 600;
  white-space: nowrap;
}
.admin-role-badge {
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.22);
}
.admin-promote-btn {
  color: var(--text-primary);
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
}
.admin-promote-btn:hover:not(:disabled) {
  color: var(--accent);
  background: var(--accent-muted);
  border-color: var(--accent-border);
}
.admin-promote-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.admin-activity-list {
  max-height: calc(100dvh - 265px);
  overflow-y: auto;
  padding: 8px;
}
.admin-activity {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr);
  gap: 10px;
  padding: 10px;
  border-radius: var(--radius-md);
}
.admin-activity:hover { background: var(--bg-elevated); }
.admin-event-dot {
  width: 9px;
  height: 9px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--text-tertiary);
}
.admin-event-dot--auth { background: #fbbf24; }
.admin-event-dot--open { background: #34d399; }
.admin-event-dot--create { background: var(--cyan-400); }
.admin-event-dot--update { background: #a78bfa; }
.admin-event-dot--danger { background: var(--danger); }
.admin-activity-body { min-width: 0; }
.admin-activity-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.admin-activity-top strong {
  color: var(--text-primary);
  font-size: var(--text-sm);
}
.admin-activity-top time {
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  white-space: nowrap;
}
.admin-activity p {
  margin: 2px 0 6px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.4;
}
.admin-activity-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.admin-activity-meta span {
  padding: 2px 7px;
  border-radius: var(--radius-full);
  background: var(--bg-overlay);
  color: var(--text-tertiary);
  font-size: 11px;
}
.admin-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}
@media (max-width: 1180px) {
  .admin-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .admin-grid { grid-template-columns: 1fr; }
  .admin-activity-list { max-height: none; }
}
@media (max-width: 639px) {
  .admin-page { padding: 14px 12px 18px; gap: 12px; }
  .admin-hero { align-items: flex-start; }
  .admin-hero-icon { width: 38px; height: 38px; }
  .admin-hero-copy h1 { font-size: var(--text-xl); }
  .admin-hero-copy p { font-size: var(--text-xs); line-height: 1.45; }
  .admin-kpis { grid-template-columns: 1fr; }
  .admin-metric { padding: 13px; border-radius: var(--radius-md); }
  .admin-metric-icon { width: 32px; height: 32px; }
  .admin-metric-value { font-size: var(--text-xl); }
  .admin-grid { gap: 12px; }
  .admin-panel { border-radius: var(--radius-md); box-shadow: none; }
  .admin-panel-head { padding: 14px; flex-direction: column; }
  .admin-panel-head h2 { font-size: var(--text-sm); }
  .admin-panel-head p { font-size: var(--text-xs); line-height: 1.45; }
  .admin-pill { height: 24px; }
  .admin-table-wrap {
    overflow: visible;
    padding: 10px;
  }
  .admin-table,
  .admin-table thead,
  .admin-table tbody,
  .admin-table tr,
  .admin-table td {
    display: block;
    width: 100%;
  }
  .admin-table thead { display: none; }
  .admin-table tbody {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .admin-table tr {
    padding: 12px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
  }
  .admin-table tbody tr:hover td { background: transparent; }
  .admin-table td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-subtle);
    white-space: normal;
    text-align: right;
    color: var(--text-secondary);
  }
  .admin-table td::before {
    content: attr(data-label);
    color: var(--text-tertiary);
    font-size: var(--text-xs);
    font-weight: 600;
    text-transform: uppercase;
    text-align: left;
    flex-shrink: 0;
  }
  .admin-table td:first-child {
    align-items: flex-start;
    padding-top: 0;
  }
  .admin-table td:first-child::before { display: none; }
  .admin-table td:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
  .admin-user-cell {
    width: 100%;
    align-items: flex-start;
  }
  .admin-user-cell span:last-child {
    min-width: 0;
  }
  .admin-user-cell strong,
  .admin-user-cell small {
    overflow-wrap: anywhere;
  }
  .admin-role-badge,
  .admin-promote-btn {
    width: min(160px, 52vw);
  }
  .admin-activity-list { padding: 6px; }
  .admin-activity {
    grid-template-columns: 10px minmax(0, 1fr);
    padding: 9px 8px;
  }
  .admin-activity-top {
    align-items: flex-start;
    flex-direction: column;
    gap: 2px;
  }
  .admin-activity p {
    overflow-wrap: anywhere;
  }
  .admin-activity-meta span {
    max-width: 100%;
    overflow-wrap: anywhere;
  }
}
@media (max-width: 380px) {
  .admin-page { padding-inline: 10px; }
  .admin-hero-icon { display: none; }
  .admin-table td {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
    text-align: left;
  }
  .admin-role-badge,
  .admin-promote-btn {
    width: 100%;
  }
}
`;
