'use client';

import { Breadcrumb } from "@/components/Breadcrumb";
import { TutorialProgress } from "@/components/TutorialProgress";
import { Eye, FileText, Key, Sparkles } from "lucide-react";
import Link from "next/link";

const demos = [
  {
    title: "Hardcoded Secrets",
    description: "Witness how quickly a leaked repository escalates into a full compromise when secrets live in code.",
    href: "/demos/hardcoded",
    icon: Eye,
    badge: { label: "Critical Risk", color: "bg-rose-100 text-rose-700" },
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
    icon: FileText,
    badge: { label: "Medium Risk", color: "bg-amber-100 text-amber-700" },
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
    icon: Key,
    badge: { label: "Best Practice", color: "bg-emerald-100 text-emerald-700" },
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
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Interactive Demos" },
          ]}
        />

        <div className="mt-10 mb-12 text-center">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="text-blue-600" size={28} />
            <h1 className="text-4xl font-bold text-slate-900">Choose Your Learning Path</h1>
          </div>
          <p className="mt-4 text-lg text-slate-600">
            Each demo layers on more resilient techniques. Work through them in order to experience the
            mindset shift from insecure quick fixes to production-ready secrets management.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {demos.map((demo) => {
            const Icon = demo.icon;
            return (
              <div key={demo.href} className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="text-slate-700" size={22} />
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{demo.title}</h2>
                      <p className="text-sm text-slate-500">Hands-on, scenario-driven walkthrough</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${demo.badge.color}`}>
                    {demo.badge.label}
                  </span>
                </div>
                <div className="mt-4 flex flex-1 flex-col justify-between gap-4">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">{demo.description}</p>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Key Takeaways
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                        {demo.takeaways.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Link
                    href={demo.href}
                    className="mt-4 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Enter Demo
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">How to Use the Demos</h2>
              <p className="text-sm text-slate-500">
                Follow the sequence to understand the progression from insecure to secure patterns.
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
                <li>Run each interactive demo and review the console output to see how secrets leak or remain protected.</li>
                <li>Read the linked incident stories — every insecure example mirrors a real-world breach.</li>
                <li>Apply the remediation steps and compare them against your current project or organization.</li>
                <li>Document required environment variables using the provided templates before sharing with your team.</li>
              </ol>
            </div>
          </div>

          <TutorialProgress />
        </div>

        <div className="my-12" />

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Before You Begin", items: prework },
            { title: "After Each Demo", items: postwork },
            { title: "Assessment Criteria", items: assessmentCriteria },
          ].map((section) => (
            <div key={section.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
