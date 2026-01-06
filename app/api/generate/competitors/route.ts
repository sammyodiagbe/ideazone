import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/ai/client';
import { extractJSON } from '@/lib/ai/utils';
import { buildCompetitorPrompt } from '@/lib/ai/prompts/competitors';
import type { GenerateRequest } from '@/types/api';
import type { CompetitorAnalysis, ClarifiedIdea } from '@/types/workspace';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const { settings, context } = body;

    if (!context?.clarifiedIdea) {
      return NextResponse.json(
        { success: false, error: 'Clarified idea is required for competitor analysis' },
        { status: 400 }
      );
    }

    const client = getAnthropicClient();
    const prompt = buildCompetitorPrompt(context.clarifiedIdea as ClarifiedIdea, settings);

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { success: false, error: 'No text response from AI' },
        { status: 500 }
      );
    }

    const data = JSON.parse(extractJSON(textBlock.text)) as CompetitorAnalysis;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Competitors API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
