import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Macro-Chain",
  description:
    "Map prediction market events to equity impacts via causal reasoning chains.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}
