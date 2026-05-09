/**
 * Terminal segment layout. The app under /app gets the monospace +
 * pure-black terminal treatment. The landing page at / uses Inter on a
 * near-black background so the two read as distinct products.
 */
export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg font-mono text-fg">{children}</div>
  );
}
