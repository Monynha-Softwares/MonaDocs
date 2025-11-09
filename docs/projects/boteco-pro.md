---
title: "Boteco Pro"
sidebar_position: 1
---

# Boteco Pro

This document summarizes the Boteco Pro project with a focus on frontend, content, UI/UX, and engineering patterns discovered in the project repository. It follows a standardized format so the same template can be reused for other projects.

## Quick facts

- Source repository: https://github.com/Monynha-Softwares/BotecoPro
- Primary frontend: Flutter (Web / Mobile / Desktop)
- Authentication: Clerk (frontend-managed via ClerkAuth)
- Persistence: client-side persistence via localStorage (JSON)
- Build output (web): ~3.8 MB (optimized release)

## Summary

Boteco Pro is a Flutter-based hospitality management application for bars and restaurants. The project is architected as a single-page Flutter Web app with mobile and desktop support. The codebase follows clear separation between core/business logic and presentation, uses Provider-style state management, and centralizes persistence through a `DatabaseService` that serializes objects to JSON and writes to `localStorage`.

## Frontend architecture & patterns

- Project layout (conventions):
	- `lib/main.dart` — application entry point and responsive navigation wiring.
	- `lib/theme.dart` — centralized theme and design tokens.
	- `lib/core/` — models, providers, services (business logic and persistence).
	- `lib/presentation/pages/` — page widgets named `*_page.dart` (e.g., `products_page.dart`).
	- `lib/presentation/widgets/` — shared, reusable UI components (e.g., `bottom_navigation.dart`, `shared_widgets.dart`).

- Page & widgets pattern:
	- Pages are `StatefulWidget`s following a predictable lifecycle (`initState`, async data load, `setState`).
	- Reusable visual primitives live in `shared_widgets.dart` to avoid duplication.

- State management & services:
	- `DatabaseService` acts as the single persistence gateway (singleton-like) and exposes CRUD methods.
	- Providers wrap stateful services (e.g., `AuthProvider`, `DatabaseProvider`) and notify UI via `ChangeNotifier`.
	- Caching and in-memory stores are used for performance; code includes fixes to ensure caches use correct types (List vs Map).

- Theming & tokens:
	- Material 3 theme with centralized colors in `theme.dart`.
	- Primary token palette: Primary Wine `#8B1E3F`, Secondary Mustard `#B3701A`, Accent Beige `#F1DDAD`, Brown `#4F3222`.
	- Fonts: preferred system fonts to avoid remote font fetches that harm performance.

- Responsive & navigation patterns:
	- Breakpoints: Mobile (<600px), Tablet (600–800px), Desktop (>=800px), Large Desktop (>=1200px).
	- Mobile: BottomNavigationBar and single-column layouts.
	- Desktop: NavigationRail (sidebar) and multi-column grids.

## Content & documentation patterns

- Documentation is thorough and role-oriented (DOCUMENTATION_INDEX.md provides role-based reading paths for managers, developers, and DevOps).
- Docs structure is consistent: concise README, architecture pages, deployment guides, and quick summary audit files.
- In-app content patterns:
	- Use short, consistent labels (singular nouns for entities: Product, Order, Table).
	- Model serialization methods `toJson()` / `fromJson()` for predictable storage and migration.
	- Localization uses `intl`; code updates keep compatibility with packages (e.g., `intl: ^0.20.2`).

## UI/UX patterns & accessibility

- Accessibility:
	- Prefer accessible components (Clerk-provided auth UI is used for accessibility benefits).
	- Maintain color-contrast ratios with the selected palette.
	- Keyboard navigable forms and clear focus states are recommended.

- Form patterns:
	- Validate inputs client-side and show inline error messages.
	- Use consistent loading indicators and disabled states for submit buttons.
	- Follow progressive disclosure: show only necessary fields and allow expansion for advanced options.

- Performance & UX:
	- Avoid remote fonts and large assets to keep `main.dart.js` small.
	- Use service worker caching for offline support and faster subsequent loads.

## Data persistence & offline patterns

- Persistence pattern:
	- `DatabaseService` serializes domain objects and stores them under well-known `localStorage` keys (e.g., `products`, `orders`, `tables`).
	- On app init, the service loads and deserializes these keys to restore state.

- Caching & concurrency:
	- Write locks and debouncing are applied for bulk writes to avoid thrashing localStorage.
	- In-memory caches reduce read overhead; caches must be kept typed (List vs Map).

- Security & constraints:
	- Do not store sensitive PII or secrets in localStorage (design notes explicitly list what should NOT be stored).

## Authentication & session management

- Clerk is used as the primary authentication provider via `ClerkAuth` and `ClerkAuthBuilder`.
- Recommended configuration: provide `CLERK_PUBLISHABLE_KEY` via `.env` and validate key presence at runtime.
- Auth flows replace legacy login/signup pages and provide accessible, production-ready forms.

## Testing & CI

- Testing patterns:
	- Unit tests for data models (`test/models_test.dart`).
	- Widget/integration tests for UI flows (`testWidgets` with `pumpWidget`).
	- E2E via webdriver/puppeteer for critical flows (add table, create order, payment).

- CI/CD suggestions (pattern used in repo docs):
	- Use GitHub Actions with a Flutter action to run `flutter analyze`, `flutter test`, `flutter build web --release`, then deploy (Firebase/Netlify).
	- Provide secrets via GitHub Secrets (Clerk keys, Firebase service account) and avoid committing `.env`.

## Deployment

- Preferred option in repo: Firebase Hosting (with service worker and PWA support). Alternative options: Netlify, GitHub Pages, AWS S3.
- Build step: `flutter build web --release` → serve `build/web`.

## Design tokens (reference)

- Colors:
	- Primary: #8B1E3F (Wine)
	- Secondary: #B3701A (Mustard)
	- Accent: #F1DDAD (Beige)
	- Dark: #4F3222 (Brown)

- Spacing scale: use 4px baseline (4, 8, 12, 16, 24, 32)
- Typography: system fonts for web performance; scale for Mobile/Tablet/Desktop

## Reusable project documentation template

Use this section as a template for other projects. Each project doc should include:

1. Quick facts (repo link, frontend, auth, persistence)
2. One-paragraph executive summary
3. Frontend architecture & file layout
4. Content & documentation conventions
5. UI/UX patterns (accessibility, breakpoints, navigation)
6. Data & persistence patterns (services, cache, localStorage keys)
7. Auth and security notes (env variables, secrets handling)
8. Testing & CI (commands and required secrets)
9. Deployment (commands and common providers)
10. Design tokens (colors, spacing, typography)
11. Links to detailed docs (README, WEB_ARCHITECTURE.md, FIREBASE_DEPLOYMENT_GUIDE.md)

## Links & references

- BotecoPro README: https://github.com/Monynha-Softwares/BotecoPro/blob/dev/README.md
- Architecture & docs: https://github.com/Monynha-Softwares/BotecoPro/tree/dev/docs

## Next steps

1. Review this page and merge to `dev` so maintainers can iterate.
2. Apply the same template to other projects under `docs/projects/`.
3. Optionally add a short checklist and automation to validate project docs follow this template (CI check).
