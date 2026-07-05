"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentType, SVGProps, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useSidebar } from "./SidebarContext";
import {
  FluentPrompt16Regular,
  LucideChevronLeft,
  LucideChevronRight,
  LucideInfo,
  LucideSettings,
  LucideUser,
  LucideVault,
  LucideX,
  SolarChatLineDuotone,
  SolarChatLineOutline,
  SolarCodeSquareLineDuotone,
  SolarFileLinear,
  SolarFolderFavouriteBookmarkLinear,
  SolarFolderWithFilesOutline,
  SolarGlobalLinear,
  SolarLinkMinimalisticBold,
  SolarNotesLineDuotone,
  SolarServerSquareCloudLinear,
  SolarShieldBoldDuotone,
  SolarTagLineDuotone,
  SolarWidgetLineDuotone,
} from "@/Icons/Icons";

const ADMIN_EMAIL = "mdelever77@gmail.com";

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_MAIN = [
  { name: "Dashboard", href: "/dashboard", icon: SolarWidgetLineDuotone },
  { name: "Projects", href: "/projects", icon: SolarFolderWithFilesOutline },
  { name: "Links", href: "/links", icon: SolarLinkMinimalisticBold },
  { name: "Notes", href: "/notes", icon: SolarNotesLineDuotone },
  { name: "Snippets", href: "/snippets", icon: SolarCodeSquareLineDuotone },
  { name: "Prompts", href: "/prompts", icon: FluentPrompt16Regular },
  { name: "API Client", href: "/api-client", icon: SolarGlobalLinear },
  { name: "Infrastructure", href: "/infrastructure", icon: SolarServerSquareCloudLinear },
  { name: "Files", href: "/files", icon: SolarFileLinear },
  { name: "Feedback", href: "/feedback", icon: SolarChatLineOutline },
  { name: "About", href: "/about", icon: LucideInfo },
];

const NAV_MANAGE = [
  { name: "Categories", href: "/categories", icon: SolarFolderFavouriteBookmarkLinear },
  { name: "Tags", href: "/tags", icon: SolarTagLineDuotone },
];

const NAV_SETTINGS = [
  { name: "Vault", href: "/settings/vault", icon: LucideSettings },
];

