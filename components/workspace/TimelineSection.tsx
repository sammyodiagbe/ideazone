'use client';

import { SectionCard } from './SectionCard';
import { Badge } from '@/components/ui';
import { useWorkspace } from '@/context/WorkspaceContext';
import type { Timeline } from '@/types/workspace';

interface TimelineSectionProps {
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function TimelineSection({ onRegenerate, isRegenerating }: TimelineSectionProps) {
  const { workspace } = useWorkspace();
  const content = workspace.timeline.content as Timeline | null;

  return (
    <SectionCard
      sectionKey="timeline"
      number={5}
      title="Delivery Timeline"
      onRegenerate={onRegenerate}
      isRegenerating={isRegenerating}
    >
      {content ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-zinc-100 px-4 py-2 dark:bg-zinc-800">
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {content.totalSprints}
              </span>
              <span className="ml-1 text-sm text-zinc-500">sprints</span>
            </div>
            <div className="text-sm text-zinc-500">
              ({workspace.generationSettings.sprintLength} week sprints)
            </div>
          </div>

          <div className="space-y-4">
            {content.sprints.map((sprint) => {
              const milestone = content.milestones.find((m) => m.sprint === sprint.number);
              return (
                <div
                  key={sprint.number}
                  className="relative rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                >
                  {milestone && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="success">{milestone.milestone}</Badge>
                    </div>
                  )}

                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      S{sprint.number}
                    </span>
                    <h5 className="font-medium text-zinc-900 dark:text-zinc-100">
                      {sprint.goal}
                    </h5>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-medium text-zinc-500">Features:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {sprint.features.map((featureId, i) => (
                        <Badge key={i} variant="default">
                          {featureId}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-zinc-500">Deliverables:</span>
                    <ul className="mt-1 list-inside list-disc text-sm text-zinc-600 dark:text-zinc-400">
                      {sprint.deliverables.map((deliverable, i) => (
                        <li key={i}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Milestones
            </h4>
            <div className="flex flex-wrap gap-3">
              {content.milestones.map((milestone, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm dark:bg-green-900/30"
                >
                  <span className="font-medium text-green-700 dark:text-green-400">
                    Sprint {milestone.sprint}:
                  </span>
                  <span className="text-green-800 dark:text-green-300">
                    {milestone.milestone}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-zinc-500">No content yet. Generate to see timeline.</p>
      )}
    </SectionCard>
  );
}
