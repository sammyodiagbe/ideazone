import type { GenerationSettings, ClarifiedIdea } from '@/types/workspace';

export function buildCompetitorPrompt(
  clarifiedIdea: ClarifiedIdea,
  settings: GenerationSettings
): string {
  return `You are a market research analyst helping identify existing competitors and alternatives for a product idea.

## Your Task
Research and identify existing apps, products, or services that solve similar problems to the one described below. Include real, existing companies with their actual websites.

## Product Idea
**Summary:** ${clarifiedIdea.summary}
**Problem Being Solved:** ${clarifiedIdea.problem}
**Target Users:** ${clarifiedIdea.targetUsers}
**Proposed Solution:** ${clarifiedIdea.proposedSolution}

## Context
- Tech Stack: ${settings.techStack}
- Complexity: ${settings.complexity}

## Output Format
Respond with a JSON object (no markdown, just pure JSON) with this exact structure:
{
  "competitors": [
    {
      "name": "Company/Product Name",
      "website": "https://example.com",
      "description": "Brief description of what they do",
      "targetAudience": "Who they primarily serve",
      "keyFeatures": ["feature1", "feature2", "feature3"],
      "pricing": "Free / Freemium / Paid ($X/mo) / Enterprise",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"]
    }
  ],
  "marketGaps": ["gap1", "gap2", "gap3"],
  "differentiationOpportunities": ["opportunity1", "opportunity2", "opportunity3"],
  "competitiveAdvantage": "Summary of how this product can differentiate and compete"
}

## Guidelines
- Include 4-6 real, existing competitors or alternatives (not fictional)
- Use actual website URLs (verify they are real companies)
- Include both direct competitors and indirect alternatives
- Be objective about strengths and weaknesses
- Consider competitors of various sizes (startups to enterprises)
- Identify 3-5 market gaps that exist in current solutions
- Suggest 3-5 differentiation opportunities based on the gaps
- Provide actionable competitive advantage summary

## Important
- Only include real companies that actually exist
- Websites must be valid URLs to real products/services
- If you're unsure about a competitor, don't include it
- Focus on the most relevant and well-known alternatives first

Respond only with the JSON object, no additional text.`;
}
