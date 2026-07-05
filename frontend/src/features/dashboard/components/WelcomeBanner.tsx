"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { SolarBarChartLineDuotone, LucideVault } from "@/Icons/Icons";

const QUOTES = [
  "Knowledge is power. Keep it organized! 🚀",
  "Your digital brain, beautifully organized. 🧠",
  "Every great project starts with a saved link. 🔗",
  "Stay focused, stay organized. ✨",
  "Your second brain is getting smarter! 💡",
];

export default function WelcomeBanner({
  dateStr,
  isLoading,
  totalItems,
}: {
  dateStr: string;
  isLoading: boolean;
  totalItems: number;
}) {
  const user = useAuthStore((state) => state.user);
  const [greeting, setGreeting] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="dp-hero">
        <div className="dp-hero-left">
          <div className="dp-hero-brand">
            <div className="dp-hero-vault">
              <LucideVault width={22} />
            </div>
            <span>NeoVault</span>
          </div>
          <h1 className="dp-hero-greeting">
            {greeting && `${greeting}, `}
            <span className="dp-hero-name">{user?.username ?? "there"}</span> 👋
          </h1>
          <p className="dp-hero-date">{dateStr || " "}</p>
        </div>

        {/* Summary pill */}
        <div className="dp-hero-summary">
          <div className="dp-hero-summary-row">
            <SolarBarChartLineDuotone width={16} className="dp-hero-summary-icon" />
            <div>
              {isLoading ? (
                <div
                  className="skeleton"
                  style={{ height: 28, width: 56, borderRadius: 6 }}
                />
              ) : (
                <p className="dp-hero-total">{totalItems}</p>
              )}
              <p className="dp-hero-total-label">items saved</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const CSS = `
.dp-hero {
  display:         flex;
  align-items:     flex-start;
  justify-content: space-between;
  gap:             16px;
  padding:         20px 24px;
  background:      linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%);
  border:          1px solid var(--border-default);
  border-radius:   var(--radius-xl);
  position:        relative;
}
.dp-hero::before {
  content:       '';
  position:      absolute;
  top:           -60px; right: -40px;
  width:         220px; height: 220px;
  background:    radial-gradient(circle, var(--accent-muted) 0%, transparent 70%);
  pointer-events: none;
}
@media (max-width: 767px) {
  .dp-hero {
    flex-direction: row;
    gap:            14px;
    padding:        20px 16px;
    min-height:     140px;
  }
  .dp-hero-summary-row { gap: 12px; }
}
@media (max-width: 479px) {
  .dp-hero { padding: 18px 14px; }
  .dp-hero-greeting { font-size: var(--text-xl); }
}

.dp-hero-brand {
  display:     flex;
  align-items: center;
  gap:         6px;
  font-size:   var(--text-xs);
  font-weight: 500;
  color:       var(--text-tertiary);
  margin-bottom: 8px;
}
.dp-hero-vault {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           24px; height: 24px;
}
.dp-hero-greeting {
  font-size:      var(--text-2xl);
  font-weight:    700;
  color:          var(--text-primary);
  letter-spacing: -0.02em;
  line-height:    1.2;
  margin:         0;
}
.dp-hero-name  { color: var(--text-accent); }
.dp-hero-date  { font-size: var(--text-sm); color: var(--text-tertiary); margin-top: 4px; }

.dp-hero-summary {
  flex-shrink:   0;
  background:    var(--bg-overlay);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding:       14px 18px;
  min-width:     100px;
}
.dp-hero-summary-row { display: flex; align-items: center; gap: 10px; }
.dp-hero-summary-icon { color: var(--text-accent); flex-shrink: 0; }
.dp-hero-total { font-size: var(--text-2xl); font-weight: 800; color: var(--text-primary); letter-spacing: -0.04em; line-height: 1; }
.dp-hero-total-label { font-size: var(--text-xs); color: var(--text-tertiary); margin-top: 2px; white-space: nowrap; }

`;
