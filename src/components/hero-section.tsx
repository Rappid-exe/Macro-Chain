import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { HERO_HEADLINE, HERO_SUB_HEADLINE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Safari } from "@/components/ui/safari";
import { cn } from "@/lib/cn";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#030303]"
    >
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.05] via-transparent to-amber-500/[0.05] blur-3xl" />

      {/* Animated geometric shapes */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-yellow-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-amber-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-yellow-400/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-yellow-300/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-amber-400/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Main content — centered */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <Circle className="h-2 w-2 fill-yellow-400" />
            <span className="text-sm text-white/60 tracking-wide">
              Causal Intelligence
            </span>
          </motion.div>

          {/* Centered heading */}
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1
              id="hero-heading"
              className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight text-center"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                {HERO_HEADLINE}
              </span>
            </h1>
          </motion.div>

          {/* Sub-headline */}
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              {HERO_SUB_HEADLINE}
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="solid" size="lg">
              Launch Terminal
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Terminal screenshot in Safari mockup — full width, centred */}
      <motion.div
        custom={4}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mt-12 w-full max-w-[1200px] mx-auto px-4"
      >
        <Safari url="macro-chain.io" imageSrc="/terminal-screenshot.png" />
      </motion.div>

      {/* Integrations bar at the bottom */}
      <motion.div
        custom={5}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full mt-auto pb-12 pt-8"
      >
        <p className="text-center text-xs uppercase tracking-widest text-white/30 mb-6">
          Powered by
        </p>
        <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap px-4">
          {/* Perplexity — official icon from Bootstrap Icons */}
          <div className="flex items-center gap-2.5 text-white/40 hover:text-white/70 transition-colors duration-300">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" className="shrink-0">
              <path fillRule="evenodd" d="M8 .188a.5.5 0 0 1 .503.5V4.03l3.022-2.92.059-.048a.51.51 0 0 1 .49-.054.5.5 0 0 1 .306.46v3.247h1.117l.1.01a.5.5 0 0 1 .403.49v5.558a.5.5 0 0 1-.503.5H12.38v3.258a.5.5 0 0 1-.312.462.51.51 0 0 1-.55-.11l-3.016-3.018v3.448c0 .275-.225.5-.503.5a.5.5 0 0 1-.503-.5v-3.448l-3.018 3.019a.51.51 0 0 1-.548.11.5.5 0 0 1-.312-.463v-3.258H2.503a.5.5 0 0 1-.503-.5V5.215l.01-.1c.047-.229.25-.4.493-.4H3.62V1.469l.006-.074a.5.5 0 0 1 .302-.387.51.51 0 0 1 .547.102l3.023 2.92V.687c0-.276.225-.5.503-.5M4.626 9.333v3.984l2.87-2.872v-4.01zm3.877 1.113 2.871 2.871V9.333l-2.87-2.897zm3.733-1.668a.5.5 0 0 1 .145.35v1.145h.612V5.715H9.201zm-9.23 1.495h.613V9.13c0-.131.052-.257.145-.35l3.033-3.064h-3.79zm1.62-5.558H6.76L4.626 2.652zm4.613 0h2.134V2.652z" />
            </svg>
            <span className="text-sm md:text-base font-light tracking-wide">perplexity</span>
          </div>

          {/* Bloomberg — clean wordmark style */}
          <div className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors duration-300">
            <span className="text-base md:text-lg font-semibold tracking-tight">Bloomberg</span>
          </div>

          {/* Polymarket */}
          <div className="flex items-center gap-2.5 text-white/40 hover:text-white/70 transition-colors duration-300">
            <span className="text-sm md:text-base font-light tracking-wide">Polymarket</span>
          </div>

          {/* Kalshi — bold wordmark style */}
          <div className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors duration-300">
            <span className="text-base md:text-lg font-bold tracking-tight">Kalshi</span>
          </div>
        </div>
      </motion.div>

      {/* Top/bottom gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </section>
  );
}
