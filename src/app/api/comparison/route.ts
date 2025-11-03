import { NextResponse } from "next/server";

export const runtime = "edge";

const comparisonData = {
  updatedAt: new Date().toISOString(),
  approaches: [
    {
      id: "hardcoded",
      name: "Hardcoded Secrets",
      risk: "critical",
      description:
        "Secrets are embedded directly in application source code, exposing them to every developer and version history.",
      redFlags: [
        "Secrets visible in every commit",
        "Rotation requires code changes and redeployment",
        "Incident blast radius includes entire repository access",
      ],
    },
    {
      id: "shared",
      name: "Shared Secrets Files",
      risk: "high",
      description:
        "Secrets live in JSON/YAML files that teams share manually or commit accidentally, introducing coordination risk.",
      redFlags: [
        "Version control history still leaks secrets",
        "File distribution is manual and hard to audit",
        "Difficult to enforce least-privilege access policies",
      ],
    },
    {
      id: "environment",
      name: "Environment Variables",
      risk: "recommended",
      description:
        "Secrets are provisioned at runtime through environment variables or secret managers integrated with the platform.",
      redFlags: [
        "Requires disciplined documentation",
        "Needs automation to rotate credentials regularly",
      ],
    },
  ],
  metrics: {
    averageRotationTimeHours: {
      hardcoded: 72,
      shared: 36,
      environment: 2,
    },
    blastRadiusScore: {
      hardcoded: 5,
      shared: 3,
      environment: 1,
    },
  },
};

export async function GET() {
  return NextResponse.json(comparisonData, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
