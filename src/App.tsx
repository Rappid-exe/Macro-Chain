import { lazy, Suspense } from "react";
import { SectionErrorBoundary } from "@/components/section-error-boundary";

// Hero renders synchronously (above the fold, critical path)
import HeroSection from "@/components/hero-section";

// Below-fold sections are lazy-loaded for performance
const AlphaDecaySection = lazy(() => import("@/components/alpha-decay-section"));
const AgentStackSection = lazy(() => import("@/components/agent-stack-section"));
const WorkflowSection = lazy(() => import("@/components/workflow-section"));
const TechnicalProofSection = lazy(() => import("@/components/technical-proof-section"));
const FAQSection = lazy(() => import("@/components/faq-section"));
const ProofOfAlphaSection = lazy(() => import("@/components/proof-of-alpha-section"));
const WaitlistCTASection = lazy(() => import("@/components/waitlist-cta-section"));
const FooterSection = lazy(() => import("@/components/footer-section"));

function SectionFallback({ minHeight = "20rem" }: { minHeight?: string }) {
  return <div style={{ minHeight }} aria-hidden="true" />;
}

export default function App() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-signal-green focus:px-4 focus:py-2 focus:text-bg-primary focus:font-semibold focus:outline-none"
      >
        Skip to main content
      </a>

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
            <WorkflowSection />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <TechnicalProofSection />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <FAQSection />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <ProofOfAlphaSection />
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
    </>
  );
}
