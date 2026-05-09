import { motion } from "framer-motion";
import { usePreferReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";

interface BackgroundPathsProps {
  className?: string;
}

interface FloatingPathsProps {
  position: number; // 1 or -1, determines left/right origin
}

/**
 * Generates an organic bezier curve path string for a given index.
 * Each path is unique based on the index, creating abstract flowing curves.
 */
function generatePathD(index: number): string {
  const seed = index * 37;
  const cx1 = 100 + ((seed * 7) % 600);
  const cy1 = 50 + ((seed * 3) % 400);
  const cx2 = 200 + ((seed * 11) % 500);
  const cy2 = 100 + ((seed * 5) % 350);
  const ex = 300 + ((seed * 13) % 400);
  const ey = 150 + ((seed * 9) % 300);
  const cx3 = 400 + ((seed * 17) % 300);
  const cy3 = 50 + ((seed * 19) % 400);
  const fx = 600 + ((seed * 23) % 200);
  const fy = 200 + ((seed * 29) % 250);

  return `M ${50 + ((seed * 2) % 100)} ${100 + ((seed * 4) % 300)} C ${cx1} ${cy1} ${cx2} ${cy2} ${ex} ${ey} S ${cx3} ${cy3} ${fx} ${fy}`;
}

/**
 * Returns an animation duration between 10 and 30 seconds based on the index.
 */
function getAnimationDuration(index: number): number {
  return 10 + (((index * 7 + 3) % 21));
}

function FloatingPaths({ position }: FloatingPathsProps) {
  const prefersReducedMotion = usePreferReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform={`translate(${position === 1 ? 0 : 100}, 0)`}
        >
          {Array.from({ length: 18 }, (_, i) => {
            const duration = getAnimationDuration(i + (position === 1 ? 0 : 18));
            const pathD = generatePathD(i + (position === 1 ? 0 : 18));
            const baseOpacity = 0.03 + (i % 5) * 0.025; // max ~0.15
            const strokeWidth = 0.5 + (i % 3) * 0.3;

            if (prefersReducedMotion) {
              return (
                <path
                  key={i}
                  d={pathD}
                  stroke="#FFFFFF"
                  strokeWidth={strokeWidth}
                  strokeOpacity={baseOpacity}
                  fill="none"
                  pathLength={1}
                />
              );
            }

            return (
              <motion.path
                key={i}
                d={pathD}
                stroke="#FFFFFF"
                strokeWidth={strokeWidth}
                fill="none"
                initial={{
                  pathLength: 0.3,
                  opacity: baseOpacity * 0.5,
                  rotate: 0,
                }}
                animate={{
                  pathLength: [0.3, 0.8, 0.3],
                  opacity: [baseOpacity * 0.5, baseOpacity, baseOpacity * 0.5],
                  rotate: [0, position * (5 + (i % 10)), 0],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export function BackgroundPaths({ className }: BackgroundPathsProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none bg-neutral-950",
        className
      )}
      aria-hidden="true"
    >
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
