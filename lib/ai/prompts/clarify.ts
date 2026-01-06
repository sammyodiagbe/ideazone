import type { GenerationSettings } from '@/types/workspace';

export function buildClarifyPrompt(rawIdea: string, settings: GenerationSettings): string {
  return `You are a product strategist helping to clarify and structure a raw product idea.

## Your Task
Analyze the following product idea and provide a structured clarification. Be thorough but concise.

## Raw Idea
${rawIdea}

## Context
- Tech Stack: ${settings.techStack}
- Team Size: ${settings.teamSize}
- Complexity Target: ${settings.complexity}

## Output Format
Respond with a JSON object (no markdown, just pure JSON) with this exact structure:
{
  "summary": "A one-sentence summary of the core product concept",
  "problem": "The specific problem this product solves",
  "targetUsers": "Who the primary users are and their key characteristics",
  "proposedSolution": "How the product solves the problem (2-3 sentences)",
  "assumptions": ["assumption1", "assumption2", "..."],
  "openQuestions": ["question1", "question2", "..."]
}

## Guidelines
- Summary should be crisp and memorable (under 20 words)
- Problem should focus on the pain point, not the solution
- Target users should be specific enough to inform design decisions
- Include 3-5 key assumptions that need validation
- Include 2-4 open questions that would affect implementation

Respond only with the JSON object, no additional text.`;
}
