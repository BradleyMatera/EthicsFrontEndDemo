import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-static";
export const revalidate = 0;
import * as fs from 'fs';
import * as path from 'path';

export async function GET(request: NextRequest) {
  try {
    const projectRoot = path.join(process.cwd());
    
    // Security audit of the project
    const audit = {
      timestamp: new Date().toISOString(),
      projectName: "Node.js Secrets Management Tutorial",
      environment: process.env.NODE_ENV || 'development',
      
      // Code analysis
      codeAnalysis: {
        totalFiles: 0,
        jsFiles: 0,
        tsFiles: 0,
        jsonFiles: 0,
        envFiles: 0,
        secretsDetected: [],
        gitignorePresent: false,
        packageJsonPresent: false
      },
      
      // Environment variable status
      environmentStatus: {
        envLocalExists: fs.existsSync(path.join(projectRoot, '.env.local')),
        envExampleExists: fs.existsSync(path.join(projectRoot, '.env.example')),
        requiredVarsSet: checkRequiredEnvironmentVars(),
        missingVars: getMissingRequiredVars(),
        configuredVars: Object.keys(process.env).filter(key => 
          key.startsWith('NEXT_') || 
          key.includes('SECRET') || 
          key.includes('KEY') ||
          key.includes('PASSWORD') ||
          key.includes('TOKEN')
        ).length
      },
      
      // Security scoring
      securityScore: {
        overall: 0,
        breakdown: {
          environmentVars: 0,
          codeQuality: 0,
          configSecurity: 0,
          gitSecurity: 0
        }
      },
      
      // Demonstration status
      demoStatus: {
        hardcodedDemo: {
          active: true,
          risksExposed: ["Credentials in source code", "Git history exposure", "Public repository risk"],
          securityLevel: "CRITICAL"
        },
        sharedSecretsDemo: {
          active: fs.existsSync(path.join(projectRoot, 'src/app/api/demo/shared/secrets.json')),
          risksExposed: ["File in repository", "Team access", "Version control history"],
          securityLevel: "HIGH"
        },
        environmentVarsDemo: {
          active: fs.existsSync(path.join(projectRoot, '.env.local')),
          risksExposed: ["Local file only", "Platform configuration"],
          securityLevel: "LOW"
        }
      },
      
      // Recommendations
      recommendations: {
        immediate: generateImmediateRecommendations(),
        ongoing: [
          "Regularly rotate secrets",
          "Monitor for secret exposure",
          "Implement secret scanning in CI/CD",
          "Use managed secret services for production"
        ]
      },
      
      // Platform integrations
      platformSupport: {
        vercel: {
          supported: true,
          envVarSupport: true,
          secretsManager: false
        },
        heroku: {
          supported: true,
          envVarSupport: true,
          secretsManager: false
        },
        aws: {
          supported: true,
          envVarSupport: true,
          secretsManager: true,
          services: ["Parameter Store", "Secrets Manager"]
        },
        azure: {
          supported: true,
          envVarSupport: true,
          secretsManager: true,
          services: ["Key Vault", "App Configuration"]
        },
        gcp: {
          supported: true,
          envVarSupport: true,
          secretsManager: true,
          services: ["Secret Manager", "Cloud KMS"]
        }
      }
    };

    // Calculate security scores
    audit.securityScore.breakdown.environmentVars = calculateEnvVarScore(audit.environmentStatus);
    audit.securityScore.breakdown.configSecurity = 85; // Based on NextUI/Next.js best practices
    audit.securityScore.breakdown.gitSecurity = checkGitSecurity();
    audit.securityScore.breakdown.codeQuality = 90; // TypeScript + modern React patterns
    
    audit.securityScore.overall = Math.round(
      (audit.securityScore.breakdown.environmentVars + 
       audit.securityScore.breakdown.configSecurity + 
       audit.securityScore.breakdown.gitSecurity + 
       audit.securityScore.breakdown.codeQuality) / 4
    );

    return NextResponse.json(audit);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate security audit", details: error },
      { status: 500 }
    );
  }
}

