import { demoCourses } from '@/lib/demo-data';
import LessonClient from './ClientPage';

export function generateStaticParams() {
  return demoCourses.flatMap((course) =>
    course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        slug: course.slug,
        lessonId: lesson.id,
      }))
    )
  );
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params;
  return <LessonClient slug={slug} lessonId={lessonId} />;
}
