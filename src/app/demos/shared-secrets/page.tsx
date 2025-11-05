'use client';

import { Breadcrumb } from "@/components/Breadcrumb";
import { CodeBlock } from "@/components/ui/code-block";
import { SharedSecretsDemo as SharedDemo } from "@/demos/shared/demo";
import { LabConsole } from "@/components/labs/LabConsole";
import { sharedSecretsScenario } from "@/components/labs/scenarios";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Chip,
  Divider,
  Link as NextUILink,
} from "@nextui-org/react";
import { 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight, 
  Github,
  ExternalLink,
  Lock,
  GitBranch,
  Users,
  Eye,
  Play,
  Terminal
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SharedSecretsDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [demoOutput, setDemoOutput] = useState<any>(null);
  const [demo] = useState(() => new SharedDemo());
  const sharedExamples = [
    {
      title: "secrets.json File",
      language: "json",
      code: `{
  "database": {
    "host": "production.db.company.com",
    "username": "admin",
    "password": "P@ssw0rd123!",
    "port": 5432
  },
  "apiKeys": {
    "stripe": "fake-stripe-live-key-example",
    "sendgrid": "SG.1234567890abcdef",
    "aws": "fake-aws-key-for-demo-only"
  },
  "jwt": {
    "secret": "my-super-secret-jwt-key-for-production"
  }
}`,
      risk: "All secrets visible to anyone who clones the repository"
    },
    {
      title: "config.js with Secrets",
      language: "javascript",
      code: `// config.js - committed to repository
module.exports = {
  development: {
    database: {
      host: 'localhost',
      password: 'dev123'
    }
  },
  production: {
    database: {
      host: 'prod.db.company.com',
      password: 'ProductionPassword2023!',
      ssl: true
    },
    apiKey: 'pk_live_realproductionapikey',
    webhookSecret: 'whsec_productionwebhooksecret'
  }
};`,
      risk: "Production secrets mixed with configuration"
    },
    {
      title: "Loading Shared Secrets",
      language: "javascript",
      code: `// app.js - using shared secrets file
const secrets = require('./secrets.json');
const config = require('./config.js');

// Database connection using shared secrets
const dbConfig = {
  host: secrets.database.host,
  user: secrets.database.username,
  password: secrets.database.password,
  port: secrets.database.port
};

// API configuration
const stripeKey = secrets.apiKeys.stripe;
const jwtSecret = secrets.jwt.secret;

console.log('Connecting to:', dbConfig.host);`,
      risk: "Application depends on committed secrets"
    }
  ];

  const problemsWithShared = [
    {
      title: "Version Control History",
      description: "Secrets become permanently stored in git history, even if later removed",
      icon: <GitBranch className="text-danger" size={20} />,
      severity: "Critical"
    },
    {
      title: "Overprivileged Access",
      description: "All team members get access to production secrets, violating least privilege",
      icon: <Users className="text-warning" size={20} />,
      severity: "High"
    },
    {
      title: "No Environment Separation",
      description: "Development and production secrets often mixed in the same file",
      icon: <Eye className="text-warning" size={20} />,
      severity: "High"
    },
    {
      title: "Repository Exposure Risk",
      description: "If repository becomes public or is compromised, all secrets are exposed",
      icon: <Lock className="text-danger" size={20} />,
      severity: "Critical"
    }
  ];

  const betterApproaches = [
    {
      title: "Separate Configuration Files",
      description: "Keep configuration structure in repo, secrets elsewhere",
      language: "json",
      code: `// config.template.json (committed)
{
  "database": {
    "host": "REPLACE_WITH_DB_HOST",
    "username": "REPLACE_WITH_USERNAME",
    "password": "REPLACE_WITH_PASSWORD"
  }
}`
    },
    {
      title: "Environment-Based Loading",
      description: "Load secrets from environment variables or external sources",
      language: "javascript",
      code: `// config.js (committed)
module.exports = {
  database: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
}`
    }
  ];

  const labExercises = [
    {
      title: "Reproduce the Leak",
      steps: [
        "Clone the shared secrets demo and inspect the repository history",
        "Check CI logs and artifacts for traces of secrets.json",
        "Use a GitHub personal access token to verify access levels"
      ]
    },
    {
      title: "Simulate a Contractor",
      steps: [
        "Create a new read-only collaborator and clone the repo",
        "List every secret accessible with that single permission",
        "Attempt to use the secrets to access production-like services"
      ]
    },
    {
      title: "Incident Review",
      steps: [
        "Draft an incident timeline from discovery to containment",
        "Identify logs and alerts that should have fired but did not",
        "Capture remediation tasks and owners"
      ]
    }
  ];

  const migrationTimeline = {
    week1: [
      "Inventory every secrets.* or config.* file committed to the repo",
      "Create configuration templates that exclude sensitive values",
      "Update documentation explaining the new separation"
    ],
    week2: [
      "Introduce environment variable loading with validation",
      "Set up secret scanning in CI and pre-push hooks",
      "Ensure pipeline secrets are stored outside of version control"
    ],
    week3: [
      "Rotate exposed credentials and remove secrets files from history",
      "Schedule access reviews for teams that previously read secrets",
      "Train developers on the new workflow and escalation paths"
    ]
  };

  const governanceQuestions = [
    "Who approves access to shared secret files today?",
    "How quickly can you revoke access if a contractor leaves?",
    "What downstream systems break if secrets.json is removed?",
    "Do you have monitoring for commits that reintroduce secrets?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Shared Secrets Demo" },
          ]}
        />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Lock className="text-warning mr-3" size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Shared Secrets Files</h1>
          <p className="text-xl text-foreground-600 max-w-3xl mx-auto">
            Understand why committing secrets files to your repository creates security vulnerabilities 
            and learn better alternatives for configuration management.
          </p>
        </div>

        {/* Warning */}
        <Card className="bg-warning-50 border-warning-200 mb-8">
          <CardHeader>
            <AlertTriangle className="text-warning mr-3" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-warning-800">⚠️ Medium Risk Approach</h3>
              <Chip color="warning" size="sm" variant="flat">Avoid in production</Chip>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-warning-700">
              While slightly better than hardcoded secrets, committing secrets files to your repository 
              still exposes sensitive information to anyone with repository access and creates permanent 
              security risks in your version control history.
            </p>
          </CardBody>
        </Card>

        {/* Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Common Shared Secrets Patterns</h2>
          <div className="space-y-6">
            {sharedExamples.map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <h3 className="text-lg font-semibold">{example.title}</h3>
                </CardHeader>
                <CardBody>
                  <CodeBlock
                    title={`${example.title} Example`}
                    code={example.code}
                    language={example.language}
                    canToggleVisibility={true}
                  />
                  <div className="mt-4 p-3 bg-warning-50 rounded-lg border border-warning-200">
                    <p className="text-warning-700 text-sm font-medium">
                      ⚠️ Problem: {example.risk}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Problems */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Shared Secrets Are Problematic</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {problemsWithShared.map((problem, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {problem.icon}
                      <h3 className="text-lg font-semibold ml-3">{problem.title}</h3>
                    </div>
                    <Chip 
                      color={problem.severity === 'Critical' ? 'danger' : 'warning'}
                      size="sm"
                    >
                      {problem.severity}
                    </Chip>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-foreground-600">{problem.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Better Approaches */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Better Approaches</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {betterApproaches.map((approach, index) => (
              <Card key={index} className="bg-success-50 border-success-200">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-success-800">{approach.title}</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-success-700 mb-4">{approach.description}</p>
                  <CodeBlock
                    title={`${approach.title} Implementation`}
                    code={approach.code}
                    language={approach.language}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        <Divider className="my-12" />

  <LabConsole scenario={sharedSecretsScenario} />

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Guided Lab Exercises</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              {labExercises.map((exercise) => (
                <div key={exercise.title}>
                  <p className="font-medium text-foreground-600 mb-2">{exercise.title}</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                    {exercise.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Governance Questions</h3>
            </CardHeader>
            <CardBody>
              <ul className="list-disc space-y-2 pl-5 text-foreground-600">
                {governanceQuestions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <h3 className="text-xl font-semibold">Three-Week Migration Timeline</h3>
          </CardHeader>
          <CardBody className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="font-semibold text-foreground-600 mb-2">Week 1</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                {migrationTimeline.week1.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground-600 mb-2">Week 2</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                {migrationTimeline.week2.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground-600 mb-2">Week 3</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                {migrationTimeline.week3.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>

        {/* GitHub Security Features */}
        <Card className="mb-12">
          <CardHeader>
            <Github className="text-primary mr-3" size={24} />
            <h2 className="text-xl font-semibold">GitHub's Secret Detection</h2>
          </CardHeader>
          <CardBody>
            <p className="text-foreground-600 mb-4">
              GitHub automatically scans repositories for known secret patterns and alerts you when secrets are detected:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-5 text-foreground-600">
              <li><strong>Secret scanning:</strong> Automatically detects API keys, tokens, and credentials</li>
              <li><strong>Push protection:</strong> Prevents commits containing secrets from being pushed</li>
              <li><strong>Partner alerts:</strong> Notifies service providers when their secrets are exposed</li>
            </ul>
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-primary-800 font-medium">
                💡 Even with these protections, it's better to never commit secrets in the first place!
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
                color="warning"
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
                {isRunning ? 'Running...' : 'Execute Shared Config Demo'}
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3 mb-6 text-sm text-foreground-600">
              <p>
                Pressing the button reenacts what happens when a team synchronises secrets through a shared JSON file.
                Behind the scenes the simulation:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Loads a configuration file that still contains production credentials</li>
                <li>Illustrates how that file spreads to CI, laptops, and contractors the moment it is committed</li>
                <li>Highlights the lingering risk even after the file is “removed” from the repository</li>
              </ul>
              <p>
                Treat the output as a narrated post-incident review. Each log line explains who touched the secrets,
                where copies travelled, and what control failures allowed the leak to happen. The summary banner
                captures the recommended next steps.
              </p>
            </div>
            
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
                            <div className="bg-warning-50 border border-warning-200 p-3 rounded">
                              <div className="space-y-2">
                                <p><strong>Demo Type:</strong> {demoOutput.result.demo_type}</p>
                                <p><strong>Status:</strong> {demoOutput.result.status}</p>
                                <p><strong>Security Level:</strong> <Chip color="warning" size="sm">{demoOutput.result.security_level}</Chip></p>
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

        {/* Demo Repositories */}
        <Card className="mb-12">
          <CardHeader>
            <Github className="mr-3" size={24} />
            <h2 className="text-xl font-semibold">Source Code & Live Demo</h2>
          </CardHeader>
          <CardBody>
            <p className="text-foreground-600 mb-4">
              See how shared secrets appear in a real repository and how GitHub detects them:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                as={NextUILink}
                href="https://github.com/BradleyMatera/shared-demo"
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
                href="https://bradleymatera.github.io/shared-demo/"
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
            href="/demos/hardcoded"
            variant="bordered"
            startContent={<ArrowLeft size={16} />}
          >
            Hardcoded Secrets
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-foreground-500 mb-2">Next: Learn the proper way with environment variables</p>
            <Button
              as={Link}
              href="/demos/environment-variables"
              color="primary"
              endContent={<ArrowRight size={16} />}
            >
              Environment Variables
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
