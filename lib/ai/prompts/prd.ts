import type { GenerationSettings, ClarifiedIdea } from '@/types/workspace';

export function buildPRDPrompt(
  rawIdea: string,
  settings: GenerationSettings,
  clarifiedIdea: ClarifiedIdea
): string {
  return `You are a product manager creating a comprehensive PRD (Product Requirements Document).

## Context
**Raw Idea**: ${rawIdea}

**Clarified Idea**:
- Summary: ${clarifiedIdea.summary}
- Problem: ${clarifiedIdea.problem}
- Target Users: ${clarifiedIdea.targetUsers}
- Proposed Solution: ${clarifiedIdea.proposedSolution}
- Assumptions: ${clarifiedIdea.assumptions.join(', ')}

**Technical Context**:
- Tech Stack: ${settings.techStack}
- Team Size: ${settings.teamSize}
- Complexity: ${settings.complexity}

## Output Format
Respond with a JSON object (no markdown, just pure JSON) with this exact structure:
{
  "overview": "A comprehensive overview of the product (2-3 paragraphs)",
  "objectives": ["objective1", "objective2", "..."],
  "userStories": [
    {
      "persona": "User persona name",
      "story": "As a [persona], I want [feature] so that [benefit]",
      "acceptanceCriteria": ["criterion1", "criterion2"]
    }
  ],
  "functionalRequirements": ["requirement1", "requirement2", "..."],
  "nonFunctionalRequirements": ["requirement1", "requirement2", "..."],
  "outOfScope": ["item1", "item2", "..."]
}

## Guidelines
- Overview should paint a clear picture of what the product is and why it matters
- Include 3-5 measurable objectives
- Write 5-8 user stories covering key user journeys
- Include 8-12 functional requirements
- Include 4-6 non-functional requirements (performance, security, scalability)
- Clearly state 3-5 items that are explicitly out of scope for this version

Respond only with the JSON object, no additional text.`;
}
