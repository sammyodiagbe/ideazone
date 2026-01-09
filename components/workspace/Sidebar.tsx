'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Badge, Button, Textarea } from '@/components/ui';
import { useWorkspace, type IdeaListItem } from '@/context/WorkspaceContext';
import { useTheme } from '@/context/ThemeContext';
import { SECTION_ORDER, SECTION_TITLES } from '@/types/workspace';
import { IDEA_TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/templates';
import type { SectionKey, SectionStatus, TeamSize, Complexity } from '@/types/workspace';
import type { Id } from '@/convex/_generated/dataModel';

interface SidebarProps {
  onGenerate: () => void;
  onRegenerate: (section: SectionKey) => void;
  isGenerating: boolean;
  currentSection: SectionKey | null;
}

const statusColors: Record<SectionStatus, 'default' | 'p0' | 'p1' | 'p2' | 'success' | 'warning' | 'error'> = {
  empty: 'default',
  generating: 'warning',
  generated: 'success',
  edited: 'p1',
  error: 'error',
};

const statusLabels: Record<SectionStatus, string> = {
  empty: 'Empty',
  generating: '...',
  generated: 'Done',
  edited: 'Edited',
  error: 'Error',
};

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

export function Sidebar({ onGenerate, onRegenerate, isGenerating, currentSection }: SidebarProps) {
  const {
    workspace,
    selectedSection,
    setSelectedSection,
    setRawIdea,
    setName,
    setSettings,
    toggleSectionLocked,
    ideas,
    currentIdeaId,
    isLoadingIdeas,
    isSaving,
    selectIdea,
    clearCurrentIdea,
    createNewIdea,
    deleteIdea,
  } = useWorkspace();
  const { theme, resolvedTheme, setTheme, mounted } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showIdeasPanel, setShowIdeasPanel] = useState(false);
  const [isCreatingIdea, setIsCreatingIdea] = useState(false);
  const ideasPanelRef = useRef<HTMLDivElement>(null);

  // Click outside handler for ideas panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ideasPanelRef.current && !ideasPanelRef.current.contains(event.target as Node)) {
        setShowIdeasPanel(false);
      }
    };
    if (showIdeasPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showIdeasPanel]);

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const handleCreateNewIdea = useCallback(async () => {
    if (isCreatingIdea) return;
    setIsCreatingIdea(true);
    try {
      await createNewIdea();
      setShowIdeasPanel(false);
    } finally {
      setIsCreatingIdea(false);
    }
  }, [createNewIdea, isCreatingIdea]);

  // Note: We no longer auto-create - the dashboard handles empty state

  const handleDeleteIdea = async (id: Id<'ideas'>, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this idea?')) {
      await deleteIdea(id);
    }
  };

  const canGenerate = workspace.rawIdea.trim().length > 10 && currentIdeaId !== null;

  const filteredTemplates = selectedCategory
    ? IDEA_TEMPLATES.filter((t) => t.category === selectedCategory)
    : IDEA_TEMPLATES;

  const applyTemplate = (templateId: string) => {
    const template = IDEA_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setRawIdea(template.idea);
      setSettings({ techStack: template.suggestedTechStack });
      setShowTemplates(false);
    }
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCurrentIdea}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              title="Back to all ideas"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Idea Zone
              </h1>
              <span className="text-xs text-zinc-500">Transform ideas into action</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isSaving && (
              <span className="text-xs text-zinc-400">Saving...</span>
            )}
            <button
              type="button"
              onClick={cycleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              title={`Theme: ${theme}`}
            >
              {!mounted ? (
                <span className="h-5 w-5" />
              ) : resolvedTheme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Ideas Selector */}
      <div className="border-b border-zinc-200 p-3 dark:border-zinc-800">
        <div className="relative" ref={ideasPanelRef}>
          <button
            type="button"
            onClick={() => setShowIdeasPanel(!showIdeasPanel)}
            className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <div className="flex-1 min-w-0">
              <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {workspace.name || 'New Idea'}
              </span>
              <span className="block truncate text-xs text-zinc-500">
                {ideas?.length ?? 0} idea{(ideas?.length ?? 0) !== 1 ? 's' : ''}
              </span>
            </div>
            <svg
              className={`h-4 w-4 text-zinc-400 transition-transform ${showIdeasPanel ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showIdeasPanel && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
              <div className="p-2">
                <button
                  type="button"
                  onClick={handleCreateNewIdea}
                  disabled={isCreatingIdea}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  {isCreatingIdea ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                  New Idea
                </button>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-700">
                {isLoadingIdeas ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-500" />
                  </div>
                ) : ideas && ideas.length > 0 ? (
                  ideas.map((idea) => (
                    <button
                      key={idea._id}
                      type="button"
                      onClick={() => {
                        selectIdea(idea._id);
                        setShowIdeasPanel(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700 ${
                        currentIdeaId === idea._id ? 'bg-zinc-100 dark:bg-zinc-700' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {idea.name}
                        </span>
                        <span className="block truncate text-xs text-zinc-500">
                          {idea.rawIdea.slice(0, 50)}{idea.rawIdea.length > 50 ? '...' : ''}
                        </span>
                      </div>
                      {ideas.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteIdea(idea._id, e)}
                          className="ml-2 rounded p-1 text-zinc-400 transition-colors hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="py-4 text-center text-sm text-zinc-500">
                    No ideas yet. Create your first one!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Idea Name */}
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <label className="mb-1 block text-xs font-medium text-zinc-500">Idea Name</label>
        <input
          type="text"
          value={workspace.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name your idea..."
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
        />
      </div>

      {/* Idea Input */}
      <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Your Idea</span>
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Templates
          </button>
        </div>

        {showTemplates && (
          <div className="mb-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="mb-2 flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                  selectedCategory === null
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300'
                }`}
              >
                All
              </button>
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                    selectedCategory === cat
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="max-h-48 space-y-1.5 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplate(template.id)}
                  className="block w-full rounded-md border border-zinc-200 bg-white p-2 text-left transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-600 dark:bg-zinc-700 dark:hover:border-blue-500 dark:hover:bg-zinc-600"
                >
                  <span className="block text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {template.name}
                  </span>
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                    {template.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <Textarea
          value={workspace.rawIdea}
          onChange={(e) => setRawIdea(e.target.value)}
          placeholder="Describe your product idea..."
          rows={3}
          className="resize-none text-sm"
        />

        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
              showSettings
                ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100'
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {showSettings ? 'Hide Settings' : 'Settings'}
          </button>
          <Button
            onClick={onGenerate}
            disabled={!canGenerate || isGenerating}
            isLoading={isGenerating}
            size="sm"
          >
            Generate All
          </Button>
        </div>

        {showSettings && (
          <div className="mt-3 space-y-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Tech Stack
              </label>
              <input
                type="text"
                value={workspace.generationSettings.techStack}
                onChange={(e) => setSettings({ techStack: e.target.value })}
                className="w-full rounded border border-zinc-200 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                placeholder="React, Node.js..."
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Team
                </label>
                <select
                  value={workspace.generationSettings.teamSize}
                  onChange={(e) => setSettings({ teamSize: e.target.value as TeamSize })}
                  className="w-full rounded border border-zinc-200 bg-white px-1 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                >
                  {TEAM_SIZES.map((size) => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Sprint
                </label>
                <select
                  value={workspace.generationSettings.sprintLength}
                  onChange={(e) => setSettings({ sprintLength: Number(e.target.value) })}
                  className="w-full rounded border border-zinc-200 bg-white px-1 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <option value={1}>1 wk</option>
                  <option value={2}>2 wk</option>
                  <option value={3}>3 wk</option>
                  <option value={4}>4 wk</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Complexity
                </label>
                <select
                  value={workspace.generationSettings.complexity}
                  onChange={(e) => setSettings({ complexity: e.target.value as Complexity })}
                  className="w-full rounded border border-zinc-200 bg-white px-1 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                >
                  {COMPLEXITIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {(() => {
        const completedCount = SECTION_ORDER.filter(
          (key) => workspace[key].status === 'generated'
        ).length;
        const totalCount = SECTION_ORDER.length;
        const percentage = Math.round((completedCount / totalCount) * 100);

        if (completedCount === 0) return null;

        return (
          <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-600 dark:text-zinc-400">Progress</span>
              <span className="text-zinc-500">
                {completedCount}/{totalCount} sections
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            {completedCount === totalCount && (
              <p className="mt-1.5 text-xs text-green-600 dark:text-green-400">
                All sections complete!
              </p>
            )}
          </div>
        );
      })()}

      {/* Section Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {SECTION_ORDER.map((sectionKey, index) => {
            const section = workspace[sectionKey];
            const isSelected = selectedSection === sectionKey;
            const isGeneratingThis = currentSection === sectionKey;

            return (
              <button
                key={sectionKey}
                type="button"
                onClick={() => setSelectedSection(sectionKey)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  isSelected
                    ? 'bg-zinc-100 dark:bg-zinc-800'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`block truncate text-sm font-medium ${
                    isSelected
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-700 dark:text-zinc-300'
                  }`}>
                    {SECTION_TITLES[sectionKey]}
                  </span>
                </div>
                <Badge
                  variant={statusColors[section.status]}
                  className="flex-shrink-0 text-xs"
                >
                  {isGeneratingThis ? '...' : statusLabels[section.status]}
                </Badge>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
