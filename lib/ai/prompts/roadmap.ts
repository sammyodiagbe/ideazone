import type { GenerationSettings, ClarifiedIdea, MVPScope } from '@/types/workspace';

export function buildRoadmapPrompt(
  rawIdea: string,
  settings: GenerationSettings,
  clarifiedIdea: ClarifiedIdea,
  mvpScope: MVPScope
): string {
  const allFeatures = [
    ...mvpScope.p0Features,
    ...mvpScope.p1Features,
    ...mvpScope.p2Features,
  ];

  return `You are a technical architect creating an implementation roadmap.

## Context
**Product**: ${clarifiedIdea.summary}
**Problem**: ${clarifiedIdea.problem}

**Features to Implement**:
${allFeatures.map((f) => `- [${f.priority}] ${f.title}: ${f.description} (Effort: ${f.estimatedEffort})`).join('\n')}

**Technical Context**:
- Tech Stack: ${settings.techStack}
- Team Size: ${settings.teamSize}
- Complexity: ${settings.complexity}

## Output Format
Respond with a JSON object (no markdown, just pure JSON) with this exact structure:
{
  "phases": [
    {
      "number": 1,
      "name": "Phase name",
      "goal": "What this phase achieves",
      "features": ["feature_id1", "feature_id2"],
      "deliverable": "What's delivered at the end of this phase"
    }
  ],
  "dependencies": [
    {
      "from": "feature_id",
      "to": "feature_id",
      "reason": "Why this dependency exists"
    }
  ]
}

## Guidelines
- Create 3-4 phases for MVP implementation
- Phase 1 should focus on foundation and core P0 features
- Phase 2 should complete P0 and add high-priority P1 features
- Phase 3 should finish P1 and add selected P2 features
- Each phase should have a clear deliverable milestone
- Identify 3-6 key dependencies between features
- Consider technical dependencies (database before API, API before UI)
- Consider user flow dependencies (auth before user-specific features)

Respond only with the JSON object, no additional text.`;
}
