# Implementation Plan: Landing Page V2

## Overview

Migrate the Macro-Chain marketing landing page from vanilla HTML/CSS/JS to React + TypeScript + Tailwind CSS + shadcn/ui. The implementation preserves all existing content, introduces new sections (FAQ, Proof of Alpha, Footer, Waitlist CTA), adds framer-motion animations (BackgroundPaths, scroll-triggered Agent Stack, Live Signals Marquee), and enforces the dark-mode terminal design system. The page remains a single-page application built with Vite.

## Tasks

- [x] 1. Project scaffolding and build configuration
  - [x] 1.1 Initialise React + TypeScript project structure
    - Install dependencies: react, react-dom, @vitejs/plugin-react, typescript, @types/react, @types/react-dom, tailwindcss, postcss, autoprefixer, framer-motion, @radix-ui/react-slot, class-variance-authority, lucide-react, clsx, tailwind-merge
    - Update `package.json` with new dependencies and adjust scripts
    - Create `tsconfig.json` with strict mode, JSX react-jsx, path alias `@` → `src/`
    - Update `vite.config.ts` with `@vitejs/plugin-react`, path alias, and `manualChunks` for framer-motion
    - Create `postcss.config.js` with tailwindcss and autoprefixer plugins
    - Create `src/main.tsx` with `ReactDOM.createRoot` mounting into `#root`
    - Update `index.html` to remove old CSS/JS references, add `<div id="root"></div>`, keep font preload
    - _Requirements: 1.1, 1.4, 1.6, 1.7_

  - [x] 1.2 Configure Tailwind CSS with design system tokens
    - Create `tailwind.config.ts` with custom colours (bg-primary, surface, border, text-primary, text-secondary, signal-green), font family (Inter with system fallbacks), border-radius (2px for all sizes), and content paths
    - Create `src/styles/globals.css` with `@tailwind base; @tailwind components; @tailwind utilities;` directives, `@font-face` for Inter variable font, and CSS custom properties
    - Import `globals.css` in `src/main.tsx`
    - _Requirements: 1.2, 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 1.3 Set up shadcn/ui infrastructure
    - Create `components.json` at project root with shadcn/ui configuration (style: default, tailwind config path, components alias, utils alias)
    - Create `src/lib/cn.ts` with `clsx` + `tailwind-merge` utility function
    - Create `src/components/ui/button.tsx` using class-variance-authority with variants (default: Signal Green bg, secondary: surface with green border, outline, ghost) and sizes (default, sm, lg, icon) with `asChild` prop via `@radix-ui/react-slot`
    - Ensure minimum touch target of 44×44px on all button sizes
    - _Requirements: 1.3, 9.4, 13.6_

- [x] 2. Core application shell and shared utilities
  - [x] 2.1 Create App component and lazy-loading architecture
    - Create `src/App.tsx` composing all section components in order: HeroSection, AlphaDecaySection, AgentStackSection, WorkflowSection, TechnicalProofSection, FAQSection, ProofOfAlphaSection, WaitlistCTASection, FooterSection
    - Wrap below-fold sections (AlphaDecay through Footer) in `React.lazy()` + `<Suspense>` with static fallbacks
    - Add `<ErrorBoundary>` wrapper around each lazy section
    - Include skip-navigation link as first focusable element: `<a href="#main-content" className="...">Skip to main content</a>`
    - _Requirements: 1.6, 12.4, 13.8_

  - [x] 2.2 Create static content constants and data types
    - Create `src/lib/constants.ts` with all text content: hero headline/sub-headline, alpha decay cards, agent stack cards, workflow copy, FAQ items, signal items, footer links
    - Create `src/lib/types.ts` with TypeScript interfaces: `SignalItem`, `AgentCard`, `AlphaDecayCard`, `FAQItem`, `FooterLinkGroup`, `SocialLink`
    - Ensure all text uses UK English spelling, no em/en dashes, no exclamation marks, no subjective superlatives
    - _Requirements: 1.5, 4.5, 5.3, 7.2, 7.3, 7.4, 15.1, 15.2, 15.3, 15.4_

  - [x] 2.3 Create useReducedMotion hook
    - Create `src/hooks/use-reduced-motion.ts` wrapping framer-motion's `useReducedMotion()` hook
    - Export for use across all animated components
    - _Requirements: 2.6, 3.7, 4.6, 13.5_

- [ ] 3. Checkpoint - Verify project scaffolding
  - Ensure all tests pass, ask the user if questions arise.
  - Verify: `npm run build` completes with zero errors, Tailwind generates utility classes, shadcn Button renders correctly

