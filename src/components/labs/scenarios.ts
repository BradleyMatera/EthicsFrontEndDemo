import { LabScenario } from './types';

const sanitize = (value: string | undefined) => (value ?? '').replace(/\s+/g, ' ').trim();

const containsAll = (source: string, needles: string[]) => needles.every((needle) => source.includes(needle));

export const hardcodedSecretsScenario: LabScenario = {
  id: 'hardcoded-secrets',
  title: 'Lab: Refactor Hardcoded Secrets',
  description:
    'A payments microservice leaked a live Stripe secret. Refactor the implementation to pull credentials from the environment and fail fast when it is missing.',
  introSteps: [
    'Inspect the payments service to find how the secret is loaded today.',
    'Move all secret material into environment variables with validation.',
    'Update the onboarding docs so the next engineer knows what to configure.',
  ],
  files: [
    {
      path: 'src/services/payments.ts',
      label: 'Payments Service',
      language: 'typescript',
      initialContent: `import Stripe from 'stripe';

const STRIPE_SECRET_KEY = 'sk_live_9f8a_fake_leaked_key_1205';

export function createStripeClient() {
  const client = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-01',
  });

  if (!client) {
    throw new Error('Stripe client failed to initialise');
  }

  return client;
}
`,
    },
    {
      path: 'scripts/seed.ts',
      label: 'Seed Script',
      language: 'typescript',
      initialContent: `import { createStripeClient } from '../src/services/payments';

async function run() {
  const stripe = createStripeClient();
  const keys = await stripe.customers.list({ limit: 1 });
  console.log('Fetched', keys.data.length, 'customers for smoke test');
}

run().catch((error) => {
  console.error('Seed script failed', error);
  process.exit(1);
});
`,
    },
    {
      path: '.env.example',
      label: 'Environment Template',
      language: 'bash',
      initialContent: `# Add your secrets here before running scripts
# STRIPE_SECRET_KEY=sk_live_fill_me_in
`,
    },
    {
      path: 'docs/incident-log.md',
      label: 'Incident Log (Read-only)',
      language: 'markdown',
      readOnly: true,
      initialContent: `# Incident Log: Stripe Key Leak

* 09:45 - Security scanner detected stripe key in src/services/payments.ts
* 09:55 - Incident declared, CI tokens revoked
* 10:10 - Customers reported failed charges after key rotation

Action items:
- [ ] Remove hardcoded key from repository
- [ ] Fail fast when STRIPE_SECRET_KEY missing
- [ ] Update onboarding documentation
`,
    },
  ],
  tasks: [
    {
      id: 'remove-inline-key',
      title: 'Delete the inline Stripe secret',
      description: 'Ensure the payments service no longer contains the leaked sk_live secret.',
      hint: 'Replace the constant with an environment lookup instead of storing the key in the file.',
      validate: (files) => {
        const content = files['src/services/payments.ts'] ?? '';
        return !content.includes('sk_live_') && !/const\s+STRIPE_SECRET_KEY\s*=/.test(content);
      },
    },
    {
      id: 'load-from-env',
      title: 'Load secrets via environment variables',
      description: 'Use process.env.STRIPE_SECRET_KEY and throw a descriptive error when it is missing.',
      hint: 'Access process.env.STRIPE_SECRET_KEY, validate it, and pass it to the Stripe constructor.',
      validate: (files) => {
        const content = sanitize(files['src/services/payments.ts']);
        if (!content) return false;
        const usesEnv = content.includes('process.env.STRIPE_SECRET_KEY');
        const hasGuard = /if \(!process\.env\.STRIPE_SECRET_KEY\)/.test(content) ||
          /const stripeSecret\s*=\s*process\.env\.STRIPE_SECRET_KEY/.test(content) &&
            /throw new Error\([^)]*(missing|STRIPE_SECRET_KEY)[^)]*\)/i.test(content);
        const constructsStripe = /new Stripe\(.*process\.env\.STRIPE_SECRET_KEY/.test(content);
        return usesEnv && hasGuard && constructsStripe;
      },
    },
    {
      id: 'document-secret',
      title: 'Document STRIPE_SECRET_KEY in .env.example',
      description: 'Provide a placeholder value in the environment template without committing real secrets.',
      hint: 'Add STRIPE_SECRET_KEY=pk_live_your_placeholder or similar guidance in .env.example.',
      validate: (files) => {
        const template = sanitize(files['.env.example']);
        if (!template) return false;
        const hasEntry = /STRIPE_SECRET_KEY=/.test(template);
        const sanitized = !/sk_live_[a-z0-9]/i.test(template);
        return hasEntry && sanitized;
      },
    },
  ],
  success: {
    title: 'Great work! 🎉',
    message:
      'The payments service now sources credentials securely. Commit the fix and rotate the Stripe key in production.',
  },
  failure: {
    title: 'Tasks remaining',
    message: 'Review the checklist for any steps you may have missed.',
  },
  resources: [
    { label: 'OWASP Secrets Management', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html' },
    { label: 'Stripe Environment Variables Guide', href: 'https://stripe.com/docs/development/quickstart#configure-environment' },
  ],
};

