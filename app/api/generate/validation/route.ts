import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/ai/client';
import { extractJSON } from '@/lib/ai/utils';
import { buildValidationPrompt } from '@/lib/ai/prompts/validation';
import type { GenerateRequest } from '@/types/api';
import type { IdeaValidation, ClarifiedIdea, CompetitorAnalysis } from '@/types/workspace';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const { settings, context } = body;

    if (!context?.clarifiedIdea) {
      return NextResponse.json(
        { success: false, error: 'Clarified idea is required for validation' },
        { status: 400 }
      );
    }

    if (!context?.competitors) {
      return NextResponse.json(
        { success: false, error: 'Competitor analysis is required for validation' },
        { status: 400 }
      );
    }

    const client = getAnthropicClient();
    const prompt = buildValidationPrompt(
      context.clarifiedIdea as ClarifiedIdea,
      context.competitors as CompetitorAnalysis,
      settings
    );

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

    const data = JSON.parse(extractJSON(textBlock.text)) as IdeaValidation;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Validation API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
