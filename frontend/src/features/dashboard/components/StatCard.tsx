import Link from "next/link";
import {
  SolarLinkMinimalisticBold,
  SolarNotesLineDuotone,
  FluentPrompt16Regular,
  LucideStar,
  LucidePin,
  SolarCodeSquareLineDuotone,
} from "@/Icons/Icons";

interface StatCardProps {
  title: string;
  icon: "link" | "note" | "snippet" | "prompt";
  total: number;
  subStats?: {
    label: string;
    value: number;
    icon: "star" | "pin";
  }[];
  href: string;
  variant: "blue" | "green" | "purple" | "teal";
}

const iconMap = {
  link:    SolarLinkMinimalisticBold,
  note:    SolarNotesLineDuotone,
  snippet: SolarCodeSquareLineDuotone,
  prompt:  FluentPrompt16Regular,
};

const subIconMap = {
  star: LucideStar,
  pin:  LucidePin,
};

const variantStyles = {
  blue: {
    accent: "var(--primary, #3b82f6)",
    muted: "var(--primary-muted, rgba(59,130,246,0.1))",
    text: "var(--primary, #3b82f6)",
  },
  green: {
    accent: "#10b981",
    muted: "rgba(16,185,129,0.1)",
    text: "#10b981",
  },
  purple: {
    accent: "#8b5cf6",
    muted: "rgba(139,92,246,0.1)",
    text: "#8b5cf6",
  },
  teal: {
    accent: "#14b8a6",
    muted: "rgba(20,184,166,0.1)",
    text: "#14b8a6",
  },
};

export default function StatCard({
  title,
  icon,
  total,
  subStats,
  href,
  variant,
}: StatCardProps) {
  const Icon = iconMap[icon];
  const colors = variantStyles[variant];

  return (
    <Link href={href} className="stat-card-link">
      <div className="stat-card">
        <div className="stat-card-header">
          <div
            className="stat-card-icon-wrap"
            style={{
              backgroundColor: colors.muted,
              color: colors.accent,
            }}
          >
            <Icon width={20} />
          </div>
          <span className="stat-card-total" style={{ color: colors.text }}>
            {total}
          </span>
        </div>
        <h3 className="stat-card-title">{title}</h3>

        {subStats && subStats.length > 0 && (
          <div className="stat-card-substats">
            {subStats.map((stat, index) => {
              const SubIcon = subIconMap[stat.icon];
              return (
                <div key={index} className="stat-card-substat">
                  <span className="stat-card-substat-label">
                    <SubIcon width={12} />
                    {stat.label}
                  </span>
                  <span className="stat-card-substat-value">{stat.value}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{CSS}</style>
    </Link>
  );
}

const CSS = `
.stat-card-link { text-decoration: none; }

.stat-card {
  background:    var(--bg-surface);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding:       20px;
  cursor:        pointer;
  transition:    border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.stat-card:hover {
  border-color: var(--border-strong);
  box-shadow:   0 4px 12px rgba(0,0,0,0.06);
}

.stat-card-header {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  margin-bottom:   12px;
}
.stat-card-icon-wrap {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           40px;
  height:          40px;
  border-radius:   var(--radius-lg);
}
.stat-card-total {
  font-size:   var(--text-3xl);
  font-weight: 700;
  line-height: 1;
}
.stat-card-title {
  font-size:     var(--text-base);
  font-weight:   600;
  color:         var(--text-primary);
  margin-bottom: 12px;
  transition:    color var(--transition-fast);
}
.stat-card:hover .stat-card-title { color: var(--primary); }

.stat-card-substats {
  display:        flex;
  flex-direction: column;
  gap:            6px;
  padding-top:    10px;
  border-top:     1px solid var(--border-default);
}
.stat-card-substat {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
}
.stat-card-substat-label {
  display:     flex;
  align-items: center;
  gap:         5px;
  font-size:   var(--text-xs);
  color:       var(--text-tertiary);
}
.stat-card-substat-value {
  font-size:   var(--text-sm);
  font-weight: 600;
  color:       var(--text-secondary);
}
`;