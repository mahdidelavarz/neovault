"use client";

import { useEffect, useState } from "react";
import { usePwaInstall } from "@/features/pwa/hooks/usePwaInstall";
import { useSwUpdate } from "@/features/pwa/hooks/useSwUpdate";
import {
  LucideDownload,
  LucideExternalLink,
  LucideRefreshCw,
  LucideShare2,
  LucideX,
} from "@/Icons/Icons";

const DISMISS_KEY = "pwa-install-dismissed-at";
// Show the banner 30 seconds after first visit; don't show for 7 days after dismiss
const SHOW_DELAY_MS = 30_000;
const SNOOZE_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function InstallBanner() {
  const { canInstall, isIos, isUnsupportedInstallBrowser, isStandalone, install } =
    usePwaInstall();
  const { updateAvailable, applyUpdate } = useSwUpdate();

  const [visible, setVisible] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    // Never show if already running in standalone mode
    if (isStandalone) return;

    // Respect previous dismissal within snooze period
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - parseInt(dismissedAt) < SNOOZE_DAYS_MS)
      return;

    // Wait a short delay before appearing — don't interrupt the first impression
    const timer = setTimeout(() => {
      if (canInstall || isIos || isUnsupportedInstallBrowser) setVisible(true);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [canInstall, isIos, isUnsupportedInstallBrowser, isStandalone]);

  const dismiss = () => {
    setVisible(false);
    setShowIosHelp(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  const handleInstall = async () => {
    const accepted = await install();
    if (accepted) dismiss();
  };

  // Reopen the current page in Chrome via an Android intent URL. Chrome can mint a
  // WebAPK (true standalone install), which Opera/Firefox cannot.
  const openInChrome = () => {
    const { host, pathname, search } = window.location;
    window.location.href =
      `intent://${host}${pathname}${search}` +
      `#Intent;scheme=https;package=com.android.chrome;end`;
  };

  // SW update toast takes priority over install banner
  if (updateAvailable) {
    return (
      <>
        <style>{CSS}</style>
        <div className="pwa-update-toast" role="alert">
          <LucideRefreshCw width={16} className="pwa-update-icon" />
          <span className="pwa-update-text">Update available</span>
          <button className="pwa-update-btn" onClick={applyUpdate}>
            Refresh
          </button>
          <button
            className="pwa-dismiss-x"
            onClick={() => {}}
            aria-label="Dismiss"
          >
            <LucideX width={14} />
          </button>
        </div>
      </>
    );
  }

  if (!visible) return null;

  return (
    <>
      <style>{CSS}</style>

      {/* Android / Desktop: show native install button */}
      {canInstall && (
        <div className="pwa-banner" role="banner">
          <div className="pwa-banner-text">
            <span className="pwa-banner-title">Install NeoVault</span>
            <span className="pwa-banner-sub">
              Add to home screen for faster access
            </span>
          </div>
          <div className="pwa-banner-actions">
            <button className="pwa-install-btn" onClick={handleInstall}>
              <LucideDownload width={15} />
              Install
            </button>
            <button
              className="pwa-dismiss-x"
              onClick={dismiss}
              aria-label="Dismiss"
            >
              <LucideX width={14} />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari: no beforeinstallprompt — show manual instructions */}
      {isIos && !canInstall && (
        <div className="pwa-banner pwa-banner--ios" role="banner">
          {!showIosHelp ? (
            <>
              <div className="pwa-banner-text">
                <span className="pwa-banner-title">Add to Home Screen</span>
                <span className="pwa-banner-sub">
                  Install for a native app experience
                </span>
              </div>
              <div className="pwa-banner-actions">
                <button
                  className="pwa-install-btn"
                  onClick={() => setShowIosHelp(true)}
                >
                  <LucideShare2 width={15} />
                  How?
                </button>
                <button
                  className="pwa-dismiss-x"
                  onClick={dismiss}
                  aria-label="Dismiss"
                >
                  <LucideX width={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="pwa-ios-steps">
                <span className="pwa-ios-step">
                  1. Tap the <strong>Share</strong> button{" "}
                  <span className="pwa-ios-share-icon">⬆</span> at the bottom of
                  Safari
                </span>
                <span className="pwa-ios-step">
                  2. Scroll down and tap <strong>"Add to Home Screen"</strong>
                </span>
                <span className="pwa-ios-step">
                  3. Tap <strong>Add</strong> in the top-right corner
                </span>
              </div>
              <button
                className="pwa-dismiss-x pwa-dismiss-x--top"
                onClick={dismiss}
                aria-label="Dismiss"
              >
                <LucideX width={14} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Android Firefox/Opera: can't mint a WebAPK — point the user to Chrome */}
      {isUnsupportedInstallBrowser && !canInstall && (
        <div className="pwa-banner" role="banner">
          <div className="pwa-banner-text">
            <span className="pwa-banner-title">Install as an app</span>
            <span className="pwa-banner-sub">
              Opera &amp; Firefox can&apos;t install web apps — open NeoVault in
              Chrome to add it to your home screen.
            </span>
          </div>
          <div className="pwa-banner-actions">
            <button className="pwa-install-btn" onClick={openInChrome}>
              <LucideExternalLink width={15} />
              Open in Chrome
            </button>
            <button
              className="pwa-dismiss-x"
              onClick={dismiss}
              aria-label="Dismiss"
            >
              <LucideX width={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const CSS = `
/* ── Update toast ─────────────────────────────────────────── */
.pwa-update-toast {
  position:      fixed;
  bottom:        80px;        /* above BottomTabBar on mobile */
  left:          50%;
  transform:     translateX(-50%);
  z-index:       1000;
  display:       flex;
  align-items:   center;
  gap:           10px;
  padding:       10px 16px;
  background:    var(--bg-surface);
  border:        1px solid var(--accent-border);
  border-radius: var(--radius-lg);
  box-shadow:    0 4px 24px rgba(0,0,0,0.25);
  white-space:   nowrap;
  animation:     pwa-slide-up 0.25s ease-out;
}
@media (min-width: 768px) {
  .pwa-update-toast { bottom: 24px; }
}
.pwa-update-icon { color: var(--accent); flex-shrink: 0; }
.pwa-update-text { font-size: var(--text-sm); color: var(--text-primary); font-weight: 500; }
.pwa-update-btn {
  height:        30px;
  padding:       0 14px;
  background:    var(--accent);
  border:        none;
  border-radius: var(--radius-md);
  color:         #fff;
  font-size:     var(--text-xs);
  font-weight:   600;
  font-family:   var(--font-sans);
  cursor:        pointer;
  transition:    opacity var(--transition-fast);
}
.pwa-update-btn:hover { opacity: 0.85; }

/* ── Install banner ───────────────────────────────────────── */
.pwa-banner {
  position:      fixed;
  bottom:        68px;        /* above BottomTabBar (56px) + gap */
  left:          12px;
  right:         12px;
  z-index:       999;
  display:       flex;
  align-items:   center;
  gap:           12px;
  padding:       12px 14px;
  background:    var(--bg-surface);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow:    0 8px 32px rgba(0,0,0,0.2);
  animation:     pwa-slide-up 0.3s ease-out;
}
@media (min-width: 640px) {
  .pwa-banner { left: auto; right: 20px; width: 360px; bottom: 20px; }
}
@media (min-width: 1024px) {
  .pwa-banner { bottom: 24px; right: 24px; }
}
.pwa-banner--ios { align-items: flex-start; }
.pwa-banner-text {
  display:        flex;
  flex-direction: column;
  gap:            2px;
  flex:           1;
  min-width:      0;
}
.pwa-banner-title { font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); }
.pwa-banner-sub   { font-size: var(--text-xs); color: var(--text-tertiary); }
.pwa-banner-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.pwa-install-btn {
  display:       flex;
  align-items:   center;
  gap:           6px;
  height:        32px;
  padding:       0 14px;
  background:    var(--accent);
  border:        none;
  border-radius: var(--radius-md);
  color:         #fff;
  font-size:     var(--text-xs);
  font-weight:   600;
  font-family:   var(--font-sans);
  cursor:        pointer;
  white-space:   nowrap;
  transition:    opacity var(--transition-fast);
}
.pwa-install-btn:hover { opacity: 0.85; }
.pwa-dismiss-x {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           28px;
  height:          28px;
  background:      transparent;
  border:          none;
  border-radius:   var(--radius-sm);
  color:           var(--text-tertiary);
  cursor:          pointer;
  flex-shrink:     0;
  transition:      background var(--transition-fast), color var(--transition-fast);
}
.pwa-dismiss-x:hover { background: var(--bg-overlay); color: var(--text-primary); }
.pwa-dismiss-x--top { align-self: flex-start; }

/* iOS steps */
.pwa-ios-steps {
  display:        flex;
  flex-direction: column;
  gap:            6px;
  flex:           1;
  min-width:      0;
}
.pwa-ios-step {
  font-size:   var(--text-xs);
  color:       var(--text-secondary);
  line-height: 1.5;
}
.pwa-ios-step strong { color: var(--text-primary); }
.pwa-ios-share-icon  { font-style: normal; }

/* Animation */
@keyframes pwa-slide-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.pwa-update-toast { animation: pwa-slide-up 0.25s ease-out; }
`;
