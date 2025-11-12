/**
 * BEST PRACTICE: This file demonstrates secure secrets management using environment variables.
 * Secrets should never be committed to source code or config files.
 * Always validate required environment variables and handle missing values securely.
 */
// ENVIRONMENT VARIABLES APPROACH - Best Practice Implementation
// This represents the approach shown in env-demo repository

import { environmentVariablesScenario } from "@/components/labs/scenarios";

class EnvironmentVariablesDemo {
  // Get environment variables with fallbacks
  private getEnvVar(key: string, fallback?: string): string {
    // In browser, simulate environment variables
    if (typeof window !== 'undefined') {
      const mockEnvVars: Record<string, string> = {
        'NODE_ENV': 'development',
        'API_KEY': 'sk-env-demo-safe-key-12345',
        'DATABASE_URL': 'postgresql://env_user:env_pass@env.db.company.com:5432/myapp',
        'DATABASE_HOST': 'env.database.company.com',
        'DATABASE_USER': 'env_app_user',
        'DATABASE_PASSWORD': 'env_secure_password_789',
        'DATABASE_PORT': '5432',
        'JWT_SECRET': 'env-jwt-secret-key-very-secure',
        'REDIS_URL': 'redis://env-cache.company.com:6379',
        'STRIPE_PUBLIC_KEY': 'pk_env_stripe_public_demo',
        'STRIPE_SECRET_KEY': 'sk_env_stripe_secret_demo',
        'SENDGRID_API_KEY': 'SG.env_sendgrid_key_demo',
        'GOOGLE_ANALYTICS_ID': 'UA-env-demo-analytics',
        'APP_SECRET': 'env-application-secret-key',
        'ENCRYPTION_KEY': 'env-encryption-key-32-chars-long',
        'WEBHOOK_SECRET': 'env-webhook-secret-verification'
      };
      
      return mockEnvVars[key] || fallback || `mock_${key.toLowerCase()}`;
    }
    
    // In Node.js environment
    return process.env[key] || fallback || '';
  }

  // Check if running in production
  private isProduction(): boolean {
    return this.getEnvVar('NODE_ENV') === 'production';
  }

  // Get database configuration from environment variables
  getDatabaseConfig() {
    const config = {
      // Option 1: Full database URL (preferred)
      url: this.getEnvVar('DATABASE_URL'),
      
      // Option 2: Individual components
      host: this.getEnvVar('DATABASE_HOST', 'localhost'),
      port: parseInt(this.getEnvVar('DATABASE_PORT', '5432')),
      username: this.getEnvVar('DATABASE_USER', 'postgres'),
      password: this.getEnvVar('DATABASE_PASSWORD'),
      database: this.getEnvVar('DATABASE_NAME', 'myapp'),
      ssl: this.isProduction(), // SSL in production only
      
      source: "environment variables",
      security_level: "high"
    };

    return config;
  }

