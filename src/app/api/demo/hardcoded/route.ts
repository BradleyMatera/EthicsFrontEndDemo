import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-static";
export const revalidate = 0;

// BAD PRACTICE: Hardcoded secrets directly in code
// This is for EDUCATIONAL PURPOSES ONLY - NEVER do this in real applications!
const HARDCODED_API_KEY = "DEMO_STRIPE_API_KEY_DO_NOT_USE"; // Educational example only
const HARDCODED_DB_PASSWORD = "DEMO_DB_PASSWORD_IN_CODE";
const HARDCODED_JWT_SECRET = "DEMO_JWT_SECRET_IN_CODE";
const HARDCODED_AWS_KEY = "DEMO_AWS_ACCESS_KEY";

export async function GET(request: NextRequest) {
  try {
    // Simulate different operations that would use secrets
    const operations = [
      {
        name: "Payment Processing",
        secret: HARDCODED_API_KEY,
        description: "Stripe API key for processing payments",
        risk: "Anyone with code access can process payments and access financial data"
      },
      {
        name: "Database Connection", 
        secret: HARDCODED_DB_PASSWORD,
        description: "Database password for user data access",
        risk: "Full database access exposed to anyone who can read the code"
      },
      {
        name: "JWT Token Signing",
        secret: HARDCODED_JWT_SECRET,
        description: "Secret key for signing authentication tokens",
        risk: "Attackers can forge authentication tokens and impersonate users"
      },
      {
        name: "AWS Resources",
        secret: HARDCODED_AWS_KEY,
        description: "AWS access key for cloud resources",
        risk: "Unlimited cloud resource access, potential for massive bills"
      }
    ];

    // Simulate some processing
    const results = operations.map(op => ({
      ...op,
      status: "EXPOSED",
      timestamp: new Date().toISOString(),
      severity: "CRITICAL"
    }));

    return NextResponse.json({
      method: "Hardcoded Secrets",
      status: "DANGEROUS",
      message: "All secrets are visible in source code",
      vulnerabilities: results,
      gitHistory: {
        exposed: true,
        message: "These secrets are permanently stored in git history",
        commits: [
          { hash: "abc1234", message: "Add payment processing", secretsExposed: 1 },
          { hash: "def5678", message: "Add database config", secretsExposed: 2 },
          { hash: "ghi9012", message: "Add JWT auth", secretsExposed: 3 },
          { hash: "jkl3456", message: "Add AWS integration", secretsExposed: 4 }
        ]
      },
      recommendations: [
        "Move all secrets to environment variables",
        "Rotate all exposed credentials immediately",
        "Review git history for secret exposure",
        "Implement secret scanning in CI/CD"
      ]
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process hardcoded secrets demo", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Simulate different actions using hardcoded secrets
    switch (action) {
      case 'payment':
        return NextResponse.json({
          result: "Payment processed",
          apiKey: HARDCODED_API_KEY, // EXPOSED!
          warning: "API key visible to anyone with code access"
        });

      case 'database':
        return NextResponse.json({
          result: "Database connected", 
          password: HARDCODED_DB_PASSWORD, // EXPOSED!
          warning: "Database password hardcoded and visible"
        });

      case 'jwt':
        return NextResponse.json({
          result: "JWT token generated",
          secret: HARDCODED_JWT_SECRET, // EXPOSED!
          warning: "JWT secret can be used to forge tokens"
        });

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process hardcoded action", details: error },
      { status: 500 }
    );
  }
}