'use client';

import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type Dispatch,
} from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
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
  | { type: 'RESET_WORKSPACE' }
  | { type: 'SET_NAME'; payload: string };

export function createDefaultWorkspace(): Workspace {
  const now = new Date().toISOString();
  return {
    id: generateId('ws'),
    name: 'New Idea',
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

    case 'SET_NAME':
      return {
        ...state,
        name: action.payload,
        updatedAt: new Date().toISOString(),
      };

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

export interface IdeaListItem {
  _id: Id<'ideas'>;
  name: string;
  rawIdea: string;
  createdAt: number;
  updatedAt: number;
}

interface WorkspaceContextValue {
  workspace: Workspace;
  dispatch: Dispatch<WorkspaceAction>;
  selectedSection: SectionKey | null;
  setSelectedSection: (section: SectionKey | null) => void;
  setRawIdea: (idea: string) => void;
  setName: (name: string) => void;
  setSettings: (settings: Partial<GenerationSettings>) => void;
  setSectionStatus: (section: SectionKey, status: SectionStatus) => void;
  setSectionContent: (section: SectionKey, content: SectionContent) => void;
  toggleSectionExpanded: (section: SectionKey) => void;
  toggleSectionLocked: (section: SectionKey) => void;
  resetWorkspace: () => void;
  // Convex integration
  currentIdeaId: Id<'ideas'> | null;
  ideas: IdeaListItem[] | undefined;
  isLoadingIdeas: boolean;
  isSaving: boolean;
  selectIdea: (id: Id<'ideas'>) => void;
  createNewIdea: () => Promise<void>;
  deleteIdea: (id: Id<'ideas'>) => Promise<void>;
  saveCurrentIdea: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const SECTION_KEYS: SectionKey[] = [
  'clarifiedIdea',
  'prd',
  'mvpScope',
  'competitors',
  'validation',
  'roadmap',
  'timeline',
  'implementationPrompts',
];

function convertDbToWorkspace(
  dbIdea: {
    _id: Id<'ideas'>;
    name: string;
    rawIdea: string;
    clarifiedIdea?: string | null;
    prd?: string | null;
    mvpScope?: string | null;
    competitors?: string | null;
    validation?: string | null;
    roadmap?: string | null;
    timeline?: string | null;
    implementationPrompts?: string | null;
    generationSettings?: string | null;
    createdAt: number;
    updatedAt: number;
  }
): Workspace {
  const base = createDefaultWorkspace();

  const parseSection = <T,>(json: string | null | undefined): T | null => {
    if (!json) return null;
    try {
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  };

  const settings = parseSection<GenerationSettings>(dbIdea.generationSettings);

  return {
    ...base,
    id: dbIdea._id,
    name: dbIdea.name,
    rawIdea: dbIdea.rawIdea,
    clarifiedIdea: {
      ...base.clarifiedIdea,
      content: parseSection<ClarifiedIdea>(dbIdea.clarifiedIdea),
      status: dbIdea.clarifiedIdea ? 'generated' : 'empty',
    },
    prd: {
      ...base.prd,
      content: parseSection<PRDContent>(dbIdea.prd),
      status: dbIdea.prd ? 'generated' : 'empty',
    },
    mvpScope: {
      ...base.mvpScope,
      content: parseSection<MVPScope>(dbIdea.mvpScope),
      status: dbIdea.mvpScope ? 'generated' : 'empty',
    },
    competitors: {
      ...base.competitors,
      content: parseSection<CompetitorAnalysis>(dbIdea.competitors),
      status: dbIdea.competitors ? 'generated' : 'empty',
    },
    validation: {
      ...base.validation,
      content: parseSection<IdeaValidation>(dbIdea.validation),
      status: dbIdea.validation ? 'generated' : 'empty',
    },
    roadmap: {
      ...base.roadmap,
      content: parseSection<Roadmap>(dbIdea.roadmap),
      status: dbIdea.roadmap ? 'generated' : 'empty',
    },
    timeline: {
      ...base.timeline,
      content: parseSection<Timeline>(dbIdea.timeline),
      status: dbIdea.timeline ? 'generated' : 'empty',
    },
    implementationPrompts: {
      ...base.implementationPrompts,
      content: parseSection<Feature[]>(dbIdea.implementationPrompts),
      status: dbIdea.implementationPrompts ? 'generated' : 'empty',
    },
    generationSettings: settings ?? base.generationSettings,
    createdAt: new Date(dbIdea.createdAt).toISOString(),
    updatedAt: new Date(dbIdea.updatedAt).toISOString(),
  };
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, dispatch] = useReducer(workspaceReducer, null, createDefaultWorkspace);
  const [selectedSection, setSelectedSection] = useState<SectionKey | null>('clarifiedIdea');
  const [currentIdeaId, setCurrentIdeaId] = useState<Id<'ideas'> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  // Convex queries and mutations
  const ideas = useQuery(api.ideas.list);
  const currentIdea = useQuery(
    api.ideas.get,
    currentIdeaId ? { id: currentIdeaId } : 'skip'
  );
  const createIdea = useMutation(api.ideas.create);
  const updateIdea = useMutation(api.ideas.update);
  const removeIdea = useMutation(api.ideas.remove);

  // Load idea from DB when currentIdea changes
  useEffect(() => {
    if (currentIdea) {
      const ws = convertDbToWorkspace(currentIdea);
      dispatch({ type: 'SET_WORKSPACE', payload: ws });
      lastSavedRef.current = JSON.stringify(ws);
    }
  }, [currentIdea]);

  // Auto-select first idea on initial load
  useEffect(() => {
    if (ideas && ideas.length > 0 && !currentIdeaId) {
      setCurrentIdeaId(ideas[0]._id);
    }
  }, [ideas, currentIdeaId]);

  // Debounced save to Convex
  const saveToConvex = useCallback(async () => {
    if (!currentIdeaId) return;

    const currentState = JSON.stringify(workspace);
    if (currentState === lastSavedRef.current) return;

    setIsSaving(true);
    try {
      await updateIdea({
        id: currentIdeaId,
        name: workspace.name,
        rawIdea: workspace.rawIdea,
        clarifiedIdea: workspace.clarifiedIdea.content
          ? JSON.stringify(workspace.clarifiedIdea.content)
          : undefined,
        prd: workspace.prd.content
          ? JSON.stringify(workspace.prd.content)
          : undefined,
        mvpScope: workspace.mvpScope.content
          ? JSON.stringify(workspace.mvpScope.content)
          : undefined,
        competitors: workspace.competitors.content
          ? JSON.stringify(workspace.competitors.content)
          : undefined,
        validation: workspace.validation.content
          ? JSON.stringify(workspace.validation.content)
          : undefined,
        roadmap: workspace.roadmap.content
          ? JSON.stringify(workspace.roadmap.content)
          : undefined,
        timeline: workspace.timeline.content
          ? JSON.stringify(workspace.timeline.content)
          : undefined,
        implementationPrompts: workspace.implementationPrompts.content
          ? JSON.stringify(workspace.implementationPrompts.content)
          : undefined,
        generationSettings: JSON.stringify(workspace.generationSettings),
      });
      lastSavedRef.current = currentState;
    } catch (error) {
      console.error('Failed to save idea:', error);
    } finally {
      setIsSaving(false);
    }
  }, [currentIdeaId, workspace, updateIdea]);

  // Debounce saves
  useEffect(() => {
    if (!currentIdeaId) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToConvex();
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [workspace, currentIdeaId, saveToConvex]);

  const selectIdea = useCallback((id: Id<'ideas'>) => {
    // Save current idea before switching
    if (currentIdeaId && saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveToConvex();
    }
    setCurrentIdeaId(id);
  }, [currentIdeaId, saveToConvex]);

  const createNewIdea = useCallback(async () => {
    const newWorkspace = createDefaultWorkspace();
    const id = await createIdea({
      name: newWorkspace.name,
      rawIdea: newWorkspace.rawIdea,
      generationSettings: JSON.stringify(newWorkspace.generationSettings),
    });
    setCurrentIdeaId(id);
    dispatch({ type: 'RESET_WORKSPACE' });
  }, [createIdea]);

  const deleteIdea = useCallback(async (id: Id<'ideas'>) => {
    await removeIdea({ id });
    if (currentIdeaId === id) {
      setCurrentIdeaId(null);
      dispatch({ type: 'RESET_WORKSPACE' });
    }
  }, [removeIdea, currentIdeaId]);

  const value: WorkspaceContextValue = {
    workspace,
    dispatch,
    selectedSection,
    setSelectedSection,
    setRawIdea: (idea: string) => dispatch({ type: 'SET_RAW_IDEA', payload: idea }),
    setName: (name: string) => dispatch({ type: 'SET_NAME', payload: name }),
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
    // Convex integration
    currentIdeaId,
    ideas,
    isLoadingIdeas: ideas === undefined,
    isSaving,
    selectIdea,
    createNewIdea,
    deleteIdea,
    saveCurrentIdea: saveToConvex,
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
