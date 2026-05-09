export default function TechnicalProofSection() {
  return (
    <section
      aria-labelledby="technical-proof-heading"
      className="bg-bg-primary px-6 py-20 lg:px-16"
    >
      <h2
        id="technical-proof-heading"
        className="mb-12 text-center text-3xl font-bold text-text-primary"
      >
        Technical Proof
      </h2>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
        {/* SVG Bayesian Causal Network Diagram */}
        <div className="w-full">
          <svg
            viewBox="0 0 500 400"
            className="max-w-full h-auto"
            role="img"
            aria-label="Bayesian Causal Network diagram showing five economic variable nodes and their causal connections: Oil Price causes Shipping Costs, Oil Price causes Inflation, Shipping Costs causes Semiconductor Supply, Semiconductor Supply causes Consumer Electronics, Inflation causes Consumer Electronics"
          >
            {/* Arrowhead marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#BDBDBD" />
              </marker>
            </defs>

            {/* Directed edges (causal relationships) */}
            {/* Oil Price -> Shipping Costs */}
            <line
              x1="130"
              y1="80"
              x2="310"
              y2="80"
              stroke="#BDBDBD"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            {/* Oil Price -> Inflation */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="280"
              stroke="#BDBDBD"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            {/* Shipping Costs -> Semiconductor Supply */}
            <line
              x1="370"
              y1="100"
              x2="300"
              y2="200"
              stroke="#BDBDBD"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            {/* Semiconductor Supply -> Consumer Electronics */}
            <line
              x1="280"
              y1="230"
              x2="300"
              y2="310"
              stroke="#BDBDBD"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            {/* Inflation -> Consumer Electronics */}
            <line
              x1="130"
              y1="310"
              x2="270"
              y2="330"
              stroke="#BDBDBD"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />

            {/* Nodes */}
            {/* Oil Price */}
            <circle cx="100" cy="70" r="30" fill="#1A1A1A" stroke="#FACC15" strokeWidth="2" />
            <text
              x="100"
              y="75"
              textAnchor="middle"
              fill="#EAEAEA"
              fontSize="14"
              fontFamily="Inter, sans-serif"
            >
              Oil Price
            </text>

            {/* Shipping Costs */}
            <circle cx="370" cy="70" r="30" fill="#1A1A1A" stroke="#FACC15" strokeWidth="2" />
            <text
              x="370"
              y="65"
              textAnchor="middle"
              fill="#EAEAEA"
              fontSize="12"
              fontFamily="Inter, sans-serif"
            >
              Shipping
            </text>
            <text
              x="370"
              y="80"
              textAnchor="middle"
              fill="#EAEAEA"
              fontSize="12"
              fontFamily="Inter, sans-serif"
            >
              Costs
            </text>

            {/* Semiconductor Supply */}
            <circle cx="270" cy="210" r="30" fill="#1A1A1A" stroke="#FACC15" strokeWidth="2" />
            <text
              x="270"
              y="205"
              textAnchor="middle"
              fill="#EAEAEA"
              fontSize="12"
              fontFamily="Inter, sans-serif"
            >
              Semiconductor
            </text>
            <text
              x="270"
              y="220"
              textAnchor="middle"
              fill="#EAEAEA"
              fontSize="12"
              fontFamily="Inter, sans-serif"
            >
              Supply
            </text>

            {/* Consumer Electronics */}
            <circle cx="320" cy="340" r="30" fill="#1A1A1A" stroke="#FACC15" strokeWidth="2" />
            <text
              x="320"
              y="335"
              textAnchor="middle"
              fill="#EAEAEA"
              fontSize="12"
              fontFamily="Inter, sans-serif"
            >
              Consumer
            </text>
            <text
              x="320"
              y="350"
              textAnchor="middle"
              fill="#EAEAEA"
              fontSize="12"
              fontFamily="Inter, sans-serif"
            >
              Electronics
            </text>

            {/* Inflation */}
            <circle cx="100" cy="310" r="30" fill="#1A1A1A" stroke="#FACC15" strokeWidth="2" />
            <text
              x="100"
              y="315"
              textAnchor="middle"
              fill="#EAEAEA"
              fontSize="14"
              fontFamily="Inter, sans-serif"
            >
              Inflation
            </text>
          </svg>
        </div>

        {/* Text explanations */}
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="mb-3 text-lg font-bold text-text-primary">
              Shannon Entropy
            </h3>
            <p className="text-base leading-relaxed text-text-secondary">
              Shannon Entropy quantifies the uncertainty or surprise in a signal.
              Higher entropy indicates more unpredictable information content,
              helping identify when market data carries genuine novelty versus noise.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-bold text-text-primary">
              Bayesian Causal Networks
            </h3>
            <p className="text-base leading-relaxed text-text-secondary">
              Bayesian Causal Networks model probabilistic dependencies between
              economic variables. They enable inference about how upstream shocks
              propagate through supply chains to affect downstream asset prices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