function checkRequiredEnvironmentVars(): string[] {
  const required = [
    'NEXT_PUBLIC_BASE_URL',
    'DATABASE_URL',
    'JWT_SECRET',
    'API_SECRET_KEY'
  ];
  
  return required.filter(varName => process.env[varName]);
}

function getMissingRequiredVars(): string[] {
  const required = [
    'NEXT_PUBLIC_BASE_URL',
    'DATABASE_URL', 
    'JWT_SECRET',
    'API_SECRET_KEY'
  ];
  
  return required.filter(varName => !process.env[varName]);
}

function calculateEnvVarScore(envStatus: any): number {
  let score = 0;
  
  if (envStatus.envLocalExists) score += 30;
  if (envStatus.envExampleExists) score += 20;
  if (envStatus.requiredVarsSet.length > 0) score += 30;
  if (envStatus.missingVars.length === 0) score += 20;
  
  return Math.min(100, score);
}

function checkGitSecurity(): number {
  let score = 70; // Base score for having a Git repository
  
  try {
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      
      // Check for important exclusions
      if (gitignoreContent.includes('.env')) score += 15;
      if (gitignoreContent.includes('node_modules')) score += 5;
      if (gitignoreContent.includes('*.log')) score += 5;
      if (gitignoreContent.includes('.DS_Store')) score += 5;
    }
  } catch (error) {
    score = 40; // Lower score if can't read .gitignore
  }
  
  return Math.min(100, score);
}

function generateImmediateRecommendations(): string[] {
  const recommendations = [];
  
  // Check for .env.local
  if (!fs.existsSync(path.join(process.cwd(), '.env.local'))) {
    recommendations.push("Create .env.local file for local development secrets");
  }
  
  // Check for .env.example
  if (!fs.existsSync(path.join(process.cwd(), '.env.example'))) {
    recommendations.push("Create .env.example to document required environment variables");
  }
  
  // Check if secrets.json exists and suggest removal
  if (fs.existsSync(path.join(process.cwd(), 'src/app/api/demo/shared/secrets.json'))) {
    recommendations.push("Remove secrets.json from repository (demonstration file only)");
  }
  
  // Check for missing environment variables
  const missing = getMissingRequiredVars();
  if (missing.length > 0) {
    recommendations.push(`Configure missing environment variables: ${missing.join(', ')}`);
  }
  
  return recommendations;
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'scan-secrets') {
      // Simulate secret scanning
      const scanResults = {
        timestamp: new Date().toISOString(),
        filesScanned: 47,
        secretsFound: [
          {
            file: "src/app/api/demo/hardcoded/route.ts",
            type: "API Key",
            line: 12,
            severity: "CRITICAL",
            pattern: "hardcoded credential"
          },
          {
            file: "src/app/api/demo/shared/secrets.json",
            type: "Multiple Secrets",
            line: 1,
            severity: "HIGH", 
            pattern: "secrets file"
          }
        ],
        recommendations: [
          "Move hardcoded credentials to environment variables",
          "Remove secrets.json from version control",
          "Implement pre-commit hooks for secret scanning"
        ]
      };
      
      return NextResponse.json(scanResults);
    }
    
    if (action === 'health-check') {
      const healthCheck = {
        timestamp: new Date().toISOString(),
        status: "healthy",
        components: {
          database: { status: "not-configured", message: "No database connection configured" },
          environment: { status: "partial", message: "Some environment variables missing" },
          apis: { status: "healthy", message: "All demo APIs responding" },
          security: { status: "demo-mode", message: "Running in educational demo mode" }
        }
      };
      
      return NextResponse.json(healthCheck);
    }
    
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process dashboard action", details: error },
      { status: 500 }
    );
  }
}