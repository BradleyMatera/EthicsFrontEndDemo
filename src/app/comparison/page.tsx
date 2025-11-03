'use client';

import { Breadcrumb } from "@/components/Breadcrumb";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@nextui-org/react";
import { 
  AlertTriangle, 
  ArrowLeft, 
  CheckCircle,
  XCircle,
  Minus,
  Shield,
  Users,
  Rotate3D,
  Eye,
  FileText,
  Key
} from "lucide-react";
import Link from "next/link";

export default function ComparisonPage() {
  const approaches = [
    {
      name: "Hardcoded Secrets",
      icon: <Eye className="text-danger" size={20} />,
      security: "Critical Risk",
      securityColor: "danger" as const,
      ease: "Very Easy",
      easeColor: "success" as const,
      rotation: "Impossible",
      rotationColor: "danger" as const,
      teamAccess: "All Developers",
      teamColor: "warning" as const,
      versioning: "Exposed",
      versioningColor: "danger" as const,
      production: "Never",
      productionColor: "danger" as const
    },
    {
      name: "Shared Config Files", 
      icon: <FileText className="text-warning" size={20} />,
      security: "Moderate Risk",
      securityColor: "warning" as const,
      ease: "Easy",
      easeColor: "success" as const,
      rotation: "Manual Process",
      rotationColor: "warning" as const,
      teamAccess: "File Access Required",
      teamColor: "warning" as const,
      versioning: "Can Exclude",
      versioningColor: "success" as const,
      production: "With Caution",
      productionColor: "warning" as const
    },
    {
      name: "Environment Variables",
      icon: <Key className="text-success" size={20} />,
      security: "High Security",
      securityColor: "success" as const,
      ease: "Moderate",
      easeColor: "warning" as const,
      rotation: "Automated",
      rotationColor: "success" as const,
      teamAccess: "Role-Based",
      teamColor: "success" as const,
      versioning: "Never Exposed",
      versioningColor: "success" as const,
      production: "Recommended",
      productionColor: "success" as const
    }
  ];

  const detailedComparison = [
    {
      category: "Secret Visibility",
      hardcoded: { status: "danger", text: "Visible in source code" },
      shared: { status: "warning", text: "Hidden from source, visible in files" }, 
      env: { status: "success", text: "Completely hidden" }
    },
    {
      category: "Version Control Risk",
      hardcoded: { status: "danger", text: "Always committed" },
      shared: { status: "warning", text: "Risk if not ignored" },
      env: { status: "success", text: "Never committed" }
    },
    {
      category: "Secret Rotation",
      hardcoded: { status: "danger", text: "Requires code changes" },
      shared: { status: "warning", text: "File updates needed" },
      env: { status: "success", text: "No code changes" }
    },
    {
      category: "Environment Separation", 
      hardcoded: { status: "danger", text: "Same secrets everywhere" },
      shared: { status: "warning", text: "Different files per env" },
      env: { status: "success", text: "Native env separation" }
    },
    {
      category: "Team Access Control",
      hardcoded: { status: "danger", text: "All team members see secrets" },
      shared: { status: "warning", text: "File permissions needed" },
      env: { status: "success", text: "Platform-based access" }
    },
    {
      category: "Deployment Complexity",
      hardcoded: { status: "success", text: "No setup needed" },
      shared: { status: "warning", text: "Files must be deployed" },
      env: { status: "warning", text: "Environment setup required" }
    }
  ];

  const scenarioGuides = [
    {
      name: "Small Team Prototype",
      considerations: [
        "Start with environment variables and a shared password manager",
        "Add pre-commit hooks to prevent accidental commits",
        "Schedule a monthly review as the team grows"
      ]
    },
    {
      name: "Growing SaaS Startup",
      considerations: [
        "Adopt a managed secrets store (AWS SSM, Doppler, 1Password) early",
        "Automate rotation with CI/CD pipelines",
        "Introduce role-based access control and onboarding workflows"
      ]
    },
    {
      name: "Enterprise Platform",
      considerations: [
        "Centralise secrets in a dedicated vault with hardware backing",
        "Integrate secrets governance with compliance tooling",
        "Implement real-time monitoring and anomaly detection"
      ]
    }
  ];

  const migrationChecklist = {
    discovery: [
      "Audit repositories for committed secrets and shared secret files",
      "Catalogue services depending on existing credentials",
      "Identify owners and consumers for each secret"
    ],
    execution: [
      "Remove secrets from version control and rotate them",
      "Introduce environment variable loading with validation",
      "Set up CI/CD secrets and block insecure merges"
    ],
    reinforcement: [
      "Train teams and update documentation",
      "Add monitoring and alerts for regressions",
      "Schedule regular audits and tabletop exercises"
    ]
  };

  const workshopPrompts = [
    "Which systems would be impacted if a secret rotated unexpectedly?",
    "How fast can we revoke access for a departing contractor?",
    "What evidence would we present during a security audit?",
    "Where do we store runbooks for incident response?"
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="text-success" size={16} />;
      case 'warning': return <Minus className="text-warning" size={16} />;
      case 'danger': return <XCircle className="text-danger" size={16} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Comparison" },
          ]}
        />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="text-primary mr-3" size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Secrets Management Comparison</h1>
          <p className="text-xl text-foreground-600 max-w-3xl mx-auto">
            Compare the three main approaches to secrets management and understand 
            which approach is best for your application security needs.
          </p>
        </div>

        {/* Quick Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {approaches.map((approach, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {approach.icon}
                  <h3 className="text-lg font-semibold">{approach.name}</h3>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground-600">Security:</span>
                    <Chip color={approach.securityColor} size="sm">{approach.security}</Chip>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground-600">Setup:</span>
                    <Chip color={approach.easeColor} size="sm">{approach.ease}</Chip>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground-600">Production:</span>
                    <Chip color={approach.productionColor} size="sm">{approach.production}</Chip>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Detailed Comparison Table */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-bold">Detailed Feature Comparison</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Secrets management comparison table">
              <TableHeader>
                <TableColumn>Feature</TableColumn>
                <TableColumn>Hardcoded Secrets</TableColumn>
                <TableColumn>Shared Config Files</TableColumn>
                <TableColumn>Environment Variables</TableColumn>
              </TableHeader>
              <TableBody>
                {detailedComparison.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(row.hardcoded.status)}
                        <span className="text-sm">{row.hardcoded.text}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(row.shared.status)}
                        <span className="text-sm">{row.shared.text}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(row.env.status)}
                        <span className="text-sm">{row.env.text}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Recommendations */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-danger-50 border-danger-200">
            <CardHeader>
              <AlertTriangle className="text-danger mr-3" size={24} />
              <h3 className="text-lg font-semibold text-danger-800">❌ Never Use</h3>
            </CardHeader>
            <CardBody>
              <div className="text-danger-700">
                <p className="font-medium mb-2">Hardcoded Secrets</p>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  <li>Extremely high security risk</li>
                  <li>Permanent exposure in git history</li>
                  <li>No way to rotate secrets easily</li>
                  <li>All team members see all secrets</li>
                </ul>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-success-50 border-success-200">
            <CardHeader>
              <CheckCircle className="text-success mr-3" size={24} />
              <h3 className="text-lg font-semibold text-success-800">✅ Best Practice</h3>
            </CardHeader>
            <CardBody>
              <div className="text-success-700">
                <p className="font-medium mb-2">Environment Variables</p>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  <li>Industry standard approach</li>
                  <li>Platform-native secret management</li>
                  <li>Easy secret rotation</li>
                  <li>Role-based access control</li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Migration Path */}
        <Card className="mb-12">
          <CardHeader>
            <Rotate3D className="text-primary mr-3" size={24} />
            <h2 className="text-xl font-semibold">Migration Path</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <h4 className="font-semibold">If you're currently using hardcoded secrets:</h4>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <Card className="flex-1 bg-danger-50">
                  <CardBody className="text-center">
                    <Eye className="mx-auto mb-2 text-danger" size={24} />
                    <p className="font-medium">Hardcoded</p>
                    <p className="text-sm text-danger-600">Current State</p>
                  </CardBody>
                </Card>
                
                <div className="text-2xl text-foreground-400">→</div>
                
                <Card className="flex-1 bg-warning-50">
                  <CardBody className="text-center">
                    <FileText className="mx-auto mb-2 text-warning" size={24} />
                    <p className="font-medium">Shared Files</p>
                    <p className="text-sm text-warning-600">Intermediate Step</p>
                  </CardBody>
                </Card>
                
                <div className="text-2xl text-foreground-400">→</div>
                
                <Card className="flex-1 bg-success-50">
                  <CardBody className="text-center">
                    <Key className="mx-auto mb-2 text-success" size={24} />
                    <p className="font-medium">Environment Variables</p>
                    <p className="text-sm text-success-600">Best Practice</p>
                  </CardBody>
                </Card>
              </div>
              
              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <p className="text-primary-800 font-medium">💡 Pro Tip:</p>
                <p className="text-primary-700 text-sm mt-1">
                  You can migrate gradually. Start by moving secrets to shared files, 
                  then transition to environment variables when you're ready to set up proper 
                  secret management infrastructure.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Divider className="my-12" />

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {scenarioGuides.map((scenario) => (
            <Card key={scenario.name}>
              <CardHeader>
                <h3 className="text-lg font-semibold">{scenario.name}</h3>
              </CardHeader>
              <CardBody>
                <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-600">
                  {scenario.considerations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ))}
        </div>

        <Card className="mb-12">
          <CardHeader>
            <h3 className="text-xl font-semibold">Migration Checklist</h3>
          </CardHeader>
          <CardBody className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="font-semibold text-foreground-600 mb-2">Discovery</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                {migrationChecklist.discovery.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground-600 mb-2">Execution</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                {migrationChecklist.execution.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground-600 mb-2">Reinforcement</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                {migrationChecklist.reinforcement.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <h3 className="text-xl font-semibold">Workshop Prompts</h3>
          </CardHeader>
          <CardBody>
            <ul className="list-disc space-y-2 pl-5 text-foreground-600">
              {workshopPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            as={Link}
            href="/best-practices"
            variant="bordered"
            startContent={<ArrowLeft size={16} />}
          >
            Best Practices
          </Button>
          
          <Button
            as={Link}
            href="/"
            color="primary"
          >
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
}
