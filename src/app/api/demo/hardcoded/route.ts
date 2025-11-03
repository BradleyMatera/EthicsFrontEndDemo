import { NextResponse } from "next/server";

export const runtime = "edge";

const hardcodedDemoPayload = {
  demoType: "hardcoded",
  status: "insecure",
  severity: "critical",
  exposurePath: [
    "Developer commits AWS key to GitHub",
    "Automated bot scrapes repository within minutes",
    "Attacker enumerates S3 buckets and snapshots databases",
  ],
  recommendedMitigations: [
    "Rotate the exposed credentials immediately",
    "Invalidate long-lived tokens from your cloud provider dashboard",
    "Add secret scanning to your CI/CD pipeline before merge",
  ],
};

export async function GET() {
  return NextResponse.json(hardcodedDemoPayload, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
