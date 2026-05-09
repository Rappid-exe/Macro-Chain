/** Timeline entry for the Oil Spike event. */
interface TimelineEntry {
  label: string;
  description: string;
}

const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    label: "Trigger Detected",
    description: "Hormuz strait disruption signal identified",
  },
  {
    label: "Causal Map Updated",
    description: "3rd-order link to energy equities mapped",
  },
  {
    label: "Alert Issued",
    description: "Institutional brief delivered to subscribers",
  },
];

/**
 * Chart data points representing equity movement over 5 days.
 * The Macro-Chain alert fires on Day 1; the equity moves on Day 3 (48h later).
 */
const CHART_POINTS = [
  { day: 1, value: 0 },
  { day: 2, value: 0.5 },
  { day: 3, value: 3.2 },
  { day: 4, value: 5.8 },
  { day: 5, value: 7.1 },
];

export default function ProofOfAlphaSection() {
  return (
    <section
      aria-labelledby="proof-of-alpha-heading"
      className="bg-bg-primary px-6 py-20 lg:px-16"
    >
      <h2
        id="proof-of-alpha-heading"
        className="mb-12 text-center text-3xl font-bold text-text-primary"
      >
        Proof of Alpha
      </h2>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
        {/* Left panel: Timeline */}
        <div
          role="list"
          aria-label="Oil Spike event timeline: Macro-Chain alert fired 48 hours before energy equity moved upward"
        >
          <h3 className="mb-6 text-lg font-bold text-text-primary">
            Oil Spike Event
          </h3>
          <ol className="relative border-l-2 border-signal-green/40 pl-6">
            {TIMELINE_ENTRIES.map((entry, index) => (
              <li
                key={entry.label}
                className="relative mb-8 last:mb-0"
                role="listitem"
              >
                {/* Timeline dot */}
                <span
                  className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-signal-green bg-bg-primary"
                  aria-hidden="true"
                />
                <p className="text-sm font-semibold text-signal-green">
                  Step {index + 1}
                </p>
                <p className="text-base font-semibold text-text-primary">
                  {entry.label}
                </p>
                <p className="text-base text-text-secondary">
                  {entry.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Right panel: SVG Chart */}
        <div className="w-full">
          <svg
            viewBox="0 0 500 320"
            className="h-auto max-w-full"
            role="img"
            aria-label="Line chart showing the Oil Spike event: Macro-Chain alert fired on Day 1, equity moved upward 48 hours later on Day 3, demonstrating a 48-hour lead time before the energy equity price increase"
          >
            {/* Background */}
            <rect width="500" height="320" fill="#050505" rx="2" />

            {/* Chart area boundaries */}
            {/* Y-axis */}
            <line
              x1="60"
              y1="40"
              x2="60"
              y2="260"
              stroke="#BDBDBD"
              strokeWidth="1"
            />
            {/* X-axis */}
            <line
              x1="60"
              y1="260"
              x2="460"
              y2="260"
              stroke="#BDBDBD"
              strokeWidth="1"
            />

            {/* Y-axis label */}
            <text
              x="15"
              y="150"
              fill="#BDBDBD"
              fontSize="11"
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
              transform="rotate(-90, 15, 150)"
            >
              Equity Movement (%)
            </text>

            {/* Y-axis tick marks and values */}
            {[0, 2, 4, 6, 8].map((val) => {
              const y = 260 - (val / 8) * 220;
              return (
                <g key={`y-tick-${val}`}>
                  <line
                    x1="55"
                    y1={y}
                    x2="60"
                    y2={y}
                    stroke="#BDBDBD"
                    strokeWidth="1"
                  />
                  <text
                    x="48"
                    y={y + 4}
                    fill="#BDBDBD"
                    fontSize="11"
                    fontFamily="Inter, sans-serif"
                    textAnchor="end"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* X-axis label */}
            <text
              x="260"
              y="305"
              fill="#BDBDBD"
              fontSize="11"
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
            >
              Time (Days)
            </text>

            {/* X-axis tick marks and day labels */}
            {CHART_POINTS.map((point) => {
              const x = 60 + ((point.day - 1) / 4) * 400;
              return (
                <g key={`x-tick-${point.day}`}>
                  <line
                    x1={x}
                    y1="260"
                    x2={x}
                    y2="265"
                    stroke="#BDBDBD"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y="280"
                    fill="#BDBDBD"
                    fontSize="11"
                    fontFamily="Inter, sans-serif"
                    textAnchor="middle"
                  >
                    Day {point.day}
                  </text>
                </g>
              );
            })}

            {/* Grid lines (horizontal, subtle) */}
            {[2, 4, 6, 8].map((val) => {
              const y = 260 - (val / 8) * 220;
              return (
                <line
                  key={`grid-${val}`}
                  x1="60"
                  y1={y}
                  x2="460"
                  y2={y}
                  stroke="rgba(42, 42, 42, 0.4)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Data line */}
            <polyline
              fill="none"
              stroke="#00E676"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={CHART_POINTS.map((point) => {
                const x = 60 + ((point.day - 1) / 4) * 400;
                const y = 260 - (point.value / 8) * 220;
                return `${x},${y}`;
              }).join(" ")}
            />

            {/* Data points */}
            {CHART_POINTS.map((point) => {
              const x = 60 + ((point.day - 1) / 4) * 400;
              const y = 260 - (point.value / 8) * 220;
              return (
                <circle
                  key={`point-${point.day}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#00E676"
                  stroke="#050505"
                  strokeWidth="2"
                />
              );
            })}

            {/* Macro-Chain Alert marker (Day 1) */}
            <line
              x1="60"
              y1="42"
              x2="60"
              y2="258"
              stroke="#00E676"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              opacity="0.7"
            />
            <text
              x="60"
              y="35"
              fill="#00E676"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
              fontWeight="600"
            >
              Macro-Chain Alert
            </text>

            {/* Equity Movement marker (Day 3 = 48h later) */}
            <line
              x1="260"
              y1="42"
              x2="260"
              y2="258"
              stroke="#EAEAEA"
              strokeWidth="1.5"
              strokeDasharray="6 3"
              opacity="0.5"
            />
            <text
              x="260"
              y="35"
              fill="#EAEAEA"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
              fontWeight="600"
            >
              Equity Moves
            </text>

            {/* 48h lead time annotation */}
            {/* Horizontal bracket between Day 1 and Day 3 */}
            <line
              x1="65"
              y1="50"
              x2="255"
              y2="50"
              stroke="#BDBDBD"
              strokeWidth="1"
            />
            {/* Left cap */}
            <line
              x1="65"
              y1="46"
              x2="65"
              y2="54"
              stroke="#BDBDBD"
              strokeWidth="1"
            />
            {/* Right cap */}
            <line
              x1="255"
              y1="46"
              x2="255"
              y2="54"
              stroke="#BDBDBD"
              strokeWidth="1"
            />
            {/* Label */}
            <text
              x="160"
              y="47"
              fill="#EAEAEA"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              textAnchor="middle"
              fontWeight="600"
            >
              48h lead time
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
