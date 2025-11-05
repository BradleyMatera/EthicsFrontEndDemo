export type LabFile = {
  path: string;
  label?: string;
  language?: string;
  readOnly?: boolean;
  initialContent: string;
};

export type LabTask = {
  id: string;
  title: string;
  description: string;
  hint?: string;
  validate: (files: Record<string, string>) => boolean;
};

export type LabScenario = {
  id: string;
  title: string;
  description: string;
  introSteps?: string[];
  files: LabFile[];
  tasks: LabTask[];
  success: {
    title: string;
    message: string;
  };
  failure?: {
    title: string;
    message: string;
  };
  resources?: { label: string; href: string }[];
};
