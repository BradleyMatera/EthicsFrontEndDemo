'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, CheckCircle2, Lock, Play, FileText, FlaskConical } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import type { Enrollment } from '@/lib/types';

export default function CourseDetailClient({ slug }: { slug: string }) {
  const { user } = useAuth();
  const course = dataStore.getCourseBySlug(slug);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(
    user && course ? dataStore.getEnrollment(user.id, course.id) : null
  );

  if (!course) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Course not found</h1>
        <Link href="/courses" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const lessons = dataStore.getCourseLessons(course.id);
  const lessonCount = lessons.length;

  const handleEnroll = () => {
    if (!user) return;
    const enr = dataStore.enroll(user.id, course.id);
    setEnrollment(enr);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-slate-500">
        <Link href="/courses" className="hover:text-blue-600">Courses</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{course.title}</span>
      </div>

      {/* Course Header */}
      <div className="mb-8 rounded-2xl bg-blue-600 p-8 text-white">
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white capitalize">
          {course.level}
        </span>
        <h1 className="mt-3 text-3xl font-bold">{course.title}</h1>
        <p className="mt-2 text-lg text-blue-100">{course.subtitle}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-blue-100">
          <span className="flex items-center gap-1">
            <BookOpen size={16} /> {lessonCount} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} /> {course.estimatedHours} hours
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-700">{course.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Enrollment / Progress */}
      {user ? (
        enrollment ? (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Your Progress</h3>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-slate-600">
                {enrollment.completedLessons.length} of {lessonCount} lessons completed
              </span>
              {enrollment.status === 'completed' ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  <CheckCircle2 size={14} /> Completed
                </span>
              ) : (
                <Link
                  href={`/courses/${course.slug}/lessons/${enrollment.currentLessonId ?? lessons[0]?.lesson.id}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Play size={16} /> Continue Learning
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <button
              onClick={handleEnroll}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <BookOpen size={18} /> Enroll Now
            </button>
          </div>
        )
      ) : (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
          <Lock className="mx-auto text-slate-400" size={28} />
          <p className="mt-2 text-slate-600">Sign in with a demo persona to enroll in this course.</p>
        </div>
      )}

      {/* Curriculum */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Curriculum</h2>
        <div className="space-y-4">
          {course.modules.map((module) => (
            <div key={module.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">{module.title}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {module.lessons.length} lessons
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {module.lessons.map((lesson) => {
                  const isCompleted = enrollment?.completedLessons.includes(lesson.id);
                  const isLocked = !enrollment;
                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle2 className="text-emerald-600" size={18} />
                        ) : isLocked ? (
                          <Lock className="text-slate-300" size={18} />
                        ) : (
                          <Play className="text-blue-600" size={18} />
                        )}
                        <div>
                          <p className={`text-sm ${isLocked ? 'text-slate-400' : 'text-slate-700'}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {lesson.durationMinutes} min
                            </span>
                            {lesson.hasQuiz && (
                              <span className="flex items-center gap-1">
                                <FileText size={12} /> Quiz
                              </span>
                            )}
                            {lesson.hasLab && (
                              <span className="flex items-center gap-1">
                                <FlaskConical size={12} /> Lab
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {!isLocked && (
                        <Link
                          href={`/courses/${course.slug}/lessons/${lesson.id}`}
                          className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                          aria-label={`Go to ${lesson.title}`}
                        >
                          <ArrowRight size={16} />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
