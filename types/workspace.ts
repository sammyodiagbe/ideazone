export type Priority = 'P0' | 'P1' | 'P2';
export type SectionStatus = 'empty' | 'generating' | 'generated' | 'edited' | 'error';
export type Effort = 'S' | 'M' | 'L' | 'XL';
export type TeamSize = 'solo' | 'small' | 'medium' | 'large';
export type Complexity = 'simple' | 'moderate' | 'complex';

export interface Feature {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  acceptanceCriteria: string[];
  implementationPrompt: string;
  estimatedEffort: Effort;
  dependencies: string[];
  phase: number;
}

export interface ClarifiedIdea {
  summary: string;
  problem: string;
  targetUsers: string;
  proposedSolution: string;
  assumptions: string[];
  openQuestions: string[];
}

export interface PRDContent {
  overview: string;
  objectives: string[];
  userStories: Array<{
    persona: string;
    story: string;
    acceptanceCriteria: string[];
  }>;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  outOfScope: string[];
}

export interface MVPScope {
  p0Features: Feature[];
  p1Features: Feature[];
  p2Features: Feature[];
  rationale: string;
}

export interface Phase {
  number: number;
  name: string;
  goal: string;
  features: string[];
  deliverable: string;
}

export interface Roadmap {
  phases: Phase[];
  dependencies: Array<{
    from: string;
    to: string;
    reason: string;
  }>;
}

export interface Sprint {
  number: number;
  goal: string;
  features: string[];
  deliverables: string[];
}

export interface Timeline {
  totalSprints: number;
  sprints: Sprint[];
  milestones: Array<{
    sprint: number;
    milestone: string;
  }>;
}

export interface Competitor {
  name: string;
  website: string;
  description: string;
  targetAudience: string;
  keyFeatures: string[];
  pricing: string;
  strengths: string[];
  weaknesses: string[];
}

export interface CompetitorAnalysis {
  competitors: Competitor[];
  marketGaps: string[];
  differentiationOpportunities: string[];
  competitiveAdvantage: string;
}

export interface ValidationScore {
  category: string;
  score: number;
  maxScore: number;
  reasoning: string;
}

export interface MarketDataPoint {
  year: string;
  marketSize: number;
  projectedGrowth: number;
}

export interface CompetitivePosition {
  dimension: string;
  yourIdea: number;
  marketAverage: number;
}

export interface IdeaValidation {
  overallScore: number;
  verdict: 'Strong' | 'Promising' | 'Needs Work' | 'Risky';
  summary: string;
  validationScores: ValidationScore[];
  strengths: string[];
  weaknesses: string[];
  risks: Array<{
    risk: string;
    severity: 'High' | 'Medium' | 'Low';
    mitigation: string;
  }>;
  marketData: MarketDataPoint[];
  competitivePositioning: CompetitivePosition[];
  recommendations: string[];
  goToMarketScore: number;
  technicalFeasibilityScore: number;
  marketOpportunityScore: number;
}

export interface Section<T = string> {
  id: string;
  title: string;
  content: T;
  status: SectionStatus;
  lastGenerated?: string;
  isExpanded: boolean;
  isLocked: boolean;
}

export interface GenerationSettings {
  techStack: string;
  teamSize: TeamSize;
  sprintLength: number;
  complexity: Complexity;
}

export interface Workspace {
  id: string;
  name: string;
  rawIdea: string;
  clarifiedIdea: Section<ClarifiedIdea | null>;
  prd: Section<PRDContent | null>;
  mvpScope: Section<MVPScope | null>;
  competitors: Section<CompetitorAnalysis | null>;
  validation: Section<IdeaValidation | null>;
  roadmap: Section<Roadmap | null>;
  timeline: Section<Timeline | null>;
  implementationPrompts: Section<Feature[] | null>;
  generationSettings: GenerationSettings;
  createdAt: string;
  updatedAt: string;
}

export type SectionKey =
  | 'clarifiedIdea'
  | 'prd'
  | 'mvpScope'
  | 'competitors'
  | 'validation'
  | 'roadmap'
  | 'timeline'
  | 'implementationPrompts';

export const SECTION_ORDER: SectionKey[] = [
  'clarifiedIdea',
  'prd',
  'mvpScope',
  'competitors',
  'validation',
  'roadmap',
  'timeline',
  'implementationPrompts',
];

export const SECTION_TITLES: Record<SectionKey, string> = {
  clarifiedIdea: 'Clarified Idea',
  prd: 'Product Requirements Document',
  mvpScope: 'MVP Scope',
  competitors: 'Competitor Analysis',
  validation: 'Idea Validation',
  roadmap: 'Implementation Roadmap',
  timeline: 'Delivery Timeline',
  implementationPrompts: 'Implementation Prompts',
};
