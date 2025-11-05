'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from '@nextui-org/react';
import { CheckCircle2, Command, Info, ListChecks, ListTodo, Terminal } from 'lucide-react';
import { LabScenario } from './types';

const COMMANDS = [
  'help',
  'ls',
  'cat <path>',
  'edit <path>',
  'status',
  'hint [task-id]',
  'validate',
  'reset',
  'clear',
];

type TerminalEntry = {
  id: string;
  kind: 'system' | 'command' | 'output';
  text: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
};

type EditorState = {
  open: boolean;
  path: string;
  value: string;
  readOnly?: boolean;
};

const cloneFileMap = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([key, value]) => [key, value]));

const makeId = () => Math.random().toString(36).slice(2, 10);

const formatList = (items: string[]) => (items.length === 0 ? '(empty)' : items.join('\n'));

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim();

export function LabConsole({ scenario }: { scenario: LabScenario }) {
  const initialFiles = useMemo(() => {
    const map: Record<string, string> = {};
    scenario.files.forEach((file) => {
      map[file.path] = file.initialContent;
    });
    return map;
  }, [scenario]);

  const fileMetadata = useMemo(() => {
    const map: Record<string, { label?: string; language?: string; readOnly?: boolean }> = {};
    scenario.files.forEach((file) => {
      map[file.path] = {
        label: file.label,
        language: file.language,
        readOnly: file.readOnly,
      };
    });
    return map;
  }, [scenario]);

  const [files, setFiles] = useState<Record<string, string>>(() => cloneFileMap(initialFiles));
  const [entries, setEntries] = useState<TerminalEntry[]>(() => [
    {
      id: makeId(),
      kind: 'system',
      text: `Welcome to the ${scenario.title}. Type 'help' to see available commands.`,
      tone: 'default',
    },
  ]);
  const [command, setCommand] = useState('');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [lastValidation, setLastValidation] = useState<'success' | 'failure' | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const terminalScrollRef = useRef<HTMLDivElement | null>(null);

  const taskStatuses = useMemo(
    () =>
      scenario.tasks.map((task) => {
        let complete = false;
        try {
          complete = task.validate(files);
        } catch (error) {
          console.error(`Lab task validation failed (${task.id}):`, error);
          complete = false;
        }
        return { ...task, complete };
      }),
    [files, scenario.tasks],
  );

  const incompleteTasks = taskStatuses.filter((task) => !task.complete);
  const allTasksComplete = taskStatuses.every((task) => task.complete);

  useEffect(() => {
    if (!terminalScrollRef.current) return;
    const container = terminalScrollRef.current;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [entries]);

  const appendEntry = useCallback((entry: Omit<TerminalEntry, 'id'>) => {
    setEntries((prev) => [...prev, { id: makeId(), ...entry }]);
  }, []);

  const resetLab = useCallback(() => {
    setFiles(cloneFileMap(initialFiles));
    setEntries([
      {
        id: makeId(),
        kind: 'system',
        text: `Workspace reset. Re-loading ${Object.keys(initialFiles).length} files.`,
      },
    ]);
    setCommand('');
    setEditor(null);
    setLastValidation(null);
    setCommandHistory([]);
    setHistoryIndex(null);
  }, [initialFiles]);

  const runValidation = useCallback(() => {
    if (allTasksComplete) {
      appendEntry({
        kind: 'system',
        text: `${scenario.success.title}\n${scenario.success.message}`,
        tone: 'success',
      });
      setLastValidation('success');
    } else {
      const lines = incompleteTasks.map((task, index) => `${index + 1}. ${task.title}`);
      appendEntry({
        kind: 'system',
        text:
          `${scenario.failure?.title ?? 'Not quite yet'}` +
          `\n${scenario.failure?.message ?? 'Finish the remaining checklist items before submitting.'}` +
          (lines.length ? `\n\nOutstanding tasks:\n${lines.join('\n')}` : ''),
        tone: 'warning',
      });
      setLastValidation('failure');
    }
  }, [allTasksComplete, appendEntry, incompleteTasks, scenario.failure, scenario.success]);

  const handleCommand = useCallback(
    (raw: string) => {
      const input = raw.trim();
      if (!input) return;

      appendEntry({ kind: 'command', text: `$ ${input}` });
      setCommandHistory((prev) => [...prev, input]);
      setHistoryIndex(null);

      const [commandName, ...commandArgs] = input.split(/\s+/);
      const arg = commandArgs.join(' ');

      switch (commandName.toLowerCase()) {
        case 'help': {
          appendEntry({
            kind: 'output',
            text: `Available commands:\n${COMMANDS.map((cmd) => `• ${cmd}`).join('\n')}`,
          });
          break;
        }
        case 'ls': {
          const fileList = Object.keys(files).sort();
          appendEntry({ kind: 'output', text: formatList(fileList) });
          break;
        }
        case 'cat':
        case 'view': {
          if (!arg) {
            appendEntry({ kind: 'output', text: 'Usage: cat <path>', tone: 'warning' });
            break;
          }
          const target = files[arg];
          if (target === undefined) {
            appendEntry({ kind: 'output', text: `File not found: ${arg}`, tone: 'danger' });
            break;
          }
          appendEntry({
            kind: 'output',
            text: `----- ${arg} -----\n${target}\n----- end -----`,
          });
          break;
        }
        case 'edit': {
          if (!arg) {
            appendEntry({ kind: 'output', text: 'Usage: edit <path>', tone: 'warning' });
            break;
          }
          const file = files[arg];
          if (file === undefined) {
            appendEntry({ kind: 'output', text: `File not found: ${arg}`, tone: 'danger' });
            break;
          }
          const metadata = fileMetadata[arg];
          if (metadata?.readOnly) {
            appendEntry({
              kind: 'output',
              text: `${arg} is read-only in this lab.`,
              tone: 'warning',
            });
            break;
          }
          setEditor({ open: true, path: arg, value: file, readOnly: metadata?.readOnly });
          appendEntry({ kind: 'output', text: `Opening editor for ${arg}...` });
          break;
        }
        case 'reset': {
          resetLab();
          break;
        }
        case 'status': {
          const statusLines = taskStatuses.map((task) => {
            const icon = task.complete ? '✅' : '⬜️';
            return `${icon} ${task.title}`;
          });
          appendEntry({
            kind: 'output',
            text: `Task progress:\n${statusLines.join('\n')}`,
          });
          break;
        }
        case 'hint': {
          if (commandArgs.length) {
            const task = taskStatuses.find((step) => step.id.toLowerCase() === arg.toLowerCase());
            if (!task) {
              appendEntry({ kind: 'output', text: `Unknown task id: ${arg}`, tone: 'warning' });
              break;
            }
            appendEntry({
              kind: 'output',
              text: task.hint ?? 'No hint available for this task. Review the description on the right.',
            });
          } else {
            if (incompleteTasks.length === 0) {
              appendEntry({ kind: 'output', text: 'All tasks complete. No hints necessary!', tone: 'success' });
            } else {
              const lines = incompleteTasks.map((task) => `• ${task.title}: ${task.hint ?? 'Review the task description.'}`);
              appendEntry({ kind: 'output', text: `Hints:\n${lines.join('\n')}` });
            }
          }
          break;
        }
        case 'validate':
        case 'submit': {
          runValidation();
          break;
        }
        case 'clear': {
          setEntries([]);
          break;
        }
        default: {
          appendEntry({
            kind: 'output',
            text: `Unknown command: ${commandName}. Type 'help' for the supported commands.`,
            tone: 'warning',
          });
        }
      }
    },
    [appendEntry, fileMetadata, files, incompleteTasks, resetLab, runValidation, taskStatuses],
  );

  const handleSubmit = useCallback(() => {
    if (!command.trim()) return;
    handleCommand(command);
    setCommand('');
  }, [command, handleCommand]);

  const handleEditorSave = useCallback(() => {
    if (!editor) return;
    setFiles((prev) => ({ ...prev, [editor.path]: editor.value }));
    appendEntry({ kind: 'output', text: `Saved ${editor.path}` });
    setEditor(null);
  }, [appendEntry, editor]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSubmit();
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHistoryIndex((prev) => {
          const newIndex = prev === null ? commandHistory.length - 1 : Math.max(prev - 1, 0);
          const historyValue = commandHistory[newIndex] ?? '';
          setCommand(historyValue);
          return newIndex;
        });
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHistoryIndex((prev) => {
          if (prev === null) return null;
          const newIndex = prev + 1;
          if (newIndex >= commandHistory.length) {
            setCommand('');
            return null;
          }
          const value = commandHistory[newIndex] ?? '';
          setCommand(value);
          return newIndex;
        });
      }
    },
    [commandHistory, handleSubmit],
  );

  useEffect(() => {
    if (!allTasksComplete || lastValidation === 'success') {
      return;
    }
    appendEntry({
      kind: 'system',
      text: '✅ All tasks satisfied. Run `validate` to record your success.',
      tone: 'success',
    });
    setLastValidation('success');
  }, [allTasksComplete, appendEntry, lastValidation]);

  return (
    <Card className="mb-12 border border-default-200">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="text-primary" size={22} />
          <div>
            <h2 className="text-lg font-semibold">{scenario.title}</h2>
            <p className="text-xs text-foreground-500">{scenario.description}</p>
          </div>
        </div>
        <Chip color={allTasksComplete ? 'success' : 'secondary'} variant="flat" startContent={<ListChecks size={14} />}>
          {`${taskStatuses.filter((task) => task.complete).length} of ${taskStatuses.length} tasks complete`}
        </Chip>
      </CardHeader>
      <CardBody className="space-y-6">
        {scenario.introSteps && scenario.introSteps.length > 0 && (
          <div className="rounded-lg border border-default-200 bg-content1/40 p-4 text-sm text-foreground-600">
            <p className="mb-2 font-semibold flex items-center gap-2"><Info size={16} /> Lab Briefing</p>
            <ul className="list-disc space-y-1 pl-5">
              {scenario.introSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {scenario.walkthroughSteps && scenario.walkthroughSteps.length > 0 && (
          <div className="rounded-lg border border-default-200 bg-content1/40 p-4 text-sm text-foreground-600">
            <p className="mb-2 font-semibold flex items-center gap-2"><ListTodo size={16} /> Step-by-step Walkthrough</p>
            <ol className="list-decimal space-y-1 pl-5">
              {scenario.walkthroughSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            <div className="rounded-lg border border-default-200 bg-black text-green-400">
              <div
                ref={terminalScrollRef}
                className="h-64 overflow-y-auto p-4 text-sm font-mono leading-relaxed"
              >
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={entry.tone === 'success'
                      ? 'text-green-300'
                      : entry.tone === 'warning'
                      ? 'text-yellow-300'
                      : entry.tone === 'danger'
                      ? 'text-red-300'
                      : undefined}
                  >
                    {entry.text}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-default-200 bg-zinc-900 p-3">
                <Command size={16} className="text-zinc-400" />
                <Input
                  aria-label="Lab command input"
                  className="flex-1"
                  variant="bordered"
                  value={command}
                  onValueChange={setCommand}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command (e.g. help, ls, edit src/service/payments.ts)"
                  size="sm"
                />
                <Button color="primary" size="sm" onPress={handleSubmit}>
                  Run
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-500">
              <span className="font-medium uppercase">Tips:</span>
              <Tooltip content="List available files" placement="bottom">
                <span>ls</span>
              </Tooltip>
              <Tooltip content="Preview a file" placement="bottom">
                <span>cat &lt;path&gt;</span>
              </Tooltip>
              <Tooltip content="Open the inline editor" placement="bottom">
                <span>edit &lt;path&gt;</span>
              </Tooltip>
              <Tooltip content="Check progress" placement="bottom">
                <span>status</span>
              </Tooltip>
              <Tooltip content="Ask for help" placement="bottom">
                <span>hint</span>
              </Tooltip>
              <Tooltip content="Validate your work" placement="bottom">
                <span>validate</span>
              </Tooltip>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-default-200 bg-content1/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide">Task Checklist</h3>
                <Button size="sm" color="primary" variant="solid" onPress={runValidation}>
                  Validate
                </Button>
              </div>
              <div className="space-y-3">
                {taskStatuses.map((task) => (
                  <div key={task.id} className="rounded border border-default-200 bg-content2/50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{task.title}</p>
                      <Chip
                        size="sm"
                        color={task.complete ? 'success' : 'secondary'}
                        variant="flat"
                        startContent={<CheckCircle2 size={12} />}
                      >
                        {task.complete ? 'Complete' : 'Pending'}
                      </Chip>
                    </div>
                    <p className="mt-2 text-xs text-foreground-500">{task.description}</p>
                    {task.hint && !task.complete && (
                      <p className="mt-2 text-xs text-foreground-400 italic">Hint: {task.hint}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {scenario.resources && scenario.resources.length > 0 && (
              <div className="rounded-lg border border-default-200 bg-content1/40 p-4 text-sm text-foreground-600">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide">Supporting Resources</h3>
                <ul className="list-disc space-y-1 pl-5">
                  {scenario.resources.map((resource) => (
                    <li key={resource.href}>
                      <a
                        href={resource.href}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {resource.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardBody>

      <Modal isOpen={!!editor?.open} onOpenChange={(open) => !open && setEditor(null)} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editing {editor?.path}
                {editor?.readOnly && <span className="text-xs text-danger">This file is read-only.</span>}
              </ModalHeader>
              <ModalBody>
                <Textarea
                  aria-label={`Editor for ${editor?.path ?? 'selected file'}`}
                  minRows={16}
                  value={editor?.value ?? ''}
                  onValueChange={(value) => editor && setEditor({ ...editor, value })}
                  isDisabled={editor?.readOnly}
                  className="font-mono"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleEditorSave} isDisabled={editor?.readOnly}>
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
}
