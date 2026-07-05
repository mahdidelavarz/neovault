"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useTheme } from "@/app/providers";
import {
  LucideChevronDown,
  LucideChevronRight,
  LucideLogOut,
  LucideMoon,
  LucideSettings,
  LucideSunDim,
  LucideUser,
  LucideVault,
  SolarHamburgerMenuLinear,
  SolarPaletteRoundBoldDuotone,
  SolarRoundedMagniferOutline,
} from "@/Icons/Icons";
import ThemeSwitcher from "../ui/ThemeSwitcher";
import { useSidebar } from "./SidebarContext";
import { useVault } from "@/features/settings/security/hooks/useVault";
import { PinModal } from "@/features/settings/security/components/PinModal";

// ─── Component ────────────────────────────────────────────────────────────────

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useTheme();
  const { setMobileOpen } = useSidebar();
  const { isEnabled, isUnlocked, needsRecovery, unlock, requestUnlock, lock } = useVault();

  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Listen for global unlock requests (from VaultGuard, ActiveView, etc.)
  useEffect(() => {
    const handler = () => {
      if (needsRecovery) {
        // This device has no cached vault key — PIN unlock can never
        // succeed here. Send the user to recover with their phrase instead.
        router.push('/settings/vault');
        return;
      }
      setPinOpen(true);
    };
    window.addEventListener('vault:unlock-requested', handler);
    return () => window.removeEventListener('vault:unlock-requested', handler);
  }, [needsRecovery, router]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Ctrl+K → search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        router.push("/search");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isDark = theme === "dark";

  return (
    <>
      <style>{CSS}</style>
      <header className="header">
        {/* Left — burger (mobile) + brand (mobile) + search */}
        <div className="header-left">
          <button
            className="header-burger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <SolarHamburgerMenuLinear width={20} />
          </button>

          <button
            className="header-brand"
            onClick={() => router.push("/dashboard")}
            aria-label="NeoVault home"
          >
            <span className="header-brand-icon">
              <LucideVault width={30} />
            </span>
            <span className="header-brand-text">NeoVault</span>
          </button>

          <button
            className="header-search"
            onClick={() => router.push("/search")}
            aria-label="Open search"
          >
            <SolarRoundedMagniferOutline className="header-search-icon" />
            <span className="header-search-text">Search anything…</span>
            <kbd className="header-kbd">⌘K</kbd>
          </button>
        </div>

        {/* Right — actions */}
        <div className="header-right">
          {/* Vault lock indicator — only shown when vault is enabled */}
          {isEnabled && (
            <button
              className={`header-icon-btn header-vault-btn${isUnlocked ? ' header-vault-btn--unlocked' : ''}`}
              onClick={isUnlocked ? lock : requestUnlock}
              title={isUnlocked ? 'Vault unlocked — click to lock' : 'Vault locked — click to unlock'}
              aria-label={isUnlocked ? 'Lock vault' : 'Unlock vault'}
            >
              <span className="header-vault-icon">{isUnlocked ? '🔓' : '🔒'}</span>
            </button>
          )}

          {/* Account / settings menu */}
          <div className="header-user-wrap" ref={menuRef}>
            <button
              className="header-user-btn"
              onClick={() => setMenuOpen((p) => !p)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <div className="header-avatar">
                <LucideUser width={16} />
              </div>
              <span className="header-username">
                {user?.username ?? "User"}
              </span>
              <LucideChevronDown
                width={16}
                className={[
                  "header-chevron",
                  menuOpen ? "header-chevron--open" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            </button>

            {menuOpen && (
              <div className="header-dropdown" role="menu">
                <div className="header-dropdown-user">
                  <div className="header-dropdown-avatar">
                    <LucideUser width={16} />
                  </div>
                  <div className="header-dropdown-user-meta">
                    <p className="header-dropdown-name">{user?.username ?? "User"}</p>
                    <p className="header-dropdown-role">Personal Vault</p>
                  </div>
                </div>

                <div className="header-dropdown-divider" />

                <p className="header-dropdown-label">Appearance</p>

                {/* Theme toggle */}
                <button
                  className="header-dropdown-item"
                  role="menuitem"
                  onClick={toggleTheme}
                >
                  {isDark ? <LucideSunDim width={15} /> : <LucideMoon width={15} />}
                  <span className="header-dropdown-item-text">
                    {isDark ? "Light mode" : "Dark mode"}
                  </span>
                  <span className="header-dropdown-tag">{isDark ? "Dark" : "Light"}</span>
                </button>

                {/* Color palette → opens the palette picker */}
                <button
                  className="header-dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    setPaletteOpen(true);
                  }}
                >
                  <SolarPaletteRoundBoldDuotone width={15} />
                  <span className="header-dropdown-item-text">Color palette</span>
                  <LucideChevronRight width={14} className="header-dropdown-chevron" />
                </button>

                <div className="header-dropdown-divider" />

                <button
                  className="header-dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/settings/vault");
                  }}
                >
                  <LucideSettings width={15} />
                  <span className="header-dropdown-item-text">Settings</span>
                </button>

                <button
                  className="header-dropdown-item header-dropdown-item--danger"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LucideLogOut width={15} />
                  <span className="header-dropdown-item-text">Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Palette picker — trigger lives in the settings menu above */}
      <ThemeSwitcher
        showTrigger={false}
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
      />

      <PinModal
        isOpen={pinOpen}
        onClose={() => setPinOpen(false)}
        onSubmit={unlock}
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
.header {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  gap:             12px;
  height:          56px;
  padding:         0 16px;
  background:      var(--bg-surface);
  border-bottom:   1px solid var(--border-default);
  position:        sticky;
  top:             0;
  z-index:         var(--z-sticky);
  flex-shrink:     0;
}

/* Left */
.header-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }

