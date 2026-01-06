'use client';

import { SectionCard } from './SectionCard';
import { useWorkspace } from '@/context/WorkspaceContext';
import type { PRDContent } from '@/types/workspace';

interface PRDSectionProps {
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function PRDSection({ onRegenerate, isRegenerating }: PRDSectionProps) {
  const { workspace } = useWorkspace();
  const content = workspace.prd.content as PRDContent | null;

  return (
    <SectionCard
      sectionKey="prd"
      number={2}
      title="Product Requirements Document"
      onRegenerate={onRegenerate}
      isRegenerating={isRegenerating}
    >
      {content ? (
        <div className="space-y-6">
          <div>
            <h4 className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Overview
            </h4>
            <p className="whitespace-pre-wrap text-zinc-900 dark:text-zinc-100">
              {content.overview}
            </p>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Objectives
            </h4>
            <ul className="list-inside list-disc space-y-1 text-zinc-900 dark:text-zinc-100">
              {content.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
              User Stories
            </h4>
            <div className="space-y-4">
              {content.userStories.map((story, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                >
                  <p className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">
                    {story.persona}
                  </p>
                  <p className="mb-2 text-zinc-700 dark:text-zinc-300">{story.story}</p>
                  <div>
                    <span className="text-xs font-medium text-zinc-500">
                      Acceptance Criteria:
                    </span>
                    <ul className="mt-1 list-inside list-disc text-sm text-zinc-600 dark:text-zinc-400">
                      {story.acceptanceCriteria.map((ac, j) => (
                        <li key={j}>{ac}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Functional Requirements
            </h4>
            <ul className="list-inside list-disc space-y-1 text-zinc-900 dark:text-zinc-100">
              {content.functionalRequirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Non-Functional Requirements
            </h4>
            <ul className="list-inside list-disc space-y-1 text-zinc-900 dark:text-zinc-100">
              {content.nonFunctionalRequirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Out of Scope
            </h4>
            <ul className="list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
              {content.outOfScope.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-zinc-500">No content yet. Generate to see PRD.</p>
      )}
    </SectionCard>
  );
}
