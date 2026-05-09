import { AGENT_CARDS } from "@/lib/constants";
import { cn } from "@/lib/cn";

const CARD_GRADIENTS = [
  { from: "#FACC15", to: "#F59E0B" },
  { from: "#FACC15", to: "#EAB308" },
  { from: "#F59E0B", to: "#FACC15" },
  { from: "#EAB308", to: "#FACC15" },
];

function AgentStackSection() {
  return (
    <section
      aria-labelledby="agent-stack-heading"
      className="bg-[#030303] px-6 py-24 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16 max-w-xl">
          <h2
            id="agent-stack-heading"
            className="text-3xl font-bold text-text-primary mb-4"
          >
            Agent Stack
          </h2>
          <p className="text-base leading-relaxed text-text-secondary">
            Four autonomous agents working in concert to map causal
            intelligence before the market prices it in.
          </p>
        </div>

        {/* Skew cards grid */}
        <div className="flex justify-center items-center flex-wrap gap-8">
          {AGENT_CARDS.map((card, idx) => {
            const gradient = CARD_GRADIENTS[idx] ?? CARD_GRADIENTS[0];
            return (
              <div
                key={card.title}
                className="group relative w-[280px] h-[320px] transition-all duration-500"
              >
                {/* Skewed gradient panel */}
                <span
                  className="absolute top-0 left-[40px] w-1/2 h-full rounded-lg transform skew-x-[15deg] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[16px] group-hover:w-[calc(100%-72px)]"
                  style={{
                    background: `linear-gradient(315deg, ${gradient.from}, ${gradient.to})`,
                  }}
                />
                {/* Blurred glow */}
                <span
                  className="absolute top-0 left-[40px] w-1/2 h-full rounded-lg transform skew-x-[15deg] blur-[30px] opacity-50 transition-all duration-500 group-hover:skew-x-0 group-hover:left-[16px] group-hover:w-[calc(100%-72px)]"
                  style={{
                    background: `linear-gradient(315deg, ${gradient.from}, ${gradient.to})`,
                  }}
                />

                {/* Animated blur blobs */}
                <span className="pointer-events-none absolute inset-0 z-10">
                  <span className="absolute top-0 left-0 w-0 h-0 rounded-lg opacity-0 bg-white/[0.08] backdrop-blur-[10px] transition-all duration-300 group-hover:top-[-30px] group-hover:left-[30px] group-hover:w-[60px] group-hover:h-[60px] group-hover:opacity-100" />
                  <span className="absolute bottom-0 right-0 w-0 h-0 rounded-lg opacity-0 bg-white/[0.08] backdrop-blur-[10px] transition-all duration-500 group-hover:bottom-[-30px] group-hover:right-[30px] group-hover:w-[60px] group-hover:h-[60px] group-hover:opacity-100" />
                </span>

                {/* Card content */}
                <article
                  className={cn(
                    "relative z-20 left-0 h-full p-8 rounded-2xl text-white transition-all duration-500",
                    "bg-[rgba(10,10,10,0.85)] backdrop-blur-[10px] shadow-lg",
                    "border border-white/[0.08]",
                    "group-hover:left-[-20px] group-hover:bg-[rgba(10,10,10,0.95)]"
                  )}
                >
                  <h3 className="text-lg font-bold text-text-primary mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {card.description}
                  </p>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AgentStackSection;
