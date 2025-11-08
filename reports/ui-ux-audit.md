# MonaDocs UI/UX Audit — October 2025

## Overview
This audit reviews the MonaDocs documentation portal with a focus on visual identity alignment, interaction consistency, accessibility, and navigation clarity. Each section below lists the issue observed, its impact on the experience, and the remediation applied or recommended.

## Visual identity & typography
- **Issue**: The primary palette on the production site was dominated by generic purple hues and default system fonts, deviating from Monynha’s blue/green/purple identity and prescribed typography (Inter + serif for headings). **Impact**: Weak brand recognition and inconsistent reading rhythm across pages.
  - **Resolution**: Reset the design tokens to Monynha Blue (`#2563EB`), Green (`#10B981`), and supporting tones, and defined Inter/Merriweather as the global base and heading families to keep typography consistent in both light and dark themes.【F:src/css/custom.css†L8-L39】
  - **Resolution**: Updated hero treatments to use the new gradient, increased subtitle line height to 1.75 rem, and constrained copy width to avoid dense paragraphs on wide screens.【F:src/css/custom.css†L75-L108】

## Buttons & interactive states
- **Issue**: Buttons across the hero, feature cards, and CTA sections reused translucent white borders that failed the 4.5:1 contrast requirement and offered inconsistent hover behavior. **Impact**: Users could misinterpret button priority and encounter low-contrast outlines, especially on mobile overlays.
  - **Resolution**: Standardized `button--primary`, `button--secondary`, and `button--outline` with brand-aligned fills, 2 px borders, and consistent hover/focus elevation, while keeping pill-shaped outlines for approachability.【F:src/css/custom.css†L110-L159】【F:src/css/custom.css†L201-L206】
  - **Resolution**: Refined homepage outline buttons to use an accessible blue stroke/hover treatment and blur-backed glass effect for readability against the hero gradient.【F:src/pages/index.module.css†L45-L57】
  - **Resolution**: Ensured CTA outline buttons remain transparent until interaction and invert to dark text on hover for contrast on the gradient background.【F:src/components/Portfolio/styles.module.css†L317-L327】

## Imagery & iconography
- **Issue**: The Undraw illustrations shipped with Docusaurus did not match Monynha’s brand style. **Impact**: Visual inconsistency and diluted storytelling in the homepage features grid.
  - **Resolution**: Replaced stock SVGs with bespoke brand-colored illustrations and wired them with accessible `aria-label`s so assistive tech can interpret the imagery’s meaning.【F:src/components/HomepageFeatures/index.js†L5-L52】【F:static/img/icon-projects.svg†L1-L11】【F:static/img/icon-technologies.svg†L1-L12】【F:static/img/icon-standards.svg†L1-L11】

## Navigation & information architecture
- **Issue**: The main navigation tucked key sections inside a single dropdown, forcing extra taps on mobile and making lateral wayfinding harder. **Impact**: Reduced discoverability of core documentation hubs.
  - **Resolution**: Promoted each major section (Introduction, Repositories, Technologies, Guidelines, Identity, Contribution, Architecture) to first-level navbar items and mirrored the structure in the footer for parity between desktop and mobile experiences.【F:docusaurus.config.js†L86-L146】

## Accessibility enhancements
- **Issue**: Several interactive areas were `div` elements relying on click handlers, offering no keyboard focus states. **Impact**: Keyboard and assistive-technology users could not navigate project/technology cards, violating WCAG 2.1.1.
  - **Resolution**: Converted TechStack tiles and portfolio project selectors to semantic `<button>` elements with `aria-pressed` tracking and keyboard activation via Enter/Space.【F:src/components/TechStack/index.js†L50-L73】【F:src/components/Portfolio/index.js†L195-L218】
  - **Resolution**: Introduced global `:focus-visible` outlines using the Monynha green accent and respected `prefers-reduced-motion` to reduce animation overload for motion-sensitive users.【F:src/css/custom.css†L261-L276】

## Content hierarchy & spacing
- **Issue**: Feature blocks and selector panels lacked breathing room and visual anchoring. **Impact**: Dense layouts reduced scanability and undermined the intended hierarchy.
  - **Resolution**: Added a soft gradient backdrop and drop shadows to feature imagery, and elevated tech/project cards with consistent shadows, minimum heights, and hover transitions for clearer grouping.【F:src/components/HomepageFeatures/styles.module.css†L1-L14】【F:src/components/TechStack/styles.module.css†L26-L66】【F:src/components/Portfolio/styles.module.css†L40-L75】
  - **Resolution**: Highlighted the active project in the portfolio using inset outlines and status chip color shifts to reinforce selection state feedback.【F:src/components/Portfolio/styles.module.css†L69-L75】

## Asset refresh & favicon
- **Issue**: The legacy SVG favicon did not represent the Monynha brand and lacked `.ico` support for older browsers. **Impact**: Inconsistent tab iconography and potential fallback to generic icons.
  - **Resolution**: Generated a minimalist “M” favicon in PNG and ICO formats and updated the site configuration to reference the ICO entry point.【F:docusaurus.config.js†L15-L16】

## Performance & responsiveness
- **Resolution**: Card components now rely on CSS transitions with respect for `prefers-reduced-motion`, and CTA/button shadows reuse CSS variables to avoid expensive repaints.【F:src/css/custom.css†L110-L159】【F:src/css/custom.css†L261-L276】
  - **Observation**: Layout grids continue to use responsive `auto-fit`/media queries; no blocking issues were found, but continue monitoring TechStack preview fetches to ensure they remain cached for repeated visits.

## Additional recommendations
1. **Micro-interactions**: Introduce subtle scroll prompts or parallax cues below the hero once analytics confirm engagement gaps; keep them behind the `prefers-reduced-motion` guard for accessibility compliance.
2. **Documentation copy**: Collaborate with content authors to refresh hero and CTA copy for PT/EN parity and clearer value propositions (outside the scope of this code-oriented pass).
3. **SVG optimization**: When new proprietary illustrations are ready, run them through SVGO to minimize payload before replacing the interim icon set added here.