/* Burger — mobile only (sidebar is always visible on desktop) */
.header-burger {
  display:         none;
  align-items:     center;
  justify-content: center;
  width:           38px;
  height:          38px;
  background:      transparent;
  border:          1px solid transparent;
  border-radius:   var(--radius-md);
  color:           var(--text-secondary);
  cursor:          pointer;
  flex-shrink:     0;
  transition:      background var(--transition-fast), color var(--transition-fast);
}
.header-burger:active { background: var(--bg-overlay); color: var(--text-primary); }

/* Brand — mobile only (desktop has the sidebar logo) */
.header-brand {
  display:     none;
  align-items: center;
  gap:         8px;
  background:  transparent;
  border:      none;
  padding:     0;
  cursor:      pointer;
  flex-shrink: 0;
}
.header-brand-icon {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           34px;
  height:          34px;
}
.header-brand-text {
  margin-top:     3px;
  font-size:      var(--text-md);
  font-weight:    700;
  color:          var(--text-primary);
  letter-spacing: -0.02em;
}

.header-search {
  display:       flex;
  align-items:   center;
  gap:           8px;
  height:        32px;
  padding:       0 10px;
  background:    var(--bg-subtle);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-md);
  color:         var(--text-tertiary);
  font-size:     var(--text-sm);
  font-family:   var(--font-sans);
  cursor:        pointer;
  max-width:     360px;
  width:         220px;
  text-align:    left;
  transition:    border-color var(--transition-fast),
                 background   var(--transition-fast);
}
.header-search:hover {
  border-color: var(--border-strong);
  background:   var(--bg-elevated);
}
.header-search-icon {
  width:      20px;
  height:     20px;
  flex-shrink: 0;
}
.header-search-text {
  flex: 1;
  white-space: nowrap;
  overflow:    hidden;
}
.header-kbd {
  display:       inline-flex;
  align-items:   center;
  padding:       1px 6px;
  font-size:     10px;
  font-family:   var(--font-mono);
  color:         var(--text-tertiary);
  background:    var(--bg-overlay);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-sm);
  white-space:   nowrap;
}

/* Right */
.header-right {
  display:     flex;
  align-items: center;
  gap:         6px;
  flex-shrink: 0;
}

.header-icon-btn {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           38px;
  height:          38px;
  background:      transparent;
  border:          1px solid transparent;
  border-radius:   var(--radius-md);
  color:           var(--text-secondary);
  cursor:          pointer;
  transition:      background var(--transition-fast),
                   color      var(--transition-fast),
                   border-color var(--transition-fast);
}
.header-icon-btn:hover {
  background:   var(--bg-overlay);
  border-color: var(--border-default);
  color:        var(--text-primary);
}

.header-vault-btn { font-size: 15px; }
.header-vault-btn--unlocked { border-color: rgba(34,197,94,0.35); }
.header-vault-icon { line-height: 1; }

/* User button */
.header-user-wrap { position: relative; }

