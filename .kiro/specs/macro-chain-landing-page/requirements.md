# Requirements Document

## Introduction

Macro-Chain is an institutional-grade macro-intelligence terminal for fund managers. This document specifies the requirements for a high-conversion, dark-mode landing page that communicates the product's value proposition: identifying third-order equity impacts before the market prices them in. The page follows a minimalist, high-end design language inspired by Bloomberg Terminal and Palantir aesthetics, using UK English spelling throughout.

## Glossary

- **Landing_Page**: The single-page marketing website for Macro-Chain, serving as the primary conversion funnel for institutional prospects.
- **Hero_Section**: The above-the-fold area of the Landing_Page containing the primary headline, sub-headline, and call-to-action buttons.
- **Alpha_Decay_Section**: A three-column layout explaining the diminishing alpha at each order of market reaction.
- **Agent_Stack_Section**: A feature grid presenting the four autonomous agents that power Macro-Chain.
- **Workflow_Section**: A section demonstrating integration capabilities with existing team tools.
- **Technical_Proof_Section**: A section providing mathematical credibility through mention of Shannon Entropy and Bayesian Causal Networks.
- **CTA**: Call-to-action; an interactive element prompting the user to take a specific conversion action.
- **Signal_Green**: The accent colour (#00E676) used for success states, alpha indicators, and interactive links.
- **Design_System**: The visual language governing the Landing_Page, including palette, typography, spacing, and border treatments.
- **Terminal_Launch_Flow**: The destination screen or application state reached when a user activates the "Launch Terminal" CTA.
- **Backtested_Alphas_View**: The destination screen or application state reached when a user activates the "View Backtested Alphas" CTA.

## Requirements

### Requirement 1: Hero Section Display

**User Story:** As a fund manager visiting the Landing_Page, I want to immediately understand Macro-Chain's value proposition, so that I can decide whether to engage further.

#### Acceptance Criteria

1. WHEN the Landing_Page loads, THE Hero_Section SHALL display the headline "Stop Trading the News. Trade the Ripple." within the viewport without requiring scrolling.
2. WHEN the Landing_Page loads, THE Hero_Section SHALL display the sub-headline "Identify third-order equity impacts before the market prices them in. The only causal intelligence engine built for the information latency gap." within the viewport without requiring scrolling.
3. WHEN the Landing_Page loads, THE Hero_Section SHALL display a primary CTA button labelled "Launch Terminal" with visually prominent styling distinguishable from the secondary CTA button.
4. WHEN the Landing_Page loads, THE Hero_Section SHALL display a secondary CTA button labelled "View Backtested Alphas" with visually subdued styling distinguishable from the primary CTA button.
5. WHEN a user activates the "Launch Terminal" CTA button, THE Landing_Page SHALL navigate the user to the Terminal_Launch_Flow screen.
6. WHEN a user activates the "View Backtested Alphas" CTA button, THE Landing_Page SHALL navigate the user to the Backtested_Alphas_View screen.
7. WHEN the Landing_Page loads, THE Hero_Section SHALL render all content (headline, sub-headline, and both CTA buttons) within 2 seconds of the navigation request completing.

### Requirement 2: Alpha Decay Problem Section

**User Story:** As a fund manager, I want to understand why first and second-order signals are insufficient, so that I recognise the value of third-order causal intelligence.

#### Acceptance Criteria

1. WHILE the viewport is wider than 768px, THE Alpha_Decay_Section SHALL display three columns in a horizontal layout ordered left-to-right as 1st Order, 2nd Order, 3rd Order
2. THE Alpha_Decay_Section SHALL display the first column with the label "1st Order", the descriptor "High Entropy", the explanation "Bots trade the headline in milliseconds", and the indicator "Alpha: 0"
3. THE Alpha_Decay_Section SHALL display the second column with the label "2nd Order", the descriptor "Market Reaction", the explanation "Analysts publish; retail follows", and the indicator "Alpha: Marginal"
4. THE Alpha_Decay_Section SHALL display the third column with the label "3rd Order", the descriptor "The Fuse", the sub-descriptor "The Information Edge", the explanation "Supply chain ripples and byproduct shocks. This is where Macro-Chain lives", and a Signal_Green (#00E676) border on the left edge to visually distinguish it from the other columns
5. WHILE the viewport is 768px or narrower, THE Alpha_Decay_Section SHALL stack the three columns vertically in top-to-bottom order as 1st Order, 2nd Order, 3rd Order
6. THE Alpha_Decay_Section SHALL display a section heading of "The Alpha Decay Problem" above the three columns

### Requirement 3: Four-Agent Stack Feature Grid

**User Story:** As a fund manager, I want to understand the technical capabilities of Macro-Chain's agent architecture, so that I can assess its fitness for my workflow.

#### Acceptance Criteria

1. WHEN the viewport width is 1024px or wider, THE Agent_Stack_Section SHALL display four feature cards in a 2x2 grid layout
2. WHEN the viewport width is narrower than 1024px, THE Agent_Stack_Section SHALL display the four feature cards in a single-column stacked layout
3. THE Agent_Stack_Section SHALL display the four cards in the following fixed order: "The Scraper", "The Auditor", "The Entropy Model", "The Reporter"
4. THE Agent_Stack_Section SHALL display a card titled "The Scraper" with the description "Real-time monitoring of Polymarket, Kalshi, and industrial news APIs"
5. THE Agent_Stack_Section SHALL display a card titled "The Auditor" with the description "Autonomous parsing of 10-K filings and global shipping manifests to find hidden dependencies"
6. THE Agent_Stack_Section SHALL display a card titled "The Entropy Model" with the description "Mathematical modelling of 'Information Decay' to determine if a link is already priced in"
7. THE Agent_Stack_Section SHALL display a card titled "The Reporter" with the description "Institutional-grade briefs delivered instantly to your existing workflow"
8. THE Agent_Stack_Section SHALL render each card with a visible title and description, where the title is visually distinct from the description through font weight or size differentiation

### Requirement 4: Workflow Integration Section

**User Story:** As a fund manager, I want to see how Macro-Chain integrates with my existing tools, so that I can understand the operational benefit without changing my workflow.

#### Acceptance Criteria

1. THE Workflow_Section SHALL display a mock-up interface containing a "Send to Notion" button and an "Alert Slack" button, visually styled as interactive elements consistent with the Design_System
2. THE Workflow_Section SHALL display the copy "Own the most painful 30 minutes of your research day. Automated causal mapping with one-click export to your team's workspace."
3. WHEN a user activates a mock-up button, THE Landing_Page SHALL display a visible hover or pressed state on the button but SHALL NOT trigger any external service call or navigation
4. THE Workflow_Section SHALL display a contextual label (e.g., "Integrations" or "Workflow") as a section heading to identify the purpose of the mock-up to the user

### Requirement 5: Technical Proof Section

**User Story:** As a quantitatively minded fund manager, I want to see the mathematical foundations of Macro-Chain, so that I can trust the rigour of its causal analysis.

#### Acceptance Criteria

1. THE Technical_Proof_Section SHALL include a textual explanation of how Shannon Entropy is applied to measure information decay, containing at minimum the named concept and a plain-language description of its role in the system
2. THE Technical_Proof_Section SHALL include a textual explanation of how Bayesian Causal Networks are applied to validate causal links, containing at minimum the named concept and a plain-language description of its role in the system
3. THE Technical_Proof_Section SHALL present technical claims using only factual, falsifiable statements and SHALL NOT contain subjective superlatives (e.g., "revolutionary", "unmatched", "best-in-class"), unsubstantiated comparative claims, or exclamation marks
4. THE Technical_Proof_Section SHALL limit each technical explanation to no more than 50 words per concept, ensuring content is scannable without requiring extended reading

### Requirement 6: Dark-Mode Design System

**User Story:** As a fund manager accustomed to terminal interfaces, I want the Landing_Page to use a dark, professional aesthetic, so that the product feels aligned with institutional-grade tooling.

#### Acceptance Criteria

1. THE Design_System SHALL use a primary background colour of #050505 (deep black)
2. THE Design_System SHALL use secondary surface colours within the range #111111 to #1E1E1E and border colours within the range #1E1E1E to #2A2A2A for all secondary surfaces and borders
3. THE Design_System SHALL use Signal_Green (#00E676) exclusively for success states, alpha indicators, and interactive link highlights
4. THE Design_System SHALL use Inter or SF Pro as the sole typeface for all text elements, with no other font families permitted
5. THE Design_System SHALL apply a maximum border-radius of 2px to all interactive and container elements
6. THE Design_System SHALL apply borders no wider than 1px with opacity between 10% and 30% to container and divider elements, with no rounded corners exceeding 2px radius
7. THE Design_System SHALL use #EAEAEA or brighter as the primary text colour and #9E9E9E to #BDBDBD as the secondary text colour, maintaining a minimum contrast ratio of 4.5:1 against the element's background colour for all text elements on the Landing_Page
8. THE Design_System SHALL restrict the Landing_Page colour palette to the defined background, surface, border, text, and Signal_Green values, with no warm-toned hues (hue values between 0° and 60° on the HSL scale) permitted

### Requirement 7: Typography and Language Standards

**User Story:** As a brand stakeholder, I want consistent UK English and typographic standards across the Landing_Page, so that the product voice remains precise and coherent.

#### Acceptance Criteria

1. THE Landing_Page SHALL use UK English spelling (per Oxford English Dictionary conventions) throughout all user-visible text, including headings, body copy, button labels, and image alt text (e.g., "Analysing", "Modelling", "Optimised")
2. THE Landing_Page SHALL contain zero em dash (—) or en dash (–) characters in any user-visible text, using colons or full stops instead
3. THE Landing_Page SHALL use each Glossary-defined term exclusively when referring to its corresponding concept, with no synonyms or alternate phrasings substituted across any section
4. IF a text element on the Landing_Page contains a spelling that differs from Oxford English Dictionary UK conventions, THEN THE Landing_Page SHALL be considered non-conformant for that element

### Requirement 8: Responsive Layout

**User Story:** As a fund manager accessing the page from various devices, I want the Landing_Page to adapt to different screen sizes, so that the content remains legible and well-structured.

#### Acceptance Criteria

1. WHEN the viewport width is 1024px or wider, THE Landing_Page SHALL display content sections that contain multiple related items (Alpha_Decay_Section, Agent_Stack_Section) in multi-column grid layouts as defined in their respective requirements
2. WHEN the viewport width is between 768px and 1023px, THE Landing_Page SHALL reduce multi-column content sections to no more than two columns while preserving all content without horizontal overflow
3. WHEN the viewport width is narrower than 768px, THE Landing_Page SHALL display all content sections in a single-column layout stacked vertically
4. THE Landing_Page SHALL render body text at a minimum computed font size of 16px across all supported viewport widths
5. THE Landing_Page SHALL render all interactive elements (buttons, links) with a minimum touch-target size of 44×44 CSS pixels across all supported viewport widths
6. THE Landing_Page SHALL display no horizontal scrollbar and no content overflow beyond the viewport width at any supported viewport width between 320px and 2560px

### Requirement 9: Performance and Conversion Optimisation

**User Story:** As a marketing stakeholder, I want the Landing_Page to load quickly and guide users toward conversion, so that we maximise engagement from institutional prospects.

#### Acceptance Criteria

1. THE Landing_Page SHALL achieve a Largest Contentful Paint (LCP) of 2.5 seconds or less when tested on a simulated connection of 25 Mbps download throughput and 50 ms round-trip latency
2. THE Landing_Page SHALL achieve a Cumulative Layout Shift (CLS) score of 0.1 or less
3. THE Landing_Page SHALL present the primary CTA ("Launch Terminal") fully visible within the initial viewport without scrolling on desktop viewports of 1024px × 768px or larger
4. THE Landing_Page SHALL display the Hero_Section headline at the largest font size of any text element on the page, position the sub-headline directly below the headline, and position the primary CTA below the sub-headline, establishing a top-to-bottom reading order within the initial viewport
5. THE Landing_Page SHALL achieve an Interaction to Next Paint (INP) of 200 milliseconds or less for all interactive elements

### Requirement 10: Accessibility Compliance

**User Story:** As a user with assistive technology, I want the Landing_Page to be navigable and readable, so that I can access the content regardless of ability.

#### Acceptance Criteria

1. THE Landing_Page SHALL achieve a minimum colour contrast ratio of 4.5:1 for all body text against its background
2. THE Landing_Page SHALL achieve a minimum colour contrast ratio of 3:1 for all text rendered at 18pt or above (or 14pt bold or above) and all interactive element boundaries against their background
3. THE Landing_Page SHALL provide semantic HTML structure with a single h1 element per page and heading levels that increment sequentially without skipping levels (e.g., h1 followed by h2, not h1 followed by h3)
4. THE Landing_Page SHALL ensure all interactive elements are keyboard-navigable with focus indicators that have a minimum width of 2px and achieve a 3:1 contrast ratio against adjacent colours
5. THE Landing_Page SHALL provide alt text of 1 to 150 characters conveying the purpose or content for all non-decorative images and mock-up elements, and SHALL apply empty alt attributes or aria-hidden to all decorative images
6. THE Landing_Page SHALL present keyboard focus order in a sequence that matches the visual top-to-bottom, left-to-right reading order of the content
