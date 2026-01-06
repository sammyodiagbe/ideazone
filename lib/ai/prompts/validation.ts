import type { GenerationSettings, ClarifiedIdea, CompetitorAnalysis } from '@/types/workspace';

export function buildValidationPrompt(
  clarifiedIdea: ClarifiedIdea,
  competitors: CompetitorAnalysis,
  settings: GenerationSettings
): string {
  const competitorNames = competitors.competitors.map(c => c.name).join(', ');

  return `You are a startup advisor and market analyst helping validate a product idea.

## Your Task
Analyze the following product idea and provide a comprehensive validation assessment with data for visualization charts.

## Product Idea
**Summary:** ${clarifiedIdea.summary}
**Problem Being Solved:** ${clarifiedIdea.problem}
**Target Users:** ${clarifiedIdea.targetUsers}
**Proposed Solution:** ${clarifiedIdea.proposedSolution}

## Known Competitors
${competitorNames}

## Market Context
- Tech Stack: ${settings.techStack}
- Team Size: ${settings.teamSize}
- Complexity: ${settings.complexity}

## Output Format
Respond with a JSON object (no markdown, just pure JSON) with this exact structure:
{
  "overallScore": 75,
  "verdict": "Promising",
  "summary": "A 2-3 sentence summary of the validation assessment",
  "validationScores": [
    {
      "category": "Problem Clarity",
      "score": 8,
      "maxScore": 10,
      "reasoning": "Brief explanation"
    },
    {
      "category": "Market Size",
      "score": 7,
      "maxScore": 10,
      "reasoning": "Brief explanation"
    },
    {
      "category": "Competition Level",
      "score": 6,
      "maxScore": 10,
      "reasoning": "Brief explanation"
    },
    {
      "category": "Differentiation",
      "score": 7,
      "maxScore": 10,
      "reasoning": "Brief explanation"
    },
    {
      "category": "Technical Feasibility",
      "score": 8,
      "maxScore": 10,
      "reasoning": "Brief explanation"
    },
    {
      "category": "Revenue Potential",
      "score": 7,
      "maxScore": 10,
      "reasoning": "Brief explanation"
    }
  ],
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "risks": [
    {
      "risk": "Description of the risk",
      "severity": "High",
      "mitigation": "How to mitigate this risk"
    }
  ],
  "marketData": [
    { "year": "2024", "marketSize": 10, "projectedGrowth": 12 },
    { "year": "2025", "marketSize": 14, "projectedGrowth": 18 },
    { "year": "2026", "marketSize": 20, "projectedGrowth": 25 },
    { "year": "2027", "marketSize": 28, "projectedGrowth": 35 },
    { "year": "2028", "marketSize": 40, "projectedGrowth": 48 }
  ],
  "competitivePositioning": [
    { "dimension": "Price", "yourIdea": 8, "marketAverage": 5 },
    { "dimension": "Features", "yourIdea": 7, "marketAverage": 6 },
    { "dimension": "UX/Design", "yourIdea": 8, "marketAverage": 5 },
    { "dimension": "Innovation", "yourIdea": 9, "marketAverage": 4 },
    { "dimension": "Support", "yourIdea": 7, "marketAverage": 6 }
  ],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "goToMarketScore": 72,
  "technicalFeasibilityScore": 85,
  "marketOpportunityScore": 78
}

## Guidelines
- overallScore: 0-100, weighted average of all factors
- verdict: "Strong" (80+), "Promising" (60-79), "Needs Work" (40-59), "Risky" (<40)
- validationScores: Exactly 6 categories as shown, scores 1-10
- strengths: 3-5 key strengths of the idea
- weaknesses: 2-4 areas that need improvement
- risks: 3-5 risks with severity (High/Medium/Low) and mitigations
- marketData: 5 years of projected market growth (values in billions USD, can be estimated based on industry)
- competitivePositioning: 5 dimensions comparing your idea (1-10) vs market average (1-10)
- recommendations: 3-5 actionable next steps
- goToMarketScore, technicalFeasibilityScore, marketOpportunityScore: 0-100 each

## Important
- Be realistic and balanced in your assessment
- Base market data on realistic industry projections
- Competitive positioning should reflect actual advantages/disadvantages
- All scores should be justified by the idea's characteristics

Respond only with the JSON object, no additional text.`;
}