.header-user-btn {
  display:       flex;
  align-items:   center;
  gap:           7px;
  height:        38px;
  padding:       0 10px 0 6px;
  background:    transparent;
  border:        1px solid transparent;
  border-radius: var(--radius-md);
  color:         var(--text-secondary);
  font-size:     var(--text-sm);
  font-family:   var(--font-sans);
  font-weight:   500;
  cursor:        pointer;
  transition:    background var(--transition-fast),
                 border-color var(--transition-fast),
                 color var(--transition-fast);
}
.header-user-btn:hover {
  background:   var(--bg-overlay);
  border-color: var(--border-default);
  color:        var(--text-primary);
}
.header-avatar {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           32px;
  height:          32px;
  background:      var(--accent-muted);
  border:          1px solid var(--accent-border);
  border-radius:   var(--radius-full);
  color:           var(--text-accent);
  flex-shrink:     0;
}
.header-username {
  font-size:     15px;
  max-width:     140px;
  overflow:      hidden;
  text-overflow: ellipsis;
  white-space:   nowrap;
}
.header-chevron {
  color:      var(--text-tertiary);
  transition: transform var(--transition-fast);
  flex-shrink: 0;
}
.header-chevron--open { transform: rotate(180deg); }

/* Dropdown */
.header-dropdown {
  position:      absolute;
  top:           calc(100% + 8px);
  right:         0;
  min-width:     230px;
  padding:       6px;
  background:    var(--bg-elevated);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow:    var(--shadow-lg);
  z-index:       var(--z-dropdown);
  animation:     fadeInDown var(--transition-fast) ease both;
}
.header-dropdown-user {
  display:     flex;
  align-items: center;
  gap:         10px;
  padding:     8px 10px 10px;
}
.header-dropdown-user-meta { min-width: 0; }
.header-dropdown-avatar {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           36px;
  height:          36px;
  background:      var(--accent-muted);
  border:          1px solid var(--accent-border);
  border-radius:   var(--radius-full);
  color:           var(--text-accent);
  flex-shrink:     0;
}
.header-dropdown-name {
  font-size:   var(--text-sm);
  font-weight: 600;
  color:       var(--text-primary);
  line-height: 1.2;
  overflow:    hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.header-dropdown-role {
  font-size: var(--text-xs);
  color:     var(--text-tertiary);
  margin-top: 2px;
}
.header-dropdown-divider {
  height:     1px;
  background: var(--border-subtle);
  margin:     6px 4px;
}
.header-dropdown-label {
  font-size:      var(--text-xs);
  font-weight:    600;
  color:          var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding:        2px 10px 6px;
}
.header-dropdown-item {
  display:       flex;
  align-items:   center;
  gap:           10px;
  width:         100%;
  padding:       10px;
  background:    transparent;
  border:        none;
  border-radius: var(--radius-md);
  font-size:     var(--text-sm);
  font-family:   var(--font-sans);
  font-weight:   500;
  color:         var(--text-secondary);
  cursor:        pointer;
  text-align:    left;
  transition:    background var(--transition-fast),
                 color      var(--transition-fast);
}
.header-dropdown-item:hover { background: var(--bg-overlay); color: var(--text-primary); }
.header-dropdown-item-text { flex: 1; }
.header-dropdown-tag {
  font-size:     var(--text-xs);
  font-weight:   600;
  color:         var(--text-tertiary);
  padding:       2px 7px;
  background:    var(--bg-subtle);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-full);
}
.header-dropdown-chevron { color: var(--text-tertiary); flex-shrink: 0; }
.header-dropdown-item--danger       { color: var(--danger); }
.header-dropdown-item--danger:hover { background: var(--danger-muted); color: var(--danger); }

/* ── Mobile ── */
@media (max-width: 767px) {
  .header { padding: 0 12px; gap: 8px; }
  .header-burger { display: flex; }
  .header-brand  { display: flex; }

  /* Collapse search to an icon-only button on phones to keep the bar clean */
  .header-search {
     display: none;
    width:   38px;
    max-width: 38px;
    padding: 0;
    justify-content: center;
    margin-left: auto;
  }
  .header-search-text,
  .header-kbd { display: none; }

  /* Username takes too much room on phones — show avatar only */
  .header-username,
  .header-chevron { display: none; }
  .header-user-btn { padding: 0; width: 48px; justify-content: center; }

  .header-dropdown { min-width: 240px; }
}

@media (max-width: 359px) {
  .header-brand-text { display: none; }
}
`;
