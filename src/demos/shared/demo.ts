/**
 * WARNING: This file demonstrates the shared secrets file approach.
 * Committing secrets files is risky and should be avoided in production.
 * Prefer environment variables or secret managers for sensitive data.
 */
// SHARED FILES APPROACH - Better than hardcoded but still has issues
// This represents the approach shown in shared-demo repository

import { sharedSecretsScenario } from "@/components/labs/scenarios";

class SharedSecretsDemo {
  private config: any = null;

  constructor() {
    // Initialize with demo config immediately for browser compatibility
    this.loadConfig();
  }

  // Load secrets from shared config file
  private loadConfig() {
    if (this.config) return this.config;
    
    try {
      // Use demo configuration (simulating what would be loaded from a config file)
      // WARNING: These are fake secrets for demonstration only.
      this.config = {
        api_key: "REPLACE_ME_API_KEY",
        database: {
          host: "REPLACE_ME_DB_HOST",
          username: "REPLACE_ME_DB_USER", 
          password: "REPLACE_ME_DB_PASSWORD",
          port: 5432,
          ssl: true
        },
        jwt_secret: "REPLACE_ME_JWT_SECRET",
        external_apis: {
          payment_gateway: "REPLACE_ME_PAYMENT_GATEWAY_KEY",
          analytics: "REPLACE_ME_ANALYTICS_TOKEN",
          email_service: "REPLACE_ME_EMAIL_SERVICE_KEY"
        },
        feature_flags: {
          enable_new_dashboard: true,
          enable_beta_features: false,
          maintenance_mode: false
        },
        cache_settings: {
          redis_url: "REPLACE_ME_REDIS_URL",
          ttl_seconds: 3600
        }
      };
      
      console.log("✅ Configuration loaded from shared config.json file");
      return this.config;
    } catch (error) {
      console.warn("⚠️ Could not load config file, using fallback values");
      
      // Fallback configuration
      this.config = {
        api_key: "sk-fallback-demo-key",
        database: {
          host: "localhost",
          username: "demo_user",
          password: "demo_password",
          port: 5432
        },
        jwt_secret: "fallback-jwt-secret",
        external_apis: {
          payment_gateway: "pk_fallback_key",
          analytics: "fallback_analytics_token"
        }
      };
      
      return this.config;
    }
  }

  // Get database configuration from shared file
  getDatabaseConfig() {
    const config = this.loadConfig();
    return {
      ...config.database,
      source: "shared config file"
    };
  }

  // Make API call using shared configuration
  async makeAPICall() {
    const config = this.loadConfig();
    
    try {
      console.log("📁 Using API key from shared config file");
      
      // Simulate API call
      const mockResponse = {
        message: "API call simulated with shared config key",
        key_source: "config.json file",
        key_preview: config.api_key.substring(0, 8) + "...",
        improvement: "Better than hardcoded, but still has risks"
      };

      return {
        success: true,
        data: mockResponse,
        benefits: [
          "Secrets not directly in source code",
          "Easier to manage across environments",
          "Can be excluded from version control"
        ],
        risks: [
          "File might accidentally be committed",
          "All developers need access to the file",
          "No encryption at rest"
        ]
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate JWT using shared secret
  generateJWT(userId: number) {
    const config = this.loadConfig();
    
    console.log("📁 Using JWT secret from shared config file");
    
    // Mock JWT generation
    const mockToken = `${Buffer.from(JSON.stringify({alg: 'HS256', typ: 'JWT'})).toString('base64')}.${Buffer.from(JSON.stringify({userId, exp: Date.now() + 3600000})).toString('base64')}.shared-signature`;
    
    return {
      token: mockToken,
      source: "Shared config file",
      benefits: "Secret not visible in source code",
      risks: "Config file security depends on file system permissions"
    };
  }

  // Get pros and cons of shared file approach
  getAnalysis() {
    return {
      pros: [
        "Secrets separated from source code",
        "Easier to manage different environments",
        "Can be excluded from version control",
        "Centralized configuration management"
      ],
      cons: [
        "Risk of accidentally committing config files",
        "All team members need file access",
        "No built-in secret rotation",
        "File permissions must be managed carefully",
        "Secrets stored in plain text"
      ],
      best_practices: [
        "Add config files to .gitignore",
        "Use different config files per environment",
        "Implement proper file permissions (600)",
        "Document required configuration format",
        "Consider encrypting sensitive values"
      ]
    };
  }

  // Simulate the shared file approach demo
  async runDemo() {
    // Run the original demo logic
    console.log("📁 SHARED FILES DEMO (IMPROVED APPROACH)");
    console.log("=" .repeat(50));
    
    const dbConfig = this.getDatabaseConfig();
    console.log("Database config:", dbConfig);
    
    const apiResult = await this.makeAPICall();
    console.log("API call result:", apiResult);
    
    const jwtResult = this.generateJWT(456);
    console.log("JWT generation result:", jwtResult);
    
    const analysis = this.getAnalysis();
    console.log("\n📊 ANALYSIS:");
    console.log("Pros:", analysis.pros);
    console.log("Cons:", analysis.cons);
    console.log("Best Practices:", analysis.best_practices);

    // Combine with lab scenario metadata
    return {
      demo_type: "shared_files",
      status: "completed", 
      security_level: "MODERATE_RISK",
      recommendation: "Good improvement, but environment variables are better",
      lab: {
        id: sharedSecretsScenario.id,
        title: sharedSecretsScenario.title,
        description: sharedSecretsScenario.description,
        introSteps: sharedSecretsScenario.introSteps,
        walkthroughSteps: sharedSecretsScenario.walkthroughSteps,
        tasks: sharedSecretsScenario.tasks.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          hint: t.hint
        })),
        resources: sharedSecretsScenario.resources
      }
    };
  }
}

export { SharedSecretsDemo };
