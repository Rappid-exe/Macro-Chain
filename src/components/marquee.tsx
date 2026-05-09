import { cn } from "@/lib/cn";
import { usePreferReducedMotion } from "@/hooks/use-reduced-motion";

interface MarqueeProps {
  items: string[];
  direction?: "left" | "right";
  speed?: number; // seconds for full cycle
  pauseOnHover?: boolean;
  className?: string;
}

/**
 * Generic reusable Marquee component.
 * Renders items scrolling horizontally with CSS animations for smooth 60fps.
 * Pauses on hover/focus when `pauseOnHover` is true.
 * Respects prefers-reduced-motion by displaying a static layout.
 */
export function Marquee({
  items,
  direction = "left",
  speed = 30,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const prefersReducedMotion = usePreferReducedMotion();

  // Duplicate items 3× for seamless looping (original + 2 copies = 12 total for 4 items)
  const duplicatedItems = [...items, ...items, ...items];

  const animationName =
    direction === "left" ? "marquee-scroll-left" : "marquee-scroll-right";

  if (prefersReducedMotion) {
    return (
      <div
        role="marquee"
        aria-live="off"
        className={cn(
          "flex flex-wrap gap-4 justify-center overflow-hidden",
          className
        )}
      >
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center px-4 py-2 text-sm text-text-secondary whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      role="marquee"
      aria-live="off"
      className={cn(
        "marquee-container group overflow-hidden",
        className
      )}
      tabIndex={0}
      aria-label="Live signals ticker"
    >
      <div
        className="marquee-track flex w-max gap-4"
        style={{
          animation: `${animationName} ${speed}s linear infinite`,
        }}
      >
        {duplicatedItems.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center px-4 py-2 text-sm text-text-secondary whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
