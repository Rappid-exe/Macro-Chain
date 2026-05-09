import type {
  SignalItem,
  AgentCard,
  AlphaDecayCard,
  FAQItem,
  FooterLinkGroup,
  SocialLink,
} from "./types";

// ---------------------------------------------------------------------------
// Hero Section
// ---------------------------------------------------------------------------

export const HERO_HEADLINE = "The Causal Intelligence Terminal";

export const HERO_SUB_HEADLINE =
  "Macro-Chain maps 3rd-order geopolitical triggers to equity impact before the market prices them in.";

// ---------------------------------------------------------------------------
// Live Signals Marquee
// ---------------------------------------------------------------------------

export const SIGNAL_ITEMS: SignalItem[] = [
  { id: "signal-hormuz", text: "Hormuz Blockade: +14% Signal Strength" },
  {
    id: "signal-lithium",
    text: "Lithium Supply Cut: 3rd Order Impact Detected",
  },
  { id: "signal-tsmc", text: "TSMC Fab Delay: Entropy Score 0.87" },
  {
    id: "signal-baltic",
    text: "Baltic Dry Index Spike: Causal Map Updated",
  },
];

// ---------------------------------------------------------------------------
// Alpha Decay Section
// ---------------------------------------------------------------------------

export const ALPHA_DECAY_CARDS: AlphaDecayCard[] = [
  {
    order: "1st",
    descriptor: "Headline traders",
    subDescriptor: "Direct news reaction",
    explanation:
      "First-order alpha is captured by traders reacting directly to headline events. This edge decays within minutes as the information spreads.",
    highlighted: false,
  },
  {
    order: "2nd",
    descriptor: "Supply chain analysts",
    subDescriptor: "Secondary effects",
    explanation:
      "Second-order alpha comes from identifying the immediate downstream effects of an event. Analysts who map primary supply chain disruptions capture this edge.",
    highlighted: false,
  },
  {
    order: "3rd",
    descriptor: "Macro-Chain's domain",
    subDescriptor: "Tertiary causal links",
    explanation:
      "Third-order alpha lives in the tertiary causal connections that most analysts miss. Macro-Chain maps these hidden dependencies before the market prices them in.",
    indicator: "Signal Green",
    highlighted: true,
  },
];

// ---------------------------------------------------------------------------
// Agent Stack Section
// ---------------------------------------------------------------------------

export const AGENT_CARDS: AgentCard[] = [
  {
    title: "The Scraper",
    description:
      "Real-time monitoring of Polymarket, Kalshi, and industrial news APIs.",
    emphasis: "standard",
  },
  {
    title: "The Auditor",
    description:
      "Autonomous parsing of 10-K filings and global shipping manifests to find hidden dependencies.",
    emphasis: "highlighted",
  },
  {
    title: "The Entropy Model",
    description:
      "Mathematical modelling of 'Information Decay' to determine if a link is already priced in.",
    emphasis: "highlighted",
  },
  {
    title: "The Reporter",
    description:
      "Institutional-grade briefs delivered instantly to your existing workflow.",
    emphasis: "standard",
  },
];

// ---------------------------------------------------------------------------
// Workflow Section
// ---------------------------------------------------------------------------

export const WORKFLOW_COPY =
  "Own the most painful 30 minutes of your research day. Automated causal mapping with one-click export to your team's workspace.";

// ---------------------------------------------------------------------------
// FAQ Section
// ---------------------------------------------------------------------------

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How does Macro-Chain prevent hallucinations?",
    answer:
      "Our Auditor agent cross-references 10-K filings with global shipping manifests. We do not generate links; we verify existing industrial dependencies.",
  },
  {
    question:
      "What is the average latency between a trigger and a 3rd-order alert?",
    answer: "Our stack delivers validated causal maps in under 180 seconds.",
  },
  {
    question: "Can I customise the sectors monitored?",
    answer:
      "Yes, the Terminal allows for vertical-specific focus on Energy, Semis, or Ag-Tech.",
  },
];

// ---------------------------------------------------------------------------
// Footer Section
// ---------------------------------------------------------------------------

export const FOOTER_TAGLINE = "The Causal Intelligence Engine.";

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    heading: "Product",
    links: [
      { label: "Terminal", href: "#terminal" },
      { label: "API", href: "#api" },
      { label: "Backtesting", href: "#backtesting" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Ethics", href: "#ethics" },
      { label: "Research", href: "#research" },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "twitter",
    href: "https://x.com/macrochain",
    ariaLabel: "Follow Macro-Chain on X (formerly Twitter)",
  },
  {
    platform: "linkedin",
    href: "https://linkedin.com/company/macrochain",
    ariaLabel: "Connect with Macro-Chain on LinkedIn",
  },
  {
    platform: "github",
    href: "https://github.com/Rappid-exe/Macro-Chain",
    ariaLabel: "View Macro-Chain source on GitHub",
  },
];

export const FOOTER_COPYRIGHT = "\u00A9 2026 Macro-Chain.";

export const FOOTER_LEGAL_LINKS = [
  { label: "Terms & Conditions", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Cookie Settings", href: "#cookies" },
];
