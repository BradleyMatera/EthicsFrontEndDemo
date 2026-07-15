'use client';

import { use } from 'react';
import Link from 'next/link';
import { Award, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { dataStore } from '@/lib/data-store';

export default function CertificatePage({ params }: { params: Promise<{ certNumber: string }> }) {
  const { certNumber } = use(params);
  const cert = dataStore.getCertificate(certNumber);

  if (!cert) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <XCircle className="mx-auto mb-4 text-rose-600" size={48} />
        <h1 className="text-2xl font-bold text-slate-900">Certificate Not Found</h1>
        <p className="mt-2 text-slate-600">
          The certificate number <span className="font-mono">{certNumber}</span> does not exist.
        </p>
        <Link href="/" className="mt-6 inline-flex items-center gap-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <ArrowLeft size={16} /> Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={16} /> Valid Certificate
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border-8 border-blue-600 bg-white shadow-lg">
        <div className="p-8 text-center sm:p-12">
          <div className="mb-4 inline-flex rounded-full bg-amber-50 p-4 text-amber-600">
            <Award size={48} />
          </div>
          <p className="text-sm uppercase tracking-widest text-slate-500">Certificate of Completion</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{cert.userName}</h1>
          <p className="mt-2 text-slate-600">has successfully completed</p>
          <h2 className="mt-2 text-2xl font-semibold text-blue-600">{cert.courseTitle}</h2>
          <hr className="my-6 border-slate-200" />
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <p className="text-slate-500">Issued Date</p>
              <p className="font-semibold text-slate-900">
                {new Date(cert.issuedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-500">Certificate Number</p>
              <p className="font-mono font-semibold text-slate-900">{cert.certificateNumber}</p>
            </div>
          </div>
          <hr className="my-6 border-slate-200" />
          <p className="text-xs text-slate-400">
            SecureLearn LMS — Verify at https://securelearn.dev/certificates/{cert.certificateNumber}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Print Certificate
        </button>
      </div>
    </div>
  );
}
