'use client';

import { Card, CardBody, CardHeader, Chip, Divider } from "@nextui-org/react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Cloud,
  DoorOpen,
  Key,
  Lock,
  Network,
  Shield,
  Terminal,
  Users,
  Workflow,
  Zap
} from "lucide-react";
import Link from "next/link";

const secretExamples = [
  {
    title: "API keys",
    description: "Unique identifiers that unlock payment providers, maps, or email services."
  },
  {
    title: "Database credentials",
    description: "Usernames and passwords that let applications read or write production data."
  },
  {
    title: "Encryption keys",
    description: "Digital keys that scramble or unscramble customer information."
  },
  {
    title: "Tokens & certificates",
    description: "Short strings that prove an app or person really is who they claim to be."
  }
];

const leakConsequences = [
  {
    headline: "Public Git history",
    detail: "A secret committed once is visible forever—even if you delete the file later."
  },
  {
    headline: "Unexpected invoices",
    detail: "Attackers run up costs by using your API keys for their own traffic."
  },
  {
    headline: "Data exposure",
    detail: "Database credentials give intruders a direct tunnel to private customer data."
  }
];

const nodeInsights = [
  {
    label: "JavaScript without the browser",
    explanation: "Node.js lets us run JavaScript on servers, handling tasks users never see."
  },
  {
    label: "Secret-handling mindset",
    explanation: "Server logic reads credentials, talks to payment gateways, and stores records securely."
  },
  {
    label: "Frontend vs. backend",
    explanation: "Frontend code is the lobby everyone walks through. Node.js is the locked vault behind it."
  }
];

const envHighlights = [
  {
    label: "Config that travels",
    description: "Environment variables change per machine or environment without touching source code."
  },
  {
    label: "Temporary by design",
    description: "They live in memory while your app runs, then disappear—no traces in git history."
  },
  {
    label: ".env files as training wheels",
    description: "Local files mimic production settings so you can test safely on your laptop."
  }
];

const localPractices = [
  {
    stage: ".env.local",
    focus: "Your personal sandbox",
    notes: "Only values you need on your machine. Never share or commit."
  },
  {
    stage: ".env.test",
    focus: "Repeatable experiments",
    notes: "Automated tests with fake credentials. Safe to reset anytime."
  },
  {
    stage: ".env.production",
    focus: "Launch-ready",
    notes: "Real secrets that stay off laptops and live inside secured systems."
  }
];

const pipelineConcepts = [
  {
    title: "Secret vault per pipeline",
    description: "CI tools store encrypted values so builds can run without showing them to developers."
  },
  {
    title: "Courier analogy",
    description: "Pipelines behave like trusted couriers—picking up sealed envelopes and delivering them only at runtime."
  },
  {
    title: "Role-based access",
    description: "Only a few people can edit production secrets. Everyone else gets least-privilege access."
  }
];

const cloudManagers = [
  {
    name: "AWS Secrets Manager",
    strength: "Automated rotation and fine-grained permissions",
    icon: <Cloud size={18} className="text-primary" />
  },
  {
    name: "Azure Key Vault",
    strength: "Hardware-backed encryption with auditing",
    icon: <Shield size={18} className="text-secondary" />
  },
  {
    name: "Google Secret Manager",
    strength: "Versioned secrets with IAM control",
    icon: <Workflow size={18} className="text-success" />
  },
  {
    name: "HashiCorp Vault",
    strength: "Platform-agnostic control plane for dynamic credentials",
    icon: <Lock size={18} className="text-warning" />
  }
];

const commonPitfalls = [
  {
    mistake: "Hardcoding API keys",
    fix: "Keep secrets outside code and inject them when the app starts."
  },
  {
    mistake: "Sharing one secret everywhere",
    fix: "Give each environment and service its own credential. No shared master keys."
  },
  {
    mistake: "Logging secrets for debugging",
    fix: "Mask sensitive values before they reach console output or monitoring tools."
  },
  {
    mistake: "Pushing .env files to git",
    fix: "Use .gitignore and provide safe templates like .env.example instead."
  },
  {
    mistake: "Ignoring rotation",
    fix: "Schedule secret refreshes and track the last time each value changed."
  }
];

