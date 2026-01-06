'use client';

import { SectionCard } from './SectionCard';
import { useWorkspace } from '@/context/WorkspaceContext';
import type { ClarifiedIdea } from '@/types/workspace';

interface ClarifiedIdeaSectionProps {
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function ClarifiedIdeaSection({ onRegenerate, isRegenerating }: ClarifiedIdeaSectionProps) {
  const { workspace } = useWorkspace();
  const content = workspace.clarifiedIdea.content as ClarifiedIdea | null;

  if (!content && workspace.clarifiedIdea.status === 'empty') {
    return (
      <SectionCard
        sectionKey="clarifiedIdea"
        number={1}
        title="Clarified Idea"
        onRegenerate={onRegenerate}
        isRegenerating={isRegenerating}
      >
        <p className="text-zinc-500">No content yet. Generate to see clarified idea.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      sectionKey="clarifiedIdea"
      number={1}
      title="Clarified Idea"
      onRegenerate={onRegenerate}
      isRegenerating={isRegenerating}
    >
      {content && (
        <div className="space-y-4">
          <div>
            <h4 className="mb-1 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Summary
            </h4>
            <p className="text-zinc-900 dark:text-zinc-100">{content.summary}</p>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Problem
            </h4>
            <p className="text-zinc-900 dark:text-zinc-100">{content.problem}</p>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Target Users
            </h4>
            <p className="text-zinc-900 dark:text-zinc-100">{content.targetUsers}</p>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Proposed Solution
            </h4>
            <p className="text-zinc-900 dark:text-zinc-100">{content.proposedSolution}</p>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Assumptions
            </h4>
            <ul className="list-inside list-disc space-y-1 text-zinc-900 dark:text-zinc-100">
              {content.assumptions.map((assumption, i) => (
                <li key={i}>{assumption}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Open Questions
            </h4>
            <ul className="list-inside list-disc space-y-1 text-zinc-900 dark:text-zinc-100">
              {content.openQuestions.map((question, i) => (
                <li key={i}>{question}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
