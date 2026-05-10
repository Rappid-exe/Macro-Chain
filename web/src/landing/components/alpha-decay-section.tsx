import { Card } from "@/landing/components/ui/card";
import { Zap, TrendingUp, Brain } from "lucide-react";
import { ALPHA_DECAY_CARDS } from "@/landing/lib/constants";

const CARD_ICONS = [
  <Zap key="zap" className="w-8 h-8 text-white" />,
  <TrendingUp key="trending" className="w-8 h-8 text-white" />,
  <Brain key="brain" className="w-8 h-8 text-white" />,
];

export default function AlphaDecaySection() {
  return (
    <section
      aria-labelledby="alpha-decay-heading"
      className="bg-[#030303] px-6 py-24 lg:px-16"
    >
      <h2
        id="alpha-decay-heading"
        className="mb-4 text-center text-3xl font-bold text-white"
      >
        The Information Gap
      </h2>
      <p className="mb-16 text-center text-white/50 max-w-2xl mx-auto">
        Most traders react to headlines. We map the structural dependencies they miss.
      </p>

      <div className="mx-auto flex flex-wrap justify-center gap-8 max-w-6xl">
        {ALPHA_DECAY_CARDS.map((card, idx) => (
          <div
            key={card.order}
            className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1"
          >
            <Card className="text-white rounded-2xl border border-white/10 bg-gradient-to-br from-[#010101] via-[#090909] to-[#010101] shadow-2xl relative backdrop-blur-xl overflow-hidden hover:border-yellow-400/25 hover:shadow-yellow-400/5 hover:shadow-3xl w-[320px] md:w-[350px]">
              <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/10 opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-tr from-yellow-400/10 to-transparent blur-3xl opacity-30 group-hover:opacity-50 transform group-hover:scale-110 transition-all duration-700" />
                <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-white/5 blur-xl" />
                <div className="absolute bottom-16 right-16 w-12 h-12 rounded-full bg-white/5 blur-lg" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
              </div>

              <div className="p-8 relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="p-6 rounded-full backdrop-blur-lg border border-yellow-400/20 bg-gradient-to-br from-black/80 to-black/60 shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                    <div className="transform group-hover:rotate-180 transition-transform duration-700">
                      {CARD_ICONS[idx]}
                    </div>
                  </div>
                </div>

                <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                  {card.order} Order
                </p>

                <h3 className="mb-2 text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-300">
                  {card.descriptor}
                </h3>

                {card.subDescriptor && (
                  <p className="text-sm text-white/40 mb-4">{card.subDescriptor}</p>
                )}

                <p className="text-gray-300 text-sm leading-relaxed max-w-sm group-hover:text-gray-200 transition-colors duration-300">
                  {card.explanation}
                </p>

                <div className="mt-6 w-1/3 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full transform group-hover:w-1/2 group-hover:h-1 transition-all duration-500" />
              </div>

              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-400/15 to-transparent rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-yellow-400/15 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
