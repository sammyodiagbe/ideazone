'use client';

import { useState } from 'react';
import { Badge, Button, SkeletonGroup } from '@/components/ui';
import { useWorkspace } from '@/context/WorkspaceContext';
import { SECTION_TITLES } from '@/types/workspace';
import { sectionToMarkdown, workspaceToMarkdown } from '@/lib/utils/markdown';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import type {
  SectionKey,
  SectionStatus,
  ClarifiedIdea,
  PRDContent,
  MVPScope,
  CompetitorAnalysis,
  Competitor,
  IdeaValidation,
  Roadmap,
  Timeline,
  Feature,
} from '@/types/workspace';

interface MainContentProps {
  onRegenerate: (section: SectionKey) => void;
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
  generating: 'Generating...',
  generated: 'Generated',
  edited: 'Edited',
  error: 'Error',
};

// Info card component for key-value displays
function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
      <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</h4>
      <div className="text-zinc-900 dark:text-zinc-100">{children}</div>
    </div>
  );
}

// Feature card component for MVP Scope
function FeatureCard({ feature }: { feature: Feature }) {
  const priorityVariant = { P0: 'p0', P1: 'p1', P2: 'p2' } as const;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h5 className="font-medium text-zinc-900 dark:text-zinc-100">{feature.title}</h5>
        <div className="flex flex-shrink-0 items-center gap-1">
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

// Feature prompt card for Implementation Prompts
function FeaturePromptCard({ feature }: { feature: Feature }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const priorityVariant = { P0: 'p0', P1: 'p1', P2: 'p2' } as const;

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(feature.implementationPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        <div className="flex items-center gap-3">
          <Badge variant={priorityVariant[feature.priority]}>{feature.priority}</Badge>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{feature.title}</span>
        </div>
        <svg
          className={`h-5 w-5 flex-shrink-0 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
          <div className="mb-3 flex items-center justify-between">
            <h5 className="text-sm font-medium text-zinc-500">Implementation Prompt</h5>
            <Button variant="ghost" size="sm" onClick={copyPrompt}>
              {copied ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="whitespace-pre-wrap rounded-lg bg-zinc-100 p-4 text-sm text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            {feature.implementationPrompt}
          </pre>
        </div>
      )}
    </div>
  );
}

// Content renderers for each section type
function ClarifiedIdeaContent({ content }: { content: ClarifiedIdea }) {
  return (
    <div className="space-y-6">
      {/* Summary - full width */}
      <InfoCard label="Summary">
        <p>{content.summary}</p>
      </InfoCard>

      {/* 2-column grid for key sections */}
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard label="Problem">
          <p>{content.problem}</p>
        </InfoCard>
        <InfoCard label="Target Users">
          <p>{content.targetUsers}</p>
        </InfoCard>
      </div>

      {/* Solution - full width */}
      <InfoCard label="Proposed Solution">
        <p>{content.proposedSolution}</p>
      </InfoCard>

      {/* 2-column grid for lists */}
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard label="Assumptions">
          <ul className="list-inside list-disc space-y-1">
            {content.assumptions.map((assumption, i) => (
              <li key={i}>{assumption}</li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard label="Open Questions">
          <ul className="list-inside list-disc space-y-1">
            {content.openQuestions.map((question, i) => (
              <li key={i}>{question}</li>
            ))}
          </ul>
        </InfoCard>
      </div>
    </div>
  );
}

function PRDSectionContent({ content }: { content: PRDContent }) {
  return (
    <div className="space-y-6">
      {/* Overview - full width */}
      <InfoCard label="Overview">
        <p className="whitespace-pre-wrap">{content.overview}</p>
      </InfoCard>

      {/* Objectives - full width */}
      <InfoCard label="Objectives">
        <ul className="list-inside list-disc space-y-1">
          {content.objectives.map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>
      </InfoCard>

      {/* User Stories - grid layout */}
      <div>
        <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">User Stories</h4>
        <div className="grid gap-4 lg:grid-cols-2">
          {content.userStories.map((story, i) => (
            <div key={i} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <p className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">{story.persona}</p>
              <p className="mb-3 text-sm text-zinc-700 dark:text-zinc-300">{story.story}</p>
              <div>
                <span className="text-xs font-medium text-zinc-500">Acceptance Criteria:</span>
                <ul className="mt-1 list-inside list-disc text-sm text-zinc-600 dark:text-zinc-400">
                  {story.acceptanceCriteria.map((ac, j) => (
                    <li key={j}>{ac}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements - 2 column grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard label="Functional Requirements">
          <ul className="list-inside list-disc space-y-1">
            {content.functionalRequirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard label="Non-Functional Requirements">
          <ul className="list-inside list-disc space-y-1">
            {content.nonFunctionalRequirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </InfoCard>
      </div>

      {/* Out of scope */}
      <InfoCard label="Out of Scope">
        <ul className="list-inside list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
          {content.outOfScope.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
}

function MVPScopeContent({ content }: { content: MVPScope }) {
  return (
    <div className="space-y-8">
      {/* P0 Features */}
      <div>
        <h4 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
          P0 - Must Have
          <Badge variant="p0">{content.p0Features.length}</Badge>
        </h4>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {content.p0Features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>

      {/* P1 Features */}
      <div>
        <h4 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
          P1 - Should Have
          <Badge variant="p1">{content.p1Features.length}</Badge>
        </h4>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {content.p1Features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>

      {/* P2 Features */}
      <div>
        <h4 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
          P2 - Nice to Have
          <Badge variant="p2">{content.p2Features.length}</Badge>
        </h4>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {content.p2Features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>

      {/* Rationale */}
      <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
        <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Prioritization Rationale</h4>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{content.rationale}</p>
      </div>
    </div>
  );
}

// Competitor card for the Competitor Analysis section
function CompetitorItemCard({ competitor }: { competitor: Competitor }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h5 className="font-medium text-zinc-900 dark:text-zinc-100">{competitor.name}</h5>
          <a
            href={competitor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            {competitor.website}
          </a>
        </div>
        <Badge variant="default">{competitor.pricing}</Badge>
      </div>

      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">{competitor.description}</p>

      <div className="mb-3">
        <span className="text-xs font-medium text-zinc-500">Target Audience:</span>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{competitor.targetAudience}</p>
      </div>

      <div className="mb-3">
        <span className="text-xs font-medium text-zinc-500">Key Features:</span>
        <div className="mt-1 flex flex-wrap gap-1">
          {competitor.keyFeatures.map((feature, i) => (
            <Badge key={i} variant="default">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs font-medium text-green-600 dark:text-green-400">Strengths:</span>
          <ul className="mt-1 list-inside list-disc text-sm text-zinc-600 dark:text-zinc-400">
            {competitor.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-xs font-medium text-red-600 dark:text-red-400">Weaknesses:</span>
          <ul className="mt-1 list-inside list-disc text-sm text-zinc-600 dark:text-zinc-400">
            {competitor.weaknesses.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CompetitorContent({ content }: { content: CompetitorAnalysis }) {
  return (
    <div className="space-y-6">
      {/* Competitors */}
      <div>
        <h4 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
          Existing Competitors
          <Badge variant="default">{content.competitors.length}</Badge>
        </h4>
        <div className="grid gap-4 lg:grid-cols-2">
          {content.competitors.map((competitor, index) => (
            <CompetitorItemCard key={index} competitor={competitor} />
          ))}
        </div>
      </div>

      {/* Market Gaps */}
      <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
        <h4 className="mb-2 text-sm font-medium text-amber-800 dark:text-amber-300">
          Market Gaps
        </h4>
        <ul className="list-inside list-disc text-sm text-amber-700 dark:text-amber-400">
          {content.marketGaps.map((gap, i) => (
            <li key={i}>{gap}</li>
          ))}
        </ul>
      </div>

      {/* Differentiation Opportunities */}
      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <h4 className="mb-2 text-sm font-medium text-blue-800 dark:text-blue-300">
          Differentiation Opportunities
        </h4>
        <ul className="list-inside list-disc text-sm text-blue-700 dark:text-blue-400">
          {content.differentiationOpportunities.map((opp, i) => (
            <li key={i}>{opp}</li>
          ))}
        </ul>
      </div>

      {/* Competitive Advantage */}
      <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
        <h4 className="mb-2 text-sm font-medium text-green-800 dark:text-green-300">
          Your Competitive Advantage
        </h4>
        <p className="text-sm text-green-700 dark:text-green-400">
          {content.competitiveAdvantage}
        </p>
      </div>
    </div>
  );
}

function ValidationContent({ content }: { content: IdeaValidation }) {
  const verdictColors = {
    Strong: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Promising: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Needs Work': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    Risky: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const severityColors = {
    High: 'error',
    Medium: 'warning',
    Low: 'default',
  } as const;

  return (
    <div className="space-y-6">
      {/* Overall Score Header */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Overall Score: {content.overallScore}/100
            </h3>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">{content.summary}</p>
          </div>
          <div className={`rounded-full px-4 py-2 text-lg font-semibold ${verdictColors[content.verdict]}`}>
            {content.verdict}
          </div>
        </div>

        {/* Score Bars */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Go-to-Market</span>
              <span className="font-medium">{content.goToMarketScore}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${content.goToMarketScore}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Technical Feasibility</span>
              <span className="font-medium">{content.technicalFeasibilityScore}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${content.technicalFeasibilityScore}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Market Opportunity</span>
              <span className="font-medium">{content.marketOpportunityScore}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-purple-500"
                style={{ width: `${content.marketOpportunityScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Validation Scores Chart */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <h4 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
          Validation Breakdown
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={content.validationScores} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis type="number" domain={[0, 10]} stroke="#6B7280" fontSize={12} />
              <YAxis dataKey="category" type="category" width={120} stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                }}
                formatter={(value) => [`${value}/10`, 'Score']}
              />
              <Bar dataKey="score" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Market Growth Chart */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h4 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
            Market Growth Projection (Billions USD)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={content.marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="year" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="marketSize"
                  name="Market Size"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="projectedGrowth"
                  name="Projected Growth"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competitive Positioning Radar */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h4 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
            Competitive Positioning
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={content.competitivePositioning}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="dimension" stroke="#6B7280" fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#6B7280" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                  }}
                />
                <Legend />
                <Radar
                  name="Your Idea"
                  dataKey="yourIdea"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.5}
                />
                <Radar
                  name="Market Average"
                  dataKey="marketAverage"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <h4 className="mb-3 text-sm font-medium text-green-800 dark:text-green-300">
            Strengths
          </h4>
          <ul className="space-y-2">
            {content.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <h4 className="mb-3 text-sm font-medium text-red-800 dark:text-red-300">
            Weaknesses
          </h4>
          <ul className="space-y-2">
            {content.weaknesses.map((weakness, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Risks */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <h4 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
          Risks & Mitigations
        </h4>
        <div className="space-y-3">
          {content.risks.map((risk, i) => (
            <div key={i} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{risk.risk}</p>
                <Badge variant={severityColors[risk.severity]}>{risk.severity}</Badge>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">Mitigation:</span> {risk.mitigation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <h4 className="mb-3 text-sm font-medium text-blue-800 dark:text-blue-300">
          Recommendations
        </h4>
        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-700 dark:text-blue-400">
          {content.recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function RoadmapContent({ content }: { content: Roadmap }) {
  return (
    <div className="space-y-6">
      {/* Phases - grid layout */}
      <div className="grid gap-4 lg:grid-cols-2">
        {content.phases.map((phase) => (
          <div key={phase.number} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">
                {phase.number}
              </span>
              <div className="min-w-0">
                <h5 className="font-medium text-zinc-900 dark:text-zinc-100">{phase.name}</h5>
                <p className="truncate text-sm text-zinc-500">{phase.goal}</p>
              </div>
            </div>
            <div className="mb-3">
              <span className="text-xs font-medium text-zinc-500">Features:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {phase.features.map((featureId, i) => (
                  <Badge key={i} variant="default">{featureId}</Badge>
                ))}
              </div>
            </div>
            <div className="rounded bg-green-50 px-3 py-2 dark:bg-green-900/20">
              <span className="text-xs font-medium text-green-700 dark:text-green-400">Deliverable:</span>
              <p className="text-sm text-green-800 dark:text-green-300">{phase.deliverable}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dependencies */}
      {content.dependencies.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">Key Dependencies</h4>
          <div className="flex flex-wrap gap-3">
            {content.dependencies.map((dep, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800">
                <Badge variant="default">{dep.from}</Badge>
                <span className="text-zinc-400">→</span>
                <Badge variant="default">{dep.to}</Badge>
                <span className="text-xs text-zinc-500">({dep.reason})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineContent({ content, sprintLength }: { content: Timeline; sprintLength: number }) {
  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="rounded-lg bg-zinc-100 px-4 py-2 dark:bg-zinc-800">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{content.totalSprints}</span>
          <span className="ml-1 text-sm text-zinc-500">sprints</span>
        </div>
        <div className="text-sm text-zinc-500">({sprintLength} week sprints)</div>
        <div className="flex flex-wrap gap-2">
          {content.milestones.map((milestone, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs dark:bg-green-900/30">
              <span className="font-medium text-green-700 dark:text-green-400">S{milestone.sprint}</span>
              <span className="text-green-800 dark:text-green-300">{milestone.milestone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sprints - grid layout */}
      <div className="grid gap-4 lg:grid-cols-2">
        {content.sprints.map((sprint) => {
          const milestone = content.milestones.find((m) => m.sprint === sprint.number);
          return (
            <div key={sprint.number} className="relative rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              {milestone && (
                <div className="absolute -top-2.5 right-4">
                  <Badge variant="success">{milestone.milestone}</Badge>
                </div>
              )}
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  S{sprint.number}
                </span>
                <h5 className="font-medium text-zinc-900 dark:text-zinc-100">{sprint.goal}</h5>
              </div>
              <div className="mb-3">
                <span className="text-xs font-medium text-zinc-500">Features:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {sprint.features.map((featureId, i) => (
                    <Badge key={i} variant="default">{featureId}</Badge>
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
    </div>
  );
}

function PromptsContent({ content }: { content: Feature[] }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">Click on a feature to view and copy its AI-ready implementation prompt.</p>
      <div className="grid gap-3 lg:grid-cols-2">
        {content.map((feature) => (
          <FeaturePromptCard key={feature.id} feature={feature} />
        ))}
      </div>
    </div>
  );
}

export function MainContent({ onRegenerate, currentSection }: MainContentProps) {
  const { workspace, selectedSection, toggleSectionLocked } = useWorkspace();
  const [exportCopied, setExportCopied] = useState<'section' | 'all' | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const copySection = async () => {
    const markdown = sectionToMarkdown(selectedSection!, workspace);
    if (markdown) {
      await navigator.clipboard.writeText(markdown);
      setExportCopied('section');
      setTimeout(() => setExportCopied(null), 2000);
    }
  };

  const copyAll = async () => {
    const markdown = workspaceToMarkdown(workspace);
    await navigator.clipboard.writeText(markdown);
    setExportCopied('all');
    setShowExportMenu(false);
    setTimeout(() => setExportCopied(null), 2000);
  };

  const downloadAll = () => {
    const markdown = workspaceToMarkdown(workspace);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workspace.name || 'idea-zone'}-export.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  if (!selectedSection) {
    return (
      <main className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center text-zinc-500">
          <p>Select a section from the sidebar to view its content</p>
        </div>
      </main>
    );
  }

  const section = workspace[selectedSection];
  const isGenerating = currentSection === selectedSection;

  const renderContent = () => {
    if (section.status === 'generating' || isGenerating) {
      return <SkeletonGroup lines={8} />;
    }

    if (section.status === 'empty' || !section.content) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
            <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="mb-4 text-zinc-500">No content yet for this section</p>
          <Button onClick={() => onRegenerate(selectedSection)}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate
          </Button>
        </div>
      );
    }

    if (section.status === 'error') {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/30">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="mb-4 text-red-600 dark:text-red-400">Failed to generate content</p>
          <Button variant="secondary" onClick={() => onRegenerate(selectedSection)}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </Button>
        </div>
      );
    }

    switch (selectedSection) {
      case 'clarifiedIdea':
        return <ClarifiedIdeaContent content={section.content as ClarifiedIdea} />;
      case 'prd':
        return <PRDSectionContent content={section.content as PRDContent} />;
      case 'mvpScope':
        return <MVPScopeContent content={section.content as MVPScope} />;
      case 'competitors':
        return <CompetitorContent content={section.content as CompetitorAnalysis} />;
      case 'validation':
        return <ValidationContent content={section.content as IdeaValidation} />;
      case 'roadmap':
        return <RoadmapContent content={section.content as Roadmap} />;
      case 'timeline':
        return <TimelineContent content={section.content as Timeline} sprintLength={workspace.generationSettings.sprintLength} />;
      case 'implementationPrompts':
        return <PromptsContent content={section.content as Feature[]} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {SECTION_TITLES[selectedSection]}
          </h2>
          <Badge variant={statusColors[section.status]}>{statusLabels[section.status]}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {/* Export buttons */}
          {section.status === 'generated' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={copySection}
                title="Copy this section as Markdown"
              >
                {exportCopied === 'section' ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-1">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="ml-1">Copy</span>
                  </>
                )}
              </Button>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  title="Export options"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="ml-1">Export</span>
                </Button>
                {showExportMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                    <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                      <button
                        type="button"
                        onClick={copyAll}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {exportCopied === 'all' ? 'Copied!' : 'Copy All as Markdown'}
                      </button>
                      <button
                        type="button"
                        onClick={downloadAll}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download as .md
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {section.status === 'generated' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSectionLocked(selectedSection)}
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
          {(section.status === 'generated' || section.status === 'error') && (
            <Button
              variant={section.status === 'error' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onRegenerate(selectedSection)}
              disabled={section.isLocked || isGenerating}
              isLoading={isGenerating}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="ml-1">{section.status === 'error' ? 'Retry' : 'Regenerate'}</span>
            </Button>
          )}
        </div>
      </header>

      {/* Content - removed max-w constraint for full width usage */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
