import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const comparison = {
      approaches: [
        {
          name: "Hardcoded Secrets",
          method: "hardcoded",
          riskLevel: "CRITICAL",
          riskScore: 10,
          description: "Secrets directly embedded in source code",
          pros: [
            "Quick to implement",
            "No configuration needed",
            "Works immediately"
          ],
          cons: [
            "Secrets visible to anyone with code access",
            "Permanently stored in git history", 
            "Same secrets across all environments",
            "No way to rotate without code changes",
            "High security breach risk"
          ],
          securityIssues: [
            { issue: "Source Code Exposure", severity: "Critical" },
            { issue: "Version Control History", severity: "Critical" },
            { issue: "No Environment Separation", severity: "High" },
            { issue: "No Rotation Capability", severity: "High" },
            { issue: "Team Overprivilege", severity: "Medium" }
          ],
          useCase: "NEVER - Educational purposes only",
          example: `const API_KEY = "sk_live_dangerous";`
        },
        {
          name: "Shared Secrets File",
          method: "shared", 
          riskLevel: "HIGH",
          riskScore: 7,
          description: "Secrets stored in committed configuration files",
          pros: [
            "Centralized configuration",
            "Easy to manage multiple secrets",
            "Structured organization",
            "Can use different files per environment"
          ],
          cons: [
            "Secrets committed to version control",
            "Visible to all repository contributors",
            "Stored in git history forever",
            "Risk of accidental exposure",
            "No granular access control"
          ],
          securityIssues: [
            { issue: "Repository Exposure", severity: "Critical" },
            { issue: "Git History Persistence", severity: "High" },
            { issue: "Team Access", severity: "High" },
            { issue: "Branch Propagation", severity: "Medium" },
            { issue: "Backup Exposure", severity: "Medium" }
          ],
          useCase: "Only for non-sensitive configuration",
          example: `const secrets = require('./secrets.json');`
        },
        {
          name: "Environment Variables",
          method: "environment",
          riskLevel: "LOW",
          riskScore: 2,
          description: "Secrets loaded from environment variables at runtime",
          pros: [
            "Secrets not in source code",
            "Different values per environment",
            "No git history exposure",
            "Platform-agnostic deployment",
            "Easy rotation without code changes",
            "Supported by all platforms"
          ],
          cons: [
            "Requires environment configuration",
            "Debugging can be more complex",
            "Need validation and error handling",
            "Platform-specific setup required"
          ],
          securityIssues: [
            { issue: "Process Visibility", severity: "Low" },
            { issue: "Log Exposure Risk", severity: "Low" },
            { issue: "Container Image Layers", severity: "Very Low" }
          ],
          useCase: "Recommended for most applications",
          example: `const apiKey = process.env.API_KEY;`
        }
      ],
      securityMatrix: {
        sourceCodeExposure: {
          hardcoded: "EXPOSED",
          shared: "EXPOSED", 
          environment: "PROTECTED"
        },
        gitHistory: {
          hardcoded: "PERMANENT",
          shared: "PERMANENT",
          environment: "CLEAN"
        },
        environmentSeparation: {
          hardcoded: "NONE",
          shared: "MANUAL",
          environment: "AUTOMATIC"
        },
        rotationCapability: {
          hardcoded: "REQUIRES_DEPLOYMENT", 
          shared: "REQUIRES_COMMIT",
          environment: "RUNTIME_ONLY"
        },
        accessControl: {
          hardcoded: "CODE_ACCESS",
          shared: "REPO_ACCESS", 
          environment: "DEPLOYMENT_ACCESS"
        },
        auditTrail: {
          hardcoded: "GIT_COMMITS",
          shared: "GIT_COMMITS",
          environment: "PLATFORM_LOGS"
        }
      },
      migrationPath: [
        {
          step: 1,
          action: "Audit Current State",
          description: "Identify all hardcoded and committed secrets",
          tools: ["git grep", "GitHub secret scanning", "TruffleHog"]
        },
        {
          step: 2, 
          action: "Set Up Environment Variables",
          description: "Configure .env files and platform variables",
          tools: ["dotenv", "Vercel dashboard", "Heroku config"]
        },
        {
          step: 3,
          action: "Update Application Code", 
          description: "Replace hardcoded values with process.env calls",
          tools: ["Environment validation", "Fallback values"]
        },
        {
          step: 4,
          action: "Rotate Exposed Secrets",
          description: "Change all previously exposed credentials",
          tools: ["Service dashboards", "API key rotation"]
        },
        {
          step: 5,
          action: "Implement Secret Scanning",
          description: "Prevent future secret commits",
          tools: ["pre-commit hooks", "CI/CD scanning", "GitHub Advanced Security"]
        }
      ],
      testScenarios: [
        {
          scenario: "Database Connection",
          hardcoded: "Password visible in source",
          shared: "Password in committed config file", 
          environment: "Password from secure env var"
        },
        {
          scenario: "API Key Usage",
          hardcoded: "API key exposed to all developers",
          shared: "API key in repository history",
          environment: "API key injected at runtime"
        },
        {
          scenario: "JWT Signing",
          hardcoded: "Secret can be extracted from code",
          shared: "Secret accessible via git clone",
          environment: "Secret isolated per environment"
        },
        {
          scenario: "Environment Deployment",
          hardcoded: "Same secrets everywhere",
          shared: "Manual file management required",
          environment: "Automatic per-environment secrets"
        }
      ],
      recommendations: {
        immediate: [
          "Stop hardcoding secrets in new code",
          "Set up .env files for local development",
          "Configure environment variables in deployment platforms"
        ],
        shortTerm: [
          "Audit existing codebase for hardcoded secrets",
          "Migrate existing secrets to environment variables",
          "Implement secret validation in application startup"
        ],
        longTerm: [
          "Consider enterprise secret management (HashiCorp Vault)",
          "Implement dynamic secret rotation",
          "Set up comprehensive secret scanning and monitoring"
        ]
      }
    };

    return NextResponse.json(comparison);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate comparison", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenario, approaches } = body;

    // Run the same scenario across different approaches
    const results = [];

    for (const approach of approaches) {
      let result;
      
      try {
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/demo/${approach}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: scenario })
        });
        
        result = await apiResponse.json();
      } catch (error) {
        result = { error: `Failed to test ${approach} approach` };
      }

      results.push({
        approach,
        scenario,
        result,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      scenario,
      results,
      summary: {
        tested: approaches.length,
        successful: results.filter(r => !r.result.error).length,
        failed: results.filter(r => r.result.error).length
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to run comparison test", details: error },
      { status: 500 }
    );
  }
}