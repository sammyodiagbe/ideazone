'use client';

import { SectionCard } from './SectionCard';
import { Badge } from '@/components/ui';
import { useWorkspace } from '@/context/WorkspaceContext';
import type { Roadmap } from '@/types/workspace';

interface RoadmapSectionProps {
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function RoadmapSection({ onRegenerate, isRegenerating }: RoadmapSectionProps) {
  const { workspace } = useWorkspace();
  const content = workspace.roadmap.content as Roadmap | null;

  return (
    <SectionCard
      sectionKey="roadmap"
      number={4}
      title="Implementation Roadmap"
      onRegenerate={onRegenerate}
      isRegenerating={isRegenerating}
    >
      {content ? (
        <div className="space-y-6">
          <div className="space-y-4">
            {content.phases.map((phase) => (
              <div
                key={phase.number}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">
                    {phase.number}
                  </span>
                  <div>
                    <h5 className="font-medium text-zinc-900 dark:text-zinc-100">
                      {phase.name}
                    </h5>
                    <p className="text-sm text-zinc-500">{phase.goal}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-xs font-medium text-zinc-500">Features:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {phase.features.map((featureId, i) => (
                      <Badge key={i} variant="default">
                        {featureId}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded bg-green-50 px-3 py-2 dark:bg-green-900/20">
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">
                    Deliverable:
                  </span>
                  <p className="text-sm text-green-800 dark:text-green-300">
                    {phase.deliverable}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {content.dependencies.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">
                Key Dependencies
              </h4>
              <div className="space-y-2">
                {content.dependencies.map((dep, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <Badge variant="default">{dep.from}</Badge>
                    <span>→</span>
                    <Badge variant="default">{dep.to}</Badge>
                    <span className="text-zinc-500">({dep.reason})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-zinc-500">No content yet. Generate to see roadmap.</p>
      )}
    </SectionCard>
  );
}
