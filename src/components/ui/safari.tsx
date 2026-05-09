import { cn } from "@/lib/cn";

interface SafariProps {
  url?: string;
  className?: string;
  children?: React.ReactNode;
  imageSrc?: string;
}

export function Safari({
  url = "macro-chain.io",
  className,
  children,
  imageSrc,
}: SafariProps) {
  return (
    <div className={cn("rounded-xl border border-white/[0.1] bg-[#0a0a0a] shadow-2xl overflow-hidden", className)}>
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>

        {/* URL bar */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 rounded-md bg-white/[0.05] border border-white/[0.08] px-3 py-1 min-w-[200px] max-w-[400px] w-full">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/30">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="2" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="text-xs text-white/40 truncate">{url}</span>
          </div>
        </div>

        {/* Spacer for symmetry */}
        <div className="w-[52px]" />
      </div>

      {/* Content area */}
      <div className="relative">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Macro-Chain Terminal"
            className="w-full h-auto block"
          />
        ) : children ? (
          children
        ) : (
          <div className="aspect-[16/9] bg-[#0a0a0a] flex items-center justify-center">
            <span className="text-white/20 text-sm">Terminal Preview</span>
          </div>
        )}
      </div>
    </div>
  );
}
