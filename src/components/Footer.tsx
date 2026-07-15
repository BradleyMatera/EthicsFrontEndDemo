'use client';

import Link from 'next/link';
import { Github, ShieldCheck, ExternalLink } from 'lucide-react';

const resourceLinks = [
  { label: 'Hardcoded Demo', href: 'https://github.com/BradleyMatera/hardcoded-demo' },
  { label: 'Environment Demo', href: 'https://github.com/BradleyMatera/env-demo' },
  { label: 'Shared Secrets Demo', href: 'https://github.com/BradleyMatera/shared-demo' },
];

const platformLinks = [
  { label: 'Vercel Deployment', href: 'https://vercel.com/docs' },
  { label: 'Netlify Secrets', href: 'https://docs.netlify.com/environment-variables/overview/' },
  { label: 'Docker Secrets', href: 'https://docs.docker.com/engine/swarm/secrets/' },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 text-white">
              <ShieldCheck className="text-blue-500" size={22} />
              <span className="text-lg font-semibold">SecureLearn</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Practical, production-minded guidance for keeping API keys, credentials, and tokens out of source control.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Example Repositories</p>
            <ul className="mt-4 space-y-2 text-sm">
              {resourceLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white"
                  >
                    {item.label}
                    <ExternalLink size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Deployment References</p>
            <ul className="mt-4 space-y-2 text-sm">
              {platformLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white"
                  >
                    {item.label}
                    <ExternalLink size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} SecureLearn LMS. Educational use only.</p>
          <a
            href="https://github.com/BradleyMatera"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white"
          >
            <Github size={16} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
