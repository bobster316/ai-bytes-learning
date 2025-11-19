import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LessonContent } from './LessonContent';

interface PageProps {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
}

async function getLessonData(lessonId: string) {
  const supabase = await createClient();

  // Get lesson with topic and course info
  const { data: lesson, error: lessonError } = await supabase
    .from('course_lessons')
    .select(`
      *,
      topic:course_topics (
        id,
        title,
        order_index,
        course_id,
        course:courses (
          id,
          title,
          description
        )
      )
    `)
    .eq('id', lessonId)
    .single();

  if (lessonError || !lesson) {
    return null;
  }

  // Get images for this lesson
  const { data: images } = await supabase
    .from('lesson_images')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: true });

  // Get all topics in this course with their lessons for cross-topic navigation
  const { data: allTopics } = await supabase
    .from('course_topics')
    .select(`
      id,
      title,
      order_index,
      lessons:course_lessons (
        id,
        title,
        order_index
      )
    `)
    .eq('course_id', lesson.topic.course_id)
    .order('order_index', { ascending: true });

  // Sort lessons within each topic
  const sortedTopics = (allTopics || []).map(topic => ({
    ...topic,
    lessons: (topic.lessons || []).sort((a, b) => a.order_index - b.order_index)
  }));

  return {
    lesson,
    images: images || [],
    allTopics: sortedTopics,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const data = await getLessonData(lessonId);

  if (!data) {
    return {
      title: 'Lesson Not Found',
    };
  }

  return {
    title: `${data.lesson.title} - ${data.lesson.topic.course.title}`,
    description: data.lesson.key_takeaways?.[0] || data.lesson.topic.course.description,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { id: courseId, lessonId } = await params;
  const data = await getLessonData(lessonId);

  if (!data) {
    notFound();
  }

  const { lesson, images, allTopics } = data;

  // Flatten all lessons across all topics for sequential navigation
  const allLessons: Array<{ id: string; title: string; topicTitle: string }> = [];
  allTopics.forEach(topic => {
    topic.lessons.forEach(lesson => {
      allLessons.push({
        id: lesson.id,
        title: lesson.title,
        topicTitle: topic.title
      });
    });
  });

  // Find current lesson index in the flattened list
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Get progress information
  const totalLessons = allLessons.length;
  const currentLessonNumber = currentIndex + 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/courses/${courseId}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course</span>
            </Link>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{lesson.estimated_duration_minutes} min</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Lesson {currentLessonNumber} of {totalLessons}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Course & Topic Context */}
        <div className="mb-6">
          <p className="text-sm font-medium text-[#00BFA5] mb-2">
            {lesson.topic.course.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {lesson.topic.title}
          </p>
        </div>

        {/* Lesson Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          {lesson.title}
        </h1>

        {/* Key Takeaways */}
        {lesson.key_takeaways && lesson.key_takeaways.length > 0 && (
          <div className="mb-12 p-6 bg-[#00BFA5]/10 dark:bg-[#00BFA5]/5 rounded-lg border border-[#00BFA5]/20">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Key Takeaways
            </h2>
            <ul className="space-y-2">
              {lesson.key_takeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#00BFA5] mt-1">•</span>
                  <span className="text-foreground/90 leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lesson Content - Render as Full HTML in Iframe */}
        <div className="lesson-content w-full">
          {lesson.content_html ? (
            <LessonContent content={lesson.content_html} title={lesson.title} />
          ) : (
            <div className="text-muted-foreground text-center py-12">
              <p>Content is being generated...</p>
            </div>
          )}
        </div>
      </article>

      {/* Navigation Footer */}
      <div className="border-t border-border bg-muted/30 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Course Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round((currentLessonNumber / totalLessons) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00BFA5] transition-all duration-300"
                style={{ width: `${(currentLessonNumber / totalLessons) * 100}%` }}
              />
            </div>
          </div>

          {/* Lesson Navigation */}
          <div className="flex items-center justify-between gap-4">
            {previousLesson ? (
              <Link
                href={`/courses/${courseId}/lessons/${previousLesson.id}`}
                className="flex items-center gap-3 px-6 py-4 rounded-lg bg-background hover:bg-muted border border-border transition-colors group flex-1 max-w-sm"
              >
                <ChevronLeft className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Previous Lesson</p>
                  <p className="font-medium text-foreground truncate">{previousLesson.title}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{previousLesson.topicTitle}</p>
                </div>
              </Link>
            ) : (
              <Link
                href={`/courses/${courseId}`}
                className="flex items-center gap-3 px-6 py-4 rounded-lg bg-background hover:bg-muted border border-border transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground mb-1">Return to</p>
                  <p className="font-medium text-foreground">Course Overview</p>
                </div>
              </Link>
            )}

            {nextLesson ? (
              <Link
                href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                className="flex items-center gap-3 px-6 py-4 rounded-lg bg-[#00BFA5] hover:bg-[#00BFA5]/90 text-white transition-colors group ml-auto flex-1 max-w-sm"
              >
                <div className="text-right min-w-0 flex-1">
                  <p className="text-xs text-white/70 mb-1">Next Lesson</p>
                  <p className="font-medium truncate">{nextLesson.title}</p>
                  <p className="text-xs text-white/60 mt-0.5 truncate">{nextLesson.topicTitle}</p>
                </div>
                <ChevronRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                href={`/courses/${courseId}`}
                className="flex items-center gap-3 px-6 py-4 rounded-lg bg-[#00BFA5] hover:bg-[#00BFA5]/90 text-white transition-colors group ml-auto"
              >
                <div className="text-right">
                  <p className="text-xs text-white/70 mb-1">🎉 Course Complete!</p>
                  <p className="font-medium">Return to Overview</p>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
