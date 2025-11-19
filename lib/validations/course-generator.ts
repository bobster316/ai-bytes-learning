// ========================================
// Zod Validation Schemas for AI Course Generator
// ========================================

import { z } from 'zod';

// ========================================
// Course Generation Request Validation
// ========================================

export const courseGenerationRequestSchema = z.object({
  courseName: z.string()
    .min(3, 'Course name must be at least 3 characters')
    .max(200, 'Course name must not exceed 200 characters')
    .trim(),

  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Difficulty level is required',
    invalid_type_error: 'Difficulty level must be beginner, intermediate, or advanced',
  }),

  targetDuration: z.union([z.literal(30), z.literal(45), z.literal(60)], {
    required_error: 'Target duration is required',
    invalid_type_error: 'Target duration must be 30, 45, or 60 minutes',
  }),

  targetAudience: z.string()
    .max(500, 'Target audience description must not exceed 500 characters')
    .optional(),

  topics: z.array(z.string().max(100))
    .max(10, 'Maximum 10 custom topics allowed')
    .optional(),

  generateAudio: z.boolean().default(true),

  generateImages: z.boolean().default(true),
});

export type CourseGenerationRequestInput = z.infer<typeof courseGenerationRequestSchema>;

// ========================================
// Generation Status Query Validation
// ========================================

export const generationStatusQuerySchema = z.object({
  generationId: z.string().uuid('Invalid generation ID format'),
});

// ========================================
// Course Topic Validation
// ========================================

export const courseTopicSchema = z.object({
  course_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  order_index: z.number().int().min(0),
  estimated_duration_minutes: z.number().int().min(1).max(120).default(10),
  learning_objectives: z.array(z.string().max(500)).optional(),
  prerequisites: z.array(z.string().max(200)).optional(),
});

// ========================================
// Course Lesson Validation
// ========================================

export const courseLessonSchema = z.object({
  topic_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  order_index: z.number().int().min(0),
  estimated_duration_minutes: z.number().int().min(1).max(60).default(5),
  content_markdown: z.string().min(50, 'Lesson content must be at least 50 characters'),
  content_html: z.string().optional(),
  key_takeaways: z.array(z.string().max(500)).optional(),
  thumbnail_url: z.string().url().optional(),
  audio_url: z.string().url().optional(),
  video_url: z.string().url().optional(),
  generated_with_ai: z.boolean().default(true),
  ai_confidence_score: z.number().min(0).max(1).optional(),
});

// ========================================
// Lesson Image Validation
// ========================================

export const lessonImageSchema = z.object({
  lesson_id: z.string().uuid(),
  image_url: z.string().url('Invalid image URL'),
  alt_text: z.string().max(200).optional(),
  caption: z.string().max(500).optional(),
  order_index: z.number().int().min(0).optional(),
  source: z.enum(['unsplash', 'pexels', 'pixabay', 'dalle', 'custom']).default('unsplash'),
  source_attribution: z.string().max(500).optional(),
});

// ========================================
// Quiz Question Validation
// ========================================

export const quizOptionSchema = z.object({
  text: z.string().min(1).max(500),
  is_correct: z.boolean(),
});

export const quizQuestionSchema = z.object({
  quiz_id: z.string().uuid(),
  question_text: z.string().min(10, 'Question must be at least 10 characters'),
  question_type: z.enum(['multiple_choice', 'true_false', 'fill_blank']).default('multiple_choice'),
  order_index: z.number().int().min(0),
  points: z.number().int().min(1).default(1),
  options: z.array(quizOptionSchema).min(2).max(6).optional(),
  correct_answer: z.string().optional(),
  explanation: z.string().max(1000).optional(),
}).refine((data) => {
  // Multiple choice must have options with exactly one correct answer
  if (data.question_type === 'multiple_choice') {
    if (!data.options || data.options.length < 2) {
      return false;
    }
    const correctCount = data.options.filter(opt => opt.is_correct).length;
    return correctCount === 1;
  }
  return true;
}, {
  message: 'Multiple choice questions must have exactly one correct answer',
});

// ========================================
// Quiz Attempt Validation
// ========================================

export const quizAttemptSchema = z.object({
  quiz_id: z.string().uuid(),
  answers_json: z.record(z.string(), z.any()),
  started_at: z.string().datetime().optional(),
});

// ========================================
// AI Generation Metadata Validation
// ========================================

export const aiGeneratedCourseSchema = z.object({
  course_id: z.string().uuid(),
  original_prompt: z.string().min(3).max(500),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  target_duration_minutes: z.number().int().min(15).max(120),
  target_audience: z.string().max(500).optional(),
  groq_model: z.string().default('llama-3.1-70b-versatile'),
  generation_status: z.enum(['pending', 'generating', 'completed', 'failed']).default('pending'),
  error_message: z.string().optional(),
  groq_tokens_used: z.number().int().min(0).optional(),
  elevenlabs_characters_used: z.number().int().min(0).optional(),
  estimated_cost_usd: z.number().min(0).optional(),
  content_quality_score: z.number().min(0).max(1).optional(),
});

// ========================================
// AI Generated Content Validation (from Groq)
// ========================================

export const aiGeneratedLessonSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(100, 'Lesson description must be detailed (minimum 100 characters)').max(1000),
  estimatedDuration: z.number().int().min(5, 'Lessons should be at least 5 minutes').max(15, 'Lessons should be at most 15 minutes'),
  keywords: z.array(z.string().max(50)).min(5, 'Must have at least 5 image keywords').max(8, 'Must have at most 8 image keywords'),
});

export const aiGeneratedQuestionSchema = z.object({
  question: z.string().min(10),
  options: z.array(quizOptionSchema).min(2).max(6),
  explanation: z.string().max(1000),
});

export const aiGeneratedQuizSchema = z.object({
  title: z.string().min(1).max(200),
  questions: z.array(aiGeneratedQuestionSchema).min(5, 'Quiz must have at least 5 questions').max(7, 'Quiz must have at most 7 questions'),
});

export const aiGeneratedTopicSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(200, 'Topic description must be at least 200 words').max(2000),
  estimatedDuration: z.number().int().min(5).max(60),
  learningObjectives: z.array(z.string().max(500)).min(4, 'Must have at least 4 learning objectives').max(8),
  lessons: z.array(aiGeneratedLessonSchema).min(4, 'Each topic MUST have exactly 4 lessons').max(4, 'Each topic MUST have exactly 4 lessons'),
  quiz: aiGeneratedQuizSchema,
  keyTakeaways: z.array(z.string().max(500)).min(5, 'Must have at least 5 key takeaways').max(7),
});

export const aiGeneratedOutlineSchema = z.object({
  courseOverview: z.string().min(50).max(2000),
  learningObjectives: z.array(z.string().max(500)).min(5, 'Must have at least 5 learning objectives').max(8),
  topics: z.array(aiGeneratedTopicSchema).min(4, 'Course MUST have exactly 4 topics').max(4, 'Course MUST have exactly 4 topics'),
});

// ========================================
// Helper Functions
// ========================================

/**
 * Validates course generation request
 */
export function validateCourseGenerationRequest(data: unknown) {
  return courseGenerationRequestSchema.parse(data);
}

/**
 * Validates AI generated outline from Groq
 */
export function validateAIGeneratedOutline(data: unknown) {
  return aiGeneratedOutlineSchema.parse(data);
}

/**
 * Safe parse with error formatting
 */
export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.format(),
    };
  }
  return {
    success: true,
    data: result.data,
  };
}
