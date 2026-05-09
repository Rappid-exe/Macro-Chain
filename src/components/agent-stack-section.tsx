import { AGENT_CARDS } from "@/lib/constants";
import { SectionWithMockup } from "@/components/section-with-mockup";
import { cn } from "@/lib/cn";

function AgentStackSection() {
  return (
    <section aria-labelledby="agent-stack-heading" className="py-20 px-4">
      <SectionWithMockup
        title="Agent Stack"
        description="Four autonomous agents working in concert to map causal intelligence before the market prices it in."
      >
        {/* Bento grid at ≥1024px, single-column below */}
        <div
          className={cn(
            "grid gap-4",
            "grid-cols-1",
            "lg:grid-cols-2 lg:grid-rows-[auto_auto]"
          )}
        >
          {AGENT_CARDS.map((card) => (
            <article
              key={card.title}
              className={cn(
                "rounded-sm bg-surface p-6",
                card.emphasis === "highlighted" &&
                  "border border-signal-green lg:row-span-2",
                card.emphasis === "standard" && "border border-border"
              )}
            >
              <h3 className="text-lg font-bold text-text-primary">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </SectionWithMockup>
    </section>
  );
}

export default AgentStackSection;
