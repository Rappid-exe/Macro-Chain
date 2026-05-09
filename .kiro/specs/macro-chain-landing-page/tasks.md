# Implementation Plan: Macro-Chain Landing Page

## Overview

Build a static, dark-mode landing page for Macro-Chain using vanilla HTML, CSS, and minimal JavaScript with Vite as the build tool. The implementation follows a section-by-section approach: project scaffolding → design system → page sections (hero through technical proof) → responsive layout → performance optimisation → accessibility hardening → testing.

## Tasks

- [x] 1. Set up project structure and build tooling
  - [x] 1.1 Initialise Vite project with static HTML mode
    - Run `npm init -y` and install Vite as a dev dependency
    - Create `vite.config.js` with static site configuration (asset hashing, minification)
    - Create directory structure: `src/`, `src/styles/`, `src/scripts/`, `src/fonts/`, `public/`
    - Create root `index.html` with `<!DOCTYPE html>`, `<html lang="en-GB">`, viewport meta, and charset
    - Add `<main>` element with empty `<section>` placeholders for each page section
    - Add build and dev scripts to `package.json`
    - _Requirements: 9.1, 9.2_

  - [x] 1.2 Set up font assets and preloading
    - Add self-hosted Inter variable font (woff2 subset) to `src/fonts/`
    - Create `@font-face` declaration with `font-display: swap` for FOUT behaviour
    - Add `<link rel="preload">` for the font file in `index.html` head
    - Configure fallback stack: `-apple-system, 'SF Pro Display', sans-serif`
    - _Requirements: 6.4, 9.1_

