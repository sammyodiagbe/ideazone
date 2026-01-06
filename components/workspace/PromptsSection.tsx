'use client';

import { useState } from 'react';
import { SectionCard } from './SectionCard';
import { Badge, Button } from '@/components/ui';
import { useWorkspace } from '@/context/WorkspaceContext';
import type { Feature } from '@/types/workspace';

interface PromptsSectionProps {
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

function FeaturePromptCard({ feature }: { feature: Feature }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const priorityVariant = {
    P0: 'p0',
    P1: 'p1',
    P2: 'p2',
  } as const;

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(feature.implementationPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      >
        <div className="flex items-center gap-3">
          <Badge variant={priorityVariant[feature.priority]}>{feature.priority}</Badge>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {feature.title}
          </span>
        </div>
        <svg
          className={`h-5 w-5 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
          <div className="mb-3 flex items-center justify-between">
            <h5 className="text-sm font-medium text-zinc-500">Implementation Prompt</h5>
            <Button variant="ghost" size="sm" onClick={copyPrompt}>
              {copied ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="whitespace-pre-wrap rounded-lg bg-zinc-100 p-4 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            {feature.implementationPrompt}
          </pre>
        </div>
      )}
    </div>
  );
}

export function PromptsSection({ onRegenerate, isRegenerating }: PromptsSectionProps) {
  const { workspace } = useWorkspace();
  const content = workspace.implementationPrompts.content as Feature[] | null;

  return (
    <SectionCard
      sectionKey="implementationPrompts"
      number={6}
      title="Implementation Prompts"
      onRegenerate={onRegenerate}
      isRegenerating={isRegenerating}
    >
      {content && content.length > 0 ? (
        <div className="space-y-3">
          <p className="mb-4 text-sm text-zinc-500">
            Click on a feature to view and copy its AI-ready implementation prompt.
          </p>
          {content.map((feature) => (
            <FeaturePromptCard key={feature.id} feature={feature} />
          ))}
        </div>
      ) : (
        <p className="text-zinc-500">
          No content yet. Generate to see implementation prompts.
        </p>
      )}
    </SectionCard>
  );
}
