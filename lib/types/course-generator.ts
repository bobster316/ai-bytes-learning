// ========================================
// TypeScript Types for AI Course Generator
// ========================================

// Database table types (matching Supabase schema)

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type GenerationStatus = 'pending' | 'generating' | 'completed' | 'failed';
export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank';

// ========================================
// AI Generated Courses
// ========================================

export interface AIGeneratedCourse {
  id: number;
  course_id: number;

  // Input parameters
  original_prompt: string;
  difficulty_level: DifficultyLevel;
  target_duration_minutes: number;
  target_audience?: string;

  // AI generation metadata
  groq_model: string;
  generation_started_at?: string;
  generation_completed_at?: string;
  generation_status: GenerationStatus;
  error_message?: string;

  // Cost tracking
  groq_tokens_used?: number;
  elevenlabs_characters_used?: number;
  estimated_cost_usd?: number;

  // Quality metrics
  content_quality_score?: number;
  human_reviewed: boolean;
  reviewed_by?: string;
  reviewed_at?: string;

  created_at: string;
  updated_at: string;
}

// ========================================
// Course Topics
// ========================================

export interface CourseTopic {
  id: number;
  course_id: number;

  title: string;
  description?: string;
  order_index: number;
  estimated_duration_minutes: number;

  // AI generated content
  learning_objectives?: string[];
  prerequisites?: string[];

  created_at: string;
  updated_at: string;
}

// ========================================
// Course Lessons
// ========================================

export interface CourseLesson {
  id: number;
  topic_id: number;

  title: string;
  order_index: number;
  estimated_duration_minutes: number;

  // Content
  content_markdown: string;
  content_html?: string;
  key_takeaways?: string[];

  // Media
  thumbnail_url?: string;
  audio_url?: string;
  video_url?: string;

  // AI metadata
  generated_with_ai: boolean;
  ai_confidence_score?: number;

  created_at: string;
  updated_at: string;
}

// ========================================
// Lesson Images
// ========================================

export interface LessonImage {
  id: number;
  lesson_id: number;

  image_url: string;
  alt_text?: string;
  caption?: string;
  order_index?: number;
  source: string; // 'unsplash', 'pexels', 'dalle'
  source_attribution?: string;

  created_at: string;
}

// ========================================
// Course Quizzes
// ========================================

export interface CourseQuiz {
  id: number;
  topic_id: number;

  title: string;
  description?: string;
  passing_score_percentage: number;

  created_at: string;
  updated_at: string;
}

// ========================================
// Quiz Questions
// ========================================

export interface QuizOption {
  text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;

  question_text: string;
  question_type: QuestionType;
  order_index: number;
  points: number;

  // For multiple choice
  options?: QuizOption[];
  correct_answer?: string;
  explanation?: string;

  created_at: string;
}

// ========================================
// User Quiz Attempts
// ========================================

export interface UserQuizAttempt {
  id: number;
  user_id: string; // UUID from auth.users
  quiz_id: number;

  score_percentage: number;
  passed: boolean;
  answers_json?: Record<string, any>;

  started_at?: string;
  completed_at?: string;
  created_at: string;
}

// ========================================
// API Request/Response Types
// ========================================

// Course Generation Request
export interface CourseGenerationRequest {
  courseName: string;
  difficultyLevel: DifficultyLevel;
  targetDuration: 30 | 45 | 60; // minutes
  targetAudience?: string;
  topics?: string[]; // Optional: specific topics to cover
  generateAudio: boolean;
  generateImages: boolean;
}

// Course Generation Response
export interface CourseGenerationResponse {
  success: boolean;
  courseId?: number;
  generationId?: number;
  message: string;
  estimatedTimeSeconds?: number;
  error?: string;
}

// Generation Status Response
export interface GenerationStatusResponse {
  generationId: number;
  status: GenerationStatus;
  progress: {
    currentStep: string;
    stepsCompleted: number;
    totalSteps: number;
    percentComplete: number;
  };
  courseId?: number;
  error?: string;
}

// ========================================
// AI Generation Types (Internal)
// ========================================

// Groq API Response for Course Outline
export interface AIGeneratedOutline {
  courseOverview: string;
  learningObjectives: string[];
  topics: AIGeneratedTopic[];
}

export interface AIGeneratedTopic {
  title: string;
  description: string;
  estimatedDuration: number;
  learningObjectives: string[];
  lessons: AIGeneratedLesson[];
  quiz: AIGeneratedQuiz;
  keyTakeaways: string[];
}

export interface AIGeneratedLesson {
  title: string;
  description: string;
  estimatedDuration: number;
  keywords: string[]; // For image search
}

export interface AIGeneratedQuiz {
  title: string;
  questions: AIGeneratedQuestion[];
}

export interface AIGeneratedQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
}

// Lesson Content Generation
export interface AIGeneratedLessonContent {
  introduction: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  caseStudy: {
    title: string;
    subject: string;
    content: string;
    stats: string;
    outcomes: string;
  };
  knowledgeCheck: Array<{
    question: string;
    answer: string;
  }>;
  summary: string;
  keyTakeaways: string[];
  imageKeywords: string[];
  diagrams: Array<{
    title: string;
    steps: string[];
  }>;
  stats: Array<{
    icon: string;
    value: string;
    label: string;
  }>;
  wordCount: number;
  confidenceScore: number; // 0.0 to 1.0
  markdown?: string; // For backwards compatibility
}

// ========================================
// Progress Tracking
// ========================================

export interface GenerationProgress {
  generationId: string;
  currentStep: string;
  stepsCompleted: number;
  totalSteps: number;
  startedAt: string;
  estimatedCompletionAt?: string;
}

// ========================================
// Complete Course Data (with relations)
// ========================================

export interface CompleteCourseData {
  course: {
    id: number;
    title: string;
    description: string;
    thumbnail_url?: string;
    price: number;
    published: boolean;
  };
  aiMetadata: AIGeneratedCourse;
  topics: (CourseTopic & {
    lessons: (CourseLesson & {
      images: LessonImage[];
    })[];
    quiz: CourseQuiz & {
      questions: QuizQuestion[];
    };
  })[];
}

// ========================================
// Helper Types
// ========================================

export type DatabaseInsert<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
export type DatabaseUpdate<T> = Partial<Omit<T, 'id' | 'created_at'>>;
