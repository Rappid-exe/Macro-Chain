import { lazy, Suspense, useState } from "react";
import { SectionErrorBoundary } from "@/components/section-error-boundary";
import { ContactModal } from "@/components/contact-modal";

// Navbar renders synchronously (fixed at top)
import Navbar from "@/components/navbar";

// Hero renders synchronously (above the fold, critical path)
import HeroSection from "@/components/hero-section";

// Below-fold sections are lazy-loaded for performance
const AlphaDecaySection = lazy(() => import("@/components/alpha-decay-section"));
const AgentStackSection = lazy(() => import("@/components/agent-stack-section"));
const FAQSection = lazy(() => import("@/components/faq-section"));
const WaitlistCTASection = lazy(() => import("@/components/waitlist-cta-section"));
const FooterSection = lazy(() => import("@/components/footer-section"));

function SectionFallback({ minHeight = "20rem" }: { minHeight?: string }) {
  return <div style={{ minHeight }} aria-hidden="true" />;
}

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);

  // Listen for contact modal open events
  if (typeof window !== "undefined") {
    (window as unknown as { openContactModal: () => void }).openContactModal = () => setContactOpen(true);
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-signal-green focus:px-4 focus:py-2 focus:text-bg-primary focus:font-semibold focus:outline-none"
      >
        Skip to main content
      </a>

      <Navbar />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

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
    </>
  );
}
