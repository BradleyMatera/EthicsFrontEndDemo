'use client';

import { Breadcrumb } from "@/components/Breadcrumb";
import { CodeBlock } from "@/components/ui/code-block";
import { EnvironmentVariablesDemo as EnvDemo } from "@/demos/environment/demo";
import { LabConsole } from "@/components/labs/LabConsole";
import { environmentVariablesScenario } from "@/components/labs/scenarios";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Chip,
  Divider,
  Link as NextUILink,
  Tabs,
  Tab
} from "@nextui-org/react";
import { 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Github,
  ExternalLink,
  Key,
  Shield,
  FileText,
  Terminal,
  Cloud,
  Lock,
  Play
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EnvironmentVariablesDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [demoOutput, setDemoOutput] = useState<any>(null);
  const [demo] = useState(() => new EnvDemo());
  const envExamples = [
    {
      title: ".env File (Not in Repository)",
      language: "bash",
      code: `# .env - Keep this file secret and never commit it!
DB_HOST=production.database.company.com
DB_USERNAME=app_user
DB_PASSWORD=SecureProductionPassword123!
DB_PORT=5432

# API Keys
STRIPE_SECRET_KEY=sk_live_1234567890abcdef
SENDGRID_API_KEY=SG.1234567890abcdef
JWT_SECRET=super-secure-jwt-secret-key-production

# External Services
REDIS_URL=redis://user:pass@redis-server:6379
AWS_ACCESS_KEY_ID=AKIAI1234567890ABCDEF
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`,
      description: "Environment variables stored in .env file (excluded from git)"
    },
    {
      title: "Loading Environment Variables",
      language: "javascript",
      code: `// Load environment variables at the start of your application
require('dotenv').config();

// Database configuration using environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT)
};

// API Keys from environment
const stripeKey = process.env.STRIPE_SECRET_KEY;
const jwtSecret = process.env.JWT_SECRET;

// Validate required environment variables
if (!stripeKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}`,
      description: "Secure way to access secrets from environment variables"
    },
    {
      title: "Proper .gitignore Configuration",
      language: "bash",
      code: `# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Dependency directories
node_modules/

# Optional npm cache directory
.npm

# Output of 'npm pack'
*.tgz

# Secrets and certificates
*.pem
*.key
secrets/
config/secrets.yml`,
      description: "Essential .gitignore patterns to prevent secret exposure"
    }
  ];

  const deploymentExamples = [
    {
      platform: "Vercel",
      language: "bash",
      code: `# Add environment variables in Vercel dashboard
# or using Vercel CLI

vercel env add DB_HOST production
vercel env add DB_PASSWORD production
vercel env add JWT_SECRET production`,
      description: "Set environment variables in Vercel dashboard or CLI"
    },
    {
      platform: "Heroku", 
      language: "bash",
      code: `# Set environment variables using Heroku CLI
heroku config:set DB_HOST=prod.db.company.com
heroku config:set DB_PASSWORD=SecurePassword123
heroku config:set JWT_SECRET=super-secure-jwt-key

# Or use Heroku dashboard Config Vars section`,
      description: "Configure environment variables in Heroku"
    },
    {
      platform: "Docker",
      language: "yaml",
      code: `# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    environment:
      - DB_HOST=\${DB_HOST}
      - DB_PASSWORD=\${DB_PASSWORD}
      - JWT_SECRET=\${JWT_SECRET}
    env_file:
      - .env.production

# Run with environment variables
docker run -e DB_HOST=prod.db.com -e DB_PASSWORD=secret myapp`,
      description: "Using environment variables with Docker containers"
    }
  ];

  const bestPractices = [
    {
      title: "Environment Validation",
      description: "Always validate that required environment variables are present",
      icon: <CheckCircle className="text-success" size={20} />,
      language: "javascript",
      code: `const requiredEnvVars = ['DB_HOST', 'DB_PASSWORD', 'JWT_SECRET'];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(\`Missing required environment variable: \${envVar}\`);
  }
});`
    },
    {
      title: "Different Environments",
      description: "Use different .env files for different environments",
      icon: <FileText className="text-primary" size={20} />,
      language: "bash",
      code: `# .env.development
DB_HOST=localhost
DB_PASSWORD=dev123
DEBUG=true

# .env.production  
DB_HOST=prod.db.company.com
DB_PASSWORD=SecureProductionPassword
DEBUG=false`
    },
    {
      title: "Fallback Values",
      description: "Provide sensible defaults for non-sensitive configuration",
      icon: <Shield className="text-success" size={20} />,
      language: "javascript",
      code: `const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbHost: process.env.DB_HOST, // No fallback for secrets!
  logLevel: process.env.LOG_LEVEL || 'info'
};`
    },
    {
      title: "Secret Documentation",
      description: "Document required environment variables in README",
      icon: <FileText className="text-primary" size={20} />,
      language: "markdown",
      code: `# Required Environment Variables

## Database
- \`DB_HOST\`: Database hostname
- \`DB_USERNAME\`: Database username  
- \`DB_PASSWORD\`: Database password

## API Keys
- \`STRIPE_SECRET_KEY\`: Stripe secret key
- \`JWT_SECRET\`: JWT signing secret`
    }
  ];

  const labScenarios = [
    {
      title: "Local Setup",
      steps: [
        "Copy .env.template to .env.local and fill in placeholder values",
        "Run validation script to ensure all variables are present",
        "Start the app and verify secrets are not logged or exposed"
      ]
    },
    {
      title: "CI Pipeline",
      steps: [
        "Configure environment variables in your CI system",
        "Add a step that fails the build if required variables are missing",
        "Mask secrets in build logs and artifact uploads"
      ]
    },
    {
      title: "Rotation Drill",
      steps: [
        "Rotate one credential in the .env file",
        "Propagate the change across environments using automation",
        "Confirm that old credentials are no longer accepted"
      ]
    }
  ];

  const rolloutPlan = {
    kickoff: [
      "Inventory all services and credentials",
      "Create .env.example documenting required variables",
      "Agree on naming conventions and casing"
    ],
    implementation: [
      "Add validation at application boot",
      "Store secrets in platform-specific secret stores",
      "Add scripts to sync secrets for developers"
    ],
    sustainment: [
      "Schedule rotation and access reviews",
      "Monitor for usage of default or placeholder values",
      "Automate alerts for missing variables in deployments"
    ]
  };

  const observabilityChecklist = [
    "Dashboards tracking last rotation time per secret",
    "Alerts when environment variables change unexpectedly",
    "Audit logs for who accessed or modified secrets",
    "Synthetic tests verifying secrets are loaded at runtime"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Environment Variables Demo" },
          ]}
        />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Key className="text-success mr-3" size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Environment Variables</h1>
          <p className="text-xl text-foreground-600 max-w-3xl mx-auto">
            Learn the proper way to manage secrets using environment variables and .env files. 
            This is the recommended approach for most applications.
          </p>
        </div>

        {/* Success Banner */}
        <Card className="bg-success-50 border-success-200 mb-8">
          <CardHeader>
            <CheckCircle className="text-success mr-3" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-success-800">✅ Recommended Approach</h3>
              <Chip color="success" size="sm" variant="flat">Best Practice</Chip>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-success-700">
              Using environment variables is the industry standard for managing secrets. This approach 
              keeps sensitive data separate from your codebase while maintaining flexibility across 
              different deployment environments.
            </p>
          </CardBody>
        </Card>

        {/* Core Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Proper Implementation</h2>
          <div className="space-y-6">
            {envExamples.map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <h3 className="text-lg font-semibold">{example.title}</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-foreground-600 mb-4">{example.description}</p>
                  <CodeBlock
                    title={`${example.title} Snippet`}
                    code={example.code}
                    language={example.language}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Deployment Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Deployment Platform Examples</h2>
          <Tabs aria-label="Deployment platforms" color="primary">
            {deploymentExamples.map((example, index) => (
              <Tab key={example.platform} title={example.platform}>
                <Card>
                  <CardBody>
                    <p className="text-foreground-600 mb-4">{example.description}</p>
                    <CodeBlock
                      title={`${example.platform} Configuration`}
                      code={example.code}
                      language={example.language}
                    />
                  </CardBody>
                </Card>
              </Tab>
            ))}
          </Tabs>
        </div>

        {/* Best Practices */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Best Practices & Implementation Tips</h2>
          <div className="grid gap-6">
            {bestPractices.map((practice, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center">
                    {practice.icon}
                    <h3 className="text-lg font-semibold ml-3">{practice.title}</h3>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-foreground-600 mb-4">{practice.description}</p>
                  <CodeBlock
                    title={`${practice.title} Example`}
                    code={practice.code}
                    language={practice.language}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        <Divider className="my-12" />

  <LabConsole scenario={environmentVariablesScenario} />

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Lab Scenarios</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              {labScenarios.map((scenario) => (
                <div key={scenario.title}>
                  <p className="font-medium text-foreground-600 mb-2">{scenario.title}</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                    {scenario.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Observability Checklist</h3>
            </CardHeader>
            <CardBody>
              <ul className="list-disc space-y-2 pl-5 text-foreground-600">
                {observabilityChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <h3 className="text-xl font-semibold">Rollout Plan</h3>
          </CardHeader>
          <CardBody className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="font-semibold text-foreground-600 mb-2">Kickoff</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                {rolloutPlan.kickoff.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground-600 mb-2">Implementation</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                {rolloutPlan.implementation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground-600 mb-2">Sustainment</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                {rolloutPlan.sustainment.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>

        {/* Production Considerations */}
        <Card className="mb-12">
          <CardHeader>
            <Cloud className="text-primary mr-3" size={24} />
            <h2 className="text-xl font-semibold">Production-Grade Secret Management</h2>
          </CardHeader>
          <CardBody>
            <p className="text-foreground-600 mb-4">
              While environment variables are great for most applications, enterprise applications 
              should consider dedicated secret management solutions:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold mb-2">Cloud Providers:</h4>
                <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-600">
                  <li>AWS Secrets Manager</li>
                  <li>Azure Key Vault</li>
                  <li>Google Secret Manager</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Self-Hosted Solutions:</h4>
                <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-600">
                  <li>HashiCorp Vault</li>
                  <li>Kubernetes Secrets</li>
                  <li>Docker Secrets</li>
                </ul>
              </div>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-primary-800 font-medium">
                💡 Environment variables are perfect for getting started and most applications!
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Interactive Demo */}
        <Card className="mb-8">
          <CardHeader>
            <Terminal className="mr-3" size={24} />
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-semibold">Run Interactive Demo</h2>
              <Button
                color="success"
                variant="flat"
                startContent={<Play size={16} />}
                onPress={async () => {
                  setIsRunning(true);
                  setDemoOutput(null);
                  
                  try {
                    const originalLog = console.log;
                    const logs: string[] = [];
                    console.log = (...args) => {
                      logs.push(args.join(' '));
                      originalLog(...args);
                    };

                    const result = await demo.runDemo();
                    console.log = originalLog;
                    
                    setDemoOutput({
                      result,
                      logs,
                      timestamp: new Date().toLocaleTimeString()
                    });
                  } catch (error) {
                    setDemoOutput({
                      error: error instanceof Error ? error.message : 'Unknown error',
                      timestamp: new Date().toLocaleTimeString()
                    });
                  }
                  
                  setIsRunning(false);
                }}
                isLoading={isRunning}
              >
                {isRunning ? 'Running...' : 'Execute Environment Variables Demo'}
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-foreground-600 mb-4">
              Click the button above to see how environment variables provide secure secrets management:
            </p>
            
            {demoOutput && (
              <div className="mt-4">
                <Card className="bg-default-100">
                  <CardHeader className="pb-2">
                    <Terminal size={16} className="mr-2" />
                    <span className="text-sm font-mono">Demo Output ({demoOutput.timestamp})</span>
                  </CardHeader>
                  <CardBody className="pt-2">
                    {demoOutput.error ? (
                      <div className="text-danger">
                        <p className="font-semibold">Error:</p>
                        <p className="font-mono text-sm">{demoOutput.error}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {demoOutput.logs && demoOutput.logs.length > 0 && (
                          <div>
                            <p className="font-semibold mb-2">Console Output:</p>
                            <div className="bg-black text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                              {demoOutput.logs.map((log: string, index: number) => (
                                <div key={index}>{log}</div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {demoOutput.result && (
                          <div>
                            <p className="font-semibold mb-2">Demo Result:</p>
                            <div className="bg-success-50 border border-success-200 p-3 rounded">
                              <div className="space-y-2">
                                <p><strong>Demo Type:</strong> {demoOutput.result.demo_type}</p>
                                <p><strong>Status:</strong> {demoOutput.result.status}</p>
                                <p><strong>Security Level:</strong> <Chip color="success" size="sm">{demoOutput.result.security_level}</Chip></p>
                                <p><strong>Recommendation:</strong> {demoOutput.result.recommendation}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Demo Repository */}
        <Card className="mb-12">
          <CardHeader>
            <Github className="mr-3" size={24} />
            <h2 className="text-xl font-semibold">Source Code & Live Demo</h2>
          </CardHeader>
          <CardBody>
            <p className="text-foreground-600 mb-4">
              See a complete implementation using environment variables with proper error handling:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                as={NextUILink}
                href="https://github.com/BradleyMatera/env-demo"
                target="_blank"
                color="primary"
                variant="flat"
                startContent={<Github size={16} />}
                endContent={<ExternalLink size={16} />}
              >
                View Repository
              </Button>
              <Button
                as={NextUILink}
                href="https://bradleymatera.github.io/env-demo/"
                target="_blank"
                color="secondary"
                variant="flat"
                startContent={<ExternalLink size={16} />}
              >
                Live Demo
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            as={Link}
            href="/demos/shared-secrets"
            variant="bordered"
            startContent={<ArrowLeft size={16} />}
          >
            Shared Secrets
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-foreground-500 mb-2">Next: Learn industry best practices</p>
            <Button
              as={Link}
              href="/best-practices"
              color="primary"
              endContent={<ArrowRight size={16} />}
            >
              Best Practices Guide
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
