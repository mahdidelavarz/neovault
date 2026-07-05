"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled,   setIsInstalled]   = useState(false);
  const [isIos,         setIsIos]         = useState(false);
  const [isStandalone,  setIsStandalone]  = useState(false);
  const [isUnsupportedInstallBrowser, setIsUnsupportedInstallBrowser] = useState(false);

  useEffect(() => {
    // Detect if already running as installed PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    const ua = navigator.userAgent;

    // Detect iOS (Safari on iPhone/iPad/iPod)
    setIsIos(/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream);

    // Detect Android browsers that can't produce a standalone install (WebAPK):
    // Firefox and Opera never fire `beforeinstallprompt` and only create a plain
    // home-screen shortcut that opens inside the browser. Chrome/Edge/Samsung do
    // mint WebAPKs, so they're excluded (they go through `canInstall` instead).
    const isAndroid = /Android/i.test(ua);
    const isFirefox = /Firefox|FxiOS/i.test(ua);
    const isOpera = /OPR\/|Opera/i.test(ua);
    setIsUnsupportedInstallBrowser(isAndroid && (isFirefox || isOpera));

    // Capture the browser's native install prompt (Android Chrome/Edge)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    // Track successful install
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  /** Trigger the native Android install prompt. Returns true if accepted. */
  const install = async (): Promise<boolean> => {
    if (!installPrompt) return false;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setInstallPrompt(null);
    return outcome === "accepted";
  };

  return {
    /** Android Chrome: native install prompt is available */
    canInstall: !!installPrompt,
    /** The app was just installed in this session */
    isInstalled,
    /** Running on iOS Safari */
    isIos,
    /** Android Firefox/Opera: can't produce a standalone install (no WebAPK) */
    isUnsupportedInstallBrowser,
    /** Already running as installed PWA (standalone mode) */
    isStandalone,
    /** Trigger the Android install dialog */
    install,
  };
}
