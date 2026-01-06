import type { GenerationSettings, ClarifiedIdea, MVPScope, Feature } from '@/types/workspace';

export function buildImplementationPrompt(
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

  return `You are a senior engineer creating detailed implementation prompts for AI-assisted development.

## Context
**Product**: ${clarifiedIdea.summary}
**Tech Stack**: ${settings.techStack}

**Features Needing Implementation Prompts**:
${allFeatures.map((f) => `
### ${f.id}: ${f.title}
- Description: ${f.description}
- Priority: ${f.priority}
- Effort: ${f.estimatedEffort}
- Acceptance Criteria: ${f.acceptanceCriteria.join('; ')}
- Dependencies: ${f.dependencies.length > 0 ? f.dependencies.join(', ') : 'None'}
`).join('\n')}

## Output Format
Respond with a JSON array of Feature objects (no markdown, just pure JSON) with updated implementationPrompt fields:
[
  {
    "id": "f1",
    "title": "Feature title",
    "description": "Original description",
    "priority": "P0",
    "acceptanceCriteria": ["criterion1", "criterion2"],
    "implementationPrompt": "Detailed implementation prompt here...",
    "estimatedEffort": "M",
    "dependencies": [],
    "phase": 1
  }
]

## Implementation Prompt Guidelines
Each implementationPrompt should be a detailed, actionable prompt that an AI coding assistant can use to implement the feature. Include:

1. **Clear objective**: What exactly needs to be built
2. **Technical approach**: Recommended patterns and architecture
3. **File structure**: Suggested files to create/modify
4. **Key implementation details**: Important considerations
5. **Testing requirements**: What tests to write
6. **Example code patterns**: If helpful

Make each prompt self-contained and specific to the tech stack (${settings.techStack}).

Respond only with the JSON array, no additional text.`;
}
