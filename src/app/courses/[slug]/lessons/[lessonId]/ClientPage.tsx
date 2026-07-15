'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, FileText, FlaskConical, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import type { LessonBlock } from '@/lib/types';
import { CodeBlock } from '@/components/ui/code-block';

const calloutStyles = {
  info: { icon: <Info size={18} />, color: 'bg-blue-50 border-blue-200 text-blue-700' },
  warning: { icon: <AlertTriangle size={18} />, color: 'bg-amber-50 border-amber-200 text-amber-700' },
  danger: { icon: <AlertTriangle size={18} />, color: 'bg-rose-50 border-rose-200 text-rose-700' },
  success: { icon: <CheckCircle size={18} />, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
};

function LessonBlockRenderer({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case 'heading':
      return block.level === 2 ? (
        <h2 className="mt-6 text-2xl font-bold">{block.text}</h2>
      ) : (
        <h3 className="mt-5 text-xl font-semibold">{block.text}</h3>
      );
    case 'paragraph':
      return <p className="my-3 leading-relaxed text-slate-700">{block.text}</p>;
    case 'code':
      return (
        <div className="my-4">
          <CodeBlock code={block.code} language={block.language} title={block.caption} />
        </div>
      );
    case 'callout': {
      const style = calloutStyles[block.variant];
      return (
        <div className={`my-4 rounded-lg border p-4 ${style.color}`}>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0">{style.icon}</span>
            <div>
              <p className="font-semibold">{block.title}</p>
              <p className="mt-1 text-sm">{block.text}</p>
            </div>
          </div>
        </div>
      );
    }
    case 'list':
      return block.ordered ? (
        <ol className="my-3 list-decimal space-y-1 pl-6 text-slate-700">
          {block.items.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      ) : (
        <ul className="my-3 list-disc space-y-1 pl-6 text-slate-700">
          {block.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'divider':
      return <hr className="my-6 border-slate-200" />;
    default:
      return null;
  }
}

function QuizComponent({ lessonId, onComplete }: { lessonId: string; onComplete: () => void }) {
  const { user } = useAuth();
  const questions = dataStore.getQuizQuestions(lessonId);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (questions.length === 0) return null;

  const handleSubmit = () => {
    if (!user) return;
    const attempt = dataStore.submitQuizAttempt(user.id, lessonId, answers);
    setScore(attempt.score);
    setSubmitted(true);
    if (attempt.passed) onComplete();
  };

  const handleRetry = () => {
    setAnswers(new Array(questions.length).fill(-1));
    setSubmitted(false);
  };

  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
        <FileText size={20} className="text-blue-600" /> Knowledge Check
      </h3>
      <div className="mt-4 flex flex-col gap-5">
        {questions.map((q, qi) => (
          <div key={q.id} className="rounded-lg border border-slate-200 p-4">
            <p className="mb-3 font-medium text-slate-900">{qi + 1}. {q.question}</p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi;
                const isCorrect = q.correctIndex === oi;
                const showResult = submitted;
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => {
                      const next = [...answers];
                      next[qi] = oi;
                      setAnswers(next);
                    }}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                      showResult
                        ? isCorrect
                          ? 'border-emerald-300 bg-emerald-50'
                          : isSelected
                          ? 'border-rose-300 bg-rose-50'
                          : 'border-slate-200'
                        : isSelected
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                      showResult && isCorrect ? 'border-emerald-600 bg-emerald-600 text-white' :
                      showResult && isSelected && !isCorrect ? 'border-rose-600 bg-rose-600 text-white' :
                      isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-600'
                    }`}>
                      {showResult && isCorrect ? <CheckCircle2 size={14} /> :
                       showResult && isSelected && !isCorrect ? <XCircle size={14} /> :
                       String.fromCharCode(65 + oi)}
                    </span>
                    <span className="text-slate-700">{opt}</span>
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-medium">Explanation: </span>{q.explanation}
              </p>
            )}
          </div>
        ))}
        {submitted ? (
          <div className="flex flex-col items-start justify-between gap-3 rounded-lg bg-slate-50 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold text-slate-900">
                Score: {score} / {questions.length}
              </p>
              <p className={`text-sm ${score >= Math.ceil(questions.length * 0.7) ? 'text-emerald-600' : 'text-rose-600'}`}>
                {score >= Math.ceil(questions.length * 0.7) ? 'Passed!' : 'Keep trying — review the lesson and try again.'}
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Retry
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={answers.some((a) => a === -1)}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}

export default function LessonClient({ slug, lessonId }: { slug: string; lessonId: string }) {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [showCompleteToast, setShowCompleteToast] = useState(false);

  const course = dataStore.getCourseBySlug(slug);
  const lessons = course ? dataStore.getCourseLessons(course.id) : [];
  const currentIdx = lessons.findIndex((l) => l.lesson.id === lessonId);
  const current = currentIdx >= 0 ? lessons[currentIdx] : null;

  useEffect(() => {
    if (user && course) {
      let enr = dataStore.getEnrollment(user.id, course.id);
      if (!enr) {
        enr = dataStore.enroll(user.id, course.id);
      }
      setEnrolled(true);
    }
  }, [user, course]);

  if (!course || !current) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Lesson not found</h1>
        <Link href="/courses" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Back to Courses
        </Link>
      </div>
    );
  }

  const { lesson, module: currentModule } = current;
  const isCompleted = user && course
    ? dataStore.getEnrollment(user.id, course.id)?.completedLessons.includes(lesson.id)
    : false;

  const handleComplete = () => {
    if (!user || !course) return;
    dataStore.markLessonComplete(user.id, course.id, lesson.id);
    setEnrolled(true);
    setShowCompleteToast(true);
    setTimeout(() => setShowCompleteToast(false), 3000);
  };

  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/courses" className="hover:text-blue-600">Courses</Link>
        <span>/</span>
        <Link href={`/courses/${course.slug}`} className="hover:text-blue-600">{course.title}</Link>
        <span>/</span>
        <span className="text-slate-900">{currentModule.title}</span>
      </div>

      {/* Lesson Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {currentModule.title}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            <Clock size={12} /> {lesson.durationMinutes} min
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 size={12} /> Completed
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
      </div>

      {/* Lesson Content */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          {lesson.blocks.map((block, i) => (
            <LessonBlockRenderer key={i} block={block} />
          ))}
        </div>
      </div>

      {/* Completion Toast */}
      {showCompleteToast && (
        <div className="fixed bottom-6 right-6 z-50 fade-in">
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
            <CheckCircle2 size={18} /> Lesson completed!
          </div>
        </div>
      )}

      {/* Quiz */}
      {lesson.hasQuiz && enrolled && (
        <QuizComponent lessonId={lesson.id} onComplete={handleComplete} />
      )}

      {/* Mark Complete for lessons without quiz */}
      {!lesson.hasQuiz && enrolled && !isCompleted && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={24} />
            <div>
              <p className="font-semibold text-slate-900">Mark Lesson Complete</p>
              <p className="text-sm text-slate-500">Track your progress by marking this lesson as done.</p>
            </div>
          </div>
          <button
            onClick={handleComplete}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Mark Complete
          </button>
        </div>
      )}

      {/* Lab Link */}
      {lesson.hasLab && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <FlaskConical className="text-blue-600" size={24} />
            <div>
              <p className="font-semibold text-slate-900">Interactive Lab</p>
              <p className="text-sm text-slate-500">Practice what you learned in a hands-on lab.</p>
            </div>
          </div>
          <Link
            href={`/labs/${lesson.id}`}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Start Lab <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        {prevLesson ? (
          <Link
            href={`/courses/${course.slug}/lessons/${prevLesson.lesson.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={16} /> {prevLesson.lesson.title}
          </Link>
        ) : <div />}

        {nextLesson ? (
          <Link
            href={`/courses/${course.slug}/lessons/${nextLesson.lesson.id}`}
            onClick={handleComplete}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Complete & Continue <ArrowRight size={16} />
          </Link>
        ) : (
          <Link
            href={`/courses/${course.slug}`}
            onClick={handleComplete}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <CheckCircle2 size={16} /> Complete Course
          </Link>
        )}
      </div>
    </div>
  );
}