const NAV_ADMIN = [
  { name: "Admin", href: "/admin", icon: SolarShieldBoldDuotone },
  { name: "Feedback", href: "/admin/feedback", icon: SolarChatLineOutline },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { collapsed, mobileOpen, setCollapsed, setMobileOpen } = useSidebar();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileOpen, setMobileOpen]);

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Desktop sidebar content (respects collapsed state)
  const desktopContent = (
    <div
      className={["sidebar-inner", collapsed ? "sidebar-inner--collapsed" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Logo */}
      <div className="sidebar-logo ">
        <div className="sidebar-logo-icon" onClick={() => setCollapsed(!collapsed)}>
          <LucideVault width={28} />
        </div>
        {!collapsed && <span className="sidebar-logo-text">NeoVault</span>}

        {/* Collapse toggle btn — desktop only */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)} // FIX: Toggle collapsed state
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <LucideChevronRight width={14} />
          ) : (
            <LucideChevronLeft width={14} />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <NavSection label="Menu" collapsed={collapsed}>
          {NAV_MAIN.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              }
              collapsed={collapsed}
            />
          ))}
        </NavSection>

        <NavSection label="Manage" collapsed={collapsed}>
          {NAV_MANAGE.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname.startsWith(item.href)}
              collapsed={collapsed}
            />
          ))}
        </NavSection>

        <NavSection label="Settings" collapsed={collapsed}>
          {NAV_SETTINGS.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname.startsWith(item.href)}
              collapsed={collapsed}
            />
          ))}
        </NavSection>

        {user?.email === ADMIN_EMAIL && (
          <NavSection label="Admin" collapsed={collapsed}>
            {NAV_ADMIN.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                active={pathname.startsWith(item.href)}
                collapsed={collapsed}
              />
            ))}
          </NavSection>
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            <LucideUser width={14} />
          </div>
          {!collapsed && (
            <span className="sidebar-username">{user?.username ?? "User"}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>

      {/* ── Desktop sidebar ── */}
      <aside className="sidebar-desktop">{desktopContent}</aside>

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={["sidebar-mobile", mobileOpen ? "sidebar-mobile--open" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Force expanded in mobile drawer */}
        <div className="sidebar-inner">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <LucideVault width={28} />
            </div>
            <span className="sidebar-logo-text">NeoVault</span>
            <button
              className="sidebar-close-btn sidebar-close-btn--visible"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <LucideX width={16} />
            </button>
          </div>

          <nav className="sidebar-nav">
            <NavSection label="Menu" collapsed={false}>
              {NAV_MAIN.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  active={
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href))
                  }
                  collapsed={false}
                />
              ))}
            </NavSection>
            <NavSection label="Manage" collapsed={false}>
              {NAV_MANAGE.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  active={pathname.startsWith(item.href)}
                  collapsed={false}
                />
              ))}
            </NavSection>

            <NavSection label="Settings" collapsed={false}>
              {NAV_SETTINGS.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  active={pathname.startsWith(item.href)}
                  collapsed={false}
                />
              ))}
            </NavSection>

            {user?.email === ADMIN_EMAIL && (
              <NavSection label="Admin" collapsed={false}>
                {NAV_ADMIN.map((item) => (
                  <NavItem
                    key={item.href}
                    {...item}
                    active={pathname.startsWith(item.href)}
                    collapsed={false}
                  />
                ))}
              </NavSection>
            )}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-avatar">
                <LucideUser width={14} />
              </div>
              <span className="sidebar-username">
                {user?.username ?? "User"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavSection({
  label,
  collapsed,
  children,
}: {
  label: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="nav-section">
      {!collapsed && <p className="nav-section-label">{label}</p>}
      <div className="nav-section-items">{children}</div>
    </div>
  );
}

function NavItem({
  name,
  href,
  icon: Icon,
  active,
  collapsed,
}: {
  name: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className={["nav-item", active ? "nav-item--active" : ""]
        .filter(Boolean)
        .join(" ")}
      title={collapsed ? name : undefined}
    >
      <Icon className="nav-item-icon" />
      {!collapsed && <span className="nav-item-label">{name}</span>}
      {active && !collapsed && <span className="nav-item-dot" />}
    </Link>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
/* ── Desktop sidebar ── */
.sidebar-desktop {
  display:    flex;
  flex-shrink: 0;
}
@media (max-width: 767px) {
  .sidebar-desktop { display: none; }
}

.sidebar-inner {
  display:        flex;
  flex-direction: column;
  width:          var(--sidebar-width);
  height:         94.6dvh;
  background:     var(--bg-surface);
  border-right:   1px solid var(--border-default);
  transition:     width var(--transition-slow);
  position:       sticky;
  top:            0;
  overflow:       hidden;
}
.sidebar-inner--collapsed {
  width: var(--sidebar-width-collapsed);
}
@media (min-width: 768px) and (max-width: 1023px) {
  /* Force collapsed appearance — hide all text, show icons only */
  .sidebar-inner         { width: var(--sidebar-width-collapsed); }
  .sidebar-collapse-btn  { display: none; }
  .sidebar-logo-text     { display: none; }
  .nav-section-label     { display: none; }
  .nav-item-label        { display: none; }
  .nav-item-dot          { display: none; }
  .sidebar-username      { display: none; }
}

/* Logo */
.sidebar-logo {
  display:       flex;
  align-items:   center;
  gap:           10px;
  padding:       16px 14px 14px;
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink:   0;
  min-height:    60px;
}
.sidebar-logo-icon {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           34px;
  height:          34px;
  flex-shrink:     0;
}
.sidebar-logo-text {
  font-size:      var(--text-md);
  font-weight:    700;
  color:          var(--text-primary);
  letter-spacing: -0.02em;
  flex:           1;
  white-space:    nowrap;
}
.sidebar-collapse-btn {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           24px;
  height:          24px;
  background:      transparent;
  border:          1px solid var(--border-default);
  border-radius:   var(--radius-sm);
  color:           var(--text-tertiary);
  cursor:          pointer;
  flex-shrink:     0;
  margin-left:     10px;
  transition:      background var(--transition-fast), color var(--transition-fast);
}
.sidebar-collapse-btn:hover { background: var(--bg-overlay); color: var(--text-primary); }

.sidebar-close-btn {
  display:         none;
  align-items:     center;
  justify-content: center;
  width:           32px;
  height:          32px;
  background:      transparent;
  border:          1px solid var(--border-default);
  border-radius:   var(--radius-md);
  color:           var(--text-secondary);
  cursor:          pointer;
  flex-shrink:     0;
  margin-left:     auto;
  transition:      background var(--transition-fast), color var(--transition-fast);
}
.sidebar-close-btn--visible { display: flex; }
.sidebar-close-btn:hover { background: var(--bg-overlay); color: var(--text-primary); }

/* Nav */
.sidebar-nav {
  flex:       1;
  overflow-y: auto;
  overflow-x: hidden;
  padding:    8px;
  display:    flex;
  flex-direction: column;
  gap:        4px;
}
.sidebar-nav::-webkit-scrollbar { width: 0; }

.nav-section        { margin-bottom: 4px; }
.nav-section-label  {
  font-size:      var(--text-xs);
  font-weight:    600;
  color:          var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding:        10px 8px 4px;
  white-space:    nowrap;
}
.nav-section-items  { display: flex; flex-direction: column; gap: 2px; }

.nav-item {
  display:         flex;
  align-items:     center;
  justify-content: center;
  gap:             10px;
  padding:         9px 8px;
  border-radius:   var(--radius-md);
  color:           var(--text-secondary);
  font-size:       var(--text-sm);
  font-weight:     500;
  text-decoration: none;
  white-space:     nowrap;
  position:        relative;
  transition:      background var(--transition-fast), color var(--transition-fast);
  /* Bigger tap targets on mobile */
  min-height:      44px;
}
.nav-item:hover          { background: var(--bg-overlay); color: var(--text-primary); }
.nav-item--active        { background: var(--accent-muted); color: var(--cyan-300); }
.nav-item--active:hover  { background: var(--accent-muted); color: var(--cyan-300); }
.nav-item-icon           { width: 20px; height: 20px; }
.nav-item-label          { flex: 1; height:13px}
.nav-item-dot            { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }

/* Footer */
.sidebar-footer {
  padding:     10px 8px;
  border-top:  1px solid var(--border-subtle);
  flex-shrink: 0;
}
.sidebar-user    { display: flex; align-items: center; gap: 10px; padding: 7px 8px; border-radius: var(--radius-md); }
.sidebar-avatar  {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           28px;
  height:          28px;
  background:      var(--bg-subtle);
  border:          1px solid var(--border-default);
  border-radius:   var(--radius-full);
  color:           var(--text-secondary);
  flex-shrink:     0;
}
.sidebar-username {
  font-size:     var(--text-sm);
  font-weight:   500;
  color:         var(--text-secondary);
  white-space:   nowrap;
  overflow:      hidden;
  text-overflow: ellipsis;
}

/* ── Mobile backdrop ── */
.sidebar-backdrop {
  display:    none;
  position:   fixed;
  inset:      0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(2px);
  z-index:    calc(var(--z-modal) - 1);
  animation:  fadeIn var(--transition-base) ease both;
}
@media (max-width: 767px) {
  .sidebar-backdrop { display: block; }
}

/* ── Mobile drawer ── */
.sidebar-mobile {
  display:    none;
  position:   fixed;
  top:        0;
  left:       0;
  bottom:     0;
  width:      280px;
  max-width:  85vw;
  z-index:    var(--z-modal);
  transform:  translateX(-100%);
  transition: transform var(--transition-slow);
}
.sidebar-mobile--open { transform: translateX(0); }
@media (max-width: 767px) {
  .sidebar-mobile { display: block; }
}
.sidebar-mobile .sidebar-inner {
  width:    100%;
  height:   100%;
  position: relative;
  top:      0;
  border-right: 1px solid var(--border-default);
}
`;
