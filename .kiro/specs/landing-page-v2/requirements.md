# Requirements Document

## Introduction

Macro-Chain Landing Page V2 is a major iteration of the existing marketing landing page. The Board has directed a migration from vanilla HTML/CSS/JS to React + TypeScript + Tailwind CSS + shadcn/ui, the integration of animated components from 21st.dev, and the addition of new sections (FAQ, Proof of Alpha, Footer, Live Signals Marquee). All existing content is preserved; only the architecture and presentation change. The page targets institutional fund managers and maintains a dark-mode, terminal-grade aesthetic with UK English throughout.

## Glossary

- **Landing_Page_V2**: The React + TypeScript single-page marketing website for Macro-Chain, replacing the vanilla HTML/CSS/JS V1 implementation.
- **Hero_Section**: The above-the-fold area containing the animated background, primary headline, sub-headline, call-to-action buttons, and Live Signals Marquee.
- **BackgroundPaths_Component**: A framer-motion animated SVG component rendering 36 floating paths behind the Hero_Section content.
- **FloatingPaths_Subcomponent**: The sub-component of BackgroundPaths_Component responsible for generating and animating individual SVG path elements.
- **Live_Signals_Marquee**: A continuously scrolling dual-row ticker displaying simulated geopolitical and supply-chain trigger signals within the Hero_Section.
- **Alpha_Decay_Section**: A three-column layout explaining the diminishing alpha at each order of market reaction.
- **Agent_Stack_Section**: A bento/asymmetric layout presenting the four autonomous agents with scroll-triggered animations and parallax effects.
- **SectionWithMockup_Component**: A framer-motion component used in the Agent_Stack_Section providing scroll-triggered animations and parallax image mockups.
- **Workflow_Section**: A section demonstrating integration capabilities with existing team tools, using Lucide icons for visual recognition.
- **Technical_Proof_Section**: A section providing mathematical credibility through an SVG diagram of the Bayesian Causal Network and a concise Shannon Entropy explanation.
- **FAQ_Section**: A question-and-answer section addressing institutional trust concerns with short, technical responses.
- **Proof_Of_Alpha_Section**: A before-and-after comparison section demonstrating Macro-Chain's predictive capability through a timeline and chart visualisation.
- **Footer_Section**: The page footer containing navigation links, social links, legal notices, and a waitlist CTA positioned directly above it.
- **Waitlist_CTA**: A call-to-action element positioned above the Footer_Section prompting users to join the product waitlist.
- **Signal_Green**: The accent colour (#00E676) used for success states, alpha indicators, and interactive highlights.
- **Design_System**: The visual language governing the Landing_Page_V2, including palette, typography, spacing, and border treatments.
- **shadcn_ui**: The component library providing pre-built, accessible UI primitives styled with Tailwind CSS.
- **Bento_Layout**: An asymmetric grid layout where certain cards are intentionally larger to convey visual hierarchy and importance.

## Requirements

### Requirement 1: Architecture Migration to React + TypeScript + Tailwind CSS

**User Story:** As a developer, I want the landing page built with React, TypeScript, Tailwind CSS, and shadcn/ui, so that the codebase is maintainable, type-safe, and uses a modern component architecture.

#### Acceptance Criteria

1. THE Landing_Page_V2 SHALL be implemented as a React application using TypeScript (.tsx/.ts) for all component and utility files, excluding build-tool configuration files (e.g., vite.config, tailwind.config, postcss.config) which may use .js or .ts.
2. THE Landing_Page_V2 SHALL use Tailwind CSS as the sole styling mechanism, with no separate CSS files for component-specific styles. A single global CSS entry-point file containing only Tailwind directives (@tailwind base, components, utilities) and CSS custom properties is permitted.
3. THE Landing_Page_V2 SHALL include at least one shadcn/ui component used in the rendered page, located in a `/components/ui` directory following the standard shadcn project structure (components.json at project root, cn utility function, and component files in /components/ui).
4. THE Landing_Page_V2 SHALL include framer-motion, @radix-ui/react-slot, class-variance-authority, and lucide-react as installed dependencies.
5. THE Landing_Page_V2 SHALL preserve all visible text content from the V1 implementation across all sections (Hero headline and subheadline, Alpha Decay cards, Agent Stack cards, Workflow copy, Technical Proof descriptions) such that every user-visible string renders identically to V1.
6. THE Landing_Page_V2 SHALL render as a single-page application with no client-side routing between sections.
7. THE Landing_Page_V2 SHALL produce a successful production build with zero TypeScript compilation errors and zero build-tool errors.

### Requirement 2: Animated Hero Background

**User Story:** As a visitor, I want the hero section to have an animated background with flowing SVG paths, so that the page feels dynamic and premium compared to the static V1 background.

#### Acceptance Criteria

1. WHEN the Landing_Page_V2 loads, THE BackgroundPaths_Component SHALL render behind the Hero_Section content with a background colour of neutral-950 (#0a0a0a) or darker (luminance equal to or less than #0a0a0a).
2. THE FloatingPaths_Subcomponent SHALL generate exactly 36 animated SVG path elements within the BackgroundPaths_Component.
3. WHILE the Hero_Section is visible, THE FloatingPaths_Subcomponent SHALL continuously loop the SVG path animations using framer-motion, with each path following an independent animation timeline of between 10 and 30 seconds per cycle that repeats infinitely.
4. THE BackgroundPaths_Component SHALL render SVG paths in white (#FFFFFF) with an opacity no greater than 0.15 so that overlaid text remains legible at a minimum contrast ratio of 4.5:1 against the background colour.
5. THE BackgroundPaths_Component SHALL not block pointer events or keyboard focus from reaching the Hero_Section headline, sub-headline, and CTA buttons.
6. IF the user has enabled `prefers-reduced-motion: reduce`, THEN THE BackgroundPaths_Component SHALL disable all SVG path animations and display the paths in a static position.

### Requirement 3: Live Signals Marquee

**User Story:** As a fund manager, I want to see a scrolling ticker of simulated live signals, so that the page conveys real-time intelligence capability and feels alive.

#### Acceptance Criteria

1. WHEN the Landing_Page_V2 loads, THE Live_Signals_Marquee SHALL display a continuously scrolling ticker positioned at the bottom of the Hero_Section, with each row completing a full scroll cycle in 20 to 40 seconds.
2. THE Live_Signals_Marquee SHALL display exactly the following four simulated trigger signals: "Hormuz Blockade: +14% Signal Strength", "Lithium Supply Cut: 3rd Order Impact Detected", "TSMC Fab Delay: Entropy Score 0.87", and "Baltic Dry Index Spike: Causal Map Updated".
3. THE Live_Signals_Marquee SHALL render as two rows scrolling in opposite directions (one left-to-right, one right-to-left).
4. WHEN a user hovers over or moves keyboard focus to an element within the Live_Signals_Marquee, THE Live_Signals_Marquee SHALL pause the scrolling animation for both rows.
5. THE Live_Signals_Marquee SHALL loop the signal content infinitely without visible gaps or jumps between repetitions.
6. THE Live_Signals_Marquee SHALL render signal text at a minimum computed font size of 14px and a minimum contrast ratio of 4.5:1 against its background, meeting WCAG 2.1 AA requirements.
7. IF the user has enabled `prefers-reduced-motion: reduce`, THEN THE Live_Signals_Marquee SHALL display all signal content in a static (non-scrolling) layout with both rows visible simultaneously.

### Requirement 4: Agent Stack Bento Layout with Scroll Animations

**User Story:** As a fund manager, I want the Agent Stack section to use an asymmetric layout with scroll-triggered animations, so that the key agents (The Auditor, The Entropy Model) are visually emphasised as the heavy lifters of the system.

#### Acceptance Criteria

1. WHEN the viewport width is 1024px or wider, THE Agent_Stack_Section SHALL display the four agent cards in a bento/asymmetric grid layout where "The Auditor" or "The Entropy Model" (or both) occupy a larger grid area than "The Scraper" and "The Reporter".
2. WHEN the viewport width is narrower than 1024px, THE Agent_Stack_Section SHALL display the four agent cards in a single-column stacked layout preserving the order: "The Scraper", "The Auditor", "The Entropy Model", "The Reporter".
3. WHEN at least 20% of the Agent_Stack_Section's height enters the viewport during scrolling, THE SectionWithMockup_Component SHALL trigger entry animations on the agent cards using framer-motion, transitioning each card from opacity 0 and a vertical offset of 20–40px to opacity 1 and zero offset, with a total transition duration between 400ms and 800ms per card and a stagger delay between 80ms and 150ms between consecutive cards.
4. WHILE the user scrolls within the Agent_Stack_Section's visible range, THE SectionWithMockup_Component SHALL apply parallax effects to primary and secondary image mockup elements within the Agent_Stack_Section, where the primary element translates vertically at a rate between 0.1× and 0.3× of the scroll distance and the secondary element translates at a rate between 0.4× and 0.6× of the scroll distance, producing a visible depth separation between the two layers.
5. THE Agent_Stack_Section SHALL preserve the exact card titles and descriptions from V1: "The Scraper" (Real-time monitoring of Polymarket, Kalshi, and industrial news APIs), "The Auditor" (Autonomous parsing of 10-K filings and global shipping manifests to find hidden dependencies), "The Entropy Model" (Mathematical modelling of 'Information Decay' to determine if a link is already priced in), "The Reporter" (Institutional-grade briefs delivered instantly to your existing workflow).
6. IF the user has enabled `prefers-reduced-motion: reduce`, THEN THE Agent_Stack_Section SHALL render all agent cards in their final visible state (opacity 1, zero offset) without any entry animation or parallax translation.
7. WHEN the Agent_Stack_Section entry animation is triggered, THE SectionWithMockup_Component SHALL complete the full animation sequence to the final state regardless of scroll speed, ensuring cards do not remain in a partially animated state.

### Requirement 5: Workflow Integration Section with Lucide Icons

**User Story:** As a fund manager, I want to see recognisable Slack and Notion icons on the integration buttons, so that I immediately understand the utility without reading button labels.

#### Acceptance Criteria

1. THE Workflow_Section SHALL display a "Send to Notion" button that includes the Notion icon from the lucide-react library rendered to the left of the button label text.
2. THE Workflow_Section SHALL display an "Alert Slack" button that includes the Slack icon from the lucide-react library rendered to the left of the button label text.
3. THE Workflow_Section SHALL preserve the existing copy: "Own the most painful 30 minutes of your research day. Automated causal mapping with one-click export to your team's workspace."
4. WHEN a user hovers over a mock-up button, THE Workflow_Section SHALL display a background colour change on that button.
5. WHEN a user presses a mock-up button, THE Workflow_Section SHALL display a visually distinct pressed state (different from the hover state) on that button and SHALL NOT trigger any external service call or navigation.
6. THE Workflow_Section SHALL render icons at a size between 16px and 24px, vertically centred relative to the adjacent button label text with no more than 2px vertical offset from the text centre line.
7. THE Workflow_Section SHALL ensure each button is announced to assistive technologies with its full label text (e.g., "Send to Notion", "Alert Slack") and the icons are hidden from the accessibility tree using aria-hidden="true".

### Requirement 6: Technical Proof Section with SVG Diagram

**User Story:** As a quantitatively minded fund manager, I want to see a visual diagram of the Bayesian Causal Network rather than a text-heavy paragraph, so that I can process the system's logic faster through a graph representation.

#### Acceptance Criteria

1. THE Technical_Proof_Section SHALL include an SVG diagram visualising the Bayesian Causal Network as a directed graph containing a minimum of 4 labelled nodes representing economic variables and a minimum of 4 directed edges representing causal relationships between those nodes.
2. THE Technical_Proof_Section SHALL include a concise textual explanation of Shannon Entropy limited to no more than 50 words.
3. THE Technical_Proof_Section SHALL present the SVG diagram at a minimum contrast ratio of 4.5:1 between node/edge/label elements and the section background, with node label text rendered at a minimum equivalent of 12px at any viewport width, and the diagram SHALL scale responsively (without horizontal overflow or requiring horizontal scrolling) on viewports from 375px width to 2560px width.
4. THE Technical_Proof_Section SHALL provide an accessible text alternative (via aria-label or a visually hidden description) for the SVG diagram that lists all nodes and their causal connections depicted in the visual representation.
5. THE Technical_Proof_Section SHALL present technical claims using only factual, falsifiable statements and SHALL NOT contain subjective superlatives or exclamation marks.
6. THE Technical_Proof_Section SHALL preserve the existing explanation of Bayesian Causal Networks in a condensed form (no more than 50 words) alongside the SVG diagram.
7. WHILE the viewport width is narrower than 768px, THE Technical_Proof_Section SHALL stack the SVG diagram and textual explanations vertically in a single-column layout.

### Requirement 7: FAQ Section

**User Story:** As an institutional prospect, I want to read short, technical answers to common objections, so that I can build trust in the product's rigour without scheduling a sales call.

#### Acceptance Criteria

1. THE FAQ_Section SHALL display exactly three question-and-answer pairs in a vertically stacked layout, with each pair separated by a visible border or spacing of at least 16px.
2. THE FAQ_Section SHALL include the question "How does Macro-Chain prevent hallucinations?" with the answer "Our Auditor agent cross-references 10-K filings with global shipping manifests. We do not generate links; we verify existing industrial dependencies."
3. THE FAQ_Section SHALL include the question "What is the average latency between a trigger and a 3rd-order alert?" with the answer "Our stack delivers validated causal maps in under 180 seconds."
4. THE FAQ_Section SHALL include the question "Can I customise the sectors monitored?" with the answer "Yes, the Terminal allows for vertical-specific focus on Energy, Semis, or Ag-Tech."
5. THE FAQ_Section SHALL render each answer in a visually distinct style from its corresponding question using at least one of the following differentiators: a minimum font-weight difference of 200 (e.g., 700 for questions, 400 for answers), a minimum left-indentation of 16px for answers, or a text colour that differs from the question text colour by at least a 3:1 contrast ratio between the two colours.
6. THE FAQ_Section SHALL use UK English spelling throughout all question and answer text.
7. WHEN the FAQ_Section loads, THE FAQ_Section SHALL display all answers visible by default without requiring user interaction to expand or reveal them.
8. THE FAQ_Section SHALL render each question-and-answer pair using semantic markup that programmatically associates each answer with its corresponding question (e.g., definition list elements, or heading elements for questions with paragraph elements for answers).
9. THE FAQ_Section SHALL include a section heading at the appropriate heading level (following the sequential heading hierarchy of the page) that identifies the section as containing frequently asked questions.

### Requirement 8: Proof of Alpha Section

**User Story:** As a fund manager, I want to see a concrete before-and-after example of Macro-Chain's predictive capability, so that I can assess the real-world value of the product.

#### Acceptance Criteria

1. THE Proof_Of_Alpha_Section SHALL display a two-panel layout: a left panel showing a timeline of the "Oil Spike" news event containing a minimum of 3 chronological entries (e.g., trigger detection, causal map update, alert issued), and a right panel showing a chart visualisation with a labelled time axis and a labelled value axis that plots the Macro-Chain alert firing point relative to the target equity price movement.
2. THE Proof_Of_Alpha_Section SHALL visually indicate that the Macro-Chain alert fired 48 hours before the target equity moved, using a time marker, annotation, or labelled axis that clearly distinguishes the alert timestamp from the equity movement timestamp.
3. WHILE the viewport is narrower than 768px, THE Proof_Of_Alpha_Section SHALL stack the timeline and chart panels vertically (timeline above chart).
4. THE Proof_Of_Alpha_Section SHALL render the chart and timeline using SVG or canvas elements that scale responsively without pixelation across viewport widths from 375px to 2560px.
5. THE Proof_Of_Alpha_Section SHALL provide accessible text alternatives (via aria-label or visually hidden description) for both the timeline and chart visualisations that convey: the event name ("Oil Spike"), the 48-hour lead time of the Macro-Chain alert, and the direction of the subsequent equity movement.
6. THE Proof_Of_Alpha_Section SHALL label the chart with at minimum a horizontal time axis and a vertical equity-movement axis, each displaying units or date references sufficient for a viewer to interpret the 48-hour lead without relying solely on colour.

### Requirement 9: Waitlist CTA

**User Story:** As a marketing stakeholder, I want a waitlist call-to-action positioned above the footer, so that users who have scrolled through the entire page can convert without scrolling back to the top.

#### Acceptance Criteria

1. THE Waitlist_CTA SHALL be positioned directly above the Footer_Section, visible to users who have scrolled to the bottom of the page.
2. THE Waitlist_CTA SHALL include a button or input field prompting users to join the waitlist, rendered with Signal_Green (#00E676) as the primary interactive colour and occupying a minimum width of 200 CSS pixels to ensure discoverability.
3. THE Waitlist_CTA SHALL be styled consistently with the Design_System (Signal_Green accent, dark background, Inter typeface).
4. THE Waitlist_CTA SHALL render the button or input at a minimum touch-target size of 44×44 CSS pixels.
5. WHEN a user activates the Waitlist_CTA button or submits the input field with a valid entry, THE Landing_Page_V2 SHALL display a visible confirmation state change (such as updated button text, a confirmation message, or navigation to a sign-up flow) within 200 milliseconds of activation.
6. IF a user submits the Waitlist_CTA input field with an empty value or an invalid email format, THEN THE Landing_Page_V2 SHALL display an inline error indication adjacent to the input field and SHALL NOT clear the user's existing input.

### Requirement 10: Footer Section

**User Story:** As a visitor, I want a structured footer with navigation links, social links, and legal notices, so that I can find additional information and trust the legitimacy of the product.

#### Acceptance Criteria

1. THE Footer_Section SHALL display a left column containing the Macro-Chain logo and the tagline "The Causal Intelligence Engine."
2. THE Footer_Section SHALL display a centre column with two groups: "Product" (containing links labelled Terminal, API, Backtesting) and "Company" (containing links labelled About, Ethics, Research).
3. THE Footer_Section SHALL display a right column containing social links for X/Twitter, LinkedIn, and GitHub, each rendered as an icon with a minimum touch-target size of 44×44 CSS pixels and an accessible name identifying the destination platform.
4. THE Footer_Section SHALL display a bottom bar containing the text "© 2026 Macro-Chain." and links labelled "Terms & Conditions", "Privacy Policy", and "Cookie Settings".
5. THE Footer_Section SHALL maintain the dark terminal aesthetic consistent with the Design_System (background colour #050505 or darker, text in #EAEAEA or #BDBDBD).
6. THE Footer_Section SHALL use UK English spelling throughout all visible text.
7. WHILE the viewport is narrower than 768px, THE Footer_Section SHALL stack the three columns vertically in the order: left column (logo and tagline), centre column (Product and Company groups), right column (social links).
8. WHEN a user activates a social link in the Footer_Section, THE Footer_Section SHALL open the linked URL in a new browser tab.
9. WHEN a user activates a navigation link in the Footer_Section (Product or Company groups), THE Landing_Page_V2 SHALL either scroll to the corresponding section on the page or navigate to the linked URL without triggering an error state.

### Requirement 11: Dark-Mode Design System Preservation

**User Story:** As a brand stakeholder, I want the V2 page to maintain the same dark-mode aesthetic and design tokens as V1, so that the brand identity remains consistent across the migration.

#### Acceptance Criteria

1. THE Design_System SHALL use a primary background colour of #050505 (deep black) configured as a Tailwind CSS custom colour token.
2. THE Design_System SHALL use Signal_Green (#00E676) as the sole accent colour, applied exclusively for success states, alpha indicators, interactive highlights, and CTA elements.
3. THE Design_System SHALL use Inter as the primary typeface for all text elements, loaded from the self-hosted woff2 file at `/src/fonts/inter-var.woff2`, with a fallback font stack of -apple-system, 'SF Pro Display', sans-serif applied in the font-family declaration so that text remains legible if the woff2 file fails to load.
4. THE Design_System SHALL apply a maximum border-radius of 2px to all interactive and container elements via Tailwind configuration.
5. THE Design_System SHALL restrict the colour palette to defined background (#050505), surface (#1A1A1A), border (rgba(42,42,42,0.2)), text-primary (#EAEAEA), text-secondary (#BDBDBD), and Signal_Green (#00E676) values, with no warm-toned hues (hue values between 0° and 60° on the HSL scale) permitted.
6. THE Design_System SHALL maintain a minimum contrast ratio of 4.5:1 for normal text (below 18.66px bold or below 24px regular) and a minimum contrast ratio of 3:1 for large text (18.66px bold or above, or 24px regular or above) against its respective background colour.

### Requirement 12: Performance Targets

**User Story:** As a marketing stakeholder, I want the V2 page to meet Core Web Vitals thresholds despite the addition of animations and new sections, so that page speed does not degrade conversion rates.

#### Acceptance Criteria

1. THE Landing_Page_V2 SHALL achieve a Largest Contentful Paint (LCP) of 2.5 seconds or less when tested on a cold load (empty browser cache, no service worker) with a simulated connection of 25 Mbps download throughput and 50 ms round-trip latency.
2. THE Landing_Page_V2 SHALL achieve a Cumulative Layout Shift (CLS) score of 0.1 or less measured across the full page load and any subsequent scroll through all sections.
3. THE Landing_Page_V2 SHALL achieve an Interaction to Next Paint (INP) of 200 milliseconds or less for all interactive elements.
4. THE Landing_Page_V2 SHALL lazy-load all framer-motion animations and below-the-fold sections such that the Hero_Section headline and primary CTA reach First Contentful Paint without waiting for below-the-fold JavaScript to be parsed or executed.
5. WHEN the viewport is 1024px × 768px or larger, THE Landing_Page_V2 SHALL present the Hero_Section headline and primary CTA fully visible within the initial viewport without scrolling.
6. THE Landing_Page_V2 SHALL be measured using Lighthouse in a Chromium-based browser under performance audit mode with the network and device conditions specified in criterion 1, and all criteria SHALL be evaluated against a single representative run or the median of three consecutive runs.

### Requirement 13: Accessibility Compliance

**User Story:** As a user with assistive technology, I want the V2 page to be fully navigable and readable, so that I can access all content regardless of ability.

#### Acceptance Criteria

1. THE Landing_Page_V2 SHALL achieve WCAG 2.1 AA compliance for all content sections including newly added FAQ, Proof of Alpha, Footer, and Marquee components.
2. THE Landing_Page_V2 SHALL provide semantic HTML structure with a single h1 element and heading levels that increment sequentially without skipping levels.
3. THE Landing_Page_V2 SHALL ensure all interactive elements are keyboard-navigable with visible focus indicators that have a minimum width of 2px and achieve a 3:1 contrast ratio against adjacent colours.
4. THE Landing_Page_V2 SHALL ensure the Live_Signals_Marquee is marked with `aria-live="off"` or equivalent so that screen readers do not announce each scrolling item as it appears.
5. IF the user has enabled `prefers-reduced-motion: reduce`, THEN THE Landing_Page_V2 SHALL disable all CSS transitions, CSS animations, and framer-motion animations, rendering content in its final state without intermediate motion frames.
6. THE Landing_Page_V2 SHALL render all interactive elements with a minimum touch-target size of 44×44 CSS pixels.
7. THE Landing_Page_V2 SHALL present keyboard focus order in a sequence that matches the visual top-to-bottom, left-to-right reading order of the content.
8. THE Landing_Page_V2 SHALL provide a skip-navigation link as the first focusable element on the page that, when activated, moves keyboard focus to the main content area bypassing repeated navigation elements.
9. THE Landing_Page_V2 SHALL provide a text alternative via `alt` attribute or `aria-label` for every non-decorative image and informational SVG element, and SHALL mark purely decorative images with `alt=""` or `aria-hidden="true"`.

### Requirement 14: Responsive Layout

**User Story:** As a fund manager accessing the page from various devices, I want the V2 page to adapt to different screen sizes, so that all new and existing content remains legible and well-structured.

#### Acceptance Criteria

1. WHEN the viewport width is 1024px or wider, THE Landing_Page_V2 SHALL display multi-column layouts for the Alpha_Decay_Section (three columns), Agent_Stack_Section (bento grid), Proof_Of_Alpha_Section (side-by-side panels), and Footer_Section (three columns).
2. WHEN the viewport width is between 768px and 1023px, THE Landing_Page_V2 SHALL reduce multi-column content sections to no more than two columns while preserving all content without horizontal overflow.
3. WHEN the viewport width is narrower than 768px, THE Landing_Page_V2 SHALL display all content sections in a single-column layout stacked vertically.
4. THE Landing_Page_V2 SHALL render body text at a minimum computed font size of 16px across all viewport widths from 320px to 2560px.
5. THE Landing_Page_V2 SHALL display no horizontal scrollbar and no content overflow beyond the viewport width at any viewport width between 320px and 2560px.
6. THE Landing_Page_V2 SHALL constrain all images, SVG elements, and media containers to a maximum width of 100% of their parent container so that no media element exceeds the viewport width at any viewport width between 320px and 2560px.

### Requirement 15: Typography and Language Standards

**User Story:** As a brand stakeholder, I want consistent UK English and typographic standards across the V2 page, so that the product voice remains precise and coherent across all new and existing sections.

#### Acceptance Criteria

1. THE Landing_Page_V2 SHALL use UK English spelling (per Oxford English Dictionary conventions) throughout all user-visible text, including headings, body copy, button labels, FAQ answers, footer text, image alt text, and dynamically rendered marquee content, with the exception of proper nouns, brand names, and third-party product names that have a fixed canonical spelling (e.g., "Polymarket", "Kalshi", "GitHub").
2. THE Landing_Page_V2 SHALL contain zero em dash (—) or en dash (–) characters in any user-visible text.
3. THE Landing_Page_V2 SHALL contain zero exclamation marks in any user-visible text.
4. THE Landing_Page_V2 SHALL contain zero subjective superlatives in any user-visible text, where a subjective superlative is defined as any word or compound phrase that makes an unverifiable absolute or comparative claim about quality or impact, including but not limited to the following prohibited terms: "revolutionary", "unmatched", "best-in-class", "game-changing", "world-class", "cutting-edge", "groundbreaking", "unparalleled", "industry-leading", "next-generation", and "state-of-the-art".
5. IF a text element on the Landing_Page_V2 contains a spelling that differs from Oxford English Dictionary UK conventions and the word is not a proper noun, brand name, or third-party product name with a fixed canonical spelling, THEN THE Landing_Page_V2 SHALL be considered non-conformant for that element.
