import { useRef, Children, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { usePreferReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";

interface SectionWithMockupProps {
  title: string;
  description: string;
  children: ReactNode;
  mockupSrc?: string;
  mockupAlt?: string;
  reverse?: boolean;
  className?: string;
  headingId?: string;
}

/**
 * SectionWithMockup provides scroll-triggered entry animations and parallax
 * effects for the Agent Stack section. Children animate in with staggered
 * opacity/translateY transitions when 20% of the section enters the viewport.
 * Optional mockup images receive parallax at different rates to create depth.
 */
export function SectionWithMockup({
  title,
  description,
  children,
  mockupSrc,
  mockupAlt,
  reverse = false,
  className,
  headingId,
}: SectionWithMockupProps) {
  const prefersReducedMotion = usePreferReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll progress for parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms: primary at 0.2× scroll, secondary at 0.5× scroll
  const primaryY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const secondaryY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  // Entry animation trigger at 20% threshold
  const inViewRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(inViewRef, { once: true, amount: 0.2 });

  const childArray = Children.toArray(children);

  // When reduced motion is active, render everything in final state
  if (prefersReducedMotion) {
    return (
      <div ref={sectionRef} className={cn("relative", className)}>
        <div
          ref={inViewRef}
          className={cn(
            "flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12",
            reverse && "lg:flex-row-reverse"
          )}
        >
          {/* Text content */}
          <div className="flex-1 space-y-4">
            <h2 id={headingId} className="text-2xl font-bold text-text-primary">{title}</h2>
            <p className="text-base leading-relaxed text-text-secondary">
              {description}
            </p>
          </div>

          {/* Children (cards) */}
          <div className="flex-1">
            <div className="grid gap-4">
              {childArray.map((child, index) => (
                <div key={index}>{child}</div>
              ))}
            </div>
          </div>

          {/* Mockup image (no parallax in reduced motion) */}
          {mockupSrc && (
            <div className="flex-1">
              <img
                src={mockupSrc}
                alt={mockupAlt ?? ""}
                className="w-full max-w-full rounded-sm"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className={cn("relative", className)}>
      <div
        ref={inViewRef}
        className={cn(
          "flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12",
          reverse && "lg:flex-row-reverse"
        )}
      >
        {/* Text content with entry animation */}
        <motion.div
          className="flex-1 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          <h2 id={headingId} className="text-2xl font-bold text-text-primary">{title}</h2>
          <p className="text-base leading-relaxed text-text-secondary">
            {description}
          </p>
        </motion.div>

        {/* Children (cards) with staggered entry animation */}
        <div className="flex-1">
          <div className="grid gap-4">
            {childArray.map((child, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
              >
                {child}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Primary mockup image with parallax */}
        {mockupSrc && (
          <motion.div
            className="flex-1"
            style={{ y: primaryY }}
          >
            <img
              src={mockupSrc}
              alt={mockupAlt ?? ""}
              className="w-full max-w-full rounded-sm"
            />
          </motion.div>
        )}
      </div>

      {/* Secondary parallax element (decorative depth layer) */}
      {mockupSrc && (
        <motion.div
          className="pointer-events-none absolute inset-0 -z-10 opacity-20"
          style={{ y: secondaryY }}
          aria-hidden="true"
        >
          <img
            src={mockupSrc}
            alt=""
            className="h-full w-full object-cover blur-sm"
          />
        </motion.div>
      )}
    </div>
  );
}