- [x] 2. Implement design system tokens and base styles
  - [x] 2.1 Create CSS custom properties and base reset
    - Create `src/styles/tokens.css` with all design system custom properties (palette, typography, spacing, borders)
    - Define `--color-bg-primary: #050505`, `--color-surface: #1A1A1A`, `--color-border: rgba(42, 42, 42, 0.2)`, `--color-text-primary: #EAEAEA`, `--color-text-secondary: #BDBDBD`, `--color-accent: #00E676`
    - Define typography scale using `clamp()` for fluid sizing (body min 16px)
    - Define spacing scale (xs through xl) and border tokens (2px radius, 1px width)
    - Create `src/styles/reset.css` with minimal CSS reset (box-sizing, margin removal)
    - Create `src/styles/main.css` that imports tokens and reset
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 8.4_

  - [x] 2.2 Create button and interactive element base styles
    - Define `.btn` base class with 44x44px minimum touch target, 2px border-radius
    - Define `.btn-primary` with Signal Green background (#00E676), #050505 text
    - Define `.btn-secondary` with transparent background, 1px Signal Green border, Signal Green text
    - Add `:hover`, `:active`, and `:focus-visible` states with 2px focus ring at 3:1 contrast
    - Ensure all interactive elements meet 44x44px minimum touch target
    - _Requirements: 6.3, 6.5, 8.5, 10.4_

- [ ] 3. Implement Hero Section
  - [-] 3.1 Build Hero Section HTML and styles
    - Add `<section id="hero" aria-labelledby="hero-heading">` with semantic structure
    - Add `<h1 id="hero-heading">` with text "Stop Trading the News. Trade the Ripple."
    - Add `<p class="hero-sub">` with sub-headline text about third-order equity impacts
    - Add primary CTA `<a class="btn btn-primary" href="/terminal">Launch Terminal</a>`
    - Add secondary CTA `<a class="btn btn-secondary" href="/alphas">View Backtested Alphas</a>`
    - Style h1 as largest font on page using `--font-size-h1` (clamp 2.5rem–4rem)
    - Ensure all hero content renders above the fold on 1024x768 viewport
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 9.3, 9.4, 10.3_

  - [ ]* 3.2 Write unit tests for Hero Section content
    - Verify headline text matches "Stop Trading the News. Trade the Ripple."
    - Verify sub-headline text matches requirements
    - Verify primary CTA label is "Launch Terminal" with href="/terminal"
    - Verify secondary CTA label is "View Backtested Alphas" with href="/alphas"
    - Verify single h1 element exists on page
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ] 4. Implement Alpha Decay Section
  - [-] 4.1 Build Alpha Decay Section HTML and styles
    - Add `<section id="alpha-decay" aria-labelledby="alpha-decay-heading">`
    - Add `<h2 id="alpha-decay-heading">The Alpha Decay Problem</h2>`
    - Create three-column CSS Grid layout (`repeat(3, 1fr)` above 768px, `1fr` below)
    - Build 1st Order column: label "1st Order", descriptor "High Entropy", explanation "Bots trade the headline in milliseconds", indicator "Alpha: 0"
    - Build 2nd Order column: label "2nd Order", descriptor "Market Reaction", explanation "Analysts publish; retail follows", indicator "Alpha: Marginal"
    - Build 3rd Order column: label "3rd Order", descriptor "The Fuse", sub-descriptor "The Information Edge", explanation "Supply chain ripples and byproduct shocks. This is where Macro-Chain lives", Signal Green left border (2px solid #00E676)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 4.2 Write unit tests for Alpha Decay Section content
    - Verify section heading text is "The Alpha Decay Problem"
    - Verify all three columns contain correct labels, descriptors, and explanations
    - Verify 3rd Order column has Signal Green border-left
    - _Requirements: 2.2, 2.3, 2.4, 2.6_

- [ ] 5. Implement Agent Stack Section
  - [-] 5.1 Build Agent Stack Feature Grid HTML and styles
    - Add `<section id="agent-stack" aria-labelledby="agent-stack-heading">`
    - Add `<h2 id="agent-stack-heading">` with appropriate section heading
    - Create 2x2 CSS Grid layout (`repeat(2, 1fr)` at ≥1024px, `1fr` below)
    - Build four cards in fixed order: "The Scraper", "The Auditor", "The Entropy Model", "The Reporter"
    - Each card: surface colour #1A1A1A, 1px border at 20% opacity, 2px radius
    - Card titles visually distinct from descriptions (font weight/size differentiation)
    - Include full description text for each card per requirements
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 5.2 Write unit tests for Agent Stack Section content
    - Verify four cards exist in correct order
    - Verify each card title and description matches requirements exactly
    - Verify title elements have distinct styling from description elements
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 6. Checkpoint - Verify core sections
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement Workflow Integration Section
  - [ ] 7.1 Build Workflow Integration Section HTML and styles
    - Add `<section id="workflow" aria-labelledby="workflow-heading">`
    - Add `<h2 id="workflow-heading">` with section heading (e.g., "Integrations" or "Workflow")
    - Add section copy: "Own the most painful 30 minutes of your research day. Automated causal mapping with one-click export to your team's workspace."
    - Create "Send to Notion" and "Alert Slack" mock-up buttons styled consistently with Design_System
    - Add minimal JS: `event.preventDefault()` on button click to prevent navigation
    - Implement hover/active states on mock buttons (CSS `:hover`/`:active` with JS enhancement)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 7.2 Write E2E tests for Workflow Section mock buttons
    - Verify "Send to Notion" and "Alert Slack" buttons are visible
    - Verify clicking mock buttons does not trigger navigation or external calls
    - Verify hover/pressed states are visually applied
    - _Requirements: 4.1, 4.3_

- [ ] 8. Implement Technical Proof Section
  - [ ] 8.1 Build Technical Proof Section HTML and styles
    - Add `<section id="technical-proof" aria-labelledby="technical-proof-heading">`
    - Add `<h2 id="technical-proof-heading">` with appropriate section heading
    - Write Shannon Entropy explanation (≤50 words): named concept + plain-language role description
    - Write Bayesian Causal Networks explanation (≤50 words): named concept + plain-language role description
    - Ensure no superlatives, no exclamation marks, only factual falsifiable statements
    - Use UK English spelling throughout (e.g., "modelling", "analysing")
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 7.1, 7.2_

  - [ ]* 8.2 Write unit tests for Technical Proof Section content
    - Verify Shannon Entropy concept is named and described
    - Verify Bayesian Causal Networks concept is named and described
    - Verify each description is ≤50 words
    - Verify no exclamation marks or superlatives in section text
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 9. Implement responsive layout and final styling
  - [ ] 9.1 Implement responsive breakpoints and layout rules
    - Verify CSS Grid responds correctly at 1024px breakpoint (Agent Stack: 2-col → 1-col)
    - Verify CSS Grid responds correctly at 768px breakpoint (Alpha Decay: 3-col → 1-col)
    - Ensure tablet (768px–1023px) reduces to max 2 columns with no horizontal overflow
    - Ensure mobile (<768px) displays all sections in single-column vertical stack
    - Verify no horizontal scrollbar appears at any width from 320px to 2560px
    - Add `max-width: var(--max-width)` container with auto margins for content centering
    - _Requirements: 8.1, 8.2, 8.3, 8.6_

  - [ ] 9.2 Implement critical CSS inlining for build
    - Configure Vite plugin or build script to extract and inline critical above-the-fold CSS
    - Load remaining CSS asynchronously via `media="print" onload="this.media='all'"` pattern
    - Verify hero section renders styled without waiting for full CSS bundle
    - _Requirements: 1.7, 9.1_

- [ ] 10. Implement accessibility hardening
  - [ ] 10.1 Add semantic structure and accessibility attributes
    - Verify single `<h1>` exists (hero heading) with sequential heading levels (h1 → h2, no skips)
    - Add `aria-labelledby` attributes to all `<section>` elements referencing their headings
    - Add meaningful `alt` text (1–150 chars) to any non-decorative images/mock-ups
    - Apply `aria-hidden="true"` or empty `alt=""` to decorative elements
    - Verify keyboard focus order matches visual reading order (top-to-bottom, left-to-right)
    - Ensure focus indicators: 2px width, 3:1 contrast ratio against adjacent colours
    - _Requirements: 10.3, 10.4, 10.5, 10.6_

  - [ ]* 10.2 Write accessibility tests with axe-core
    - Set up @axe-core/playwright integration
    - Run automated WCAG 2.1 AA audit on full page
    - Verify colour contrast ratios (4.5:1 body text, 3:1 large text and interactive boundaries)
    - Verify touch target sizes (≥44x44px) for all interactive elements
    - Verify heading hierarchy (no skipped levels)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 11. Checkpoint - Full page integration
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Set up testing infrastructure and write integration tests
  - [x] 12.1 Configure Vitest and Playwright test environments
    - Install Vitest, jsdom, Playwright, @axe-core/playwright as dev dependencies
    - Create `vitest.config.js` with jsdom environment for unit tests
    - Create `playwright.config.js` with desktop (1440px), tablet (768px), and mobile (375px) viewports
    - Add test scripts to `package.json` (`test:unit`, `test:e2e`, `test:a11y`)
    - _Requirements: 9.1, 10.1_

  - [ ]* 12.2 Write E2E responsive layout tests
    - Test Alpha Decay Section: 3 columns at >768px, 1 column at ≤768px
    - Test Agent Stack Section: 2 columns at ≥1024px, 1 column at <1024px
    - Test no horizontal overflow at 320px and 2560px viewport widths
    - Test body text minimum computed font size ≥16px at all breakpoints
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6_

  - [ ]* 12.3 Write E2E navigation and interaction tests
    - Test primary CTA navigates to `/terminal`
    - Test secondary CTA navigates to `/alphas`
    - Test keyboard tab order matches visual order
    - Test focus indicators are visible on all interactive elements
    - _Requirements: 1.5, 1.6, 10.4, 10.6_

- [ ] 13. Performance optimisation and Lighthouse CI
  - [ ] 13.1 Optimise for Core Web Vitals targets
    - Verify font preload eliminates render-blocking
    - Verify critical CSS inline prevents layout shift (CLS ≤ 0.1)
    - Verify no layout shifts from font swap (explicit dimensions or font-size-adjust)
    - Minify HTML, CSS, and JS in production build
    - Add asset hashing for cache-busting
    - Verify LCP target (≤2.5s) with Lighthouse on simulated 25 Mbps / 50ms RTT
    - _Requirements: 9.1, 9.2, 9.5_

  - [ ]* 13.2 Set up Lighthouse CI configuration
    - Install and configure Lighthouse CI
    - Set performance budgets: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms
    - Configure simulated throttling (25 Mbps download, 50ms RTT)
    - Add Lighthouse CI script to `package.json`
    - _Requirements: 9.1, 9.2, 9.5_

- [ ] 14. Content validation and UK English compliance
  - [ ] 14.1 Validate all copy for UK English and style compliance
    - Review all user-visible text for UK English spelling (modelling, analysing, optimised, colour)
    - Verify zero em dash (—) or en dash (–) characters in any visible text
    - Verify glossary terms used consistently (no synonyms or alternate phrasings)
    - Verify Signal Green (#00E676) used only for success states, alpha indicators, and interactive links
    - Verify no warm-toned hues (HSL hue 0°–60°) in any CSS colour value
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 6.3, 6.8_

- [ ] 15. Final checkpoint - Complete validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- No property-based tests are included as the design explicitly states PBT does not apply to this static page feature
- Unit tests validate DOM structure and content correctness via Vitest + jsdom
- E2E tests validate responsive behaviour, navigation, and accessibility via Playwright
- All text content must use UK English spelling throughout

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["2.2", "12.1"] },
    { "id": 3, "tasks": ["3.1", "4.1", "5.1"] },
    { "id": 4, "tasks": ["3.2", "4.2", "5.2", "7.1", "8.1"] },
    { "id": 5, "tasks": ["7.2", "8.2", "9.1"] },
    { "id": 6, "tasks": ["9.2", "10.1"] },
    { "id": 7, "tasks": ["10.2", "12.2", "12.3"] },
    { "id": 8, "tasks": ["13.1"] },
    { "id": 9, "tasks": ["13.2", "14.1"] }
  ]
}
```
