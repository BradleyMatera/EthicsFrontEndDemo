'use client';

import { Navigation } from "@/components/Navigation";
import { TutorialProgress } from "@/components/TutorialProgress";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Chip,
  Divider,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen, 
  ArrowRight,
  Eye,
  Lock,
  Key
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const demoCards = [
    {
      title: "Hardcoded Secrets",
      description: "Learn why hardcoding secrets directly in your code is dangerous",
      icon: <Eye className="text-danger" size={24} />,
      risk: "High Risk",
      riskColor: "danger" as const,
      href: "/demos/hardcoded",
      examples: ["API keys in source", "Database passwords", "JWT secrets"],
    },
    {
      title: "Shared Secrets",
      description: "Explore the risks of committing secrets files to your repository",
      icon: <Lock className="text-warning" size={24} />,
      risk: "Medium Risk",
      riskColor: "warning" as const,
      href: "/demos/shared-secrets",
      examples: ["secrets.json files", "Config files with passwords", "Shared keys"],
    },
    {
      title: "Environment Variables",
      description: "Discover the proper way to handle secrets using .env files",
      icon: <Key className="text-success" size={24} />,
      risk: "Best Practice",
      riskColor: "success" as const,
      href: "/demos/environment-variables",
      examples: [".env files", "Runtime secrets", "Secure deployment"],
    },
    {
      title: "Comparison",
      description: "Compare all approaches side-by-side to understand the differences",
      icon: <Shield className="text-primary" size={24} />,
      risk: "Educational",
      riskColor: "primary" as const,
      href: "/comparison",
      examples: ["Security analysis", "Feature comparison", "Migration guide"],
    },
  ];

  const learningModules = [
    {
      key: "foundations",
      title: "Module 1 · Foundations",
      subtitle: "Set expectations and baseline awareness across the team",
      objectives: [
        "Install Bun, clone the repository, and run the project locally",
        "Align on terminology: secrets, credentials, keys, tokens",
        "Capture the current state of secrets usage in your apps"
      ],
      deliverables: [
        "Local environment checklist signed off",
        "Baseline screenshot of insecure secret exposure",
        "Stakeholder map showing who touches secrets today"
      ]
    },
    {
      key: "exposure",
      title: "Module 2 · Exposure Drills",
      subtitle: "Experience the failure modes firsthand",
      objectives: [
        "Run each insecure demo and capture console output",
        "Document the attack path and timeline for every breach scenario",
        "List monitoring or logging gaps that made detection harder"
      ],
      deliverables: [
        "Incident-style write-up for hardcoded secrets",
        "Incident-style write-up for shared secrets",
        "Rotation plan for any real credentials uncovered"
      ]
    },
    {
      key: "hardening",
      title: "Module 3 · Hardening",
      subtitle: "Replace insecure patterns with the .env workflow",
      objectives: [
        "Create environment-specific .env files with validation",
        "Integrate CI and deployment secrets for production parity",
        "Automate local setup with scripts or task runners"
      ],
      deliverables: [
        "Validated .env.example file checked into version control",
        "Automation scripts for loading secrets locally and in CI",
        "Documented rotation cadence for each credential"
      ]
    },
    {
      key: "operations",
      title: "Module 4 · Operations",
      subtitle: "Make secure secrets management a habit",
      objectives: [
        "Define ownership, escalation paths, and review cadence",
        "Configure monitoring, alerting, and dashboards for secrets",
        "Create onboarding/offboarding flows for privileged access"
      ],
      deliverables: [
        "Secrets governance charter",
        "Alert runbook for suspected compromise",
        "Quarterly audit checklist ready for compliance"
      ]
    }
  ];

  const adoptionChecklist = [
    "Select a secrets manager or platform secrets store",
    "Catalogue every credential used across environments",
    "Automate rotation and expiry alerts",
    "Document recovery procedures for compromised credentials",
    "Train teams on onboarding, usage, and revocation workflows"
  ];

  const practitionerToolkit = [
    {
      name: "Discovery",
      items: [
        "truffleHog / gitleaks git history scans",
        "CI secret scanning hooks",
        "Dependency inventory with secret usage annotations"
      ]
    },
    {
      name: "Implementation",
      items: [
        "dotenv-safe validation script",
        "Pre-commit hooks preventing accidental secret commits",
        "CLI helpers for local environment injection"
      ]
    },
    {
      name: "Operations",
      items: [
        "Rotation scheduler and reminder system",
        "Access review templates (quarterly/annual)",
        "Incident response playbooks for leaked credentials"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center py-12">
          <div className="flex justify-center mb-6">
            <Shield className="text-primary mr-3" size={48} />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Node.js Secrets
            </h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground-600 mb-4">
            Management Tutorial
          </h2>
          <p className="text-lg text-foreground-500 max-w-3xl mx-auto mb-8">
            A comprehensive, interactive guide to managing secrets in Node.js applications. 
            Learn from bad practices to industry best practices with hands-on examples.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              as={Link}
              href="/demos/hardcoded" 
              color="primary" 
              size="lg"
              endContent={<ArrowRight size={20} />}
            >
              Start Learning
            </Button>
            <Button 
              as={Link}
              href="/best-practices" 
              variant="bordered" 
              size="lg"
              startContent={<BookOpen size={20} />}
            >
              Best Practices
            </Button>
          </div>
        </div>

        <Divider className="my-12" />

        {/* What You'll Learn Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <AlertTriangle className="text-warning mr-3" size={24} />
              <h3 className="text-xl font-semibold">What NOT to Do</h3>
            </CardHeader>
            <CardBody>
              <ul className="list-disc space-y-2 pl-5 text-foreground-600">
                <li>Hardcoding secrets in source code</li>
                <li>Committing secrets to version control</li>
                <li>Sharing secrets in plain text files</li>
                <li>Using the same secrets across environments</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="text-success mr-3" size={24} />
              <h3 className="text-xl font-semibold">Best Practices</h3>
            </CardHeader>
            <CardBody>
              <ul className="list-disc space-y-2 pl-5 text-foreground-600">
                <li>Environment-based secret management</li>
                <li>Proper .gitignore configurations</li>
                <li>Secret rotation and expiration</li>
                <li>Production-grade secret managers</li>
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* Interactive Demos */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Interactive Demonstrations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoCards.map((demo) => (
              <Card key={demo.href} className="hover:scale-105 transition-transform">
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {demo.icon}
                      <div className="ml-3">
                        <h4 className="text-lg font-semibold">{demo.title}</h4>
                        <Chip size="sm" color={demo.riskColor} variant="flat">
                          {demo.risk}
                        </Chip>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-foreground-600 mb-4">{demo.description}</p>
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Examples:</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                      {demo.examples.map((example) => (
                        <li key={example}>{example}</li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    as={Link}
                    href={demo.href}
                    color={demo.riskColor}
                    variant="flat"
                    size="sm"
                    endContent={<ArrowRight size={16} />}
                    className="w-full"
                  >
                    Explore Demo
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        <Divider className="my-12" />

        {/* Guided Curriculum */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-4">Guided Curriculum</h2>
          <p className="text-foreground-600 text-center max-w-3xl mx-auto mb-8">
            Follow the curriculum to move from awareness to production-grade governance. Each module spells out objectives,
            exit criteria, and artefacts you should produce along the way.
          </p>
          <Tabs aria-label="Learning modules" color="primary" variant="underlined" className="max-w-5xl mx-auto">
            {learningModules.map((module) => (
              <Tab key={module.key} title={module.title} className="text-left">
                <Card>
                  <CardHeader className="flex flex-col items-start gap-2">
                    <p className="text-sm uppercase tracking-wide text-foreground-400">{module.subtitle}</p>
                    <h3 className="text-xl font-semibold">Learning Objectives</h3>
                  </CardHeader>
                  <CardBody className="space-y-6">
                    <div>
                      <ul className="list-disc space-y-2 pl-5 text-foreground-600">
                        {module.objectives.map((objective) => (
                          <li key={objective}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground-500 mb-2">Exit Criteria</p>
                      <ul className="list-disc space-y-2 pl-5 text-foreground-600">
                        {module.deliverables.map((deliverable) => (
                          <li key={deliverable}>{deliverable}</li>
                        ))}
                      </ul>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
            ))}
          </Tabs>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-warning-50 border-warning-200">
            <CardBody>
              <div className="flex items-start">
                <AlertTriangle className="text-warning mr-3 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-warning-800">Educational Purpose Only</p>
                  <p className="text-warning-700 text-sm">
                    This tutorial demonstrates both secure and insecure practices so you can recognize poor patterns in the wild.
                    Never ship the insecure examples — use them to educate your team and improve existing systems.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <TutorialProgress />
        </div>

        <Divider className="my-12" />

        {/* Adoption Checklist & Toolkit */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-xl font-semibold">Adoption Checklist</h3>
                <p className="text-sm text-foreground-500">Mark these milestones as you roll the programme out.</p>
              </div>
            </CardHeader>
            <CardBody>
              <ol className="list-decimal space-y-2 pl-5 text-foreground-600">
                {adoptionChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <h3 className="text-xl font-semibold">Practitioner Toolkit</h3>
                <p className="text-sm text-foreground-500">Keep these tools handy for discovery, implementation, and operations.</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {practitionerToolkit.map((group) => (
                <div key={group.name}>
                  <p className="font-medium text-foreground-600 mb-2">{group.name}</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                    {group.items.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardBody>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-divider">
          <p className="text-foreground-500">
            Built with Next.js, NextUI, and ❤️ for secure coding practices
          </p>
        </div>
      </main>
    </div>
  );
}
