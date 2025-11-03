import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Comparison | Secrets Management Tutorial',
  description: 'Compare the security implications of different secrets management approaches'
};

export default function ComparisonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}