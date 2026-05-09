"use client";

import Link from "next/link";
import { HERO_HEADLINE, HERO_SUB_HEADLINE } from "@/landing/lib/constants";
import { BackgroundPaths } from "@/landing/components/background-paths";
import { LiveSignalsMarquee } from "@/landing/components/live-signals-marquee";
import { Button } from "@/landing/components/ui/button";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg-primary px-4 py-12"
    >
      <BackgroundPaths />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <h1
          id="hero-heading"
          className="text-4xl font-bold leading-tight text-text-primary md:text-5xl lg:text-6xl"
        >
          {HERO_HEADLINE}
        </h1>

        <p className="max-w-2xl text-lg text-text-secondary md:text-xl">
          {HERO_SUB_HEADLINE}
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <Button asChild variant="default" size="lg">
            <Link href="/app">Launch Terminal</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="#proof-of-alpha">View Backtested Alphas</Link>
          </Button>
        </div>
      </div>

      <div className="relative z-10 mt-auto w-full pt-8">
        <LiveSignalsMarquee />
      </div>
    </section>
  );
}
