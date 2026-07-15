import { demoUsers, demoCourses, demoQuizQuestions } from './demo-data';
import type {
  User,
  Course,
  QuizQuestion,
  Enrollment,
  QuizAttempt,
  Certificate,
  AuditEvent,
  LabAttempt,
} from './types';

const STORAGE_KEY = 'securelearn-state';

type AppState = {
  currentUserId: string | null;
  enrollments: Enrollment[];
  quizAttempts: QuizAttempt[];
  labAttempts: LabAttempt[];
  certificates: Certificate[];
  auditEvents: AuditEvent[];
};

const defaultState: AppState = {
  currentUserId: null,
  enrollments: [],
  quizAttempts: [],
  labAttempts: [],
  certificates: [],
  auditEvents: [],
};

function loadState(): AppState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const dataStore = {
  // Auth
  getCurrentUser(): User | null {
    const state = loadState();
    if (!state.currentUserId) return null;
    return demoUsers.find((u) => u.id === state.currentUserId) ?? null;
  },

  loginAs(userId: string): User {
    const state = loadState();
    const user = demoUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    saveState({ ...state, currentUserId: userId });
    this.recordAudit(userId, 'login', 'user', userId);
    return user;
  },

  logout(): void {
    const state = loadState();
    const userId = state.currentUserId;
    saveState({ ...state, currentUserId: null });
    if (userId) this.recordAudit(userId, 'logout', 'user', userId);
  },

  // Courses
  getAllCourses(): Course[] {
    return demoCourses.filter((c) => c.isPublished);
  },

  getCourseBySlug(slug: string): Course | null {
    return demoCourses.find((c) => c.slug === slug) ?? null;
  },

  getCourseById(id: string): Course | null {
    return demoCourses.find((c) => c.id === id) ?? null;
  },

  getCourseLessons(courseId: string): { lesson: import('./types').Lesson; module: import('./types').Module }[] {
    const course = demoCourses.find((c) => c.id === courseId);
    if (!course) return [];
    return course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({ lesson, module }))
    );
  },

  // Enrollments
  getEnrollment(userId: string, courseId: string): Enrollment | null {
    const state = loadState();
    return state.enrollments.find((e) => e.userId === userId && e.courseId === courseId) ?? null;
  },

  getUserEnrollments(userId: string): Enrollment[] {
    const state = loadState();
    return state.enrollments.filter((e) => e.userId === userId);
  },

  enroll(userId: string, courseId: string): Enrollment {
    const state = loadState();
    const existing = state.enrollments.find(
      (e) => e.userId === userId && e.courseId === courseId
    );
    if (existing) return existing;

    const lessons = this.getCourseLessons(courseId);
    const firstLessonId = lessons.length > 0 ? lessons[0].lesson.id : null;

    const enrollment: Enrollment = {
      id: genId('enr'),
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      completedLessons: [],
      currentLessonId: firstLessonId,
      progress: 0,
      status: 'active',
    };

    saveState({
      ...state,
      enrollments: [...state.enrollments, enrollment],
    });
    this.recordAudit(userId, 'enroll', 'course', courseId);
    return enrollment;
  },

  markLessonComplete(userId: string, courseId: string, lessonId: string): Enrollment | null {
    const state = loadState();
    const enrollment = state.enrollments.find(
      (e) => e.userId === userId && e.courseId === courseId
    );
    if (!enrollment) return null;

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const totalLessons = this.getCourseLessons(courseId).length;
    enrollment.progress = totalLessons > 0
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;

    const lessons = this.getCourseLessons(courseId);
    const currentIdx = lessons.findIndex((l) => l.lesson.id === lessonId);
    if (currentIdx >= 0 && currentIdx < lessons.length - 1) {
      enrollment.currentLessonId = lessons[currentIdx + 1].lesson.id;
    } else if (enrollment.progress === 100) {
      enrollment.status = 'completed';
      enrollment.currentLessonId = null;
      this.issueCertificate(userId, courseId);
    }

    saveState(state);
    this.recordAudit(userId, 'complete_lesson', 'lesson', lessonId);
    return enrollment;
  },

  // Quizzes
  getQuizQuestions(lessonId: string): QuizQuestion[] {
    return demoQuizQuestions.filter((q) => q.lessonId === lessonId);
  },

  submitQuizAttempt(
    userId: string,
    lessonId: string,
    answers: number[]
  ): QuizAttempt {
    const state = loadState();
    const questions = this.getQuizQuestions(lessonId);
    let score = 0;
    answers.forEach((answer, idx) => {
      if (questions[idx] && answer === questions[idx].correctIndex) score++;
    });

    const attempt: QuizAttempt = {
      id: genId('qa'),
      userId,
      lessonId,
      answers,
      score,
      maxScore: questions.length,
      passed: score >= Math.ceil(questions.length * 0.7),
      attemptedAt: new Date().toISOString(),
    };

    saveState({
      ...state,
      quizAttempts: [...state.quizAttempts, attempt],
    });
    this.recordAudit(userId, 'submit_quiz', 'lesson', lessonId, { score, maxScore: questions.length });
    return attempt;
  },

  getQuizAttempts(userId: string, lessonId: string): QuizAttempt[] {
    const state = loadState();
    return state.quizAttempts.filter(
      (a) => a.userId === userId && a.lessonId === lessonId
    );
  },

  // Labs
  submitLabAttempt(
    userId: string,
    lessonId: string,
    scenarioId: string,
    taskResults: import('./types').LabTaskResult[]
  ): LabAttempt {
    const state = loadState();
    const attempt: LabAttempt = {
      id: genId('la'),
      userId,
      lessonId,
      scenarioId,
      taskResults,
      completedAt: new Date().toISOString(),
    };
    saveState({
      ...state,
      labAttempts: [...state.labAttempts, attempt],
    });
    this.recordAudit(userId, 'submit_lab', 'lesson', lessonId, { scenarioId });
    return attempt;
  },

  // Certificates
  issueCertificate(userId: string, courseId: string): Certificate | null {
    const state = loadState();
    const existing = state.certificates.find(
      (c) => c.userId === userId && c.courseId === courseId
    );
    if (existing) return existing;

    const user = demoUsers.find((u) => u.id === userId);
    const course = demoCourses.find((c) => c.id === courseId);
    if (!user || !course) return null;

    const cert: Certificate = {
      id: genId('cert'),
      userId,
      courseId,
      courseTitle: course.title,
      userName: user.name,
      issuedAt: new Date().toISOString(),
      certificateNumber: `SL-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`,
    };

    saveState({
      ...state,
      certificates: [...state.certificates, cert],
    });
    this.recordAudit(userId, 'issue_certificate', 'course', courseId, { certificateNumber: cert.certificateNumber });
    return cert;
  },

  getCertificate(certificateNumber: string): Certificate | null {
    const state = loadState();
    return state.certificates.find((c) => c.certificateNumber === certificateNumber) ?? null;
  },

  getUserCertificates(userId: string): Certificate[] {
    const state = loadState();
    return state.certificates.filter((c) => c.userId === userId);
  },

  // Audit
  recordAudit(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    metadata?: Record<string, unknown>
  ): void {
    const state = loadState();
    const event: AuditEvent = {
      id: genId('audit'),
      userId,
      action,
      resource,
      resourceId,
      metadata,
      timestamp: new Date().toISOString(),
    };
    saveState({
      ...state,
      auditEvents: [...state.auditEvents, event],
    });
  },

  getAuditEvents(userId?: string): AuditEvent[] {
    const state = loadState();
    if (userId) return state.auditEvents.filter((e) => e.userId === userId);
    return state.auditEvents;
  },

  // Reset
  resetAllData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
