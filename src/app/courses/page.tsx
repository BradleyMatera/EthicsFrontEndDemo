'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';

export default function CoursesPage() {
  const { user } = useAuth();
  const courses = dataStore.getAllCourses();

  const enrollments = useMemo(() => {
    if (!user) return [];
    return dataStore.getUserEnrollments(user.id);
  }, [user]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Course Catalog</h1>
        <p className="mt-2 text-slate-600">
          Explore security courses designed for developers at every level.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const enrollment = enrollments.find((e) => e.courseId === course.id);
          const lessonCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

          return (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-32 items-center justify-center bg-blue-600">
                <BookOpen className="text-white" size={48} />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 capitalize">
                    {course.level}
                  </span>
                  {enrollment && (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      enrollment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {enrollment.status === 'completed' ? <CheckCircle2 size={12} /> : null}
                      {enrollment.status === 'completed' ? 'Completed' : `${enrollment.progress}%`}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{course.title}</h3>
                <p className="text-sm text-slate-500">{course.subtitle}</p>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">{course.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <BookOpen size={14} />
                    {lessonCount} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {course.estimatedHours}h
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                  {enrollment ? 'Continue' : 'Enroll'}
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {!user && (
        <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
          <Lock className="mx-auto mb-2 text-slate-400" size={24} />
          <p className="text-slate-600">
            Use the Demo Login button in the navigation bar to sign in and start learning.
          </p>
        </div>
      )}
    </div>
  );
}