- [x] 4. Hero section with BackgroundPaths animation
  - [x] 4.1 Implement BackgroundPaths and FloatingPaths components
    - Create `src/components/background-paths.tsx`
    - `FloatingPaths` generates exactly 36 SVG `<path>` elements with framer-motion animations
    - Each path has independent animation timeline (10–30s cycle, infinite repeat)
    - Paths rendered in white (#FFFFFF) with opacity ≤ 0.15
    - Container has `pointer-events-none`, `aria-hidden="true"`, background colour neutral-950 (#0a0a0a) or darker
    - Respect `prefers-reduced-motion`: render paths static when active
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 4.2 Write unit tests for BackgroundPaths
    - Test exactly 36 SVG path elements are rendered
    - Test `pointer-events-none` and `aria-hidden="true"` attributes present
    - Test paths have opacity ≤ 0.15
    - Test reduced motion renders static paths
    - _Requirements: 2.2, 2.4, 2.5, 2.6_

  - [x] 4.3 Implement LiveSignalsMarquee component
    - Create `src/components/marquee.tsx` with generic `Marquee` component
    - Create `src/components/hero-section.tsx` composing BackgroundPaths + content + LiveSignalsMarquee
    - Render two rows scrolling in opposite directions (left-to-right, right-to-left)
    - Display exactly 4 signal items from constants, duplicated 3× for seamless looping
    - Scroll cycle: 20–40 seconds per full cycle
    - Pause on hover/focus via `animation-play-state: paused`
    - Mark with `aria-live="off"` and `role="marquee"`
    - Minimum font size 14px, contrast ratio ≥ 4.5:1
    - Reduced motion: display static layout with both rows visible
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 13.4_

  - [x] 4.4 Write unit tests for LiveSignalsMarquee
    - Test exactly 4 unique signal texts rendered
    - Test two rows with opposite direction attributes
    - Test `aria-live="off"` attribute present
    - Test pause behaviour on hover/focus
    - Test reduced motion renders static layout
    - _Requirements: 3.2, 3.3, 3.4, 3.7, 13.4_

  - [x] 4.5 Implement HeroSection component
    - Compose BackgroundPaths, headline (h1), sub-headline, two CTA buttons (Launch Terminal, View Backtested Alphas), and LiveSignalsMarquee
    - Hero headline and CTA visible within initial viewport at 1024×768 without scrolling
    - Use shadcn Button component for CTAs
    - _Requirements: 1.5, 2.1, 12.5_

- [x] 5. Alpha Decay section
  - [x] 5.1 Implement AlphaDecaySection component
    - Create `src/components/alpha-decay-section.tsx`
    - Three-column grid at ≥1024px, single-column below 768px
    - Render three cards (1st Order, 2nd Order, 3rd Order) with exact V1 content from constants
    - 3rd Order card visually highlighted (Signal Green accent)
    - _Requirements: 1.5, 14.1, 14.3_

- [x] 6. Agent Stack section with scroll animations
  - [x] 6.1 Implement SectionWithMockup component
    - Create `src/components/section-with-mockup.tsx`
    - Use `useScroll` + `useTransform` from framer-motion for parallax (primary: 0.1–0.3× scroll, secondary: 0.4–0.6× scroll)
    - Entry animation triggered by `useInView` at 20% threshold: opacity 0 → 1, translateY 20–40px → 0, duration 400–800ms, stagger 80–150ms
    - Animation completes to final state regardless of scroll speed
    - Disable all motion when reduced motion is active
    - _Requirements: 4.3, 4.4, 4.6, 4.7_

  - [x] 6.2 Implement AgentStackSection component
    - Create `src/components/agent-stack-section.tsx`
    - Bento/asymmetric grid at ≥1024px: "The Auditor" and/or "The Entropy Model" occupy larger grid area
    - Single-column stacked layout below 1024px in order: Scraper, Auditor, Entropy Model, Reporter
    - Preserve exact card titles and descriptions from V1 constants
    - Wrap cards with SectionWithMockup for scroll animations
    - _Requirements: 4.1, 4.2, 4.5_

  - [x] 6.3 Write unit tests for AgentStackSection
    - Test all four agent cards render with correct titles and descriptions
    - Test bento layout classes applied at desktop viewport
    - Test single-column layout at mobile viewport
    - _Requirements: 4.1, 4.2, 4.5_

- [x] 7. Workflow section with Lucide icons
  - [x] 7.1 Implement WorkflowSection component
    - Create `src/components/workflow-section.tsx`
    - Render preserved copy from constants
    - "Send to Notion" button with Lucide `NotebookPen` (or closest Notion icon) rendered left of label
    - "Alert Slack" button with Lucide `Slack` icon rendered left of label (use `MessageSquare` if Slack not available)
    - Icons at 16–24px, vertically centred, `aria-hidden="true"`
    - Buttons have hover state (background colour change) and pressed state (visually distinct from hover)
    - Buttons do not trigger external calls or navigation
    - Buttons announced with full label text to assistive technologies
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 8. Checkpoint - Verify above-fold and mid-page sections
  - Ensure all tests pass, ask the user if questions arise.
  - Verify: Hero renders with animation, Alpha Decay shows 3 columns on desktop, Agent Stack has bento layout, Workflow buttons have icons

- [x] 9. Technical Proof section with SVG diagram
  - [x] 9.1 Implement TechnicalProofSection component
    - Create `src/components/technical-proof-section.tsx`
    - SVG Bayesian Causal Network diagram: minimum 4 labelled nodes (economic variables) and 4 directed edges
    - Shannon Entropy explanation ≤ 50 words
    - Bayesian Causal Networks explanation ≤ 50 words (condensed from V1)
    - SVG scales responsively (375px–2560px) without horizontal overflow
    - Contrast ratio ≥ 4.5:1 for node/edge/label elements against background
    - Node label text minimum 12px equivalent at any viewport
    - Accessible text alternative via `aria-label` listing all nodes and causal connections
    - Stack SVG and text vertically below 768px
    - No subjective superlatives or exclamation marks
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 10. FAQ section
  - [x] 10.1 Implement FAQSection component
    - Create `src/components/faq-section.tsx`
    - Render exactly 3 Q&A pairs from constants in vertically stacked layout
    - Separation between pairs: visible border or spacing ≥ 16px
    - Visual differentiation: questions in font-semibold text-primary, answers in font-normal text-secondary with left indentation ≥ 16px
    - All answers visible by default (no expand/collapse interaction required)
    - Semantic markup: use `<dl>` with `<dt>` for questions and `<dd>` for answers
    - Section heading at appropriate heading level in page hierarchy
    - UK English throughout
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_

  - [x] 10.2 Write unit tests for FAQSection
    - Test exactly 3 Q&A pairs rendered
    - Test correct question and answer text content
    - Test semantic markup (dl/dt/dd elements)
    - Test visual differentiation classes applied
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.8_

- [x] 11. Proof of Alpha section
  - [x] 11.1 Implement ProofOfAlphaSection component
    - Create `src/components/proof-of-alpha-section.tsx`
    - Two-panel layout: left panel = timeline (≥3 chronological entries for "Oil Spike" event), right panel = chart (SVG with time axis + value axis)
    - Chart plots Macro-Chain alert firing point 48 hours before equity movement with clear time marker/annotation
    - Responsive: stack vertically (timeline above chart) below 768px
    - SVG/canvas elements scale without pixelation (375px–2560px)
    - Accessible text alternatives for both timeline and chart (event name, 48-hour lead, equity direction)
    - Chart labelled with horizontal time axis and vertical equity-movement axis with units/dates
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 12. Waitlist CTA section
  - [x] 12.1 Implement WaitlistCTASection component
    - Create `src/components/waitlist-cta-section.tsx`
    - Positioned directly above FooterSection
    - Button/input with Signal Green (#00E676) as primary colour, minimum width 200px
    - Minimum touch target 44×44px
    - Styled with Design System (dark background, Inter typeface)
    - On activation: display confirmation state change within 200ms (updated button text or message)
    - On invalid/empty submission: display inline error, do not clear input
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 13. Footer section
  - [x] 13.1 Implement FooterSection component
    - Create `src/components/footer-section.tsx`
    - Three-column layout at ≥768px: left (logo + tagline "The Causal Intelligence Engine."), centre (Product: Terminal/API/Backtesting + Company: About/Ethics/Research), right (social icons: X/Twitter, LinkedIn, GitHub)
    - Social links: icon with 44×44px touch target, accessible name, open in new tab (`target="_blank" rel="noopener noreferrer"`)
    - Bottom bar: "© 2026 Macro-Chain." + Terms & Conditions, Privacy Policy, Cookie Settings links
    - Background #050505 or darker, text #EAEAEA/#BDBDBD
    - Stack columns vertically below 768px (left → centre → right)
    - UK English throughout
    - Navigation links scroll to section or navigate without error
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_

  - [x] 13.2 Write unit tests for FooterSection
    - Test three columns render with correct content
    - Test social links have accessible names and target="_blank"
    - Test bottom bar contains copyright and legal links
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 14. Checkpoint - Verify all sections render correctly
  - Ensure all tests pass, ask the user if questions arise.
  - Verify: all sections render, content matches V1, new sections (FAQ, Proof of Alpha, Footer, Waitlist) display correctly

- [x] 15. Responsive layout and accessibility hardening
  - [x] 15.1 Implement responsive breakpoints across all sections
    - Verify and adjust: 3-column → 2-column → 1-column transitions at 1024px and 768px breakpoints
    - Ensure no horizontal overflow at any viewport 320px–2560px
    - Body text minimum 16px across all viewports
    - All images/SVGs constrained to max-width 100% of parent
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [x] 15.2 Implement accessibility features
    - Verify single h1, sequential heading levels (no skips)
    - All interactive elements keyboard-navigable with visible focus indicators (2px width, 3:1 contrast)
    - Focus order matches visual reading order (top-to-bottom, left-to-right)
    - Skip-navigation link as first focusable element
    - All non-decorative images/SVGs have `alt` or `aria-label`; decorative images have `alt=""` or `aria-hidden="true"`
    - All interactive elements meet 44×44px touch target
    - _Requirements: 13.1, 13.2, 13.3, 13.6, 13.7, 13.8, 13.9_

  - [x] 15.3 Write accessibility E2E tests
    - Run axe-core audit via Playwright at multiple viewports (375px, 768px, 1024px, 1440px)
    - Test keyboard navigation order
    - Test focus indicators visible on all interactive elements
    - Test skip-navigation link functionality
    - _Requirements: 13.1, 13.3, 13.7, 13.8_

- [x] 16. Performance optimisation
  - [x] 16.1 Implement lazy loading and code splitting
    - Verify `React.lazy()` + `<Suspense>` for all below-fold sections
    - Verify framer-motion in separate chunk via `manualChunks`
    - Preload Inter woff2 in `<head>` with `font-display: swap`
    - Ensure Hero headline and CTA render without waiting for below-fold JS
    - Add `<SectionErrorBoundary>` fallbacks for failed lazy loads
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 16.2 Write performance E2E tests
    - Test LCP ≤ 2.5s at simulated 25 Mbps / 50ms RTT
    - Test CLS ≤ 0.1 across full page scroll
    - Test Hero visible without scroll at 1024×768
    - _Requirements: 12.1, 12.2, 12.5_

- [x] 17. Content validation and property-based tests
  - [x] 17.1 Validate all text content for language standards
    - Review all strings in `src/lib/constants.ts` for UK English spelling
    - Verify no em dashes (—), en dashes (–), or exclamation marks
    - Verify no subjective superlatives from banned list
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [x] 17.2 Write property test: no banned punctuation
    - **Property 1: Text content contains no banned punctuation**
    - Install `fast-check` as dev dependency
    - Import all text constants from `constants.ts`
    - Assert no string contains —, –, or ! characters
    - Minimum 100 iterations
    - **Validates: Requirements 15.2, 15.3**

  - [x] 17.3 Write property test: no subjective superlatives
    - **Property 2: Text content contains no subjective superlatives**
    - Import all text constants from `constants.ts`
    - Assert no string contains words from banned superlatives list
    - Minimum 100 iterations
    - **Validates: Requirements 15.4**

- [ ] 18. Final checkpoint - Full build and test verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify: `npm run build` succeeds with zero errors, all unit tests pass, all content renders correctly, responsive layouts work at all breakpoints

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The existing `/web` directory (Next.js dashboard) is unaffected by this implementation
- All text content must use UK English spelling throughout
- The Inter variable font at `/src/fonts/inter-var.woff2` is already present in the repository

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3", "2.2", "2.3"] },
    { "id": 3, "tasks": ["2.1"] },
    { "id": 4, "tasks": ["4.1", "4.3", "5.1", "7.1"] },
    { "id": 5, "tasks": ["4.2", "4.4", "4.5", "6.1", "9.1", "10.1", "11.1", "12.1", "13.1"] },
    { "id": 6, "tasks": ["6.2", "6.3", "10.2", "13.2"] },
    { "id": 7, "tasks": ["15.1", "15.2", "17.1"] },
    { "id": 8, "tasks": ["15.3", "16.1"] },
    { "id": 9, "tasks": ["16.2", "17.2", "17.3"] }
  ]
}
```
