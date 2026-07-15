# SecureLearn LMS

An interactive Learning Management System for teaching secrets management to developers. Progress through structured courses with lessons, quizzes, hands-on labs, and verifiable certificates.

## Features

- **Structured Curriculum**: Modules and lessons designed by security engineers
- **Hands-On Labs**: Interactive terminal-based labs that simulate real security scenarios
- **Knowledge Checks**: Quizzes after each lesson reinforce learning
- **Verifiable Certificates**: Earn certificates with unique verification numbers upon course completion
- **Role-Based Experience**: Student, instructor, and admin personas with differentiated dashboards
- **Progress Tracking**: Dashboard with enrollment status, completion rates, and activity history
- **Dark Mode**: Full dark mode support across all pages

## Demo Personas

Use the **Demo Login** button in the navbar to sign in as:

| Persona | Role | Description |
|---------|------|-------------|
| Alex Chen | Student | Junior developer learning secrets management |
| Sam Rodriguez | Instructor | Security engineer with 10+ years experience |
| Jordan Blake | Admin | Platform administrator overseeing operations |

## Tech Stack

- **Framework**: Next.js 15.1.0 with App Router
- **UI Library**: HeroUI (formerly NextUI)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **State**: React Context + LocalStorage

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # LMS landing page
│   ├── courses/
│   │   ├── page.tsx                      # Course catalog
│   │   ├── [slug]/
│   │   │   ├── page.tsx                  # Course detail with curriculum
│   │   │   └── lessons/[lessonId]/
│   │   │       └── page.tsx              # Lesson player with quiz
│   ├── labs/[lessonId]/
│   │   └── page.tsx                      # Interactive lab page
│   ├── dashboard/
│   │   └── page.tsx                      # Role-based dashboard
│   ├── certificates/[certNumber]/
│   │   └── page.tsx                      # Certificate verification
│   ├── demos/
│   │   ├── hardcoded/                    # Hardcoded secrets demo
│   │   ├── shared-secrets/               # Shared files demo
│   │   └── environment-variables/        # Environment vars demo
│   ├── comparison/                       # Side-by-side comparison
│   └── best-practices/                   # HashiCorp 5 pillars guide
├── components/
│   ├── Navigation.tsx                    # Navbar with theme toggle
│   ├── Footer.tsx                        # Footer with resource links
│   ├── PersonaSwitcher.tsx              # Demo login dropdown
│   ├── providers.tsx                     # HeroUI + Auth providers
│   ├── Breadcrumb.tsx                    # Reusable breadcrumb
│   ├── labs/
│   │   ├── LabConsole.tsx               # Interactive terminal lab
│   │   ├── scenarios.ts                  # Lab scenarios (hardcoded, env vars)
│   │   └── types.ts
│   └── ui/
│       └── code-block.tsx               # Syntax-highlighted code
├── lib/
│   ├── types.ts                          # Domain types (User, Course, etc.)
│   ├── auth-context.tsx                  # Auth provider with demo personas
│   ├── data-store.ts                     # LocalStorage-based state management
│   └── demo-data.ts                      # Seed courses, users, quiz questions
└── app/globals.css                       # Global styles + animations
```

## Course Content

### Secrets Management Fundamentals

**Module 1: Foundations of Secrets Management**
- Why Secrets Matter (quiz)
- The Hardcoded Secrets Problem (quiz + lab)

**Module 2: Environment Variables Done Right**
- Introduction to Environment Variables (quiz + lab)
- Validation and Error Handling (quiz)

**Module 3: Advanced Secrets Management**
- Cloud Secret Stores (quiz)
- CI/CD and Secrets (quiz)

## Demo Repositories

- **[Hardcoded Demo](https://github.com/BradleyMatera/hardcoded-demo)**
- **[Environment Demo](https://github.com/BradleyMatera/env-demo)**
- **[Shared Secrets Demo](https://github.com/BradleyMatera/shared-demo)**

## Deployment

This app can be deployed to Vercel, Netlify, or any Node.js hosting provider.

```bash
npm run build
```

For static export:

```bash
NEXT_STATIC_EXPORT=true npm run build
```

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with Next.js & HeroUI.
