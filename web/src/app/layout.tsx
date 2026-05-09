import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Macro-Chain",
  description:
    "The Causal Intelligence Terminal. Map 3rd-order geopolitical triggers to equity impact before the market prices them in.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Neutral base — per-route layouts (app/layout.tsx, landing via page)
  // pick their own font and background.
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
