'use client';

import { Breadcrumb } from "@/components/Breadcrumb";
import { CodeBlock } from "@/components/ui/code-block";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Chip,
  Divider,
  Link as NextUILink,
  Tabs,
  Tab,
  Progress
} from "@nextui-org/react";
import { 
  Shield, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink,
  Lock,
  Key,
  Users,
  RotateCcw,
  FileSearch,
  Cloud,
  CheckCircle,
  AlertTriangle,
  BookOpen
} from "lucide-react";
import Link from "next/link";

export default function BestPracticesPage() {
  const hashiCorpPrinciples = [
    {
      title: "Central Secrets Control Plane",
      icon: <Shield className="text-primary" size={24} />,
      description: "Centralize all secret management in one secure location instead of scattering secrets across multiple systems and files.",
      benefits: [
        "Single source of truth for all secrets",
        "Consistent security policies across applications",
        "Simplified audit and compliance reporting",
        "Reduced risk of secret sprawl"
      ],
      implementation: `// Using a centralized secrets manager
const vault = require('node-vault')({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN
});

// Retrieve secrets from central location
const dbSecrets = await vault.read('secret/database');
const apiKeys = await vault.read('secret/api-keys');`,
      examples: [
        "HashiCorp Vault",
        "AWS Secrets Manager", 
        "Azure Key Vault",
        "Kubernetes Secrets"
      ]
    },
    {
      title: "Access Control Lists (ACLs)",
      icon: <Users className="text-success" size={24} />,
      description: "Implement granular access controls to ensure only authorized users and applications can access specific secrets.",
      benefits: [
        "Principle of least privilege enforcement",
        "Reduced blast radius of compromises", 
        "Compliance with security frameworks",
        "Audit trail of secret access"
      ],
      implementation: `// Example Vault policy for ACL
path "secret/database/*" {
  capabilities = ["read"]
}

path "secret/api-keys/payment/*" {
  capabilities = ["read", "list"]
}

# Only senior developers can write secrets
path "secret/*" {
  capabilities = ["create", "update", "delete"]
  allowed_parameters = {
    "ttl" = ["1h", "24h", "168h"]
  }
}`,
      examples: [
        "Role-based access (RBAC)",
        "Team-based permissions",
        "Application-specific access",
        "Environment separation"
      ]
    },
    {
      title: "Dynamic Secrets",
      icon: <RotateCcw className="text-warning" size={24} />,
      description: "Generate short-lived, automatically rotating secrets instead of using long-lived static credentials.",
      benefits: [
        "Automatic credential rotation",
        "Reduced window of compromise",
        "No manual secret management",
        "Improved security posture"
      ],
      implementation: `// Dynamic database credentials
const dbCreds = await vault.read('database/creds/readonly');

// Credentials are automatically generated and expire
const connection = {
  host: 'database.company.com',
  username: dbCreds.data.username,  // auto-generated
  password: dbCreds.data.password,  // auto-generated
  lease_duration: dbCreds.lease_duration // 1 hour TTL
};

// Vault automatically rotates and cleans up expired creds`,
      examples: [
        "Database credentials",
        "Cloud service tokens",
        "SSH certificates",
        "API tokens with TTL"
      ]
    },
    {
      title: "Encryption as a Service",
      icon: <Lock className="text-danger" size={24} />,
      description: "Use dedicated encryption services for data protection instead of managing encryption keys and algorithms yourself.",
      benefits: [
        "Centralized key management",
        "Hardware security modules (HSM)",
        "Compliance with regulations",
        "Simplified encryption workflows"
      ],
      implementation: `// Using Vault's encryption service
const plaintext = "sensitive user data";

// Encrypt data using Vault's encryption service
const encrypted = await vault.write('transit/encrypt/customer-data', {
  plaintext: Buffer.from(plaintext).toString('base64')
});

// Decrypt when needed
const decrypted = await vault.write('transit/decrypt/customer-data', {
  ciphertext: encrypted.data.ciphertext
});`,
      examples: [
        "Vault Transit Engine",
        "AWS KMS",
        "Azure Key Vault Encryption",
        "Google Cloud KMS"
      ]
    },
    {
      title: "Auditing",
      icon: <FileSearch className="text-secondary" size={24} />,
      description: "Maintain comprehensive logs of all secret access, modifications, and usage for security monitoring and compliance.",
      benefits: [
        "Complete audit trail",
        "Compliance reporting",
        "Security incident response",
        "Anomaly detection"
      ],
      implementation: `// Example audit log entry
{
  "time": "2023-11-03T10:30:00Z",
  "type": "request",
  "auth": {
    "client_token": "hmac-sha256:...",
    "accessor": "hmac-sha256:...",
    "display_name": "api-service",
    "policies": ["api-policy"]
  },
  "request": {
    "operation": "read",
    "path": "secret/database/credentials",
    "remote_address": "10.0.0.15"
  },
  "response": {
    "status": 200
  }
}`,
      examples: [
        "Access logs",
        "Modification tracking", 
        "Failed access attempts",
        "Policy violations"
      ]
    }
  ];

  const implementationLevels = [
    {
      level: "Starter",
      description: "Basic security for small teams and projects",
      color: "success" as const,
      practices: [
        "Use .env files with proper .gitignore",
        "Environment variable validation",
        "Different secrets per environment",
        "Basic secret documentation"
      ],
      tools: ["dotenv", "env-cmd", "cross-env"]
    },
    {
      level: "Professional", 
      description: "Enhanced security for growing applications",
      color: "primary" as const,
      practices: [
        "Cloud provider secret managers",
        "Automated secret rotation",
        "Access logging and monitoring",
        "Secret scanning in CI/CD"
      ],
      tools: ["AWS Secrets Manager", "Azure Key Vault", "GitHub Secret Scanning"]
    },
    {
      level: "Enterprise",
      description: "Advanced security for large organizations",
      color: "secondary" as const,
      practices: [
        "HashiCorp Vault implementation",
        "Dynamic secret generation",
        "Fine-grained access controls",
        "Compliance audit trails"
      ],
      tools: ["HashiCorp Vault", "CyberArk", "Kubernetes Secrets CSI"]
    }
  ];

  const commonMistakes = [
    {
      mistake: "Using the same secrets across environments",
      solution: "Use different secrets for development, staging, and production",
      severity: "high"
    },
    {
      mistake: "Storing secrets in configuration files",
      solution: "Keep configuration and secrets separate",
      severity: "critical"
    },
    {
      mistake: "No secret rotation policy",
      solution: "Implement regular secret rotation schedules",
      severity: "medium"
    },
    {
      mistake: "Overprivileged access to secrets",
      solution: "Apply principle of least privilege",
      severity: "high"
    },
    {
      mistake: "No monitoring of secret access",
      solution: "Implement comprehensive audit logging",
      severity: "medium"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Best Practices" },
          ]}
        />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <BookOpen className="text-primary mr-3" size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Secrets Management Best Practices</h1>
          <p className="text-xl text-foreground-600 max-w-4xl mx-auto">
            Comprehensive guide based on HashiCorp's 5 principles of secrets management and 
            industry-proven security practices for protecting sensitive data.
          </p>
        </div>

        {/* HashiCorp's 5 Principles */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">The 5 Pillars of Secrets Management</h2>
            <p className="text-foreground-600">
              Based on HashiCorp's industry-leading security framework
            </p>
          </div>
          
          <div className="space-y-8">
            {hashiCorpPrinciples.map((principle, index) => (
              <Card key={index} className="p-2">
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {principle.icon}
                      <div className="ml-4">
                        <h3 className="text-xl font-bold">{index + 1}. {principle.title}</h3>
                        <p className="text-foreground-600">{principle.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {principle.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <CheckCircle className="text-success mr-2" size={16} />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      
                      <h4 className="font-semibold mb-3 mt-6">Common Tools:</h4>
                      <div className="flex flex-wrap gap-2">
                        {principle.examples.map((example, i) => (
                          <Chip key={i} size="sm" variant="flat" color="primary">
                            {example}
                          </Chip>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Implementation Example:</h4>
                      <CodeBlock
                        code={principle.implementation}
                        language="javascript"
                        showLineNumbers={false}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Implementation Levels */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Implementation Roadmap</h2>
          <p className="text-center text-foreground-600 mb-8">
            Choose your starting point based on your organization's size and security requirements
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {implementationLevels.map((level, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{level.level}</h3>
                      <Chip color={level.color} variant="flat">
                        Level {index + 1}
                      </Chip>
                    </div>
                    <p className="text-foreground-600 text-sm">{level.description}</p>
                  </div>
                </CardHeader>
                <CardBody>
                  <h4 className="font-semibold mb-3">Key Practices:</h4>
                  <ul className="space-y-2 mb-6">
                    {level.practices.map((practice, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <CheckCircle className="text-success mr-2 mt-0.5 flex-shrink-0" size={14} />
                        {practice}
                      </li>
                    ))}
                  </ul>
                  
                  <h4 className="font-semibold mb-3">Recommended Tools:</h4>
                  <div className="flex flex-wrap gap-1">
                    {level.tools.map((tool, i) => (
                      <Chip key={i} size="sm" variant="bordered" color={level.color}>
                        {tool}
                      </Chip>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Common Mistakes to Avoid</h2>
          <div className="space-y-4">
            {commonMistakes.map((item, index) => (
              <Card key={index}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <AlertTriangle 
                          className={`mr-3 ${
                            item.severity === 'critical' ? 'text-danger' : 
                            item.severity === 'high' ? 'text-warning' : 'text-default-400'
                          }`} 
                          size={20} 
                        />
                        <h4 className="font-semibold">{item.mistake}</h4>
                        <Chip 
                          size="sm" 
                          color={item.severity === 'critical' ? 'danger' : item.severity === 'high' ? 'warning' : 'default'}
                          className="ml-3"
                        >
                          {item.severity}
                        </Chip>
                      </div>
                      <p className="text-foreground-600 ml-8">
                        <strong>Solution:</strong> {item.solution}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources */}
        <Card className="mb-12">
          <CardHeader>
            <ExternalLink className="mr-3" size={24} />
            <h2 className="text-xl font-semibold">Additional Resources</h2>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Official Documentation:</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <NextUILink 
                      href="https://www.hashicorp.com/resources/5-best-practices-for-secrets-management"
                      target="_blank"
                      showAnchorIcon
                    >
                      HashiCorp 5 Best Practices for Secrets Management
                    </NextUILink>
                  </li>
                  <li>
                    <NextUILink 
                      href="https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_credentials"
                      target="_blank"
                      showAnchorIcon
                    >
                      OWASP - Hard-coded Credentials
                    </NextUILink>
                  </li>
                  <li>
                    <NextUILink 
                      href="https://docs.github.com/en/code-security/secret-scanning"
                      target="_blank"
                      showAnchorIcon
                    >
                      GitHub Secret Scanning
                    </NextUILink>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Tools & Platforms:</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <NextUILink 
                      href="https://www.vaultproject.io/"
                      target="_blank"
                      showAnchorIcon
                    >
                      HashiCorp Vault
                    </NextUILink>
                  </li>
                  <li>
                    <NextUILink 
                      href="https://aws.amazon.com/secrets-manager/"
                      target="_blank"
                      showAnchorIcon
                    >
                      AWS Secrets Manager
                    </NextUILink>
                  </li>
                  <li>
                    <NextUILink 
                      href="https://azure.microsoft.com/en-us/services/key-vault/"
                      target="_blank"
                      showAnchorIcon
                    >
                      Azure Key Vault
                    </NextUILink>
                  </li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            as={Link}
            href="/demos/environment-variables"
            variant="bordered"
            startContent={<ArrowLeft size={16} />}
          >
            Environment Variables
          </Button>
          
          <Button
            as={Link}
            href="/"
            color="primary"
            endContent={<ArrowRight size={16} />}
          >
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
}
