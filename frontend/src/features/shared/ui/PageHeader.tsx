import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
}

/**
 * Standard page header: title + subtitle on the left, action button on the right.
 * Replaces the .page-header / .page-title / .page-subtitle pattern in every module page.
 */
export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <>
      <style>{CSS}</style>
      <div className="ph-header">
        <div className="ph-left">
          <h1 className="ph-title">{title}</h1>
          {subtitle && <p className="ph-subtitle" suppressHydrationWarning>{subtitle}</p>}
        </div>
        {action && <div className="ph-action">{action}</div>}
      </div>
    </>
  );
}

const CSS = `
.ph-header {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  flex-wrap:       wrap;
  gap:             8px;
}
.ph-left { display: flex; flex-direction: column; }
.ph-title {
  font-size:      var(--text-2xl);
  font-weight:    700;
  color:          var(--text-primary);
  letter-spacing: -0.02em;
}
.ph-subtitle {
  font-size:  var(--text-sm);
  color:      var(--text-tertiary);
  margin-top: 2px;
}
@media (max-width: 479px) {
  .ph-title { font-size: var(--text-xl); }
}
`;
