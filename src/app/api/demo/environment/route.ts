import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-static";
export const revalidate = 0;

// GOOD PRACTICE: Using environment variables
// This demonstrates the proper way to handle secrets

function validateEnvironmentVariables() {
  const requiredVars = [
    'DB_HOST',
    'DB_PASSWORD', 
    'JWT_SECRET',
    'STRIPE_SECRET_KEY',
    'AWS_ACCESS_KEY_ID'
  ];

  const missing: string[] = [];
  const present: string[] = [];
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  });

  return { missing, present };
}

function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '3000',
    hasDatabase: !!process.env.DB_HOST,
    hasJWT: !!process.env.JWT_SECRET,
    hasStripe: !!process.env.STRIPE_SECRET_KEY,
    hasAWS: !!process.env.AWS_ACCESS_KEY_ID,
    hasSendGrid: !!process.env.SENDGRID_API_KEY,
    totalEnvVars: Object.keys(process.env).length
  };
}

function maskSecret(secret: string): string {
  if (!secret || secret.length < 8) return '***';
  return secret.substring(0, 4) + '***' + secret.substring(secret.length - 4);
}

export async function GET(request: NextRequest) {
  try {
    const validation = validateEnvironmentVariables();
    const envInfo = getEnvironmentInfo();

    // Get available environment variables (safely masked)
    const availableVars = {
      database: {
        host: process.env.DB_HOST ? maskSecret(process.env.DB_HOST) : null,
        username: process.env.DB_USERNAME ? maskSecret(process.env.DB_USERNAME) : null,
        port: process.env.DB_PORT || null,
        ssl: process.env.DB_SSL || null
      },
      apiKeys: {
        stripe: process.env.STRIPE_SECRET_KEY ? maskSecret(process.env.STRIPE_SECRET_KEY) : null,
        sendgrid: process.env.SENDGRID_API_KEY ? maskSecret(process.env.SENDGRID_API_KEY) : null,
        twilio: process.env.TWILIO_ACCOUNT_SID ? maskSecret(process.env.TWILIO_ACCOUNT_SID) : null
      },
      jwt: {
        secret: process.env.JWT_SECRET ? maskSecret(process.env.JWT_SECRET) : null,
        expiresIn: process.env.JWT_EXPIRES_IN || null,
        issuer: process.env.JWT_ISSUER || null
      },
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ? maskSecret(process.env.AWS_ACCESS_KEY_ID) : null,
        region: process.env.AWS_REGION || null,
        bucket: process.env.AWS_S3_BUCKET || null
      }
    };

    const securityFeatures = [
      {
        feature: "Environment Separation",
        status: envInfo.nodeEnv === 'production' ? 'ACTIVE' : 'DEV_MODE',
        description: "Different secrets per environment"
      },
      {
        feature: "Runtime Loading",
        status: "ACTIVE",
        description: "Secrets loaded at runtime, not build time"
      },
      {
        feature: "No Source Code Exposure", 
        status: "SECURE",
        description: "Secrets not visible in source code or git history"
      },
      {
        feature: "Validation",
        status: validation.missing.length === 0 ? 'PASSED' : 'FAILED',
        description: `Required variables check: ${validation.present.length}/${validation.present.length + validation.missing.length}`
      },
      {
        feature: "Deployment Flexibility",
        status: "ACTIVE",
        description: "Same code works across different environments"
      }
    ];

    return NextResponse.json({
      method: "Environment Variables",
      status: "SECURE",
      message: "Secrets properly loaded from environment variables",
      validation: validation,
      environment: envInfo,
      availableSecrets: availableVars,
      securityFeatures: securityFeatures,
      deployment: {
        platform: process.env.VERCEL ? 'Vercel' : 
                  process.env.NETLIFY ? 'Netlify' :
                  process.env.AWS_LAMBDA_FUNCTION_NAME ? 'AWS Lambda' :
                  'Local/Docker',
        configMethod: "Platform-specific environment variable configuration",
        cicd: "Secrets injected at deployment time"
      },
      bestPractices: [
        "✅ Secrets in environment variables, not code",
        "✅ Different secrets per environment", 
        "✅ Validation of required variables",
        "✅ Masked secrets in logs and responses",
        "✅ No secrets in git history",
        "✅ Platform-agnostic deployment"
      ]
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process environment variables demo", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, service } = body;

    // Validate that required environment variables exist
    const validation = validateEnvironmentVariables();
    if (validation.missing.length > 0) {
      return NextResponse.json({
        error: "Missing required environment variables",
        missing: validation.missing,
        setup: "Please configure environment variables before testing"
      }, { status: 400 });
    }

    switch (action) {
      case 'connect':
        if (service === 'database') {
          return NextResponse.json({
            result: "Database connection established",
            config: {
              host: maskSecret(process.env.DB_HOST || ''),
              port: process.env.DB_PORT,
              ssl: process.env.DB_SSL === 'true'
            },
            security: "Password loaded from environment, not exposed"
          });
        } else if (service === 'stripe') {
          return NextResponse.json({
            result: "Stripe API connected",
            keyType: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? 'Production' : 'Test',
            keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7),
            security: "Full API key safely stored in environment"
          });
        } else if (service === 'aws') {
          return NextResponse.json({
            result: "AWS services connected",
            keyId: maskSecret(process.env.AWS_ACCESS_KEY_ID || ''),
            region: process.env.AWS_REGION,
            security: "AWS credentials loaded from environment variables"
          });
        }
        break;

      case 'authenticate':
        return NextResponse.json({
          result: "JWT configuration loaded",
          expiresIn: process.env.JWT_EXPIRES_IN,
          issuer: process.env.JWT_ISSUER,
          security: "JWT secret safely loaded from environment"
        });

      case 'encrypt':
        return NextResponse.json({
          result: "Encryption configured",
          algorithm: process.env.ENCRYPTION_ALGORITHM,
          keyLength: process.env.ENCRYPTION_KEY?.length || 0,
          security: "Encryption key stored securely in environment"
        });

      case 'validate':
        const allEnvVars = Object.keys(process.env).filter(key => 
          !key.startsWith('npm_') && 
          !key.startsWith('NODE_') && 
          key !== 'PATH'
        );
        
        return NextResponse.json({
          result: "Environment validation complete",
          totalVariables: allEnvVars.length,
          requiredPresent: validation.present,
          requiredMissing: validation.missing,
          security: "All secrets properly isolated from source code"
        });

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process environment action", details: error },
      { status: 500 }
    );
  }
}