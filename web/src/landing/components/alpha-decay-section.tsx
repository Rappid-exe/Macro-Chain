import { ALPHA_DECAY_CARDS } from "@/landing/lib/constants";
import { cn } from "@/lib/cn";

export default function AlphaDecaySection() {
  return (
    <section
      aria-labelledby="alpha-decay-heading"
      className="bg-bg-primary px-6 py-20 lg:px-16"
    >
      <h2
        id="alpha-decay-heading"
        className="mb-12 text-center text-3xl font-bold text-text-primary"
      >
        Alpha Decay
      </h2>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ALPHA_DECAY_CARDS.map((card) => (
          <article
            key={card.order}
            className={cn(
              "rounded-sm border p-6",
              card.highlighted
                ? "border-signal-green bg-surface"
                : "border-border bg-surface"
            )}
          >
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-text-secondary">
              {card.order} Order
            </p>
            <h3
              className={cn(
                "mb-1 text-lg font-bold",
                card.highlighted ? "text-signal-green" : "text-text-primary"
              )}
            >
              {card.descriptor}
            </h3>
            {card.subDescriptor && (
              <p className="mb-3 text-sm text-text-secondary">
                {card.subDescriptor}
              </p>
            )}
            <p className="text-base leading-relaxed text-text-secondary">
              {card.explanation}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