export const sharedSecretsScenario: LabScenario = {
  id: 'shared-secrets',
  title: 'Lab: Untangle Shared Secrets Files',
  description:
    'A repository committed secrets.json with production credentials. Help convert it into a safe template and load secrets from the environment.',
  introSteps: [
    'Open secrets.json to inspect what was committed to version control.',
    'Update the app configuration to stop reading secrets directly from git.',
    'Scrub the template so future commits never include real credentials.',
  ],
  files: [
    {
      path: 'config/secrets.json',
      label: 'secrets.json',
      language: 'json',
      initialContent: `{
  "stripe": {
    "apiKey": "sk_live_example_real_key",
    "webhookSecret": "whsec_actual_webhook_secret"
  },
  "database": {
    "url": "postgres://prod_user:Sup3rS3cret@prod.db:5432/app"
  }
}
`,
    },
    {
      path: 'src/config.ts',
      label: 'Config Loader',
      language: 'typescript',
      initialContent: `import secrets from '../config/secrets.json';

type AppConfig = {
  stripeApiKey: string;
  stripeWebhookSecret: string;
  databaseUrl: string;
};

export function loadConfig(): AppConfig {
  return {
    stripeApiKey: secrets.stripe.apiKey,
    stripeWebhookSecret: secrets.stripe.webhookSecret,
    databaseUrl: secrets.database.url,
  };
}
`,
    },
    {
      path: 'docs/runbook.md',
      label: 'Runbook Notes',
      language: 'markdown',
      initialContent: `# Shared Secrets Runbook

Developers currently copy config/secrets.json between laptops using Slack. Security has requested migration to environment variables by Friday.

Open questions:
- How do we validate required variables for CI?
- What should contractors receive access to?
`,
    },
  ],
  tasks: [
    {
      id: 'scrub-template',
      title: 'Scrub real secrets from secrets.json',
      description: 'Replace the committed production values with obvious placeholders so future commits stay clean.',
      hint: 'Use values like REPLACE_ME rather than live credentials.',
      validate: (files) => {
        const content = sanitize(files['config/secrets.json']);
        if (!content) return false;
        const noLiveStripe = !content.includes('sk_live');
        const noLiveWebhook = !content.includes('whsec');
        const noProdUrl = !content.includes('prod_user') && !content.includes('Sup3rS3cret');
        const hasPlaceholder = /REPLACE/i.test(content);
        return noLiveStripe && noLiveWebhook && noProdUrl && hasPlaceholder;
      },
    },
    {
      id: 'env-config',
      title: 'Load secrets from environment variables',
      description: 'Refactor config loader to pull from process.env instead of secrets.json.',
      hint: 'Swap the import for destructuring process.env and add validation for missing values.',
      validate: (files) => {
        const content = sanitize(files['src/config.ts']);
        if (!content) return false;
        const removedImport = !content.includes("import secrets");
        const usesEnv = containsAll(content, [
          'process.env.STRIPE_API_KEY',
          'process.env.STRIPE_WEBHOOK_SECRET',
          'process.env.DATABASE_URL',
        ]);
        const hasGuard = /if \(!process\.env\.STRIPE_API_KEY\)/.test(content) || /throw new Error[^;]+STRIPE_API_KEY/i.test(content);
        return removedImport && usesEnv && hasGuard;
      },
    },
    {
      id: 'document-variables',
      title: 'Document required variables in runbook',
      description: 'Update docs/runbook.md with a checklist of the new environment variables.',
      hint: 'Add bullet points listing STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET, and DATABASE_URL.',
      validate: (files) => {
        const doc = sanitize(files['docs/runbook.md']);
        if (!doc) return false;
        return containsAll(doc, ['STRIPE_API_KEY', 'STRIPE_WEBHOOK_SECRET', 'DATABASE_URL']);
      },
    },
  ],
  success: {
    title: 'Template secured ✅',
    message: 'All real secrets are removed and the service now respects least privilege. Share the documentation with your team.',
  },
  failure: {
    title: 'Not quite done',
    message: 'Double-check the template, config loader, and docs updates.',
  },
  resources: [
    { label: 'GitHub Secret Scanning', href: 'https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning' },
    { label: '12 Factor App - Config', href: 'https://12factor.net/config' },
  ],
};

