import LabClient from './ClientPage';
import { hardcodedSecretsScenario, environmentVariablesScenario } from '@/components/labs/scenarios';
import type { LabScenario } from '@/components/labs/types';

const lessonLabMap: Record<string, LabScenario> = {
  'l-002': hardcodedSecretsScenario,
  'l-003': environmentVariablesScenario,
};

export function generateStaticParams() {
  return Object.keys(lessonLabMap).map((lessonId) => ({ lessonId }));
}

export default async function LabPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <LabClient lessonId={lessonId} />;
}
