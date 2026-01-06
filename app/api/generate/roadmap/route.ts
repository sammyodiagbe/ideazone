import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/ai/client';
import { extractJSON } from '@/lib/ai/utils';
import { buildRoadmapPrompt } from '@/lib/ai/prompts/roadmap';
import type { GenerateRequest } from '@/types/api';
import type { Roadmap, ClarifiedIdea, MVPScope } from '@/types/workspace';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const { rawIdea, settings, context } = body;

    if (!context?.clarifiedIdea || !context?.mvpScope) {
      return NextResponse.json(
        { success: false, error: 'Clarified idea and MVP scope are required' },
        { status: 400 }
      );
    }

    const client = getAnthropicClient();
    const prompt = buildRoadmapPrompt(
      rawIdea,
      settings,
      context.clarifiedIdea as ClarifiedIdea,
      context.mvpScope as MVPScope
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

    const data = JSON.parse(extractJSON(textBlock.text)) as Roadmap;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Roadmap API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
