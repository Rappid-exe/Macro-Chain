import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/cn";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="bg-white py-20 px-6 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.5fr]">
          {/* Left column — heading and description */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-sm font-medium mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" />
              </svg>
              Frequently asked
            </span>

            <h2
              id="faq-heading"
              className="text-4xl lg:text-5xl font-bold text-black leading-tight mb-4"
            >
              Frequently Asked Questions
            </h2>

            <p className="text-black/50 text-base leading-relaxed mb-6">
              Quick answers to the questions we hear most from fund managers getting started with Macro-Chain.
            </p>
          </div>

          {/* Right column — accordion items */}
          <div className="flex flex-col gap-3">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-lg border border-black/[0.08] transition-all duration-200",
                  openIndex === index ? "bg-gray-50" : "bg-white hover:bg-gray-50/50"
                )}
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-base font-medium text-black pr-4">
                    {item.question}
                  </span>
                  <span className="shrink-0 text-black/40">
                    {openIndex === index ? (
                      <Minus className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed text-black/60">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <span className="text-sm text-black/40">Still have questions?</span>{" "}
          <a
            href="#"
            className="text-sm font-semibold text-black hover:text-black/70 transition-colors"
          >
            Contact support
          </a>
        </div>
      </div>
    </section>
  );
}
