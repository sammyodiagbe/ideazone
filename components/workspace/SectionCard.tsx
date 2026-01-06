'use client';

import { type ReactNode } from 'react';
import { Card, Badge, SkeletonGroup, Button } from '@/components/ui';
import { useWorkspace } from '@/context/WorkspaceContext';
import type { SectionKey, SectionStatus } from '@/types/workspace';

interface SectionCardProps {
  sectionKey: SectionKey;
  number: number;
  title: string;
  children: ReactNode;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

const statusColors: Record<SectionStatus, string> = {
  empty: 'default',
  generating: 'warning',
  generated: 'success',
  edited: 'p1',
  error: 'error',
} as const;

const statusLabels: Record<SectionStatus, string> = {
  empty: 'Empty',
  generating: 'Generating...',
  generated: 'Generated',
  edited: 'Edited',
  error: 'Error',
};

export function SectionCard({
  sectionKey,
  number,
  title,
  children,
  onRegenerate,
  isRegenerating,
}: SectionCardProps) {
  const { workspace, toggleSectionExpanded, toggleSectionLocked } = useWorkspace();
  const section = workspace[sectionKey];

  const handleToggle = () => {
    if (section.status !== 'empty') {
      toggleSectionExpanded(sectionKey);
    }
  };

  const canExpand = section.status !== 'empty' && section.status !== 'error';

  return (
    <Card variant="outlined" className="overflow-hidden">
      <div
        role="button"
        tabIndex={canExpand ? 0 : -1}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        className={`flex w-full items-center justify-between p-4 text-left ${
          canExpand ? 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {number}
          </span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{title}</span>
          <Badge variant={statusColors[section.status] as 'default' | 'p0' | 'p1' | 'p2' | 'success' | 'warning' | 'error'}>
            {statusLabels[section.status]}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {section.status === 'generated' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleSectionLocked(sectionKey);
              }}
              title={section.isLocked ? 'Unlock section' : 'Lock section'}
            >
              {section.isLocked ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              )}
            </Button>
          )}
          {section.status === 'empty' && onRegenerate && (
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRegenerate();
              }}
              disabled={isRegenerating}
              isLoading={isRegenerating}
              title="Generate section"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="ml-1">Generate</span>
            </Button>
          )}
          {(section.status === 'generated' || section.status === 'error') && onRegenerate && (
            <Button
              variant={section.status === 'error' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRegenerate();
              }}
              disabled={section.isLocked || isRegenerating}
              isLoading={isRegenerating}
              title={section.status === 'error' ? 'Retry generation' : 'Regenerate section'}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {section.status === 'error' && <span className="ml-1">Retry</span>}
            </Button>
          )}
          <svg
            className={`h-5 w-5 text-zinc-400 transition-transform ${section.isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {section.isExpanded && (
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
          {section.status === 'generating' ? <SkeletonGroup lines={4} /> : children}
        </div>
      )}
    </Card>
  );
}
