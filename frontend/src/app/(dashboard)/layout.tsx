"use client";

import { useEffect } from "react";
import InstallBanner from "@/features/pwa/components/InstallBanner";
import OfflineBanner from "@/features/pwa/components/OfflineBanner";
import SyncStatusBadge from "@/features/pwa/components/SyncStatusBadge";
import { VaultMigrationModal } from "@/features/settings/security/components/VaultMigrationModal";
import { useVaultMigration } from "@/features/settings/security/hooks/useVaultMigration";
import Header from "@/features/shared/layout/Header";
import Sidebar from "@/features/shared/layout/Sidebar";
import BottomTabBar from "@/features/shared/layout/BottomNavBar";
import api from "@/lib/http";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showModal, items, progress, encryptAll, dismiss } =
    useVaultMigration();

  useEffect(() => {
    const key = "neovault:app-open-tracked";
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");
    api.post("/activity/app-open").catch(() => {
      sessionStorage.removeItem(key);
    });
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Header stays fixed at top — it's outside the scrollable body */}
      <Header />

      {/* Offline banner sits between header and body as a flex row — flex-shrink:0 keeps it visible */}
      <OfflineBanner />
      <SyncStatusBadge />

      <div className="dashboard-layout-body">
        {/* Sidebar is a flex child with no overflow — it never grows taller than the body */}
        <Sidebar />

        {/* Only main-content scrolls */}
        <main className="main-content">{children}</main>
      </div>

      {/* BottomTabBar is fixed-position on mobile — placing it outside body is fine */}
      <BottomTabBar />

      {/* PWA install prompt + SW update toast */}
      <InstallBanner />

      {/* One-time vault migration prompt — shown when vault unlocks and plaintext data exists */}
      {showModal && (
        <VaultMigrationModal
          itemCount={items.length}
          progress={progress}
          onEncryptAll={encryptAll}
          onDismiss={dismiss}
        />
      )}

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          flex-direction: column;
          height: 100dvh; /* Full viewport — header + body together fill it */
          overflow: hidden; /* Nothing scrolls at this level */
          background: var(--bg-base);
        }

        /* Header is a flex child here — it takes its natural height, then body fills the rest */

        .dashboard-layout-body {
          display: flex;
          flex: 1;
          overflow: hidden; /* Critical: contains the row so sidebar can't escape */
          min-height: 0; /* Flex shrink fix */
        }

        .main-content {
          flex: 1;
          min-width: 0;
          overflow: hidden; /* PageLayout controls its own scroll */
          display: flex;
          flex-direction: column;
        }
        
        @media (max-width: 767px) { .main-content { padding-bottom : 85px } } }

      `}</style>
    </div>
  );
}
