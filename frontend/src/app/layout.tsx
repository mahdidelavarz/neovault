import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "NeoVault",
  description: "Developer knowledge vault",
  manifest: "/manifest.webmanifest",

  // iOS PWA — these generate the required <meta> and <link> tags that Safari reads.
  // iOS ignores the web manifest for icons/splash; these explicit entries are mandatory.
  // No startupImage entries: the splash PNGs were never produced, so listing them only
  // emitted apple-touch-startup-image <link>s that 404'd. iOS falls back to a solid
  // background_color splash (from the manifest), which is acceptable.
  appleWebApp: {
    capable: true,
    title: "NeoVault",
    statusBarStyle: "black-translucent",
  },

  icons: {
    // Apple touch icon — shown on iOS home screen and bookmarks.
    // iOS does not use the manifest icons; this <link> tag is the only way.
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
