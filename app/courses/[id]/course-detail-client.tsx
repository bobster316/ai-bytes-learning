"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Play, Lock } from "lucide-react";
import Link from "next/link";

interface Topic {
  id: string;
  title: string;
  description: string;
  estimated_duration_minutes: number;
  lessons: Array<{
    id: string;
    title: string;
    estimated_duration_minutes: number;
    order_index: number;
  }>;
}

interface CourseDetailClientProps {
  courseId: string;
  description: string;
  whatYouLearn: string[];
  topics: Topic[];
  difficulty?: string;
  duration: number;
}

export function CourseDetailClient({
  courseId,
  description,
  whatYouLearn,
  topics,
  difficulty,
  duration,
}: CourseDetailClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum">("overview");

  return (
    <>
      {/* Tabs Section */}
      <section className="bg-background-subtle border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                activeTab === "curriculum"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Curriculum
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === "overview" ? (
                <div className="space-y-8">
                  {/* About Course */}
                  <Card>
                    <CardContent className="p-8 space-y-4">
                      <h2 className="text-2xl font-bold text-foreground">About This Course</h2>
                      <p className="text-foreground-subtle leading-relaxed text-base">
                        {description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* What You'll Learn */}
                  {whatYouLearn.length > 0 && (
                    <Card>
                      <CardContent className="p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-foreground">What You'll Learn</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {whatYouLearn.map((item, index) => (
                            <div key={index} className="flex items-start gap-3 group">
                              <div className="mt-0.5">
                                <CheckCircle2 className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
                              </div>
                              <span className="text-foreground text-base leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {topics.map((topic, topicIndex) => (
                    <Card key={topic.id}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Topic Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-2 text-foreground">
                                {topicIndex + 1}. {topic.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {topic.description}
                              </p>
                            </div>
                            <Badge variant="secondary" className="ml-4">
                              {topic.lessons.length} lessons
                            </Badge>
                          </div>

                          {/* Lessons List */}
                          <div className="space-y-2">
                            {topic.lessons
                              .sort((a, b) => a.order_index - b.order_index)
                              .map((lesson, lessonIndex) => (
                                <Link
                                  key={lesson.id}
                                  href={`/courses/${courseId}/lessons/${lesson.id}`}
                                  className="flex items-center justify-between p-4 rounded-lg hover:bg-accent hover:shadow-sm transition-all duration-200 group cursor-pointer border border-transparent hover:border-border"
                                >
                                  <div className="flex items-center gap-3">
                                    <Play className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                      {lessonIndex + 1}. {lesson.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm text-muted-foreground">
                                      {lesson.estimated_duration_minutes} min
                                    </span>
                                  </div>
                                </Link>
                              ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-foreground text-lg">Course Features</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground font-medium">Level</span>
                      <Badge variant="beginner">{difficulty || 'Beginner'}</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground font-medium">Duration</span>
                      <span className="text-foreground font-semibold">{duration} minutes</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground font-medium">Topics</span>
                      <span className="text-foreground font-semibold">{topics.length}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Language</span>
                      <span className="text-foreground font-semibold">English</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
