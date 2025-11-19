// ========================================
// AI Course Generation API Endpoint
// POST /api/course/generate
// ========================================

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import {
  validateCourseGenerationRequest,
  safeParse,
  courseGenerationRequestSchema
} from '@/lib/validations/course-generator';
import type {
  CourseGenerationRequest,
  CourseGenerationResponse
} from '@/lib/types/course-generator';
import { getCourseGenerator } from '@/lib/ai/course-generator';
import { createProgressTracker } from '@/lib/utils/progress-tracker';

/**
 * POST /api/course/generate
 * Initiates AI course generation process
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validationResult = safeParse(courseGenerationRequestSchema, body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          errors: validationResult.errors,
        },
        { status: 400 }
      );
    }

    const input = validationResult.data as CourseGenerationRequest;

    // 2. Use service role client to bypass RLS for course generation
    const supabase = createServiceClient();

    // TODO: Re-enable auth once Supabase email confirmation is fixed
    /*
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
        },
        { status: 401 }
      );
    }

    // Check if user is admin (you'll need to adjust this based on your auth setup)
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Admin access required',
        },
        { status: 403 }
      );
    }
    */

    // 3. Create initial course record
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: input.courseName,
        description: (input as any).courseDescription || `AI-generated course on ${input.courseName}`,
        price: 0, // Default, can be changed later
        published: false, // Unpublished until reviewed
      })
      .select()
      .single();

    if (courseError || !course) {
      console.error('Error creating course:', courseError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create course record',
          error: courseError?.message,
        },
        { status: 500 }
      );
    }

    // 4. Create AI generation tracking record
    const { data: generation, error: generationError } = await supabase
      .from('ai_generated_courses')
      .insert({
        course_id: course.id,
        original_prompt: input.courseName,
        difficulty_level: input.difficultyLevel,
        target_duration_minutes: input.targetDuration,
        target_audience: input.targetAudience,
        generation_status: 'pending',
        generation_started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (generationError || !generation) {
      console.error('Error creating generation record:', generationError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create generation record',
          error: generationError?.message,
        },
        { status: 500 }
      );
    }

    // 5. Start async course generation process
    // Note: In production, use a queue system (Vercel Queue, BullMQ, etc.)
    // For now, we'll use a simple async call (not ideal for long-running tasks)
    generateCourseAsync(generation.id, course.id, input)
      .catch((error) => {
        console.error('Course generation failed:', error);
        // 💡 FIX 1: Use the same Supabase client instance created in the main function
        const errorSupabase = createServiceClient();
        // Update generation record with error
        errorSupabase
          .from('ai_generated_courses')
          .update({
            generation_status: 'failed',
            error_message: error.message,
            generation_completed_at: new Date().toISOString(),
          })
          .eq('id', generation.id)
          .then(() => console.log('Generation record updated with error'));
      });

    // 6. Return immediately with generation ID
    const response: CourseGenerationResponse = {
      success: true,
      courseId: course.id,
      generationId: generation.id,
      message: 'Course generation started successfully',
      estimatedTimeSeconds: 180, // ~3 minutes
    };

    return NextResponse.json(response, { status: 202 }); // 202 Accepted

  } catch (error) {
    console.error('Unexpected error in course generation:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Async function to generate course content
 * This runs in the background after the API returns
 */
async function generateCourseAsync(
  generationId: string,
  courseId: string,
  input: CourseGenerationRequest
) {
  // 💡 FIX 2: Create Supabase client inside the async function, as the one from the POST body might be stale
  const supabase = createServiceClient();
  
  try {
    console.log(`[${generationId}] Starting course generation...`);

    // Update status to 'in_progress' immediately after starting the heavy task
    await supabase
      .from('ai_generated_courses')
      .update({ generation_status: 'in_progress' })
      .eq('id', generationId);

    // Create progress tracker
    const progressTracker = createProgressTracker(generationId);

    // Get course generator instance
    const generator = getCourseGenerator();

    // Generate complete course with progress tracking
    // The generator.generateCompleteCourse function returns true if the course was created, 
    // even if some parts had to use fallback data.
    await generator.generateCompleteCourse(
      generationId,
      courseId,
      input,
      (step, percentComplete) => {
        progressTracker.update(step, percentComplete);
      }
    );

    console.log(`[${generationId}] ✅ Course generation completed successfully!`);

    // 💡 FIX 3: Update Supabase to 'completed' on success
    await supabase
      .from('ai_generated_courses')
      .update({
        generation_status: 'completed',
        generation_completed_at: new Date().toISOString(),
        // Clear any lingering error message from a previous failure attempt
        error_message: null, 
      })
      .eq('id', generationId);
    
  } catch (error: any) {
    console.error(`[${generationId}] ❌ Course generation failed:`, error);
    
    // 💡 FIX 4: Update Supabase to 'failed' in the catch block
    await supabase
      .from('ai_generated_courses')
      .update({
        generation_status: 'failed',
        error_message: error.message || 'Unknown generation error',
        generation_completed_at: new Date().toISOString(),
      })
      .eq('id', generationId);

    // Re-throw the error so the .catch in the POST function is still notified
    throw error; 
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}