const circleTakeaways = [
  "Secrets are the keys to your customers' trust.",
  "Node.js runs the processes that need those keys on the server side.",
  "Environment variables keep keys close at hand without embedding them in code.",
  "CI/CD pipelines deliver keys safely during builds.",
  "Cloud secret stores manage keys at scale with encryption, auditing, and rotation.",
  "Teams succeed when every environment follows the same promise: never expose secrets, only deliver them where needed." 
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-default-50">
      <main className="container mx-auto px-4 py-10 max-w-6xl space-y-16">
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="text-primary" size={40} />
            <div>
              <p className="text-sm uppercase tracking-wide text-foreground-400">EthicsFrontEndDemo</p>
              <h1 className="text-4xl md:text-5xl font-bold">Secrets & Environment Variables in Node.js</h1>
            </div>
          </div>
          <p className="text-lg text-foreground-500 max-w-3xl mx-auto">
            Welcome to my Node.js Secrets Management Tutorial – an interactive demo I built (with a lot of help from AI tools) to explore how to handle secrets securely. This project is a learning prototype that walks through what not to do and what to do when managing API keys, credentials, and other secrets in Node.js applications.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-foreground-500">
            <Chip variant="flat" color="primary" startContent={<BookOpen size={14} />}>Learn the concepts</Chip>
            <Chip variant="flat" color="success" startContent={<CheckCircle size={14} />}>Build security awareness</Chip>
            <Chip variant="flat" color="secondary" startContent={<ArrowRight size={14} />}>Move from laptop → cloud</Chip>
          </div>
        </header>

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold flex items-center gap-2"><Key size={24} className="text-primary" /> Introduction · What counts as a secret?</h2>
          <p className="text-foreground-600">
            A secret is anything that would cause harm if it landed in the wrong hands. Think of them as the keys to the vault: small pieces of information that unlock huge capabilities.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {secretExamples.map((example) => (
              <Card key={example.title}>
                <CardHeader className="text-lg font-semibold flex items-center gap-2">
                  <Key size={18} className="text-secondary" /> {example.title}
                </CardHeader>
                <CardBody className="text-sm text-foreground-600">{example.description}</CardBody>
              </Card>
            ))}
          </div>
          <Card className="bg-danger-50 border border-danger-200">
            <CardHeader className="font-semibold text-danger flex items-center gap-2"><Zap size={18} /> When secrets leak</CardHeader>
            <CardBody className="grid gap-3 md:grid-cols-3 text-sm text-danger-700">
              {leakConsequences.map((item) => (
                <div key={item.headline} className="space-y-1">
                  <p className="font-medium">{item.headline}</p>
                  <p>{item.detail}</p>
                </div>
              ))}
            </CardBody>
          </Card>
          <p className="text-foreground-600">
            This site is your guided tour. We will move from “what” to “how” to “who owns it” so that you finish with a story you can retell to teammates, stakeholders, and future you.
          </p>
        </section>

        <Divider />

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold flex items-center gap-2"><DoorOpen size={24} className="text-secondary" /> Understanding Node.js · The vault behind the door</h2>
          <p className="text-foreground-600">
            Node.js is the backstage crew of many modern web systems. It runs on the server, quietly handling passwords, talking to third-party services, and keeping records safe while the browser shows a friendly face to the world.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {nodeInsights.map((insight) => (
              <Card key={insight.label}>
                <CardHeader className="font-semibold text-base flex items-center gap-2"><DoorOpen size={16} className="text-primary" /> {insight.label}</CardHeader>
                <CardBody className="text-sm text-foreground-600">{insight.explanation}</CardBody>
              </Card>
            ))}
          </div>
          <Card className="border-default-200 bg-content1/50">
            <CardBody className="text-sm text-foreground-600 space-y-2">
              <p className="font-semibold text-foreground-700">Visual metaphor:</p>
              <p className="font-mono text-xs md:text-sm bg-default-100 rounded-md p-3">
                [Browser Door] → welcomes every visitor<br />
                [Node.js Vault] → checks ID, unlocks drawers, records transactions<br />
                Secrets belong in the vault. Never tape them to the door.
              </p>
            </CardBody>
          </Card>
        </section>

        <Divider />

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold flex items-center gap-2"><Network size={24} className="text-success" /> Environment Variables · Config that adapts</h2>
          <p className="text-foreground-600">
            Environment variables are little notes handed to your application right before it wakes up. They change per location—your laptop, staging servers, production clusters—so the same code can behave differently without edits.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {envHighlights.map((item) => (
              <Card key={item.label}>
                <CardHeader className="font-semibold text-base flex items-center gap-2"><Terminal size={16} className="text-success" /> {item.label}</CardHeader>
                <CardBody className="text-sm text-foreground-600">{item.description}</CardBody>
              </Card>
            ))}
          </div>
          <Card className="bg-primary-50 border border-primary-200">
            <CardBody className="text-sm text-primary-800 space-y-2">
              <p className="font-semibold">Why it matters:</p>
              <p>Keeping secrets out of code means you can rotate them quickly, limit who sees them, and avoid accidental leaks when sharing repositories.</p>
            </CardBody>
          </Card>
        </section>

        <Divider />

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold flex items-center gap-2"><Terminal size={24} className="text-warning" /> Local Development · Security on your laptop</h2>
          <p className="text-foreground-600">
            Developers need working credentials to build features, but local files should never contain long-lived production secrets. Think of each environment file as its own labeled key ring.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {localPractices.map((practice) => (
              <Card key={practice.stage}>
                <CardHeader className="font-semibold text-base flex items-center gap-2"><Key size={16} className="text-warning" /> {practice.stage}</CardHeader>
                <CardBody className="text-sm text-foreground-600 space-y-1">
                  <p className="font-medium text-foreground-700">{practice.focus}</p>
                  <p>{practice.notes}</p>
                </CardBody>
              </Card>
            ))}
          </div>
          <Card className="border-default-200">
            <CardBody className="space-y-3 text-sm text-foreground-600">
              <p><strong>Never commit:</strong> Add real .env files to <span className="font-mono">.gitignore</span> so they stay on your machine only.</p>
              <p><strong>Document safely:</strong> Ship a <span className="font-mono">.env.example</span> with placeholder values so teammates know what to fill in without seeing the actual secrets.</p>
              <p><strong>Rotate & review:</strong> Set calendar reminders to check whether local secrets still need access or can be revoked.</p>
            </CardBody>
          </Card>
        </section>

        <Divider />

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold flex items-center gap-2"><Workflow size={24} className="text-primary" /> Secrets in CI/CD · Pipelines as couriers</h2>
          <p className="text-foreground-600">
            Once code is ready, automated pipelines build, test, and deploy it. They need secrets to access registries, clouds, or payment providers—but those secrets must stay hidden from logs and screenshots.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {pipelineConcepts.map((concept) => (
              <Card key={concept.title}>
                <CardHeader className="font-semibold text-base flex items-center gap-2"><Workflow size={16} className="text-primary" /> {concept.title}</CardHeader>
                <CardBody className="text-sm text-foreground-600">{concept.description}</CardBody>
              </Card>
            ))}
          </div>
          <Card className="bg-content1/60 border-default-200">
            <CardBody className="text-sm text-foreground-600 space-y-2">
              <p className="font-semibold text-foreground-700">Mental model:</p>
              <p className="font-mono text-xs md:text-sm bg-default-100 rounded-md p-3">
                Developer writes code → pipeline picks it up → pipeline retrieves secrets securely → pipeline deploys app<br />
                At no point do secrets appear in git history, pull requests, or screenshots.
              </p>
            </CardBody>
          </Card>
        </section>

        <Divider />

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold flex items-center gap-2"><Cloud size={24} className="text-secondary" /> Cloud Secret Stores · Managing at scale</h2>
          <p className="text-foreground-600">
            As systems grow, flat files cannot keep up. Cloud secret managers provide encryption, rotation, auditing, and access policies so you can prove compliance and sleep at night.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {cloudManagers.map((manager) => (
              <Card key={manager.name}>
                <CardHeader className="font-semibold text-base flex items-center gap-2">{manager.icon} {manager.name}</CardHeader>
                <CardBody className="text-sm text-foreground-600">{manager.strength}</CardBody>
              </Card>
            ))}
          </div>
          <Card className="border-default-200 bg-success-50">
            <CardBody className="text-sm text-success-800 space-y-2">
              <p className="font-semibold">Why upgrade?</p>
              <p>Cloud stores act like monitored vaults: every access is logged, leases can expire automatically, and policies ensure only the right services see the right values.</p>
            </CardBody>
          </Card>
        </section>

        <Divider />

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold flex items-center gap-2"><AlertTriangle size={24} className="text-danger" /> Common mistakes & better habits</h2>
          <p className="text-foreground-600">Security slips happen when pressure is high. Recognize the traps, then practice the healthier reflex.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {commonPitfalls.map((item) => (
              <Card key={item.mistake}>
                <CardHeader className="text-base font-semibold flex items-center gap-2 text-danger"><Lock size={16} /> {item.mistake}</CardHeader>
                <CardBody className="text-sm text-foreground-600">
                  <p className="font-medium text-foreground-700">Try instead:</p>
                  <p>{item.fix}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        <Divider />

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold flex items-center gap-2"><Users size={24} className="text-primary" /> The full circle</h2>
          <p className="text-foreground-600">
            You now have the complete map—from the moment a secret is created to the day it is rotated out. Share it with your team, reference it during audits, and keep refining the process.
          </p>
          <Card className="border-default-200">
            <CardBody className="space-y-3 text-sm text-foreground-600">
              {circleTakeaways.map((line) => (
                <p key={line} className="flex items-start gap-2"><CheckCircle size={16} className="text-success mt-0.5" /> {line}</p>
              ))}
            </CardBody>
          </Card>
          <Card className="bg-primary-50 border border-primary-200">
            <CardBody className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-primary-800">
              <div className="space-y-1">
                <p className="font-semibold">Keep exploring:</p>
                <p>Ready to apply what you learned? Dive into the interactive labs to practice identifying and fixing risky patterns.</p>
              </div>
              <Link href="/demos" className="inline-flex items-center gap-2 font-medium text-primary">
                Visit the labs <ArrowRight size={16} />
              </Link>
            </CardBody>
          </Card>
          <p className="text-center text-sm text-foreground-500">
            Secret management is an everyday practice, not a one-off project. Stay curious, keep policies living, and support teammates who are learning.
          </p>
        </section>
      </main>
    </div>
  );
}
