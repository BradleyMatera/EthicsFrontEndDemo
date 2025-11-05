# Deployment and Operations Guide

## Local Development

1. **Install dependencies**

   ```bash
   bun install
   ```

2. **Run the dev server**

   ```bash
   bun run dev
   ```
   
   - Serves the App Router on `http://localhost:3000` using Turbopack.
   - Hot module replacement keeps Tailwind and component changes instant.
3. **Lint and type-check** (recommended pre-commit)

   ```bash
   bun lint
   bun run type-check
   ```

### Environment Variables

Secrets required for the environment-variable demo are loaded from `.env.local` (not committed). Minimum keys:

```dotenv
DB_HOST=demo-db.example.com
DB_PASSWORD=demo-password
JWT_SECRET=demo-jwt-secret
STRIPE_SECRET_KEY=sk_test_demo
AWS_ACCESS_KEY_ID=AKIAdemo123
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

The API handlers mask values before returning JSON, so you can use recognizable faux secrets without risk.

## Building for Production

Use the GitHub Pages-aligned script so local and CI outputs match:

```bash
bun run build:github-pages
```

This sets the following environment variables under the hood:

- `NEXT_STATIC_EXPORT=true`
- `NEXT_PUBLIC_BASE_PATH=/EthicsFrontEndDemo`
- `NEXT_PUBLIC_BASE_URL=https://bradleymatera.github.io/EthicsFrontEndDemo`

The resulting static site lands in the `out/` directory. Open `out/index.html` locally (Serve via `npx serve out` if you need proper routing).

## Automated Deployment (GitHub Pages)

Two workflows manage deployment:

1. **`.github/workflows/deploy.yml`** – Triggered on pushes/pull requests targeting `master` or `main`, plus manual dispatches.
2. **`.github/workflows/pages.yml`** – Legacy workflow retained for compatibility; now mirrors the primary job.

Both workflows:

1. Checkout the repo.
2. Install Bun (latest) and Node.js 20.11.1.
3. Run `bun install` to hydrate dependencies.
4. Invoke `bun run build:github-pages`.
5. Upload the `out/` directory via `actions/upload-pages-artifact@v3`.
6. Deploy with `actions/deploy-pages@v4`.

### CI Base-Path Injection Guardrails

`actions/configure-pages@v4` injects `basePath`, `assetPrefix`, and `images.unoptimized` into Next config automatically. We replaced `next.config.ts` with `next.config.js` so this step augments (rather than overwrites) our configuration, preserving the `output: "export"` switch.

### Triggering a Redeploy

- **On push**: Any merge to `master` kicks off a deployment.
- **Manual**: Open the Actions tab → pick "Deploy to GitHub Pages" → `Run workflow`.
- **CLI**: `gh workflow run deploy.yml` (requires GitHub CLI authentication).

### Validation Checklist

After workflow completion:

1. Navigate to `https://bradleymatera.github.io/EthicsFrontEndDemo/`.
2. Click every nav item to ensure routing respects the base path.
3. Open browser dev tools → Network → ensure JSON responses load from `/EthicsFrontEndDemo/api/...`.
4. Run Lighthouse (optional) to confirm accessibility/performance budgets.

## Netlify / Vercel Notes

Although GitHub Pages is the live host, the repo retains configuration for other platforms:

- `netlify.toml` – Shows how to run `bun run build:pages` and serve `out/`.
- `vercel.json` – Legacy configuration from an earlier deployment trial.
- Dockerfile + `docker-compose.yml` – Support containerized builds or self-hosting with environment injection.

## Rollback Strategy

GitHub Pages keeps previous deployments accessible from the Actions tab. If a release fails:

1. Identify the last successful deployment run.
2. Hit `Re-run all jobs` to redeploy the previous artifact.
3. Alternatively, revert the offending commit locally and push.

## Monitoring

- **Build logs** – Available in the Actions run; check the `build` job for warnings (`Invalid next.config.js options` earlier) and ensure `Upload artifact` reports successful archiving.
- **GitHub Pages insights** – Under repo → Settings → Pages → View Deployment History.

## Summary

The deployment story is intentionally minimal: a deterministic static export, uploaded directly to GitHub Pages. Stick to `bun run build:github-pages`, maintain Node 20.x compatibility, and verify base-path-aware links after each deploy to keep the site healthy.