export const environmentVariablesScenario: LabScenario = {
  id: 'environment-variables',
  title: 'Lab: Harden Environment Variables',
  description:
    'Ensure the onboarding flow validates required environment variables and documents the process for new engineers.',
  introSteps: [
    'Open bootstrap.ts to see how the service initialises configuration.',
    'Add safeguards so missing variables fail the build with clear messaging.',
    'Keep the template file and onboarding checklist in sync.',
  ],
  files: [
    {
      path: 'src/bootstrap.ts',
      label: 'Bootstrap Script',
      language: 'typescript',
      initialContent: `export function bootstrap() {
  const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: process.env.DATABASE_URL,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  };

  console.log('Bootstrapping with config:', config);
  return config;
}
`,
    },
    {
      path: '.env.template',
      label: '.env.template',
      language: 'bash',
      initialContent: `# Duplicate this file as .env.local and fill out each value
NODE_ENV=development
PORT=3000
# DATABASE_URL=
# STRIPE_SECRET_KEY=
# SESSION_SECRET=
`,
    },
    {
      path: 'docs/onboarding.md',
      label: 'Onboarding Checklist',
      language: 'markdown',
      initialContent: `# Onboarding Checklist

- [ ] Copy .env.template to .env.local
- [ ] Fill in DATABASE_URL
- [ ] Run bun install
`,
    },
  ],
  tasks: [
    {
      id: 'validate-env',
      title: 'Validate required environment variables',
      description: 'Throw a descriptive error if DATABASE_URL, STRIPE_SECRET_KEY, or SESSION_SECRET are missing.',
      hint: 'Collect missing keys into an array and throw once, or guard each variable individually.',
      validate: (files) => {
        const content = sanitize(files['src/bootstrap.ts']);
        if (!content) return false;
        const mentionsSession = content.includes('SESSION_SECRET');
        const hasGuard = /if \(!process\.env\.DATABASE_URL\)/.test(content) || /throw new Error[^;]+DATABASE_URL/i.test(content);
        const mentionsAll = containsAll(content, [
          'process.env.DATABASE_URL',
          'process.env.STRIPE_SECRET_KEY',
          'process.env.SESSION_SECRET',
        ]);
        const throwsCombined = /missing (environment )?variable/i.test(content) || /Required environment variables/i.test(content);
        return mentionsSession && hasGuard && mentionsAll && throwsCombined;
      },
    },
    {
      id: 'update-template',
      title: 'Update .env template with placeholders',
      description: 'Provide clear instructions and placeholders for each required variable.',
      hint: 'Ensure DATABASE_URL, STRIPE_SECRET_KEY, and SESSION_SECRET all have obvious TODO values.',
      validate: (files) => {
        const template = sanitize(files['.env.template']);
        if (!template) return false;
        const hasAll = containsAll(template, ['DATABASE_URL=', 'STRIPE_SECRET_KEY=', 'SESSION_SECRET=']);
        const noBlanks = !/=#?\s*$/.test(template.split('\n').find((line) => line.startsWith('SESSION_SECRET=')) ?? '');
        return hasAll && noBlanks;
      },
    },
    {
      id: 'document-checklist',
      title: 'Extend onboarding checklist',
      description: 'Add guidance for validating environment variables during setup.',
      hint: 'Mention running bun run verify-env or similar in the checklist.',
      validate: (files) => {
        const doc = sanitize(files['docs/onboarding.md']);
        if (!doc) return false;
        const mentionsScript = /bun run (verify|check)-?env/i.test(doc) || /npm run (verify|check)-?env/i.test(doc);
        const remindsSecrets = containsAll(doc, ['STRIPE_SECRET_KEY', 'SESSION_SECRET']);
        return mentionsScript && remindsSecrets;
      },
    },
  ],
  success: {
    title: 'Environment locked in 🔐',
    message: 'The application now fails fast on missing configuration and onboarding docs reflect the process.',
  },
  failure: {
    title: 'Configuration incomplete',
    message: 'Check each file to ensure validation and documentation align.',
  },
  resources: [
    { label: 'Dotenv Validation Patterns', href: 'https://github.com/motdotla/dotenv#faq' },
    { label: 'Node Best Practices: Configuration', href: 'https://github.com/goldbergyoni/nodebestpractices#12-configuration-best-practices' },
  ],
};
