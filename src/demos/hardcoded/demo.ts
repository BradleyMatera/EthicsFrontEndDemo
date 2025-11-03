// BAD EXAMPLE - Hardcoded secrets (DO NOT USE IN PRODUCTION)
// This represents the dangerous approach shown in hardcoded-demo repository

class HardcodedSecretsDemo {
  // DANGER: API key directly in source code
  private readonly API_KEY = "sk-1234567890abcdef";
  private readonly DB_PASSWORD = "hardcoded123";
  private readonly JWT_SECRET = "my-super-secret-jwt-key";

  // DANGER: Database connection with hardcoded credentials
  getDatabaseConfig() {
    return {
      host: "production.db.company.com",
      username: "admin", 
      password: this.DB_PASSWORD, // ❌ NEVER DO THIS
      port: 5432
    };
  }

  // DANGER: API call with hardcoded key
  async makeAPICall() {
    try {
      console.log("🚨 DANGER: Using hardcoded API key:", this.API_KEY);
      
      // Simulate API call (don't make real requests in demo)
      const mockResponse = {
        message: "API call simulated with hardcoded key",
        key_used: this.API_KEY.substring(0, 8) + "...",
        risk_level: "CRITICAL"
      };

      return {
        success: true,
        data: mockResponse,
        warning: "This API key is visible to anyone with access to the source code!"
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // DANGER: JWT token generation with hardcoded secret
  generateJWT(userId: number) {
    console.log("🚨 DANGER: Using hardcoded JWT secret:", this.JWT_SECRET);
    
    // Mock JWT generation (don't use real crypto in demo)
    const mockToken = `${Buffer.from(JSON.stringify({alg: 'HS256', typ: 'JWT'})).toString('base64')}.${Buffer.from(JSON.stringify({userId, exp: Date.now() + 3600000})).toString('base64')}.mock-signature`;
    
    return {
      token: mockToken,
      warning: "JWT secret is hardcoded and visible in source code!",
      risk: "Anyone can forge tokens if they have access to this code"
    };
  }

  // Get all security risks
  getSecurityRisks() {
    return [
      "API keys visible in source code",
      "Database passwords committed to git",
      "JWT secrets exposed to all developers",
      "Impossible to rotate secrets without code changes",
      "Secrets permanently stored in version control history"
    ];
  }

  // Simulate running the demo
  async runDemo() {
    console.log("🚨 HARDCODED SECRETS DEMO (DANGEROUS APPROACH)");
    console.log("=" .repeat(50));
    
    const dbConfig = this.getDatabaseConfig();
    console.log("Database config:", dbConfig);
    
    const apiResult = await this.makeAPICall();
    console.log("API call result:", apiResult);
    
    const jwtResult = this.generateJWT(123);
    console.log("JWT generation result:", jwtResult);
    
    console.log("\n⚠️  SECURITY RISKS:");
    this.getSecurityRisks().forEach(risk => console.log(`- ${risk}`));
    
    return {
      demo_type: "hardcoded",
      status: "completed",
      security_level: "CRITICAL_RISK",
      recommendation: "NEVER use this approach in production!"
    };
  }
}

export { HardcodedSecretsDemo };