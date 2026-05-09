import { HERO_HEADLINE, HERO_SUB_HEADLINE } from "@/lib/constants";
import { LiveSignalsMarquee } from "@/components/live-signals-marquee";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex flex-col items-center justify-center bg-bg-primary px-4 py-16 overflow-hidden"
    >
      {/* BackgroundPaths will be added in task 4.5 */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-6">
        <h1
          id="hero-heading"
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary"
        >
          {HERO_HEADLINE}
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl">
          {HERO_SUB_HEADLINE}
        </p>
      </div>

      <div className="relative z-10 w-full mt-12">
        <LiveSignalsMarquee />
      </div>
    </section>
  );
}
