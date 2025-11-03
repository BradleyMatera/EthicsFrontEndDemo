'use client';

import { Navigation } from "@/components/navigation";
import { TutorialProgress } from "@/components/TutorialProgress";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Chip,
  Divider,
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
