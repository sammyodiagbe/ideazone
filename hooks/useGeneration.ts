'use client';

import { useState, useCallback, useRef } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import type { SectionKey, ClarifiedIdea } from '@/types/workspace';
import type { GenerateResponse } from '@/types/api';

export function useGeneration() {
  const { workspace, setSectionStatus, setSectionContent } = useWorkspace();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionKey | null>(null);

  // Store generated content during a generateAll run (to avoid stale state issues)
  const generatedContentRef = useRef<Record<string, unknown>>({});

  const generateSection = useCallback(
    async (section: SectionKey, contextOverride?: Record<string, unknown>): Promise<{ success: boolean; data?: unknown }> => {
      setCurrentSection(section);
      setSectionStatus(section, 'generating');

      try {
        // Build context from workspace state and any override
        const context = contextOverride || getContext(workspace, section);

        const response = await fetch(`/api/generate/${sectionToEndpoint(section)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rawIdea: workspace.rawIdea,
            settings: workspace.generationSettings,
            context,
          }),
        });

        const result = (await response.json()) as GenerateResponse<unknown>;

        if (result.success && result.data) {
          setSectionContent(section, result.data as ClarifiedIdea);
          return { success: true, data: result.data };
        } else {
          setSectionStatus(section, 'error');
          console.error(`Generation failed for ${section}:`, result.error);
          return { success: false };
        }
      } catch (error) {
        setSectionStatus(section, 'error');
        console.error(`Generation error for ${section}:`, error);
        return { success: false };
      } finally {
        setCurrentSection(null);
      }
    },
    [workspace, setSectionStatus, setSectionContent]
  );

  const generateAll = useCallback(async () => {
    setIsGenerating(true);

    // Reset the generated content tracker
    generatedContentRef.current = {};

    // Define sections with their dependencies
    const sectionDeps: { section: SectionKey; requires: SectionKey[] }[] = [
      { section: 'clarifiedIdea', requires: [] },
      { section: 'prd', requires: ['clarifiedIdea'] },
      { section: 'mvpScope', requires: ['clarifiedIdea', 'prd'] },
      { section: 'competitors', requires: ['clarifiedIdea'] },
      { section: 'validation', requires: ['clarifiedIdea', 'competitors'] },
      { section: 'roadmap', requires: ['clarifiedIdea', 'mvpScope'] },
      { section: 'timeline', requires: ['clarifiedIdea', 'mvpScope', 'roadmap'] },
      { section: 'implementationPrompts', requires: ['clarifiedIdea', 'mvpScope'] },
    ];

    const failed = new Set<SectionKey>();
    const succeeded = new Set<SectionKey>();

    // Track sections that already have content (from previous runs)
    for (const { section } of sectionDeps) {
      if (workspace[section].content && workspace[section].status === 'generated') {
        succeeded.add(section);
        // Also add to generatedContentRef so context building works
        generatedContentRef.current[section] = workspace[section].content;
      }
    }

    try {
      for (const { section, requires } of sectionDeps) {
        // Skip locked sections
        if (workspace[section].isLocked) continue;

        // Skip already generated sections
        if (succeeded.has(section)) continue;

        // Check if any required section failed or is missing
        const missingDep = requires.find(
          (dep) => failed.has(dep) || (!succeeded.has(dep) && !workspace[dep].isLocked)
        );

        if (missingDep) {
          // Skip this section - dependency failed or missing
          console.log(`Skipping ${section}: dependency ${missingDep} failed or missing`);
          continue;
        }

        // Build context using our local tracker (which has freshly generated content)
        const context: Record<string, unknown> = {};
        for (const dep of requires) {
          if (generatedContentRef.current[dep]) {
            context[dep] = generatedContentRef.current[dep];
          }
        }

        const result = await generateSection(section, context);
        if (result.success && result.data) {
          succeeded.add(section);
          // Store the generated content for subsequent sections
          generatedContentRef.current[section] = result.data;
        } else {
          failed.add(section);
        }
      }
    } finally {
      setIsGenerating(false);
      generatedContentRef.current = {};
    }
  }, [generateSection, workspace]);

  const regenerateSection = useCallback(
    async (section: SectionKey): Promise<boolean> => {
      if (workspace[section].isLocked) return false;
      setIsGenerating(true);
      try {
        const result = await generateSection(section);
        return result.success;
      } finally {
        setIsGenerating(false);
      }
    },
    [generateSection, workspace]
  );

  return {
    isGenerating,
    currentSection,
    generateAll,
    regenerateSection,
  };
}

function sectionToEndpoint(section: SectionKey): string {
  const map: Record<SectionKey, string> = {
    clarifiedIdea: 'clarify',
    prd: 'prd',
    mvpScope: 'mvp-scope',
    competitors: 'competitors',
    validation: 'validation',
    roadmap: 'roadmap',
    timeline: 'timeline',
    implementationPrompts: 'prompts',
  };
  return map[section];
}

function getContext(
  workspace: ReturnType<typeof useWorkspace>['workspace'],
  section: SectionKey
): Record<string, unknown> {
  const context: Record<string, unknown> = {};
  const order: SectionKey[] = [
    'clarifiedIdea',
    'prd',
    'mvpScope',
    'competitors',
    'validation',
    'roadmap',
    'timeline',
    'implementationPrompts',
  ];

  const sectionIndex = order.indexOf(section);

  for (let i = 0; i < sectionIndex; i++) {
    const prevSection = order[i];
    if (workspace[prevSection].content) {
      context[prevSection] = workspace[prevSection].content;
    }
  }

  return context;
}
