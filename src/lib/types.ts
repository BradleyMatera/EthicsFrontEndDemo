export type UserRole = 'student' | 'instructor' | 'admin';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
};

export type LessonBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; code: string; caption?: string }
  | { type: 'callout'; variant: 'info' | 'warning' | 'danger' | 'success'; title: string; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'divider' };

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  order: number;
  durationMinutes: number;
  blocks: LessonBlock[];
  hasQuiz: boolean;
  hasLab: boolean;
};

export type Module = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructorId: string;
  thumbnailColor: string;
  estimatedHours: number;
  tags: string[];
  modules: Module[];
  isPublished: boolean;
};

export type QuizQuestion = {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type QuizAttempt = {
  id: string;
  userId: string;
  lessonId: string;
  answers: number[];
  score: number;
  maxScore: number;
  passed: boolean;
  attemptedAt: string;
};

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedLessons: string[];
  currentLessonId: string | null;
  progress: number;
  status: 'active' | 'completed';
};

export type LabTaskResult = {
  taskId: string;
  passed: boolean;
  feedback: string;
};

export type LabAttempt = {
  id: string;
  userId: string;
  lessonId: string;
  scenarioId: string;
  taskResults: LabTaskResult[];
  completedAt: string;
};

export type Certificate = {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  userName: string;
  issuedAt: string;
  certificateNumber: string;
};

export type AuditEvent = {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
};
