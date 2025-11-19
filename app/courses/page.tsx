"use client";

import { useState } from "react";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  BookOpen,
  Clock,
  Users,
  Star,
  TrendingUp,
  Code,
  Brain,
  Smartphone,
  Database,
  Shield,
  Zap
} from "lucide-react";
import Link from "next/link";

// Mock course data
const courses = [
  {
    id: 1,
    title: "Your Smartphone's Secret: How AI Lives in Your Pocket",
    description: "Discover the hidden AI technologies working behind the scenes in your everyday smartphone.",
    level: "Beginner",
    category: "Foundational AI",
    duration: "4 topics",
    enrolled: "1.2k",
    rating: 4.8,
    image: "/placeholder-course.jpg",
  },
  {
    id: 2,
    title: "Voice Assistants 101: How Siri, Alexa and Google Understand You",
    description: "Learn how voice assistants process and understand natural language",
    level: "Beginner",
    category: "AI Applications",
    duration: "4 topics",
    enrolled: "890",
    rating: 4.7,
  },
  {
    id: 3,
    title: "Data and AI: How Information Powers Smart Technology",
    description: "Understand the role of data in artificial intelligence and machine learning",
    level: "Intermediate",
    category: "Data Science",
    duration: "5 topics",
    enrolled: "654",
    rating: 4.9,
  },
  // Add more courses as needed
];

const categories = [
  { id: "all", label: "All Courses", icon: BookOpen },
  { id: "foundational", label: "Foundational AI", icon: Brain },
  { id: "applications", label: "AI Applications", icon: Smartphone },
  { id: "generative", label: "Generative AI", icon: Zap },
  { id: "security", label: "Security & Ethics", icon: Shield },
  { id: "business", label: "Business AI", icon: TrendingUp },
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      course.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-card">
      

      {/* Hero Section */}
      <section className="bg-background-inverse border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wider text-foreground-inverse/60">
                COURSE CATALOGUE
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground-inverse">
                Explore Our Courses
              </h1>
              <p className="text-base text-foreground-inverse/70 max-w-2xl mx-auto">
                Master AI in 60-minute micro-courses. Learn smarter, one byte at a time.
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 pt-2 text-sm">
              <div className="flex items-center gap-2 text-foreground-inverse/80">
                <BookOpen className="w-4 h-4" />
                <span><strong className="text-foreground-inverse">23</strong> Courses</span>
              </div>
              <div className="flex items-center gap-2 text-foreground-inverse/80">
                <Clock className="w-4 h-4" />
                <span><strong className="text-foreground-inverse">60-min</strong> Duration</span>
              </div>
              <div className="flex items-center gap-2 text-foreground-inverse/80">
                <Users className="w-4 h-4" />
                <span><strong className="text-foreground-inverse">Expert</strong> Instructors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
            <Input
              placeholder="Search courses..."
              className="pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-foreground/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">No courses found</h3>
              <p className="text-foreground/70">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="group hover:border-border transition-all overflow-hidden bg-card border-border shadow-sm"
                >
                  {/* Course Image Placeholder */}
                  <div className="h-48 bg-background-inverse flex items-center justify-center border-b border-border relative">
                    <div className="w-20 h-20 rounded-full bg-card/10 flex items-center justify-center">
                      <Brain className="w-10 h-10 text-foreground-inverse" />
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant={course.level === "Beginner" ? "beginner" : "intermediate"}>
                        {course.level}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        FREE
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-[#00BFA5] transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-foreground/70 mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrolled}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    <Link href={`/courses/${course.id}`}>
                      <Button className="w-full" variant="default">
                        View Course →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
