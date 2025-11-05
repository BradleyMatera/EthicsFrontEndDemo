import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-static";
export const revalidate = 0;
import * as fs from 'fs';
import * as path from 'path';

// BAD PRACTICE: Loading secrets from a committed file
// This demonstrates the shared secrets approach - better than hardcoded but still risky
let secrets: any = null;

function loadSecrets() {
  try {
    const secretsPath = path.join(process.cwd(), 'secrets.json');
    const secretsData = fs.readFileSync(secretsPath, 'utf8');
    return JSON.parse(secretsData);
  } catch (error) {
    console.error('Error loading secrets.json:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Load secrets from the committed file
    secrets = loadSecrets();
    
    if (!secrets) {
      return NextResponse.json(
        { error: "Could not load secrets.json file" },
        { status: 500 }
      );
    }

    // Analyze the secrets file
    const secretsAnalysis = {
      totalSecrets: 0,
      categories: {} as Record<string, number>,
      risks: []
    };

    // Count secrets and categorize them
    function analyzeObject(obj: any, category: string) {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          analyzeObject(obj[key], category);
        } else if (typeof obj[key] === 'string' && obj[key].length > 5) {
          secretsAnalysis.totalSecrets++;
          if (!secretsAnalysis.categories[category]) {
            secretsAnalysis.categories[category] = 0;
          }
          secretsAnalysis.categories[category]++;
        }
      }
    }

    Object.keys(secrets).forEach(category => {
      analyzeObject(secrets[category], category);
    });

    // Identify specific risks
    const risks = [
      {
        type: "Version Control Exposure",
        severity: "CRITICAL",
        description: "All secrets are stored in git history permanently",
        affected: secretsAnalysis.totalSecrets
      },
      {
        type: "Repository Access",
        severity: "HIGH", 
        description: "Anyone with repo access can see all production secrets",
        affected: secretsAnalysis.totalSecrets
      },
      {
        type: "No Environment Separation",
        severity: "MEDIUM",
        description: "Same secrets used across all environments",
        affected: secretsAnalysis.totalSecrets
      },
      {
        type: "No Rotation Strategy",
        severity: "MEDIUM",
        description: "Changing secrets requires code changes and deployments",
        affected: secretsAnalysis.totalSecrets
      }
    ];

    return NextResponse.json({
      method: "Shared Secrets File",
      status: "RISKY",
      message: "Secrets loaded from committed secrets.json file",
      fileLocation: "secrets.json (committed to repository)",
      analysis: secretsAnalysis,
      sampleSecrets: {
        database: secrets.database,
        apiKeys: Object.keys(secrets.apiKeys),
        jwt: { ...secrets.jwt, secret: "***REDACTED***" },
        aws: { ...secrets.aws, secretAccessKey: "***REDACTED***" }
      },
      risks: risks,
      gitImpact: {
        inHistory: true,
        publicExposure: "High risk if repository becomes public",
        teamAccess: "All developers see production secrets",
        branchProtection: "Secrets exist on all branches"
      },
      recommendations: [
        "Move secrets to environment variables",
        "Use separate secrets per environment", 
        "Implement proper .gitignore for secrets",
        "Consider using a secrets management service",
        "Rotate all exposed credentials"
      ]
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process shared secrets demo", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, service } = body;

    secrets = loadSecrets();
    if (!secrets) {
      return NextResponse.json({ error: "Secrets file not found" }, { status: 500 });
    }

    switch (action) {
      case 'connect':
        if (service === 'database') {
          return NextResponse.json({
            result: "Database connection established",
            config: secrets.database,
            warning: "Database credentials are visible in committed secrets.json"
          });
        } else if (service === 'stripe') {
          return NextResponse.json({
            result: "Stripe API connected",
            apiKey: secrets.apiKeys.stripe.secret,
            warning: "Stripe keys are committed to repository"
          });
        } else if (service === 'aws') {
          return NextResponse.json({
            result: "AWS services connected",
            credentials: secrets.aws,
            warning: "AWS credentials exposed in version control"
          });
        }
        break;

      case 'authenticate':
        return NextResponse.json({
          result: "JWT token generated",
          config: secrets.jwt,
          warning: "JWT secret is shared across all environments"
        });

      case 'encrypt':
        return NextResponse.json({
          result: "Data encrypted",
          algorithm: secrets.encryption.algorithm,
          keyExposed: true,
          warning: "Encryption key is stored in plaintext in repository"
        });

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process shared secrets action", details: error },
      { status: 500 }
    );
  }
}