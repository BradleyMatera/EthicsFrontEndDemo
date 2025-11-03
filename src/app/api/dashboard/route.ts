import { NextResponse } from "next/server";

export const runtime = "edge";

const dashboardSummary = {
  lastUpdated: new Date().toISOString(),
  overview: {
    totalLessons: 6,
    totalCodeSamples: 18,
    incidentStories: 4,
  },
  riskBreakdown: [
    { category: "Hardcoded Secrets", incidents: 118, severity: "critical" },
    { category: "Shared Secrets Files", incidents: 64, severity: "high" },
    { category: "Environment Variables", incidents: 9, severity: "low" },
  ],
  recommendedNextSteps: [
    "Audit repositories for committed .env or secrets.* files",
    "Enforce branch protection with secret scanning enabled",
    "Document required runtime environment variables using the provided template",
  ],
};

export async function GET() {
  return NextResponse.json(dashboardSummary, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
