'use client';

import { SectionCard } from './SectionCard';
import { Badge } from '@/components/ui';
import { useWorkspace } from '@/context/WorkspaceContext';
import type { MVPScope, Feature } from '@/types/workspace';

interface MVPScopeSectionProps {
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

function FeatureCard({ feature }: { feature: Feature }) {
  const priorityVariant = {
    P0: 'p0',
    P1: 'p1',
    P2: 'p2',
  } as const;

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
      <div className="mb-2 flex items-center justify-between">
        <h5 className="font-medium text-zinc-900 dark:text-zinc-100">{feature.title}</h5>
        <div className="flex items-center gap-2">
          <Badge variant={priorityVariant[feature.priority]}>{feature.priority}</Badge>
          <Badge variant="default">{feature.estimatedEffort}</Badge>
        </div>
      </div>
      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">{feature.description}</p>
      <div>
        <span className="text-xs font-medium text-zinc-500">Acceptance Criteria:</span>
        <ul className="mt-1 list-inside list-disc text-sm text-zinc-600 dark:text-zinc-400">
          {feature.acceptanceCriteria.map((ac, i) => (
            <li key={i}>{ac}</li>
          ))}
        </ul>
      </div>
      {feature.dependencies.length > 0 && (
        <div className="mt-2">
          <span className="text-xs font-medium text-zinc-500">Dependencies: </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {feature.dependencies.join(', ')}
          </span>
        </div>
      )}
    </div>
  );
}

export function MVPScopeSection({ onRegenerate, isRegenerating }: MVPScopeSectionProps) {
  const { workspace } = useWorkspace();
  const content = workspace.mvpScope.content as MVPScope | null;

  return (
    <SectionCard
      sectionKey="mvpScope"
      number={3}
      title="MVP Scope"
      onRegenerate={onRegenerate}
      isRegenerating={isRegenerating}
    >
      {content ? (
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
              P0 - Must Have
              <Badge variant="p0">{content.p0Features.length}</Badge>
            </h4>
            <div className="space-y-3">
              {content.p0Features.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
              P1 - Should Have
              <Badge variant="p1">{content.p1Features.length}</Badge>
            </h4>
            <div className="space-y-3">
              {content.p1Features.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
              P2 - Nice to Have
              <Badge variant="p2">{content.p2Features.length}</Badge>
            </h4>
            <div className="space-y-3">
              {content.p2Features.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
            <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Prioritization Rationale
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{content.rationale}</p>
          </div>
        </div>
      ) : (
        <p className="text-zinc-500">No content yet. Generate to see MVP scope.</p>
      )}
    </SectionCard>
  );
}