  // Make API call using environment variables
  async makeAPICall() {
    const apiKey = this.getEnvVar('API_KEY');
    
    if (!apiKey) {
      return {
        success: false,
        error: "API_KEY environment variable not set",
        suggestion: "Set API_KEY environment variable before running the application"
      };
    }

    try {
      console.log("🔐 Using API key from environment variable");
      
      // Simulate API call
      const mockResponse = {
        message: "API call simulated with environment variable",
        key_source: "environment variable",
        key_preview: apiKey.substring(0, 8) + "...",
        security: "High - not visible in source code or config files"
      };

      return {
        success: true,
        data: mockResponse,
        benefits: [
          "Secrets never committed to version control",
          "Different secrets per environment", 
          "Easy secret rotation without code changes",
          "Platform-native secret management",
          "No files to accidentally commit"
        ]
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate JWT using environment variable
  generateJWT(userId: number) {
    const jwtSecret = this.getEnvVar('JWT_SECRET');
    
    if (!jwtSecret) {
      return {
        success: false,
        error: "JWT_SECRET environment variable not set",
        suggestion: "Set JWT_SECRET environment variable with a secure random string"
      };
    }

    console.log("🔐 Using JWT secret from environment variable");
    
    // Mock JWT generation
    const mockToken = `${Buffer.from(JSON.stringify({alg: 'HS256', typ: 'JWT'})).toString('base64')}.${Buffer.from(JSON.stringify({userId, exp: Date.now() + 3600000})).toString('base64')}.env-signature`;
    
    return {
      success: true,
      token: mockToken,
      source: "Environment variable",
      security: "High - secret rotation possible without code deployment",
      best_practice: "Generate JWT_SECRET with: openssl rand -hex 32"
    };
  }

  // Get all configured environment variables (safe to display)
  getEnvironmentStatus() {
    const requiredVars = [
      'NODE_ENV',
      'API_KEY', 
      'DATABASE_URL',
      'JWT_SECRET'
    ];
    
    const optionalVars = [
      'REDIS_URL',
      'STRIPE_SECRET_KEY',
      'SENDGRID_API_KEY',
      'GOOGLE_ANALYTICS_ID'
    ];
    
    const status = {
      required: {} as Record<string, boolean>,
      optional: {} as Record<string, boolean>,
      missing_required: [] as string[],
      security_recommendations: [] as string[]
    };

    // Check required variables
    requiredVars.forEach(varName => {
      const value = this.getEnvVar(varName);
      status.required[varName] = !!value;
      if (!value) {
        status.missing_required.push(varName);
      }
    });

    // Check optional variables  
    optionalVars.forEach(varName => {
      const value = this.getEnvVar(varName);
      status.optional[varName] = !!value;
    });

    // Add security recommendations
    if (this.getEnvVar('JWT_SECRET').length < 32) {
      status.security_recommendations.push("JWT_SECRET should be at least 32 characters long");
    }
    
    if (!this.isProduction() && this.getEnvVar('API_KEY').includes('demo')) {
      status.security_recommendations.push("Using demo API key - replace with real key in production");
    }

    return status;
  }

  // Get best practices for environment variables
  getBestPractices() {
    return {
      development: [
        "Use .env files for local development",
        "Add .env to .gitignore",
        "Provide .env.example with dummy values",
        "Use dotenv package to load .env files",
        "Validate required environment variables on startup"
      ],
      production: [
        "Use platform-native secret management",
        "Never log environment variable values",
        "Use different secrets per environment",
        "Rotate secrets regularly", 
        "Use strong, randomly generated secrets",
        "Implement secret validation and fallbacks"
      ],
      security: [
        "Generate secrets with: openssl rand -hex 32",
        "Use different JWT secrets per environment",
        "Encrypt sensitive data at rest",
        "Use HTTPS/TLS for API communications",
        "Implement proper error handling for missing secrets",
        "Consider using secret management services (AWS Secrets Manager, etc.)"
      ]
    };
  }

  // Simulate environment variables demo
  async runDemo() {
    console.log("🔐 ENVIRONMENT VARIABLES DEMO (BEST PRACTICE)");
    console.log("=" .repeat(50));
    
    const envStatus = this.getEnvironmentStatus();
    console.log("Environment status:", envStatus);
    
    const dbConfig = this.getDatabaseConfig();
    console.log("Database config:", dbConfig);
    
    const apiResult = await this.makeAPICall();
    console.log("API call result:", apiResult);
    
    const jwtResult = this.generateJWT(789);
    console.log("JWT generation result:", jwtResult);
    
    const bestPractices = this.getBestPractices();
    console.log("\n📋 BEST PRACTICES:");
    console.log("Development:", bestPractices.development);
    console.log("Production:", bestPractices.production);
    console.log("Security:", bestPractices.security);

    // Combine with lab scenario metadata
    return {
      demo_type: "environment_variables",
      status: "completed",
      security_level: "HIGH_SECURITY", 
      recommendation: "This is the recommended approach for production applications",
      lab: {
        id: environmentVariablesScenario.id,
        title: environmentVariablesScenario.title,
        description: environmentVariablesScenario.description,
        introSteps: environmentVariablesScenario.introSteps,
        walkthroughSteps: environmentVariablesScenario.walkthroughSteps,
        tasks: environmentVariablesScenario.tasks.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          hint: t.hint
        })),
        resources: environmentVariablesScenario.resources
      }
    };
  }
}

export { EnvironmentVariablesDemo };
