import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/ai/client';
import { extractJSON } from '@/lib/ai/utils';
import { buildTimelinePrompt } from '@/lib/ai/prompts/timeline';
import type { GenerateRequest } from '@/types/api';
import type { Timeline, ClarifiedIdea, MVPScope, Roadmap } from '@/types/workspace';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const { rawIdea, settings, context } = body;

    if (!context?.clarifiedIdea || !context?.mvpScope || !context?.roadmap) {
      return NextResponse.json(
        { success: false, error: 'Clarified idea, MVP scope, and roadmap are required' },
        { status: 400 }
      );
    }

    const client = getAnthropicClient();
    const prompt = buildTimelinePrompt(
      rawIdea,
      settings,
      context.clarifiedIdea as ClarifiedIdea,
      context.mvpScope as MVPScope,
      context.roadmap as Roadmap
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

    const data = JSON.parse(extractJSON(textBlock.text)) as Timeline;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Timeline API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
