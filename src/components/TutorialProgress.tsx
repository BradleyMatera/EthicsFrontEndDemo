'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Card, CardBody, CardHeader, Chip, Link } from '@nextui-org/react';
import { CheckCircle2, Circle, Flag, TrendingUp } from 'lucide-react';

type TutorialStep = {
  title: string;
  href: string;
  summary: string;
};

const steps: TutorialStep[] = [
  {
    title: '1. Foundations',
    href: '/',
    summary: 'Understand why secrets matter and how the guide is structured.',
  },
  {
    title: '2. Hardcoded Secrets',
    href: '/demos/hardcoded',
    summary: 'See why embedding credentials in code is catastrophic.',
  },
  {
    title: '3. Shared Secrets',
    href: '/demos/shared-secrets',
    summary: 'Evaluate repository-based secrets and their tradeoffs.',
  },
  {
    title: '4. Environment Variables',
    href: '/demos/environment-variables',
    summary: 'Implement .env-based secrets with validation and deployment tips.',
  },
  {
    title: '5. Comparison',
    href: '/comparison',
    summary: 'Compare approaches side-by-side across risk dimensions.',
  },
  {
    title: '6. Best Practices',
    href: '/best-practices',
    summary: 'Adopt enterprise-grade processes for long-term governance.',
  },
];

const statusChip = {
  complete: <Chip color="success" size="sm" variant="flat" startContent={<CheckCircle2 size={14} />}>Complete</Chip>,
  current: <Chip color="primary" size="sm" variant="flat" startContent={<TrendingUp size={14} />}>In progress</Chip>,
  upcoming: <Chip color="default" size="sm" variant="flat" startContent={<Circle size={10} />}>Upcoming</Chip>,
};

export function TutorialProgress() {
  const pathname = usePathname();
  const activeIndex = useMemo(
    () => steps.findIndex((step) => step.href === pathname),
    [pathname],
  );

  return (
    <Card className="bg-default-50 border border-default-200 fade-in">
      <CardHeader className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Flag className="text-primary" size={18} />
          <h3 className="text-base font-semibold">Tutorial Roadmap</h3>
        </div>
        <Chip size="sm" color="secondary" variant="flat">
          {activeIndex >= 0 ? `${activeIndex + 1} / ${steps.length} completed` : `0 / ${steps.length} completed`}
        </Chip>
      </CardHeader>
      <CardBody className="space-y-4 pt-0">
        {steps.map((step, index) => {
          let status: keyof typeof statusChip = 'upcoming';
          if (activeIndex > index) status = 'complete';
          else if (activeIndex === index) status = 'current';

          return (
            <div
              key={step.href}
              className="rounded-lg border border-default-200 bg-content1/60 p-3 transition hover:border-primary/50 hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <Link href={step.href} color="foreground" className="text-sm font-medium hover:text-primary">
                  {step.title}
                </Link>
                {statusChip[status]}
              </div>
              <p className="text-xs text-foreground-500 mt-2 leading-relaxed">{step.summary}</p>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
