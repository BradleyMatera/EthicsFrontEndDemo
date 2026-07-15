'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Shield,
  Users,
  Award,
  FlaskConical,
  FileText,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';

const features = [
  { icon: BookOpen, title: 'Structured Curriculum', description: 'Modules and lessons built by security engineers with real-world experience.' },
  { icon: FlaskConical, title: 'Hands-On Labs', description: 'Interactive terminal labs that simulate real security scenarios.' },
  { icon: FileText, title: 'Knowledge Checks', description: 'Quizzes after each lesson reinforce learning and track progress.' },
  { icon: Award, title: 'Certificates', description: 'Earn verifiable certificates with unique verification numbers.' },
  { icon: Users, title: 'Role-Based', description: 'Student, instructor, and admin views for every perspective.' },
  { icon: TrendingUp, title: 'Progress Tracking', description: 'Dashboard with enrollments, completion, and activity history.' },
];

const steps = [
  { step: '1', icon: Users, title: 'Sign In', description: 'Pick a demo persona from the navbar. No registration needed.' },
  { step: '2', icon: BookOpen, title: 'Learn', description: 'Enroll and progress through lessons, quizzes, and labs.' },
  { step: '3', icon: Award, title: 'Earn Certificate', description: 'Complete the course to get a verifiable certificate.' },
];

const stats = [
  { label: 'Lessons', value: '6+' },
  { label: 'Labs', value: '2' },
  { label: 'Quizzes', value: '10' },
  { label: 'Certificates', value: 'Unlimited' },
];

export default function HomePage() {
  const { user } = useAuth();
  const courses = dataStore.getAllCourses();
  const course = courses[0];
  const lessonCount = course ? course.modules.reduce((acc, m) => acc + m.lessons.length, 0) : 0;

  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            Free Interactive LMS
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Master Secrets Management
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Learn why hardcoded secrets are dangerous, how to use environment variables, and when to adopt cloud secret stores.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {user ? 'Browse Courses' : 'Start Learning Free'}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/demos"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Try the Demos
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Everything You Need to Learn</h2>
          <p className="mt-2 text-slate-600">A complete learning experience built for developers.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <feature.icon size={22} />
              </div>
              <h3 className="font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-2 text-slate-600">Three simple steps to get started.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <item.icon size={28} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Course */}
      {course && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Featured Course</h2>
            <p className="mt-2 text-slate-600">Start with our comprehensive secrets management course.</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid md:grid-cols-2">
            <div className="flex items-center justify-center bg-blue-600 p-12">
              <Shield className="text-white" size={80} />
            </div>
            <div className="p-8">
              <div className="flex gap-2">
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 capitalize">
                  {course.level}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  {course.category}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-bold text-slate-900">{course.title}</h3>
              <p className="mt-1 text-slate-600">{course.subtitle}</p>
              <p className="mt-3 text-sm text-slate-500">{course.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-blue-600" />
                  {lessonCount} lessons across {course.modules.length} modules
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-blue-600" />
                  Hands-on labs and quizzes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-blue-600" />
                  Verifiable certificate
                </li>
              </ul>
              <Link
                href={`/courses/${course.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                View Course
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {!user && (
        <section className="bg-slate-900 py-16 text-center">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold text-white">Ready to Start?</h2>
            <p className="mt-2 text-slate-400">
              Use the Demo Login button in the navigation bar to sign in as a student, instructor, or admin.
            </p>
            <Link
              href="/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Browse Courses
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

