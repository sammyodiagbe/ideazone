import type { GenerationSettings, ClarifiedIdea, MVPScope, Roadmap } from '@/types/workspace';

export function buildTimelinePrompt(
  rawIdea: string,
  settings: GenerationSettings,
  clarifiedIdea: ClarifiedIdea,
  mvpScope: MVPScope,
  roadmap: Roadmap
): string {
  const allFeatures = [
    ...mvpScope.p0Features,
    ...mvpScope.p1Features,
    ...mvpScope.p2Features,
  ];

  return `You are a project manager creating a sprint-based delivery timeline.

## Context
**Product**: ${clarifiedIdea.summary}

**Features with Effort**:
${allFeatures.map((f) => `- ${f.title} (${f.estimatedEffort})`).join('\n')}

**Roadmap Phases**:
${roadmap.phases.map((p) => `Phase ${p.number} - ${p.name}: ${p.goal}`).join('\n')}

**Project Settings**:
- Team Size: ${settings.teamSize}
- Sprint Length: ${settings.sprintLength} week(s)
- Complexity: ${settings.complexity}

## Output Format
Respond with a JSON object (no markdown, just pure JSON) with this exact structure:
{
  "totalSprints": 6,
  "sprints": [
    {
      "number": 1,
      "goal": "Sprint goal",
      "features": ["feature_id1", "feature_id2"],
      "deliverables": ["deliverable1", "deliverable2"]
    }
  ],
  "milestones": [
    {
      "sprint": 2,
      "milestone": "Alpha release internally"
    }
  ]
}

## Team Velocity Guidelines
- Solo: 1-2 small features per sprint
- Small team: 2-4 features per sprint
- Medium team: 4-6 features per sprint
- Large team: 6-10 features per sprint

## Guidelines
- Plan for ${settings.sprintLength}-week sprints
- Estimate 4-8 sprints for a typical MVP
- Include buffer for testing and bug fixes
- Mark 3-4 key milestones (Alpha, Beta, MVP Launch, etc.)
- Front-load technical foundation work
- Save polish and optimization for later sprints
- Each sprint should have a clear, achievable goal

Respond only with the JSON object, no additional text.`;
}
