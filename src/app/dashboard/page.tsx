'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Award, TrendingUp, CheckCircle2, FileText, FlaskConical, ArrowRight, Users, ShieldCheck, Activity } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/data-store';
import { demoUsers } from '@/lib/demo-data';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  const enrollments = useMemo(() => {
    if (!user) return [];
    return dataStore.getUserEnrollments(user.id);
  }, [user]);

  const certificates = useMemo(() => {
    if (!user) return [];
    return dataStore.getUserCertificates(user.id);
  }, [user]);

  const auditEvents = useMemo(() => {
    if (!user) return [];
    if (user.role === 'admin') return dataStore.getAuditEvents().slice(-15).reverse();
    return dataStore.getAuditEvents(user.id).slice(-10).reverse();
  }, [user]);

  const allCourses = useMemo(() => dataStore.getAllCourses(), []);

  const instructorCourses = useMemo(() => {
    if (!user || user.role !== 'instructor') return [];
    return allCourses.filter((c) => c.instructorId === user.id);
  }, [user, allCourses]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <BookOpen className="mx-auto mb-4 text-slate-300" size={48} />
        <h1 className="text-2xl font-bold text-slate-900">Welcome to SecureLearn</h1>
        <p className="mt-2 text-slate-600">Use the Demo Login button to sign in and access your dashboard.</p>
        <Link href="/courses" className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Browse Courses
        </Link>
      </div>
    );
  }

  const totalLessons = enrollments.reduce((acc, e) => {
    const lessons = dataStore.getCourseLessons(e.courseId);
    return acc + lessons.length;
  }, 0);
  const completedLessons = enrollments.reduce((acc, e) => acc + e.completedLessons.length, 0);

  const roleBadge = (role: string) => {
    if (role === 'admin') return 'bg-slate-800 text-white';
    if (role === 'instructor') return 'bg-indigo-100 text-indigo-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${roleBadge(user.role)}`}>
            {user.role}
          </span>
        </div>
        <p className="mt-1 text-slate-600">Welcome back, {user.name}.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BookOpen, label: 'Enrolled Courses', value: enrollments.length, color: 'bg-blue-50 text-blue-600' },
          { icon: CheckCircle2, label: 'Lessons Completed', value: completedLessons, color: 'bg-emerald-50 text-emerald-600' },
          { icon: TrendingUp, label: 'Overall Progress', value: `${totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}%`, color: 'bg-indigo-50 text-indigo-600' },
          { icon: Award, label: 'Certificates', value: certificates.length, color: 'bg-amber-50 text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
            <div className={`rounded-lg p-3 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Instructor Section */}
      {user.role === 'instructor' && instructorCourses.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Your Teaching Courses</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {instructorCourses.map((course) => {
              const lessonCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
              return (
                <div key={course.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900">{course.title}</h3>
                  <p className="text-sm text-slate-500">{course.subtitle}</p>
                  <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><BookOpen size={14} /> {lessonCount} lessons</span>
                    <span className="flex items-center gap-1"><Users size={14} /> {course.modules.length} modules</span>
                  </div>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="mt-3 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View Course <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin Section */}
      {user.role === 'admin' && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Platform Overview</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Users, label: 'Total Users', value: demoUsers.length, color: 'bg-blue-50 text-blue-600' },
              { icon: BookOpen, label: 'Published Courses', value: allCourses.length, color: 'bg-indigo-50 text-indigo-600' },
              { icon: Activity, label: 'Audit Events', value: dataStore.getAuditEvents().length, color: 'bg-amber-50 text-amber-600' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <ShieldCheck size={20} /> Registered Users
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {demoUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${roleBadge(u.role)}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enrolled Courses */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Your Courses</h2>
        {enrollments.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">You haven&apos;t enrolled in any courses yet.</p>
            <Link href="/courses" className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {enrollments.map((enr) => {
              const course = dataStore.getCourseById(enr.courseId);
              if (!course) return null;
              const lessons = dataStore.getCourseLessons(course.id);
              return (
                <div key={enr.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{course.title}</h3>
                    {enr.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        <CheckCircle2 size={14} /> Completed
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        {enr.progress}%
                      </span>
                    )}
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${enr.progress}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {enr.completedLessons.length} of {lessons.length} lessons
                  </p>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="mt-3 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {enr.status === 'completed' ? 'Review Course' : 'Continue'} <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Certificates</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                  <Award size={28} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{cert.courseTitle}</p>
                  <p className="text-sm text-slate-500">{cert.certificateNumber}</p>
                  <p className="text-xs text-slate-400">
                    Issued {new Date(cert.issuedAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/certificates/${cert.certificateNumber}`}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Recent Activity</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          {auditEvents.length === 0 ? (
            <p className="text-sm text-slate-500">No recent activity.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {auditEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 border-b border-slate-100 py-2 last:border-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    {event.action.includes('quiz') ? <FileText size={14} /> :
                     event.action.includes('lab') ? <FlaskConical size={14} /> :
                     event.action.includes('certificate') ? <Award size={14} /> :
                     <BookOpen size={14} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{event.action.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
