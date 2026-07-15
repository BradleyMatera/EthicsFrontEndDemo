import { Suspense } from 'react';
import CertificateContent from './CertificateContent';

export default function CertificatePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-600">Loading certificate…</div>}>
      <CertificateContent />
    </Suspense>
  );
}
