// ========================================
// AI Description Generation API
// POST /api/ai/generate-description
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { getGroqClient } from '@/lib/ai/groq';

/**
 * POST /api/ai/generate-description
 * Generate a course description from a course name
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseName } = body;

    if (!courseName || typeof courseName !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Course name is required' },
        { status: 400 }
      );
    }

    // Get AI client
    const aiClient = getGroqClient();

    // Generate description using the proper client method
    const systemPrompt = 'You are an expert at writing compelling, concise course descriptions for online learning platforms. Generate descriptions that are clear, engaging, and informative in 2-3 sentences.';
    const userPrompt = `Generate a compelling 2-3 sentence course description for a course titled: "${courseName}". The description should explain what students will learn and why it's valuable. Be specific and engaging.`;

    const description = await aiClient.generateText(systemPrompt, userPrompt, 0.7, 200);

    return NextResponse.json({
      success: true,
      description,
    });

  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate description',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
