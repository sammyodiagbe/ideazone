'use client';

import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
} from 'react';
import type {
  Workspace,
  SectionKey,
  SectionStatus,
  GenerationSettings,
  ClarifiedIdea,
  PRDContent,
  MVPScope,
  CompetitorAnalysis,
  IdeaValidation,
  Roadmap,
  Timeline,
  Feature,
} from '@/types/workspace';
import { generateId } from '@/lib/utils/id';

type SectionContent =
  | ClarifiedIdea
  | PRDContent
  | MVPScope
  | CompetitorAnalysis
  | IdeaValidation
  | Roadmap
  | Timeline
  | Feature[]
  | null;

type WorkspaceAction =
  | { type: 'SET_WORKSPACE'; payload: Workspace }
  | { type: 'SET_RAW_IDEA'; payload: string }
  | { type: 'SET_SETTINGS'; payload: Partial<GenerationSettings> }
  | { type: 'SET_SECTION_STATUS'; payload: { section: SectionKey; status: SectionStatus } }
  | { type: 'SET_SECTION_CONTENT'; payload: { section: SectionKey; content: SectionContent } }
  | { type: 'TOGGLE_SECTION_EXPANDED'; payload: SectionKey }
  | { type: 'TOGGLE_SECTION_LOCKED'; payload: SectionKey }
  | { type: 'SET_SELECTED_SECTION'; payload: SectionKey | null }
  | { type: 'RESET_WORKSPACE' };

interface UIState {
  selectedSection: SectionKey | null;
}

type UIAction = { type: 'SET_SELECTED_SECTION'; payload: SectionKey | null };

function createDefaultWorkspace(): Workspace {
  const now = new Date().toISOString();
  return {
    id: generateId('ws'),
    name: 'New Workspace',
    rawIdea: '',
    clarifiedIdea: {
      id: generateId('sec'),
      title: 'Clarified Idea',
      content: null,
      status: 'empty',
      isExpanded: true,
      isLocked: false,
    },
    prd: {
      id: generateId('sec'),
      title: 'Product Requirements Document',
      content: null,
      status: 'empty',
      isExpanded: false,
      isLocked: false,
    },
    mvpScope: {
      id: generateId('sec'),
      title: 'MVP Scope',
      content: null,
      status: 'empty',
      isExpanded: false,
      isLocked: false,
    },
    competitors: {
      id: generateId('sec'),
      title: 'Competitor Analysis',
      content: null,
      status: 'empty',
      isExpanded: false,
      isLocked: false,
    },
    validation: {
      id: generateId('sec'),
      title: 'Idea Validation',
      content: null,
      status: 'empty',
      isExpanded: false,
      isLocked: false,
    },
    roadmap: {
      id: generateId('sec'),
      title: 'Implementation Roadmap',
      content: null,
      status: 'empty',
      isExpanded: false,
      isLocked: false,
    },
    timeline: {
      id: generateId('sec'),
      title: 'Delivery Timeline',
      content: null,
      status: 'empty',
      isExpanded: false,
      isLocked: false,
    },
    implementationPrompts: {
      id: generateId('sec'),
      title: 'Implementation Prompts',
      content: null,
      status: 'empty',
      isExpanded: false,
      isLocked: false,
    },
    generationSettings: {
      techStack: 'React, Node.js, PostgreSQL',
      teamSize: 'small',
      sprintLength: 2,
      complexity: 'moderate',
    },
    createdAt: now,
    updatedAt: now,
  };
}

function workspaceReducer(state: Workspace, action: WorkspaceAction): Workspace {
  switch (action.type) {
    case 'SET_WORKSPACE':
      return action.payload;

    case 'SET_RAW_IDEA':
      return {
        ...state,
        rawIdea: action.payload,
        updatedAt: new Date().toISOString(),
      };

    case 'SET_SETTINGS':
      return {
        ...state,
        generationSettings: {
          ...state.generationSettings,
          ...action.payload,
        },
        updatedAt: new Date().toISOString(),
      };

    case 'SET_SECTION_STATUS':
      return {
        ...state,
        [action.payload.section]: {
          ...state[action.payload.section],
          status: action.payload.status,
        },
        updatedAt: new Date().toISOString(),
      };

    case 'SET_SECTION_CONTENT':
      return {
        ...state,
        [action.payload.section]: {
          ...state[action.payload.section],
          content: action.payload.content,
          status: 'generated' as SectionStatus,
          lastGenerated: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };

    case 'TOGGLE_SECTION_EXPANDED':
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          isExpanded: !state[action.payload].isExpanded,
        },
      };

    case 'TOGGLE_SECTION_LOCKED':
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          isLocked: !state[action.payload].isLocked,
        },
        updatedAt: new Date().toISOString(),
      };

    case 'RESET_WORKSPACE':
      return createDefaultWorkspace();

    default:
      return state;
  }
}

interface WorkspaceContextValue {
  workspace: Workspace;
  dispatch: Dispatch<WorkspaceAction>;
  selectedSection: SectionKey | null;
  setSelectedSection: (section: SectionKey | null) => void;
  setRawIdea: (idea: string) => void;
  setSettings: (settings: Partial<GenerationSettings>) => void;
  setSectionStatus: (section: SectionKey, status: SectionStatus) => void;
  setSectionContent: (section: SectionKey, content: SectionContent) => void;
  toggleSectionExpanded: (section: SectionKey) => void;
  toggleSectionLocked: (section: SectionKey) => void;
  resetWorkspace: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const STORAGE_KEY = 'ideazone_workspace';

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, dispatch] = useReducer(workspaceReducer, null, createDefaultWorkspace);
  const [selectedSection, setSelectedSection] = useState<SectionKey | null>('clarifiedIdea');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Workspace;
        dispatch({ type: 'SET_WORKSPACE', payload: parsed });
      } catch {
        // Invalid stored data, use default
      }
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  }, [workspace]);

  const value: WorkspaceContextValue = {
    workspace,
    dispatch,
    selectedSection,
    setSelectedSection,
    setRawIdea: (idea: string) => dispatch({ type: 'SET_RAW_IDEA', payload: idea }),
    setSettings: (settings: Partial<GenerationSettings>) =>
      dispatch({ type: 'SET_SETTINGS', payload: settings }),
    setSectionStatus: (section: SectionKey, status: SectionStatus) =>
      dispatch({ type: 'SET_SECTION_STATUS', payload: { section, status } }),
    setSectionContent: (section: SectionKey, content: SectionContent) =>
      dispatch({ type: 'SET_SECTION_CONTENT', payload: { section, content } }),
    toggleSectionExpanded: (section: SectionKey) =>
      dispatch({ type: 'TOGGLE_SECTION_EXPANDED', payload: section }),
    toggleSectionLocked: (section: SectionKey) =>
      dispatch({ type: 'TOGGLE_SECTION_LOCKED', payload: section }),
    resetWorkspace: () => dispatch({ type: 'RESET_WORKSPACE' }),
  };

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
