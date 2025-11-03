'use client';

import { Breadcrumb } from "@/components/Breadcrumb";
import { TutorialProgress } from "@/components/TutorialProgress";
import { Card, CardBody, CardHeader, Chip, Button } from "@nextui-org/react";
import { Eye, FileText, Key, Sparkles } from "lucide-react";
import Link from "next/link";

const demos = [
  {
    title: "Hardcoded Secrets",
    description: "Witness how quickly a leaked repository escalates into a full compromise when secrets live in code.",
    href: "/demos/hardcoded",
    icon: <Eye className="text-danger" size={22} />,
    badge: { label: "Critical Risk", color: "danger" as const },
    takeaways: [
      "Secrets instantly exposed to every collaborator",
      "Impossible to rotate without new deployments",
      "Audit trails show secrets copied into logs and crash reports"
    ],
  },
  {
    title: "Shared Secrets Files",
    description: "Explore JSON/YAML secrets files, why teams adopt them, and where the approach begins to crumble.",
    href: "/demos/shared-secrets",
    icon: <FileText className="text-warning" size={22} />,
    badge: { label: "Medium Risk", color: "warning" as const },
    takeaways: [
      "Version history never forgets the first commit",
      "Operational burden to keep every environment aligned",
      "Difficult to enforce least-privilege access controls"
    ],
  },
  {
    title: "Environment Variables",
    description: "Learn the recommended pattern for local, CI, and production environments with validation and rotation tips.",
    href: "/demos/environment-variables",
    icon: <Key className="text-success" size={22} />,
    badge: { label: "Best Practice", color: "success" as const },
    takeaways: [
      "Secrets never enter the repository",
      "Different environments receive scoped credentials",
      "Supports automated rotation and incident response playbooks"
    ],
  },
];

const prework = [
  "Skim the README to understand the project structure",
  "Run bun run build:pages once to ensure tooling works",
  "List the secrets used by your real-world applications"
];

const postwork = [
  "Create remediation tickets for insecure patterns",
  "Share lessons learned with your broader engineering team",
  "Schedule a follow-up to verify the new workflow is adopted"
];

const assessmentCriteria = [
  "You can explain the risks of each approach to a stakeholder",
  "Your repo contains validated .env templates instead of secrets",
  "Rotation and incident response playbooks are documented",
  "You have monitoring in place for secrets regressions"
];

export default function DemosOverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50">
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Interactive Demos" },
          ]}
        />

        <div className="mt-10 mb-12 text-center">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="text-primary" size={28} />
            <h1 className="text-4xl font-bold">Choose Your Learning Path</h1>
          </div>
          <p className="mt-4 text-lg text-foreground-600">
            Each demo layers on more resilient techniques. Work through them in order to experience the
            mindset shift from insecure quick fixes to production-ready secrets management.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {demos.map((demo) => (
            <Card key={demo.href} className="flex h-full flex-col border border-default-200 hover:border-primary/50 hover:shadow-lg transition">
              <CardHeader className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {demo.icon}
                  <div>
                    <h2 className="text-xl font-semibold">{demo.title}</h2>
                    <p className="text-sm text-foreground-500">Hands-on, scenario-driven walkthrough</p>
                  </div>
                </div>
                <Chip color={demo.badge.color} size="sm" variant="flat">
                  {demo.badge.label}
                </Chip>
              </CardHeader>
              <CardBody className="flex flex-1 flex-col justify-between gap-6">
                <div className="space-y-4">
                  <p className="text-sm text-foreground-600">{demo.description}</p>
                  <div>
                    <p className="text-xs font-semibold uppercase text-foreground-400 tracking-wide mb-2">
                      Key Takeaways
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-500">
                      {demo.takeaways.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Button
                  as={Link}
                  href={demo.href}
                  color={demo.badge.color}
                  variant="solid"
                  className="mt-auto"
                >
                  Enter Demo
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="border border-default-200">
            <CardHeader>
              <div>
                <h2 className="text-xl font-semibold">How to Use the Demos</h2>
                <p className="text-sm text-foreground-500">
                  Follow the sequence to understand the progression from insecure to secure patterns.
                </p>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground-600">
                <li>Run each interactive demo and review the console output to see how secrets leak or remain protected.</li>
                <li>Read the linked incident stories — every insecure example mirrors a real-world breach.</li>
                <li>Apply the remediation steps and compare them against your current project or organization.</li>
                <li>Document required environment variables using the provided templates before sharing with your team.</li>
              </ol>
            </CardBody>
          </Card>

          <TutorialProgress />
        </div>

        <div className="my-12" />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Before You Begin</h3>
            </CardHeader>
            <CardBody>
              <ul className="list-disc space-y-2 pl-5 text-sm text-foreground-600">
                {prework.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">After Each Demo</h3>
            </CardHeader>
            <CardBody>
              <ul className="list-disc space-y-2 pl-5 text-sm text-foreground-600">
                {postwork.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Assessment Criteria</h3>
            </CardHeader>
            <CardBody>
              <ul className="list-disc space-y-2 pl-5 text-sm text-foreground-600">
                {assessmentCriteria.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
