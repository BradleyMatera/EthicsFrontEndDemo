'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { LabConsole } from '@/components/labs/LabConsole';
import { hardcodedSecretsScenario, environmentVariablesScenario } from '@/components/labs/scenarios';
import type { LabScenario } from '@/components/labs/types';
import { dataStore } from '@/lib/data-store';

const lessonLabMap: Record<string, LabScenario> = {
  'l-002': hardcodedSecretsScenario,
  'l-003': environmentVariablesScenario,
};

export default function LabPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const scenario = lessonLabMap[lessonId];

  if (!scenario) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <FlaskConical className="mx-auto mb-4 text-slate-300" size={48} />
        <h1 className="text-2xl font-bold text-slate-900">Lab Not Available</h1>
        <p className="mt-2 text-slate-600">
          This lesson does not have an interactive lab yet.
        </p>
        <Link
          href="/courses"
          className="mt-6 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={16} /> Back to Courses
        </Link>
      </div>
    );
  }

  const course = dataStore.getAllCourses()[0];
  const lessons = course ? dataStore.getCourseLessons(course.id) : [];
  const current = lessons.find((l) => l.lesson.id === lessonId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        {course && current && (
          <>
            <Link href="/courses" className="hover:text-blue-600">Courses</Link>
            <span>/</span>
            <Link href={`/courses/${course.slug}`} className="hover:text-blue-600">{course.title}</Link>
            <span>/</span>
            <Link href={`/courses/${course.slug}/lessons/${lessonId}`} className="hover:text-blue-600">{current.lesson.title}</Link>
            <span>/</span>
            <span className="text-slate-900">Lab</span>
          </>
        )}
      </div>

      <div className="mb-6">
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          <FlaskConical size={14} /> Interactive Lab
        </span>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{scenario.title}</h1>
        <p className="mt-2 text-slate-600">{scenario.description}</p>
      </div>

      <LabConsole scenario={scenario} />

      <div className="mt-6 flex justify-between">
        <Link
          href={course ? `/courses/${course.slug}/lessons/${lessonId}` : '/courses'}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={16} /> Back to Lesson
        </Link>
      </div>
    </div>
  );
}
