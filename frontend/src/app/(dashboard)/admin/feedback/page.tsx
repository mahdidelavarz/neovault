"use client";

import Badge, { type BadgeVariant } from "@/features/shared/ui/Badge";
import { useAdminFeedback } from "@/features/feedback/hooks/useFeedback";
import { type FeedbackType } from "@/features/feedback/types/feedback";
import { SolarChatLineDuotone } from "@/Icons/Icons";

const TYPE_META: Record<FeedbackType, { label: string; variant: BadgeVariant }> = {
  bug: { label: "Bug", variant: "danger" },
  feature: { label: "Feature", variant: "cyan" },
  comment: { label: "Comment", variant: "default" },
};

export default function AdminFeedbackPage() {
  const { data, isLoading, error } = useAdminFeedback();

  return (
    <div className="afb-page">
      <style>{CSS}</style>

      <div className="afb-header">
        <div className="afb-header-icon">
          <SolarChatLineDuotone width={20} />
        </div>
        <div>
          <h1 className="afb-title">Feedback</h1>
          <p className="afb-subtitle">Bug reports, feature requests and comments from users</p>
        </div>
      </div>

      {error ? (
        <div className="afb-card afb-denied">
          <p>Access denied.</p>
        </div>
      ) : isLoading ? (
        <div className="afb-card">
          <p className="afb-muted">Loading…</p>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="afb-card">
          <p className="afb-muted">No feedback submitted yet.</p>
        </div>
      ) : (
        <div className="afb-table-wrap">
          <table className="afb-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Message</th>
                <th>User</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const meta = TYPE_META[item.type] ?? TYPE_META.comment;
                return (
                  <tr key={item.id}>
                    <td>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </td>
                    <td className="afb-message">{item.message}</td>
                    <td>
                      <div className="afb-user-cell">
                        <span className="afb-username">{item.user?.username ?? `#${item.userId}`}</span>
                        {item.user?.email && <span className="afb-email">{item.user.email}</span>}
                      </div>
                    </td>
                    <td className="afb-date">{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const CSS = `
.afb-page {
  display:        flex;
  flex-direction: column;
  gap:            16px;
  padding:        24px;
  overflow-y:     auto;
  flex:           1;
}

.afb-header {
  display:     flex;
  align-items: center;
  gap:         12px;
}
.afb-header-icon {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           40px;
  height:          40px;
  background:      var(--accent-muted);
  border:          1px solid var(--accent-border);
  border-radius:   var(--radius-lg);
  color:           var(--cyan-400);
  flex-shrink:     0;
}
.afb-title    { font-size: var(--text-xl); font-weight: 700; color: var(--text-primary); }
.afb-subtitle { font-size: var(--text-sm); color: var(--text-tertiary); margin-top: 2px; }

.afb-card {
  background:    var(--bg-surface);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding:       20px;
}
.afb-muted  { color: var(--text-tertiary); }
.afb-denied { color: var(--text-secondary); }

.afb-table-wrap {
  background:    var(--bg-surface);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow-x:    auto;
}
.afb-table {
  width:           100%;
  border-collapse: collapse;
  font-size:       var(--text-sm);
}
.afb-table th, .afb-table td {
  padding:    10px 14px;
  text-align: left;
  vertical-align: top;
}
.afb-table th {
  color:           var(--text-tertiary);
  font-weight:     600;
  font-size:       var(--text-xs);
  text-transform:  uppercase;
  letter-spacing:  0.05em;
  border-bottom:   1px solid var(--border-default);
  white-space:     nowrap;
}
.afb-table tbody tr:not(:last-child) td {
  border-bottom: 1px solid var(--border-subtle);
}
.afb-message  { color: var(--text-primary); white-space: pre-wrap; max-width: 480px; line-height: var(--leading-relaxed); }
.afb-user-cell { display: flex; flex-direction: column; }
.afb-username  { color: var(--text-primary); font-weight: 500; }
.afb-email     { color: var(--text-tertiary); font-size: var(--text-xs); }
.afb-date      { color: var(--text-tertiary); white-space: nowrap; }
`;
