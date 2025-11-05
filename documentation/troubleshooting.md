# Troubleshooting and Incident Log

This file serves two purposes:

1. Document issues discovered while hardening the tutorial.
2. Provide repeatable debugging playbooks for future regressions.

## Incident Timeline

| When | Symptom | Root Cause | Fix |
| --- | --- | --- | --- |
| 2025-11-05 | GitHub Pages build failed with `Node.js version ">=20.9.0" is required` | Workflow pinned to Node 18.x | Updated both deployment workflows to install Node 20.11.1 via `actions/setup-node@v4`. |
| 2025-11-05 | `actions/upload-pages-artifact` failed: `tar: docs: Cannot open` | Static export script attempted to upload removed `docs/` directory | Removed `docs/`, ignored it, rewired workflow to target `out/` produced by `bun run build:github-pages`. |
| 2025-11-05 | GitHub Pages nav links returned 404 | NextUI `Link` emitted raw anchors without Next.js base path | Set `as={NextLink}` so routing respects `/EthicsFrontEndDemo` base path. |
| 2025-11-05 | Workflow logged `Invalid next.config.js options` | `actions/configure-pages` injected incompatible experimental keys into TypeScript config | Replaced `next.config.ts` with `next.config.js` containing our base-path logic. The action now merges settings cleanly. |
| 2025-11-05 | Static export blocked: `dynamic = "force-static" ... not configured` | API routes default to dynamic rendering | Added `export const dynamic = "force-static"; export const revalidate = 0;` to every route handler. |
| 2025-11-05 | Local `bun run export` regenerated obsolete `docs/` artifacts | Build script moved `out` → `docs` for GitHub Pages branch deployment | Simplified `build:pages` to leave output in `out/`; added `build:github-pages` alias for workflows. |

## Debugging Playbooks

### Static Export Fails with API Errors

Symptoms:

- `Failed to collect page data for /api/...`
- Messages referencing `dynamic = "force-static"` or `revalidate`.

Resolution:

1. Open the failing route under `src/app/api/**/route.ts`.
2. Ensure `export const dynamic = "force-static";` and `export const revalidate = 0;` appear near the top.
3. Re-run `bun run build:github-pages` and confirm `out/api/...` JSON is generated.

### GitHub Pages Upload Can't Find `out/`

Symptoms:

- `tar: out: Cannot open: No such file or directory` during `actions/upload-pages-artifact`.

Checks:

1. Confirm workflow runs `bun run build:github-pages` (not `bun run build`).
2. Inspect Next.js logs for `Creating an optimized production build ...` followed by route summary.
3. If `actions/configure-pages` injects config, ensure `next.config.js` remains JavaScript (not TypeScript).

### Base Path 404s in Production

Symptoms:

- Navigation works locally but 404s on GitHub Pages at `/EthicsFrontEndDemo/...`.

Resolution:

1. Verify links use Next.js routing primitives (e.g., `NextLink`).
2. Check `NEXT_PUBLIC_BASE_PATH` passed to build equals `/EthicsFrontEndDemo`.
3. Inspect generated HTML in `out/` to confirm anchor `href`s begin with `/EthicsFrontEndDemo/...`.

### Workflow Injects Unexpected Config

`actions/configure-pages@v4` modifies the Next config to set `basePath`, `assetPrefix`, and image settings. If your custom settings disappear:

1. Keep the config in JavaScript form (`module.exports = nextConfig`).
2. Avoid exporting nested experimental objects the action might overwrite—merge them inside `next.config.js` using `Object.assign` if necessary.

### Node Version Drift

If builds fail citing Node version requirements:

1. Update the workflows to the latest LTS release accepted by Next.js.
2. Run `bun --version` locally; ensure it aligns with CI expectations.
3. Consider adding an `.nvmrc` or `.node-version` file to sync developer environments.

## Preventative Guardrails

- **Linting**: Run `bun lint` and `bun run type-check` before pushing. API files are TypeScript and benefit from early detection.
- **Static Export Smoke Test**: `bun run build:github-pages && ls out` verifies the workflow path locally.
- **Navigation Regression Test**: After UI tweaks, visit `http://localhost:3000/demos/...`; then open `out/demos/.../index.html` to ensure static routing remains intact.
- **Secrets Hygiene**: Remember `secrets.json` is intentionally committed for the shared demo. Do not add real secrets. Rotate placeholders if scanned by GitHub secret scanning bots.

## Future Work

- Automate link checking post-deploy (e.g., with `lychee`) to catch broken base-path URLs.
- Add CI job to run `bun run build:github-pages` on pull requests, not just merges.
- Consider a Markdown linter (e.g., `markdownlint-cli2`) if documentation expands further.

With these notes, the project should remain deployable and educational without rediscovering resolved pitfalls.
