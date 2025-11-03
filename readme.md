# Node.js Secrets Management Tutorial

A comprehensive, interactive guide to managing secrets in Node.js applications. Learn from dangerous practices to industry-proven security best practices with hands-on examples and real-world implementations.

## 🚀 Features

- **Interactive Demonstrations**: Live code examples showing good and bad practices
- **Comprehensive Coverage**: From hardcoded secrets to enterprise-grade solutions
- **Modern Tech Stack**: Built with Next.js 16, NextUI, and TypeScript
- **Best Practices Guide**: Based on HashiCorp's 5 principles of secrets management
- **Real-world Examples**: Learn from actual security breaches and how to prevent them

## 🎯 What You'll Learn

### 1. **Hardcoded Secrets** (🚨 Never Do This)
- Why hardcoding secrets is dangerous
- Real-world security breaches caused by hardcoded credentials
- How secrets appear in version control history

### 2. **Shared Secrets Files** (⚠️ Risky Approach)
- Problems with committing secrets.json files
- GitHub's secret detection capabilities
- Version control exposure risks

### 3. **Environment Variables** (✅ Recommended)
- Industry-standard approach using .env files
- Deployment platform configuration
- Production-grade implementation patterns

### 4. **Enterprise Best Practices** (🎓 Advanced)
- HashiCorp's 5 pillars of secrets management
- Dynamic secret generation
- Centralized control planes and audit trails

## 🛠 Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: NextUI components
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: Bun
- **Code Highlighting**: React Syntax Highlighter
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd node-secrets-tutorial
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Start the development server:
```bash
bun dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Tutorial Structure

```
src/
├── app/
│   ├── page.tsx                 # Homepage with overview
│   ├── demos/
│   │   ├── hardcoded/           # Hardcoded secrets demo
│   │   ├── shared-secrets/      # Shared files demo
│   │   └── environment-variables/ # Environment vars demo
│   └── best-practices/          # Comprehensive guide
├── components/
│   ├── navigation.tsx           # Global navigation bar
│   ├── footer.tsx               # Persistent footer
│   ├── Breadcrumb.tsx           # Reusable breadcrumb trail
│   ├── TutorialProgress.tsx     # Progress tracker widget
│   ├── providers.tsx            # Theme and UI providers
│   └── ui/
│       └── code-block.tsx       # Interactive code component
├── public/
│   └── api/                     # Static JSON used for static hosting
```

## 🔗 Demo Repositories

This tutorial references three separate GitHub repositories that demonstrate each approach:

- **[Hardcoded Demo](https://github.com/BradleyMatera/hardcoded-demo)** - Shows dangerous hardcoded secrets
- **[Shared Demo](https://github.com/BradleyMatera/shared-demo)** - Demonstrates shared secrets files
- **[Environment Demo](https://github.com/BradleyMatera/env-demo)** - Proper environment variable usage

## 🏗 Build & Deployment

### Development
```bash
bun dev          # Start dev server
bun build        # Create production build
bun start        # Start production server
```

### Environment Variables

Create a `.env.local` file for local development:
```bash
# Add any environment-specific variables here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Deployment Options

This application can be deployed to:

- **Vercel**: Zero-config deployment for Next.js
- **Netlify**: Static site generation support
- **Docker**: Container-based deployment
- **Traditional hosting**: Static export support

### GitHub Pages Deployment

GitHub Pages serves static files, so export the site and commit the generated `docs` directory:

```bash
# Build the static site with the correct base path
bun run build:pages

# Verify the docs folder locally if needed
npx serve docs

# Commit the docs folder and push to your GitHub Pages branch or repo
git add docs
git commit -m "chore: update GitHub Pages build"
git push
```

The build script sets `NEXT_PUBLIC_BASE_PATH=/EthicsFrontEndDemo` automatically, matching the project page URL `https://bradleymatera.github.io/EthicsFrontEndDemo/`. Adjust the environment variable if you host the files under a different path.

## 🔒 Security Notes

⚠️ **Important**: This tutorial demonstrates both secure and insecure practices for educational purposes. Never use the "bad" examples shown here in production applications.

The tutorial teaches:
- ✅ What TO do for secure secrets management
- ❌ What NOT to do (with clear warnings)
- 🎓 Why security practices matter
- 🛡 How to implement proper solutions

## 📖 Educational Approach

### HashiCorp's 5 Principles
1. **Central Secrets Control Plane**
2. **Access Control Lists (ACLs)**
3. **Dynamic Secrets**
4. **Encryption as a Service**
5. **Auditing**

### Implementation Levels
- **Starter**: Basic .env file approach
- **Professional**: Cloud provider secrets managers
- **Enterprise**: HashiCorp Vault and advanced solutions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [HashiCorp](https://www.hashicorp.com/) for their excellent secrets management principles
- [OWASP](https://owasp.org/) for security best practices
- [GitHub](https://github.com/) for secret scanning and security features
- The open-source community for the amazing tools and libraries

## 📞 Support

If you have questions or need help:

1. Check the [tutorial content](http://localhost:3000) for detailed explanations
2. Review the [best practices guide](http://localhost:3000/best-practices)
3. Examine the [demo repositories](https://github.com/BradleyMatera)
4. Open an issue in this repository

---

**⚠️ Educational Purpose Disclaimer**: This tutorial is designed for educational purposes to teach proper secrets management. Always follow your organization's security policies and never expose real credentials in any educational material.

Built with ❤️ for secure coding practices.
