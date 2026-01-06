'use client';

import { useState } from 'react';
import { Button, Textarea, Card } from '@/components/ui';
import { useWorkspace } from '@/context/WorkspaceContext';
import type { TeamSize, Complexity } from '@/types/workspace';

interface IdeaInputProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

const TEAM_SIZES: { value: TeamSize; label: string }[] = [
  { value: 'solo', label: 'Solo' },
  { value: 'small', label: 'Small (2-4)' },
  { value: 'medium', label: 'Medium (5-10)' },
  { value: 'large', label: 'Large (10+)' },
];

const COMPLEXITIES: { value: Complexity; label: string }[] = [
  { value: 'simple', label: 'Simple' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'complex', label: 'Complex' },
];

export function IdeaInput({ onGenerate, isGenerating }: IdeaInputProps) {
  const { workspace, setRawIdea, setSettings } = useWorkspace();
  const [showSettings, setShowSettings] = useState(false);

  const canGenerate = workspace.rawIdea.trim().length > 10;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="idea-input"
            className="mb-2 block text-lg font-semibold text-zinc-900 dark:text-zinc-100"
          >
            What&apos;s your product idea?
          </label>
          <Textarea
            id="idea-input"
            value={workspace.rawIdea}
            onChange={(e) => setRawIdea(e.target.value)}
            placeholder="Describe your product idea in detail. What problem does it solve? Who is it for? What are the key features?"
            rows={5}
            className="resize-none"
          />
          <p className="mt-1.5 text-sm text-zinc-500">
            Be as detailed as possible for better results
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {showSettings ? 'Hide settings' : 'Show settings'}
          </button>

          {showSettings && (
            <div className="flex w-full flex-wrap gap-3 pt-2">
              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor="tech-stack"
                  className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Tech Stack
                </label>
                <input
                  id="tech-stack"
                  type="text"
                  value={workspace.generationSettings.techStack}
                  onChange={(e) => setSettings({ techStack: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>

              <div>
                <label
                  htmlFor="team-size"
                  className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Team Size
                </label>
                <select
                  id="team-size"
                  value={workspace.generationSettings.teamSize}
                  onChange={(e) => setSettings({ teamSize: e.target.value as TeamSize })}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                >
                  {TEAM_SIZES.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="sprint-length"
                  className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Sprint Length
                </label>
                <select
                  id="sprint-length"
                  value={workspace.generationSettings.sprintLength}
                  onChange={(e) => setSettings({ sprintLength: Number(e.target.value) })}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <option value={1}>1 week</option>
                  <option value={2}>2 weeks</option>
                  <option value={3}>3 weeks</option>
                  <option value={4}>4 weeks</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="complexity"
                  className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Complexity
                </label>
                <select
                  id="complexity"
                  value={workspace.generationSettings.complexity}
                  onChange={(e) => setSettings({ complexity: e.target.value as Complexity })}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                >
                  {COMPLEXITIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={onGenerate}
            disabled={!canGenerate || isGenerating}
            isLoading={isGenerating}
            size="lg"
          >
            {isGenerating ? 'Generating...' : 'Generate All Sections'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
