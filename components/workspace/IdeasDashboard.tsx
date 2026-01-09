'use client';

import { useWorkspace, type IdeaListItem } from '@/context/WorkspaceContext';
import { useState } from 'react';

export function IdeasDashboard() {
  const { ideas, isLoadingIdeas, selectIdea, createNewIdea } = useWorkspace();
  const [isCreating, setIsCreating] = useState(false);
  const [newIdeaText, setNewIdeaText] = useState('');

  const handleCreateIdea = async () => {
    setIsCreating(true);
    try {
      await createNewIdea();
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoadingIdeas) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-200 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-gradient-to-br from-blue-200 via-purple-200 to-pink-300 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Transform your ideas
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            Turn product ideas into actionable plans with AI
          </p>
        </div>

        {/* Create New Idea Card */}
        <div className="w-full max-w-2xl">
          <div className="rounded-2xl bg-white/80 p-4 shadow-xl backdrop-blur-sm dark:bg-zinc-900/80">
            <div className="mb-3">
              <textarea
                value={newIdeaText}
                onChange={(e) => setNewIdeaText(e.target.value)}
                placeholder="Describe your product idea..."
                className="w-full resize-none bg-transparent text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  Press create to start building your idea
                </span>
              </div>
              <button
                onClick={handleCreateIdea}
                disabled={isCreating}
                className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                {isCreating ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900" />
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
                Create
              </button>
            </div>
          </div>
        </div>

        {/* Existing Ideas */}
        {ideas && ideas.length > 0 && (
          <div className="mt-12 w-full max-w-4xl">
            <h2 className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Your Ideas
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ideas.map((idea) => (
                <IdeaCard key={idea._id} idea={idea} onSelect={() => selectIdea(idea._id)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function IdeaCard({ idea, onSelect }: { idea: IdeaListItem; onSelect: () => void }) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col rounded-xl bg-white/60 p-4 text-left backdrop-blur-sm transition-all hover:bg-white/80 hover:shadow-lg dark:bg-zinc-900/60 dark:hover:bg-zinc-900/80"
    >
      <h3 className="mb-1 font-medium text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
        {idea.name || 'Untitled Idea'}
      </h3>
      <p className="mb-3 line-clamp-2 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
        {idea.rawIdea || 'No description yet'}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {formatDate(idea.updatedAt)}
        </span>
        <svg
          className="h-4 w-4 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
