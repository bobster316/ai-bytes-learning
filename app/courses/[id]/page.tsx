import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle2,
  Lock,
  Download,
  Share2
} from "lucide-react";
import Link from "next/link";
import { getCourseDatabase } from '@/lib/database/course-operations';
import { CourseDetailClient } from './course-detail-client';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getCourseData(courseId: string) {
  try {
    const db = getCourseDatabase();
    const data = await db.getCompleteCourse(courseId);
    return data;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getCourseData(id);

  if (!data) {
    return {
      title: 'Course Not Found',
    };
  }

  return {
    title: data.course.title,
    description: data.course.description,
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getCourseData(id);

  if (!data) {
    notFound();
  }

  const { course, topics } = data;

  // Calculate totals
  const totalLessons = topics.reduce((acc, topic) => acc + topic.lessons.length, 0);
  const totalDuration = topics.reduce(
    (acc, topic) => acc + (topic.estimated_duration_minutes || 0),
    0
  );

  // Extract learning objectives from topics
  const whatYouLearn = topics
    .flatMap(topic => topic.learning_objectives || [])
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-background-card">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <Badge variant="beginner" className="text-xs px-3 py-1">{course.difficulty || 'Beginner'}</Badge>
                <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-foreground">
                  {course.title}
                </h1>
                <p className="text-lg text-foreground-subtle leading-relaxed">{course.description}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="font-medium">{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">{totalDuration} minutes</span>
                  </div>
                </div>

                {course.instructor && (
                  <p className="text-sm text-muted-foreground">
                    Created by {course.instructor}
                  </p>
                )}
              </div>

              {/* Course Preview */}
              {course.thumbnail_url && (
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-[#00BFA5]/20 mx-auto flex items-center justify-center hover:bg-[#00BFA5]/30 transition-colors cursor-pointer">
                          <Play className="w-10 h-10 text-[#00BFA5]" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold">Course Preview</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right: Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">
                      FREE
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Full access to all course content
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full hover:shadow-lg transition-all duration-200" size="lg">
                      Start Learning
                    </Button>
                    <Button variant="outline" className="w-full hover:shadow-md transition-all duration-200 group">
                      <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Share Course
                    </Button>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <h4 className="font-semibold text-sm">This course includes:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#00BFA5]" />
                        <span>{totalLessons} comprehensive lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#00BFA5]" />
                        <span>{totalDuration} minutes of content</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00BFA5]" />
                        <span>Quizzes and assessments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#00BFA5]" />
                        <span>Lifetime access</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Client Component for Tabs */}
      <CourseDetailClient
        courseId={id}
        description={course.description}
        whatYouLearn={whatYouLearn}
        topics={topics}
        difficulty={course.difficulty}
        duration={totalDuration}
      />
    </div>
  );
}
