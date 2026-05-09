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
