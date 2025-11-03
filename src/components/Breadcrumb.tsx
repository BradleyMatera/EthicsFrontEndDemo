'use client';

import { ReactNode } from 'react';
import { Link } from '@nextui-org/react';
import { ChevronRight } from 'lucide-react';

type BreadcrumbItem = {
  label: string;
  href?: string;
  icon?: ReactNode;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="fade-in">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-foreground-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  color="primary"
                  className="flex items-center gap-1 hover:underline"
                  href={item.href}
                  size="sm"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-foreground-500">
                  {item.icon}
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight size={14} className="text-foreground-300" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
