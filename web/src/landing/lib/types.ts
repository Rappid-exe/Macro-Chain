/** Signal item displayed in the Live Signals Marquee. */
export interface SignalItem {
  id: string;
  text: string;
}

/** Agent card data for the Agent Stack section. */
export interface AgentCard {
  title: string;
  description: string;
  emphasis: "standard" | "highlighted";
}

/** Alpha Decay card representing an order of market reaction. */
export interface AlphaDecayCard {
  order: "1st" | "2nd" | "3rd";
  descriptor: string;
  subDescriptor?: string;
  explanation: string;
  indicator?: string;
  highlighted: boolean;
}

/** FAQ question-and-answer pair. */
export interface FAQItem {
  question: string;
  answer: string;
}

/** Group of navigation links in the footer. */
export interface FooterLinkGroup {
  heading: string;
  links: { label: string; href: string }[];
}

/** Social media link in the footer. */
export interface SocialLink {
  platform: "twitter" | "linkedin" | "github";
  href: string;
  ariaLabel: string;
}
