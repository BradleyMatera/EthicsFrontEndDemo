'use client';

import { Breadcrumb } from "@/components/Breadcrumb";
import { CodeBlock } from "@/components/ui/code-block";
import { HardcodedSecretsDemo as HardcodedDemo } from "@/demos/hardcoded/demo";
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
  Eye,
  EyeOff,
  Shield,
  Play,
  Terminal
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HardcodedSecretsDemo() {
  const [showSecret, setShowSecret] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [demoOutput, setDemoOutput] = useState<any>(null);
  const [demo] = useState(() => new HardcodedDemo());

  const hardcodedExamples = [
    {
      title: "API Key in Source Code",
      language: "javascript",
      code: `// BAD: Never do this!
const API_KEY = "sk-1234567890abcdef";

fetch("https://api.example.com/data", {
  headers: {
    "Authorization": \`Bearer \${API_KEY}\`
  }
});`,
      risk: "Anyone with access to your code can see the API key"
    },
    {
      title: "Database Connection String",
      language: "javascript", 
      code: `// BAD: Database credentials exposed
const dbConnection = "mongodb://admin:password123@localhost:27017/myapp";

const mongoose = require('mongoose');
mongoose.connect(dbConnection);`,
      risk: "Database credentials visible to anyone reading the code"
    },
    {
      title: "JWT Secret",
      language: "javascript",
      code: `// BAD: JWT secret hardcoded
const jwt = require('jsonwebtoken');
const SECRET = "my-super-secret-jwt-key";

const token = jwt.sign({ userId: 123 }, SECRET, { expiresIn: '1h' });`,
      risk: "JWT tokens can be forged if secret is known"
    }
  ];

  const risks = [
    {
      title: "Version Control Exposure",
      description: "Secrets become permanently part of your git history",
      severity: "Critical"
    },
    {
      title: "Public Repository Risk",
      description: "If your repo becomes public, secrets are immediately exposed",
      severity: "Critical"
    },
    {
      title: "Team Access Issues",
      description: "All developers see secrets they might not need",
      severity: "High"
    },
    {
      title: "No Rotation Capability",
      description: "Changing secrets requires code changes and deployments",
      severity: "Medium"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Hardcoded Secrets Demo" },
          ]}
        />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Eye className="text-danger mr-3" size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Hardcoded Secrets</h1>
          <p className="text-xl text-foreground-600 max-w-3xl mx-auto">
            Learn why hardcoding secrets directly in your source code is one of the most dangerous 
            security practices and how it can lead to major data breaches.
          </p>
        </div>

        {/* Danger Warning */}
        <Card className="bg-danger-50 border-danger-200 mb-8">
          <CardHeader>
            <AlertTriangle className="text-danger mr-3" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-danger-800">🚨 Critical Security Risk</h3>
              <Chip color="danger" size="sm" variant="flat">Never use in production</Chip>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-danger-700">
              Hardcoding secrets directly in your source code is extremely dangerous. This approach 
              makes your sensitive credentials visible to anyone with access to your codebase and 
              permanently stores them in version control history.
            </p>
          </CardBody>
        </Card>

        {/* Interactive Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Dangerous Examples</h2>
          <div className="space-y-6">
            {hardcodedExamples.map((example, index) => (
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
                  <div className="mt-4 p-3 bg-danger-50 rounded-lg border border-danger-200">
                    <p className="text-danger-700 text-sm font-medium">
                      ⚠️ Risk: {example.risk}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Risks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Security Risks & Consequences</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {risks.map((risk, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-lg font-semibold">{risk.title}</h3>
                    <Chip 
                      color={risk.severity === 'Critical' ? 'danger' : risk.severity === 'High' ? 'warning' : 'default'}
                      size="sm"
                    >
                      {risk.severity}
                    </Chip>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-foreground-600">{risk.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Real-World Examples */}
        <Card className="mb-12">
          <CardHeader>
            <Shield className="text-warning mr-3" size={24} />
            <h2 className="text-2xl font-bold">Real-World Impact</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Famous Security Breaches Caused by Hardcoded Secrets:</h4>
                <ul className="list-disc space-y-2 pl-5 text-foreground-600">
                  <li><strong>Uber (2016):</strong> Engineers hardcoded AWS credentials in private GitHub repos</li>
                  <li><strong>Toyota (2023):</strong> Access tokens exposed in public repositories for nearly 5 years</li>
                  <li><strong>Mercedes-Benz (2022):</strong> GitHub token with access to internal repos found hardcoded</li>
                  <li><strong>Samsung (2019):</strong> Private keys and passwords found in public repositories</li>
                </ul>
              </div>
              <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
                <p className="text-warning-800 font-medium">
                  💡 These breaches could have been prevented by following proper secrets management practices.
                </p>
              </div>
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
                color="danger"
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
                {isRunning ? 'Running...' : 'Execute Hardcoded Demo'}
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-foreground-600 mb-4">
              Click the button above to see how hardcoded secrets work in practice and what security risks they pose:
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
                            <div className="bg-danger-50 border border-danger-200 p-3 rounded">
                              <div className="space-y-2">
                                <p><strong>Demo Type:</strong> {demoOutput.result.demo_type}</p>
                                <p><strong>Status:</strong> {demoOutput.result.status}</p>
                                <p><strong>Security Level:</strong> <Chip color="danger" size="sm">{demoOutput.result.security_level}</Chip></p>
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
              Explore the actual implementation and see how secrets appear in real codebases:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                as={NextUILink}
                href="https://github.com/BradleyMatera/hardcoded-demo"
                target="_blank"
                color="primary"
                variant="flat"
                startContent={<Github size={16} />}
                endContent={<ExternalLink size={16} />}
              >
                View Source Code
              </Button>
              <Button
                as={NextUILink}
                href="https://bradleymatera.github.io/hardcoded-demo/"
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
            href="/"
            variant="bordered"
            startContent={<ArrowLeft size={16} />}
          >
            Back to Home
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-foreground-500 mb-2">Next: Learn about shared secrets</p>
            <Button
              as={Link}
              href="/demos/shared-secrets"
              color="primary"
              endContent={<ArrowRight size={16} />}
            >
              Shared Secrets Demo
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
