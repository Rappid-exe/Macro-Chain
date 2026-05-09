import { useRef, useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { AGENT_CARDS } from "@/lib/constants";
import { cn } from "@/lib/cn";

export default function AgentStackSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  const checkOverflow = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setShowTop(scrollTop > 0);
      setShowBottom(scrollTop + clientHeight < scrollHeight - 1);
    }
  };

  useEffect(() => {
    checkOverflow();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkOverflow);
    return () => el?.removeEventListener("scroll", checkOverflow);
  }, []);

  const scroll = (direction: "up" | "down") => {
    if (scrollRef.current) {
      const amount = direction === "down" ? 260 : -260;
      scrollRef.current.scrollBy({ top: amount, behavior: "smooth" });
    }
  };

  return (
    <section
      id="agents"
      aria-labelledby="agent-stack-heading"
      className="bg-[#030303] px-6 py-24 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2
            id="agent-stack-heading"
            className="text-3xl font-bold text-white mb-4"
          >
            Agent Stack
          </h2>
          <p className="text-base leading-relaxed text-white/50 max-w-xl mx-auto">
            Four autonomous agents working in concert to map causal
            intelligence before the market prices it in.
          </p>
        </div>

        {/* Scrollable card container */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-md">
            {/* Navigation buttons */}
            <div className="flex justify-center gap-2 mb-4">
              <button
                aria-label="Scroll up"
                onClick={() => scroll("up")}
                className="p-2 rounded-full border border-yellow-400/20 bg-yellow-400/[0.05] hover:bg-yellow-400/[0.12] text-yellow-400/60 hover:text-yellow-400 transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                aria-label="Scroll down"
                onClick={() => scroll("down")}
                className="p-2 rounded-full border border-yellow-400/20 bg-yellow-400/[0.05] hover:bg-yellow-400/[0.12] text-yellow-400/60 hover:text-yellow-400 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Scroll container */}
            <div className="relative overflow-hidden rounded-2xl" style={{ height: 520 }}>
              {/* Top fade */}
              <div
                className={cn(
                  "absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#030303] to-transparent z-10 pointer-events-none transition-opacity duration-300",
                  showTop ? "opacity-100" : "opacity-0"
                )}
              />

              {/* Scrollable area */}
              <div
                ref={scrollRef}
                className="flex flex-col gap-4 overflow-y-auto h-full hide-scrollbar"
              >
                {AGENT_CARDS.map((card) => (
                  <article
                    key={card.title}
                    className="shrink-0 rounded-xl border border-white/[0.08] border-l-yellow-400/40 border-l-2 bg-[#0a0a0a] p-6 hover:border-yellow-400/20 hover:border-l-yellow-400 hover:bg-[#0f0f0f] transition-all duration-300"
                  >
                    <h3 className="text-lg font-bold text-white mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/50">
                      {card.description}
                    </p>
                  </article>
                ))}
              </div>

              {/* Bottom fade */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#030303] to-transparent z-10 pointer-events-none transition-opacity duration-300",
                  showBottom ? "opacity-100" : "opacity-0"
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar utility */}
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </section>
  );
}
