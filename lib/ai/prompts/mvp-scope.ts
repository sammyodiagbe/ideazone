import type { GenerationSettings, ClarifiedIdea, PRDContent } from '@/types/workspace';

export function buildMVPScopePrompt(
  rawIdea: string,
  settings: GenerationSettings,
  clarifiedIdea: ClarifiedIdea,
  prd: PRDContent
): string {
  return `You are a product strategist defining MVP scope with clear prioritization.

## Context
**Raw Idea**: ${rawIdea}

**Clarified Idea**:
- Summary: ${clarifiedIdea.summary}
- Problem: ${clarifiedIdea.problem}
- Target Users: ${clarifiedIdea.targetUsers}

**PRD Overview**: ${prd.overview}

**Functional Requirements**:
${prd.functionalRequirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

**Technical Context**:
- Tech Stack: ${settings.techStack}
- Team Size: ${settings.teamSize}
- Complexity: ${settings.complexity}

## Output Format
Respond with a JSON object (no markdown, just pure JSON) with this exact structure:
{
  "p0Features": [
    {
      "id": "f1",
      "title": "Feature title",
      "description": "What this feature does",
      "priority": "P0",
      "acceptanceCriteria": ["criterion1", "criterion2"],
      "implementationPrompt": "",
      "estimatedEffort": "S|M|L|XL",
      "dependencies": [],
      "phase": 1
    }
  ],
  "p1Features": [...],
  "p2Features": [...],
  "rationale": "Explanation of prioritization decisions"
}

## Priority Definitions
- **P0 (Must Have)**: Core features required for MVP launch. Without these, the product cannot function.
- **P1 (Should Have)**: Important features that significantly enhance value but aren't blocking launch.
- **P2 (Nice to Have)**: Features that can wait for future versions.

## Guidelines
- Include 3-5 P0 features (absolute minimum for a working product)
- Include 4-6 P1 features
- Include 3-5 P2 features
- Effort: S (<1 day), M (1-3 days), L (3-7 days), XL (1-2 weeks)
- Leave implementationPrompt empty for now (will be filled later)
- Assign phase numbers (1, 2, or 3) based on natural build order

Respond only with the JSON object, no additional text.`;
}
