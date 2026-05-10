import { lazy, Suspense } from "react";
import HeroSection from "@/landing/components/hero-section";
import Navbar from "@/landing/components/navbar";
import { SectionErrorBoundary } from "@/landing/components/section-error-boundary";
import { LandingContactBridge } from "@/components/landing-contact-bridge";

const AlphaDecaySection = lazy(
  () => import("@/landing/components/alpha-decay-section"),
);
const AgentStackSection = lazy(
  () => import("@/landing/components/agent-stack-section"),
);
const FAQSection = lazy(() => import("@/landing/components/faq-section"));
const WaitlistCTASection = lazy(
  () => import("@/landing/components/waitlist-cta-section"),
);
const FooterSection = lazy(() => import("@/landing/components/footer-section"));

function SectionFallback({ minHeight = "20rem" }: { minHeight?: string }) {
  return <div style={{ minHeight }} aria-hidden="true" />;
}

export default function Landing() {
  return (
    <div className="bg-bg-primary font-sans text-text-primary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-signal-green focus:px-4 focus:py-2 focus:font-semibold focus:text-bg-primary focus:outline-none"
      >
        Skip to main content
      </a>

      <Navbar />
      <LandingContactBridge />

      <main id="main-content">
        <HeroSection />

        <SectionErrorBoundary fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <AlphaDecaySection />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <AgentStackSection />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <FAQSection />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <WaitlistCTASection />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <FooterSection />
          </Suspense>
        </SectionErrorBoundary>
      </main>
    </div>
  );
}
