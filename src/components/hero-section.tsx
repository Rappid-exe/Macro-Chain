import { HERO_HEADLINE, HERO_SUB_HEADLINE } from "@/lib/constants";
import { BackgroundPaths } from "@/components/background-paths";
import { LiveSignalsMarquee } from "@/components/live-signals-marquee";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex flex-col items-center justify-center bg-bg-primary px-4 py-12 overflow-hidden"
    >
      {/* Animated SVG background — absolute positioned behind content */}
      <BackgroundPaths />

      {/* Main content — positioned above background */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-6">
        <h1
          id="hero-heading"
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight"
        >
          {HERO_HEADLINE}
        </h1>

        <p className="text-lg md:text-xl text-text-secondary max-w-2xl">
          {HERO_SUB_HEADLINE}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button variant="default" size="lg">
            Launch Terminal
          </Button>
          <Button variant="secondary" size="lg">
            View Backtested Alphas
          </Button>
        </div>
      </div>

      {/* Live Signals Marquee at the bottom of the hero */}
      <div className="relative z-10 w-full mt-auto pt-8">
        <LiveSignalsMarquee />
      </div>
    </section>
  );
}
