import { demoCourses } from '@/lib/demo-data';
import CourseDetailClient from './ClientPage';

export function generateStaticParams() {
  return demoCourses.map((course) => ({ slug: course.slug }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CourseDetailClient slug={slug} />;
}
