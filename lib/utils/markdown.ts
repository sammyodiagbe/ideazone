import type {
  Workspace,
  ClarifiedIdea,
  PRDContent,
  MVPScope,
  CompetitorAnalysis,
  IdeaValidation,
  Roadmap,
  Timeline,
  Feature,
  SectionKey,
} from '@/types/workspace';
import { SECTION_TITLES, SECTION_ORDER } from '@/types/workspace';

function formatClarifiedIdea(content: ClarifiedIdea): string {
  return `## Summary

${content.summary}

## Problem

${content.problem}

## Target Users

${content.targetUsers}

## Proposed Solution

${content.proposedSolution}

## Assumptions

${content.assumptions.map((a) => `- ${a}`).join('\n')}

## Open Questions

${content.openQuestions.map((q) => `- ${q}`).join('\n')}`;
}

function formatPRD(content: PRDContent): string {
  const userStoriesSection = content.userStories
    .map(
      (story) =>
        `### ${story.persona}

${story.story}

**Acceptance Criteria:**
${story.acceptanceCriteria.map((ac) => `- ${ac}`).join('\n')}`
    )
    .join('\n\n');

  return `## Overview

${content.overview}

## Objectives

${content.objectives.map((o) => `- ${o}`).join('\n')}

## User Stories

${userStoriesSection}

## Functional Requirements

${content.functionalRequirements.map((r) => `- ${r}`).join('\n')}

## Non-Functional Requirements

${content.nonFunctionalRequirements.map((r) => `- ${r}`).join('\n')}

## Out of Scope

${content.outOfScope.map((o) => `- ${o}`).join('\n')}`;
}

function formatFeature(feature: Feature): string {
  return `### ${feature.title} [${feature.priority}] - ${feature.estimatedEffort}

${feature.description}

**Acceptance Criteria:**
${feature.acceptanceCriteria.map((ac) => `- ${ac}`).join('\n')}
${feature.dependencies.length > 0 ? `\n**Dependencies:** ${feature.dependencies.join(', ')}` : ''}`;
}

function formatMVPScope(content: MVPScope): string {
  const p0 = content.p0Features.map(formatFeature).join('\n\n');
  const p1 = content.p1Features.map(formatFeature).join('\n\n');
  const p2 = content.p2Features.map(formatFeature).join('\n\n');

  return `## P0 - Must Have (${content.p0Features.length} features)

${p0}

## P1 - Should Have (${content.p1Features.length} features)

${p1}

## P2 - Nice to Have (${content.p2Features.length} features)

${p2}

## Prioritization Rationale

${content.rationale}`;
}

function formatCompetitorAnalysis(content: CompetitorAnalysis): string {
  const competitors = content.competitors
    .map(
      (comp) =>
        `### ${comp.name}

**Website:** [${comp.website}](${comp.website})

${comp.description}

**Target Audience:** ${comp.targetAudience}

**Key Features:** ${comp.keyFeatures.join(', ')}

**Pricing:** ${comp.pricing}

**Strengths:**
${comp.strengths.map((s) => `- ${s}`).join('\n')}

**Weaknesses:**
${comp.weaknesses.map((w) => `- ${w}`).join('\n')}`
    )
    .join('\n\n---\n\n');

  return `## Existing Competitors (${content.competitors.length})

${competitors}

## Market Gaps

${content.marketGaps.map((g) => `- ${g}`).join('\n')}

## Differentiation Opportunities

${content.differentiationOpportunities.map((o) => `- ${o}`).join('\n')}

## Your Competitive Advantage

${content.competitiveAdvantage}`;
}

