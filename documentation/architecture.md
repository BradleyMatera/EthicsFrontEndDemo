# Architecture and Design Narrative

## High-Level Overview

The tutorial site is a statically exported Next.js App Router project that simulates three secret-management patterns (hardcoded, shared file, environment variables) and contrasts them with best practices. The app is divided into three tiers:

1. **UI tier** – App Router pages under `src/app/**` render educational content, interactive demos, and data visualizations. Components (in `src/components/**`) provide layout scaffolding, theming, navigation, and reusable UI blocks.
2. **Demo API tier** – Route handlers under `src/app/api/**` emulate backend behaviors for each secret pattern, returning JSON payloads for front-end visualizations. During static export they are pre-rendered as JSON files and consumed client-side.
3. **Storytelling assets** – Summaries in `app-*.js`, static HTML (`index.html`), and sub-repos (`hardcoded-demo`, `shared-demo`, `env-demo`) reinforce the narrative with minimal JavaScript demos.

The environment is intentionally simple to highlight best practices around secrets and deployment hygiene.

## Technology Stack

| Concern | Tooling | Notes |
| --- | --- | --- |
| Package/runtime | Bun 1.3.x | Handles installs and script execution; Next.js still compiles for Node.js 20.x. |
| Framework | Next.js 16 (App Router) | Uses server components, metadata API, and static export. |
| Language | TypeScript | Strong typing in components/API; `.d.ts` typing directives kept under `next-env.d.ts`. |
| UI | Tailwind CSS + NextUI | Tailwind handles layout/spacing; NextUI offers accessible primitives like `Navbar`, `Card`, `Table`. |
| Styling | `globals.css`, Tailwind config | Uses `tailwind.config.ts` + PostCSS chain to compile utilities. |
| Icons | `lucide-react`, `@heroicons/react` | Consistent icon sets across demos and cards. |
| State/Theming | `next-themes` | Dark/light mode toggled from navigation. |
| Deployment | GitHub Actions + Pages | Static site generated via `bun run build:github-pages`, uploaded from `out/`. |

## Application Flow

1. **Bootstrap** – `src/app/layout.tsx` wraps every page in `Providers`, `Navigation`, `Footer`, applies fonts, and sets metadata.
2. **Navigation** – `src/components/Navigation.tsx` renders the NextUI navbar. Each item uses `NextLink` to ensure base path awareness on GitHub Pages.
3. **Content Pages** – App Router pages under `src/app/**/page.tsx` fetch or embed data, using NextUI cards/tables to explain concepts:
   - `/` home page introduces the problem space.
   - `/demos/*` showcase each secret pattern with code snippets.
   - `/comparison` and `/best-practices` consolidate analysis and guidance.
4. **API Routes** – Under `src/app/api/**/route.ts`, each handler returns JSON describing the simulated secret state. During `NEXT_STATIC_EXPORT=true` builds these routes opt into `force-static`, so Next.js emits JSON files under `out/api/...` that match runtime responses.
5. **Static Export** – `next.config.js` checks `NEXT_STATIC_EXPORT`. When true it switches to `output: "export"` and applies trailing slashes. Combined with `NEXT_PUBLIC_BASE_PATH=/EthicsFrontEndDemo`, the exported bundle uses relative asset URLs aligned with GitHub Pages hosting.
6. **Hosting** – GitHub Actions workflow installs dependencies with Bun, builds via `bun run build:github-pages`, and publishes the `out/` artifact to Pages.

## Providers and Global State

- `src/components/providers.tsx` currently renders a NextUI `NextUIProvider` and the `ThemeProvider` from `next-themes`. It centralizes global context for the App Router tree.
- Fonts (`Geist`, `Geist_Mono`) are loaded via `next/font/google` and exposed as CSS variables consumed in `RootLayout`.

## Styling System

- `tailwind.config.ts` extends NextUI’s preset, enabling design tokens.
- `globals.css` defines base Tailwind layers, CSS custom properties, and background gradients.
- `style.css` (legacy static demo) styles the standalone `index.html` illustrating the assignment brief.

## Build and Config Pipeline

- `next.config.js` – Normalizes `basePath`/`assetPrefix` based on `NEXT_PUBLIC_BASE_PATH`. Maintains `images.unoptimized` to avoid Next.js Image optimization (which static export cannot perform).
- `tsconfig.json` – Enables App Router typed routes, sets `paths` alias (`@/*`).
- `eslint.config.mjs` & `tailwind.config.ts` – Provide linting/styling baselines compatible with Bun.
- `.github/workflows/deploy.yml` & `.github/workflows/pages.yml` – Distinct workflows that both (1) install Bun, (2) configure Node 20.11.1, (3) run `bun run build:github-pages`, and (4) upload `out/` to GitHub Pages.

## Data Sources

Most content is static, but the API routes synthesize JSON at build time from in-memory objects and environment variables when available. Highlighted behaviors:

- **Hardcoded demo** (`src/app/api/demo/hardcoded/route.ts`) – Returns intentionally exposed secrets with warnings; `dynamic = "force-static"` ensures export compatibility.
- **Shared secrets demo** (`src/app/api/demo/shared/route.ts`) – Reads `secrets.json`, masks values, and reports associated risks.
- **Environment demo** (`src/app/api/demo/environment/route.ts`) – Validates environment variables, masks them, and communicates security posture.
- **Dashboard** (`src/app/api/dashboard/route.ts`) – Aggregates project audit metrics, deriving presence of files (`.env.local`, `secrets.json`, etc.).
- **Comparison** (`src/app/api/comparison/route.ts`) – Summaries of the three approaches plus recommendations and scenario analysis.

## Component Library Highlights

- `src/components/Breadcrumb.tsx` – Standard breadcrumb component across detail pages.
- `src/components/Footer.tsx` – Provides site-wide footer with resource links and badges.
- `src/components/TutorialProgress.tsx` – Tracks steps through the tutorial with progress indication.
- `src/components/ui/*` – Contains shared NextUI wrappers (buttons, cards) and custom elements to reduce duplication.

## Static Demo Assets

- `hardcoded-demo/`, `shared-demo/`, `env-demo/` – Standalone static builds (each with `index.html`) offering minimal reproductions of the three patterns. Useful during workshops where participants view raw HTML/JS without bootstrapping the entire Next app.
- `app-*.js` files – Node scripts that align with the three secret strategies, supporting command-line demonstrations.

## Summary

The project emphasizes clarity and reproducibility over complexity. By consolidating UI, demo APIs, and automation in a static export pipeline, the repo offers a self-contained secret-management tutorial that remains deployable on constrained platforms such as GitHub Pages.
