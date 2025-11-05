# EthicsFrontEndDemo Documentation Hub

Welcome to the documentation bundle for the **Node.js Secrets Management Tutorial** front-end. This folder collects project-wide knowledge so future contributors can understand the architecture, history, and operational playbooks without context switching across chat transcripts or commit logs.

## How These Docs Are Organized

| File | Purpose |
| --- | --- |
| [`architecture.md`](architecture.md) | Deep dive into application structure, technology choices, data flow, and design rationale. |
| [`file-reference.md`](file-reference.md) | Exhaustive index explaining what every tracked file or directory does. |
| [`deployment.md`](deployment.md) | Local development workflow, automated GitHub Pages deployment, environment configuration, and validation steps. |
| [`troubleshooting.md`](troubleshooting.md) | Bugs caught during development (with fixes), plus guidance for diagnosing future regressions. |

Each document assumes you read them in the order above, but they are cross-linked so you can jump directly to the information you need.

## Project Snapshot

- **Framework**: Next.js 16 (App Router) with TypeScript, Tailwind CSS, and NextUI for UI primitives.
- **Runtime**: Bun-managed toolchain (package and script runner) with Node.js 20.x for production builds.
- **Hosting**: GitHub Pages via static export; workflow automation in `.github/workflows/deploy.yml` and `.github/workflows/pages.yml`.
- **Problem Domain**: Demonstrate secret management pitfalls (hardcoded, shared file) versus best practice (environment variables) through interactive content, API routes, and dashboard visualizations.

## Quick Start References

- To build locally: `bun install && bun run dev`
- To lint: `bun lint`
- To produce the static bundle exactly like GitHub Pages: `bun run build:github-pages`
- To trigger deployment: push to `master` (or use `workflow_dispatch` on the **Deploy to GitHub Pages** workflow).

Read on for the full story behind each part of the stack, how it evolved, and how to keep it healthy.