function formatValidation(content: IdeaValidation): string {
  const validationScores = content.validationScores
    .map((s) => `| ${s.category} | ${s.score}/${s.maxScore} | ${s.reasoning} |`)
    .join('\n');

  const risks = content.risks
    .map((r) => `### ${r.risk} (${r.severity})\n\n**Mitigation:** ${r.mitigation}`)
    .join('\n\n');

  const marketData = content.marketData
    .map((d) => `| ${d.year} | $${d.marketSize}B | $${d.projectedGrowth}B |`)
    .join('\n');

  const positioning = content.competitivePositioning
    .map((p) => `| ${p.dimension} | ${p.yourIdea}/10 | ${p.marketAverage}/10 |`)
    .join('\n');

  return `## Overall Assessment

**Score:** ${content.overallScore}/100
**Verdict:** ${content.verdict}

${content.summary}

## Key Metrics

- **Go-to-Market Score:** ${content.goToMarketScore}%
- **Technical Feasibility:** ${content.technicalFeasibilityScore}%
- **Market Opportunity:** ${content.marketOpportunityScore}%

## Validation Breakdown

| Category | Score | Reasoning |
|----------|-------|-----------|
${validationScores}

## Strengths

${content.strengths.map((s) => `- ${s}`).join('\n')}

## Weaknesses

${content.weaknesses.map((w) => `- ${w}`).join('\n')}

## Risks & Mitigations

${risks}

## Market Growth Projection

| Year | Market Size | Projected Growth |
|------|-------------|------------------|
${marketData}

## Competitive Positioning

| Dimension | Your Idea | Market Average |
|-----------|-----------|----------------|
${positioning}

## Recommendations

${content.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
}

function formatRoadmap(content: Roadmap): string {
  const phases = content.phases
    .map(
      (phase) =>
        `### Phase ${phase.number}: ${phase.name}

**Goal:** ${phase.goal}

**Features:** ${phase.features.join(', ')}

**Deliverable:** ${phase.deliverable}`
    )
    .join('\n\n');

  const deps =
    content.dependencies.length > 0
      ? `## Key Dependencies

${content.dependencies.map((d) => `- ${d.from} → ${d.to}: ${d.reason}`).join('\n')}`
      : '';

  return `${phases}

${deps}`;
}

function formatTimeline(content: Timeline, sprintLength: number): string {
  const milestoneMap = new Map(content.milestones.map((m) => [m.sprint, m.milestone]));

  const sprints = content.sprints
    .map((sprint) => {
      const milestone = milestoneMap.get(sprint.number);
      return `### Sprint ${sprint.number}${milestone ? ` - ${milestone}` : ''}

**Goal:** ${sprint.goal}

**Features:** ${sprint.features.join(', ')}

**Deliverables:**
${sprint.deliverables.map((d) => `- ${d}`).join('\n')}`;
    })
    .join('\n\n');

  return `**Total Sprints:** ${content.totalSprints} (${sprintLength}-week sprints)

**Milestones:**
${content.milestones.map((m) => `- Sprint ${m.sprint}: ${m.milestone}`).join('\n')}

${sprints}`;
}

function formatImplementationPrompts(features: Feature[]): string {
  return features
    .map(
      (feature) =>
        `### ${feature.title} [${feature.priority}]

\`\`\`
${feature.implementationPrompt}
\`\`\``
    )
    .join('\n\n');
}

export function workspaceToMarkdown(workspace: Workspace): string {
  const sections: string[] = [];

  // Title
  sections.push(`# ${workspace.name || 'Product Idea'}\n`);

  // Raw idea
  if (workspace.rawIdea) {
    sections.push(`## Original Idea\n\n> ${workspace.rawIdea.replace(/\n/g, '\n> ')}\n`);
  }

  // Settings summary
  sections.push(
    `## Settings\n\n- **Tech Stack:** ${workspace.generationSettings.techStack}\n- **Team Size:** ${workspace.generationSettings.teamSize}\n- **Sprint Length:** ${workspace.generationSettings.sprintLength} weeks\n- **Complexity:** ${workspace.generationSettings.complexity}\n`
  );

  // Each section
  for (const sectionKey of SECTION_ORDER) {
    const section = workspace[sectionKey];
    if (section.status !== 'generated' || !section.content) continue;

    sections.push(`---\n\n# ${SECTION_TITLES[sectionKey]}\n`);

    switch (sectionKey) {
      case 'clarifiedIdea':
        sections.push(formatClarifiedIdea(section.content as ClarifiedIdea));
        break;
      case 'prd':
        sections.push(formatPRD(section.content as PRDContent));
        break;
      case 'mvpScope':
        sections.push(formatMVPScope(section.content as MVPScope));
        break;
      case 'competitors':
        sections.push(formatCompetitorAnalysis(section.content as CompetitorAnalysis));
        break;
      case 'validation':
        sections.push(formatValidation(section.content as IdeaValidation));
        break;
      case 'roadmap':
        sections.push(formatRoadmap(section.content as Roadmap));
        break;
      case 'timeline':
        sections.push(
          formatTimeline(section.content as Timeline, workspace.generationSettings.sprintLength)
        );
        break;
      case 'implementationPrompts':
        sections.push(formatImplementationPrompts(section.content as Feature[]));
        break;
    }
  }

  // Footer
  sections.push(`\n---\n\n*Generated with Idea Zone*`);

  return sections.join('\n\n');
}

export function sectionToMarkdown(
  sectionKey: SectionKey,
  workspace: Workspace
): string | null {
  const section = workspace[sectionKey];
  if (section.status !== 'generated' || !section.content) return null;

  let content = `# ${SECTION_TITLES[sectionKey]}\n\n`;

  switch (sectionKey) {
    case 'clarifiedIdea':
      content += formatClarifiedIdea(section.content as ClarifiedIdea);
      break;
    case 'prd':
      content += formatPRD(section.content as PRDContent);
      break;
    case 'mvpScope':
      content += formatMVPScope(section.content as MVPScope);
      break;
    case 'competitors':
      content += formatCompetitorAnalysis(section.content as CompetitorAnalysis);
      break;
    case 'validation':
      content += formatValidation(section.content as IdeaValidation);
      break;
    case 'roadmap':
      content += formatRoadmap(section.content as Roadmap);
      break;
    case 'timeline':
      content += formatTimeline(
        section.content as Timeline,
        workspace.generationSettings.sprintLength
      );
      break;
    case 'implementationPrompts':
      content += formatImplementationPrompts(section.content as Feature[]);
      break;
  }

  return content;
}
