import type { User, Course, QuizQuestion } from './types';

export const demoUsers: User[] = [
  {
    id: 'u-student-001',
    email: 'alex.student@securelearn.dev',
    name: 'Alex Chen',
    role: 'student',
    avatarUrl: '',
    bio: 'Junior developer eager to learn secrets management best practices.',
  },
  {
    id: 'u-instructor-001',
    email: 'sam.instructor@securelearn.dev',
    name: 'Sam Rodriguez',
    role: 'instructor',
    avatarUrl: '',
    bio: 'Security engineer with 10+ years experience in DevSecOps.',
  },
  {
    id: 'u-admin-001',
    email: 'jordan.admin@securelearn.dev',
    name: 'Jordan Blake',
    role: 'admin',
    avatarUrl: '',
    bio: 'Platform administrator overseeing SecureLearn operations.',
  },
];

export const demoCourses: Course[] = [
  {
    id: 'c-001',
    slug: 'secrets-management-fundamentals',
    title: 'Secrets Management Fundamentals',
    subtitle: 'From hardcoded credentials to secure vaults',
    description:
      'A comprehensive course covering the full spectrum of secrets management in Node.js applications. Learn why hardcoded secrets are dangerous, how to use environment variables effectively, when to adopt secret managers, and how to implement rotation and audit trails.',
    category: 'Security',
    level: 'intermediate',
    instructorId: 'u-instructor-001',
    thumbnailColor: '#006FEE',
    estimatedHours: 6,
    tags: ['nodejs', 'security', 'secrets', 'env-vars', 'ci-cd'],
    isPublished: true,
    modules: [
      {
        id: 'm-001',
        courseId: 'c-001',
        title: 'Foundations of Secrets Management',
        description: 'Understand why secrets matter and the risks of poor practices.',
        order: 1,
        lessons: [
          {
            id: 'l-001',
            moduleId: 'm-001',
            title: 'Why Secrets Matter',
            slug: 'why-secrets-matter',
            order: 1,
            durationMinutes: 15,
            hasQuiz: true,
            hasLab: false,
            blocks: [
              {
                type: 'heading',
                level: 2,
                text: 'The Hidden Cost of Leaked Secrets',
              },
              {
                type: 'paragraph',
                text: 'Every application needs secrets: API keys, database passwords, JWT signing keys, OAuth client secrets. These credentials are the keys to your digital kingdom. When they leak, the consequences range from data breaches to full infrastructure compromise.',
              },
              {
                type: 'callout',
                variant: 'danger',
                title: 'Real-World Impact',
                text: 'In 2023 alone, over 12 million secrets were found exposed in public GitHub repositories. The average cost of a credential-related breach exceeds $4.5 million.',
              },
              {
                type: 'heading',
                level: 3,
                text: 'What Counts as a Secret?',
              },
              {
                type: 'list',
                ordered: true,
                items: [
                  'API keys (Stripe, AWS, Twilio, etc.)',
                  'Database connection strings with passwords',
                  'JWT signing secrets',
                  'OAuth client secrets',
                  'SSH private keys',
                  'Encryption keys and salts',
                  'Third-party service tokens',
                ],
              },
              {
                type: 'paragraph',
                text: 'The first step in proper secrets management is inventory: knowing exactly what secrets your application uses, where they live, and who has access to them.',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'Key Takeaway',
                text: 'Secrets are not just passwords. Any credential that grants access or identifies your application is a secret that must be protected.',
              },
            ],
          },
          {
            id: 'l-002',
            moduleId: 'm-001',
            title: 'The Hardcoded Secrets Problem',
            slug: 'hardcoded-secrets-problem',
            order: 2,
            durationMinutes: 20,
            hasQuiz: true,
            hasLab: true,
            blocks: [
              {
                type: 'heading',
                level: 2,
                text: 'Anatomy of a Hardcoded Secret',
              },
              {
                type: 'code',
                language: 'javascript',
                code: `// The most dangerous pattern in software development
const API_KEY = "sk_live_51H8xYzABC1234567890";
const DB_PASSWORD = "super_secret_db_pass_2024";
const JWT_SECRET = "my-secret-key";

async function connectDatabase() {
  const conn = await pg.connect(
    \`postgres://admin:\${DB_PASSWORD}@db.prod.internal:5432/app\`
  );
  return conn;
}`,
                caption: 'Example of hardcoded secrets — never do this in production',
              },
              {
                type: 'callout',
                variant: 'danger',
                title: 'Why This Is Catastrophic',
                text: 'These secrets are now permanently in your git history. Even if you remove them in a later commit, anyone with repository access can find them in previous commits. Rotating requires code changes and redeployment.',
              },
              {
                type: 'heading',
                level: 3,
                text: 'The Git History Problem',
              },
              {
                type: 'paragraph',
                text: 'Git stores every commit forever. Once a secret is committed, it exists in the repository history indefinitely. Tools like git-secrets, TruffleHog, and GitHub secret scanning can find these leaked credentials — but so can attackers.',
              },
              {
                type: 'list',
                ordered: false,
                items: [
                  'Secrets are visible to anyone with repo read access',
                  'Git history retains secrets even after removal',
                  'Same secrets used across all environments (dev/staging/prod)',
                  'Rotation requires code changes and deployment',
                  'CI/CD logs may expose secrets in build output',
                ],
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'If You See This Pattern',
                text: 'Immediately rotate the exposed credential. Use git filter-branch or BFG Repo-Cleaner to purge history. Then migrate to environment variables.',
              },
            ],
          },
        ],
      },
      {
        id: 'm-002',
        courseId: 'c-001',
        title: 'Environment Variables Done Right',
        description: 'Move from hardcoded secrets to a proper environment-based configuration.',
        order: 2,
        lessons: [
          {
            id: 'l-003',
            moduleId: 'm-002',
            title: 'Introduction to Environment Variables',
            slug: 'env-vars-intro',
            order: 1,
            durationMinutes: 18,
            hasQuiz: true,
            hasLab: true,
            blocks: [
              {
                type: 'heading',
                level: 2,
                text: 'What Are Environment Variables?',
              },
              {
                type: 'paragraph',
                text: 'Environment variables are key-value pairs stored in the process environment. They exist outside your code, are never committed to version control, and can differ between environments (development, staging, production).',
              },
              {
                type: 'code',
                language: 'javascript',
                code: `// Instead of hardcoding, read from the environment
const API_KEY = process.env.API_KEY;
const DB_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// Always validate that required vars exist
if (!API_KEY) {
  throw new Error('API_KEY environment variable is required');
}`,
                caption: 'Reading secrets from environment variables',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Benefits',
                text: 'Secrets stay out of source code, different values per environment, rotation without code changes, and platform-native support across all deployment targets.',
              },
              {
                type: 'heading',
                level: 3,
                text: 'The .env File Pattern',
              },
              {
                type: 'code',
                language: 'bash',
                code: `# .env.example — committed to repo, documents required vars
API_KEY=your_api_key_here
DATABASE_URL=postgres://user:pass@host:5432/db
JWT_SECRET=generate_a_random_string

# .env.local — NEVER committed, contains real values
API_KEY=sk_live_real_key_here
DATABASE_URL=postgres://admin:real_pass@db.internal:5432/app
JWT_SECRET=a8f3c2e9b1d4f7a6c8e2b5d9`,
                caption: '.env.example vs .env.local',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Critical',
                text: 'Always add .env.local (and .env) to your .gitignore. The .env.example file is the only env file that should be committed.',
              },
            ],
          },
          {
            id: 'l-004',
            moduleId: 'm-002',
            title: 'Validation and Error Handling',
            slug: 'env-var-validation',
            order: 2,
            durationMinutes: 22,
            hasQuiz: true,
            hasLab: false,
            blocks: [
              {
                type: 'heading',
                level: 2,
                text: 'Never Trust the Environment Blindly',
              },
              {
                type: 'paragraph',
                text: 'Just because an environment variable exists does not mean it is valid. Empty strings, malformed URLs, and expired keys can all cause runtime failures. Always validate your environment configuration at startup.',
              },
              {
                type: 'code',
                language: 'typescript',
                code: `import { z } from 'zod';

const EnvSchema = z.object({
  API_KEY: z.string().min(20, 'API_KEY must be at least 20 chars'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;`,
                caption: 'Schema-based env validation with Zod',
              },
              {
                type: 'callout',
                variant: 'success',
                title: 'Fail Fast',
                text: 'Validating at startup means your app crashes immediately with a clear error, rather than failing mysteriously hours later in production.',
              },
              {
                type: 'heading',
                level: 3,
                text: 'Graceful Defaults',
              },
              {
                type: 'paragraph',
                text: 'Not every variable needs to be required. Use sensible defaults for non-sensitive configuration like ports, log levels, and feature flags. But never default secrets — they must always be explicitly provided.',
              },
            ],
          },
        ],
      },
      {
        id: 'm-003',
        courseId: 'c-001',
        title: 'Advanced Secrets Management',
        description: 'Cloud secret stores, rotation strategies, and CI/CD integration.',
        order: 3,
        lessons: [
          {
            id: 'l-005',
            moduleId: 'm-003',
            title: 'Cloud Secret Stores',
            slug: 'cloud-secret-stores',
            order: 1,
            durationMinutes: 25,
            hasQuiz: true,
            hasLab: false,
            blocks: [
              {
                type: 'heading',
                level: 2,
                text: 'Beyond Environment Variables',
              },
              {
                type: 'paragraph',
                text: 'Environment variables are a great starting point, but as your application scales, you need more: automatic rotation, granular access control, audit logging, and centralized management. This is where cloud secret stores come in.',
              },
              {
                type: 'list',
                ordered: false,
                items: [
                  'AWS Secrets Manager — auto-rotation, IAM integration',
                  'HashiCorp Vault — open source, dynamic secrets',
                  'Azure Key Vault — HSM-backed, certificate management',
                  'Google Secret Manager — versioned secrets, IAM',
                  'Doppler — third-party, syncs to all platforms',
                ],
              },
              {
                type: 'code',
                language: 'typescript',
                code: `// Example: AWS Secrets Manager integration
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-east-1' });

async function getSecret(secretId: string): Promise<Record<string, string>> {
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretId })
  );
  return JSON.parse(response.SecretString || '{}');
}

const dbCredentials = await getSecret('prod/database/main');`,
                caption: 'Fetching secrets from AWS Secrets Manager',
              },
              {
                type: 'callout',
                variant: 'info',
                title: 'When to Upgrade',
                text: 'Consider a secret store when you have 10+ secrets, multiple environments, compliance requirements, or need automatic rotation.',
              },
            ],
          },
          {
            id: 'l-006',
            moduleId: 'm-003',
            title: 'CI/CD and Secrets',
            slug: 'cicd-secrets',
            order: 2,
            durationMinutes: 20,
            hasQuiz: true,
            hasLab: false,
            blocks: [
              {
                type: 'heading',
                level: 2,
                text: 'Secrets in the Pipeline',
              },
              {
                type: 'paragraph',
                text: 'Your CI/CD pipeline needs secrets too: deploy tokens, registry credentials, API keys for testing. The same rules apply — never hardcode, never log, always rotate.',
              },
              {
                type: 'code',
                language: 'yaml',
                code: `# GitHub Actions example — using secrets
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        env:
          API_KEY: \${{ secrets.API_KEY }}
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
        run: |
          npm run deploy
          # Secrets are masked in logs automatically`,
                caption: 'GitHub Actions secrets usage',
              },
              {
                type: 'callout',
                variant: 'warning',
                title: 'Never Echo Secrets',
                text: 'Even masked, avoid printing secrets in CI logs. Use echo "::add-mask::$VAR" in GitHub Actions or similar masking in other CI systems.',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const demoQuizQuestions: QuizQuestion[] = [
  {
    id: 'q-001',
    lessonId: 'l-001',
    question: 'Which of the following is considered a secret that must be protected?',
    options: [
      'A CSS color value',
      'A JWT signing key',
      'A React component name',
      'A TypeScript interface definition',
    ],
    correctIndex: 1,
    explanation: 'JWT signing keys grant the ability to forge tokens. Any credential that grants access is a secret.',
  },
  {
    id: 'q-002',
    lessonId: 'l-001',
    question: 'What was the approximate number of secrets found exposed on GitHub in 2023?',
    options: ['50,000', '500,000', '12 million', '1 billion'],
    correctIndex: 2,
    explanation: 'Over 12 million secrets were found exposed in public GitHub repositories in 2023.',
  },
  {
    id: 'q-003',
    lessonId: 'l-002',
    question: 'Why is removing a hardcoded secret in a later commit not sufficient?',
    options: [
      'Git does not allow removing code once committed',
      'The secret remains in git history and can be retrieved',
      'It requires admin privileges to remove code',
      'The IDE will not let you delete the line',
    ],
    correctIndex: 1,
    explanation: 'Git stores every commit. The secret exists in history indefinitely unless purged with tools like BFG or git filter-branch.',
  },
  {
    id: 'q-004',
    lessonId: 'l-002',
    question: 'What should you do immediately if you discover a hardcoded secret in your repository?',
    options: [
      'Delete the file and push',
      'Leave it — it is probably fine',
      'Rotate the credential and purge git history',
      'Add a comment saying not to use it',
    ],
    correctIndex: 2,
    explanation: 'The credential must be considered compromised. Rotate it immediately, then purge from git history.',
  },
  {
    id: 'q-005',
    lessonId: 'l-003',
    question: 'Which file should be committed to version control?',
    options: ['.env.local', '.env', '.env.example', '.env.production'],
    correctIndex: 2,
    explanation: 'Only .env.example should be committed. It documents required variables without exposing real values.',
  },
  {
    id: 'q-006',
    lessonId: 'l-003',
    question: 'What is a key advantage of environment variables over hardcoded secrets?',
    options: [
      'They are faster to type',
      'Different values can be used per environment without code changes',
      'They are automatically encrypted',
      'They work without any configuration',
    ],
    correctIndex: 1,
    explanation: 'Environment variables allow different values per environment (dev/staging/prod) without changing application code.',
  },
  {
    id: 'q-007',
    lessonId: 'l-004',
    question: 'Why should you validate environment variables at startup?',
    options: [
      'To make the code longer',
      'To fail fast with clear errors instead of mysterious runtime failures',
      'Because TypeScript requires it',
      'To impress code reviewers',
    ],
    correctIndex: 1,
    explanation: 'Startup validation ensures the app crashes immediately with a clear message rather than failing unpredictably later.',
  },
  {
    id: 'q-008',
    lessonId: 'l-005',
    question: 'When should you consider upgrading from environment variables to a cloud secret store?',
    options: [
      'When you have 1 secret',
      'Never — env vars are always sufficient',
      'When you have 10+ secrets, multiple environments, or compliance requirements',
      'Only if you use AWS',
    ],
    correctIndex: 2,
    explanation: 'Cloud secret stores provide rotation, access control, and audit logging that become necessary at scale.',
  },
  {
    id: 'q-009',
    lessonId: 'l-006',
    question: 'What is the best practice for handling secrets in CI/CD pipelines?',
    options: [
      'Hardcode them in the pipeline config',
      'Use the CI platform secret management and mask them in logs',
      'Store them in a file in the repository',
      'Email them to the team',
    ],
    correctIndex: 1,
    explanation: 'CI platforms like GitHub Actions provide encrypted secrets that are automatically masked in logs.',
  },
  {
    id: 'q-010',
    lessonId: 'l-006',
    question: 'Which command masks a secret in GitHub Actions logs?',
    options: [
      'echo "::mask::$VAR"',
      'echo "::add-mask::$VAR"',
      'echo "hide::$VAR"',
      'mask $VAR',
    ],
    correctIndex: 1,
    explanation: 'echo "::add-mask::$VAR" tells GitHub Actions to mask the value in all subsequent log output.',
  },
];
