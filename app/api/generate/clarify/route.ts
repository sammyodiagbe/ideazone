import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/ai/client';
import { extractJSON } from '@/lib/ai/utils';
import { buildClarifyPrompt } from '@/lib/ai/prompts/clarify';
import type { GenerateRequest } from '@/types/api';
import type { ClarifiedIdea } from '@/types/workspace';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const { rawIdea, settings } = body;

    if (!rawIdea || rawIdea.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Idea must be at least 10 characters' },
        { status: 400 }
      );
    }

    const client = getAnthropicClient();
    const prompt = buildClarifyPrompt(rawIdea, settings);

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { success: false, error: 'No text response from AI' },
        { status: 500 }
      );
    }

    const data = JSON.parse(extractJSON(textBlock.text)) as ClarifiedIdea;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Clarify API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
