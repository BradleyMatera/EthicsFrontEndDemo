'use client';

import { Link } from '@nextui-org/react';
import { Github, Package, ShieldCheck } from 'lucide-react';

const resourceLinks = [
  {
    label: 'Hardcoded Demo',
    href: 'https://github.com/BradleyMatera/hardcoded-demo',
  },
  {
    label: 'Shared Secrets Demo',
    href: 'https://github.com/BradleyMatera/shared-demo',
  },
  {
    label: 'Environment Demo',
    href: 'https://github.com/BradleyMatera/env-demo',
  },
];

const platformLinks = [
  { label: 'Vercel Deployment', href: 'https://vercel.com/docs' },
  { label: 'Netlify Secrets', href: 'https://docs.netlify.com/environment-variables/overview/' },
  { label: 'Docker Secrets', href: 'https://docs.docker.com/engine/swarm/secrets/' },
];

export function Footer() {
  return (
    <footer className="border-t border-divider bg-default-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="text-primary" size={22} />
              <p className="text-lg font-semibold">Node Secrets Guide</p>
            </div>
            <p className="text-sm text-foreground-500">
              Practical, production-minded guidance for keeping API keys, credentials, and tokens
              out of your source control while delivering repeatable workflows for every team.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground-600">Example Repositories</p>
            <ul className="mt-4 space-y-2 text-sm text-foreground-500">
              {resourceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    color="foreground"
                    className="hover:text-primary"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    size="sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground-600">Deployment References</p>
            <ul className="mt-4 space-y-2 text-sm text-foreground-500">
              {platformLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    color="foreground"
                    className="hover:text-primary"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    size="sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-divider pt-6 text-sm text-foreground-500 md:flex-row">
          <p>© {new Date().getFullYear()} Node Secrets Guide. All security examples audited quarterly.</p>
          <div className="flex items-center gap-4">
            <Link
              color="foreground"
              className="flex items-center gap-2 hover:text-primary"
              href="https://github.com/BradleyMatera"
              target="_blank"
              rel="noreferrer"
              size="sm"
            >
              <Github size={16} />
              GitHub
            </Link>
            <Link
              color="foreground"
              className="flex items-center gap-2 hover:text-primary"
              href="https://bun.sh/"
              target="_blank"
              rel="noreferrer"
              size="sm"
            >
              <Package size={16} />
              Built with Bun & Next.js
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
