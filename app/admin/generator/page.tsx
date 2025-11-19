"use client";

import { useLocalStorage } from "@/lib/useLocalStorage";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Sparkles,
  BookOpen,
  Brain,
  Smartphone,
  TrendingUp,
  Code,
  Users,
  Lock,
  Zap,
  FileText,
  Music,
  ShoppingCart,
  Cpu,
  Globe
} from "lucide-react";

// Mock course templates
const courseTemplates = [
  {
    id: 1,
    icon: Smartphone,
    title: "Your Smartphone's Secret: How AI Lives in Your Pocket",
    description: "Discover the hidden technologies working behind the scenes in your smartphone",
    level: "Beginner",
    category: "Foundational AI & Basics",
    duration: "Difficulty Level",
    topics: 4,
  },
  {
    id: 2,
    icon: Brain,
    title: "Meet the Chatbots: Your Friendly AI Helpers",
    description: "Learn how AI-powered chatbots work and how they're changing customer service",
    level: "Beginner",
    category: "Foundational AI & Basics",
    duration: "Difficulty Level",
    topics: 4,
  },
  {
    id: 3,
    icon: FileText,
    title: "Natural Language Processing: The Brain Behind Text",
    description: "Explore AI's transformative impact on medical diagnosis and drug discovery",
    level: "Intermediate",
    category: "Applied Knowledge",
    topics: 4,
  },
  {
    id: 4,
    icon: Code,
    title: "Is AI Safe? A Simple Guide to Ethics and Privacy",
    description: "Understand the ethical considerations and privacy concerns in modern AI",
    level: "Beginner",
    category: "Foundational AI & Basics",
    topics: 4,
  },
  {
    id: 5,
    icon: TrendingUp,
    title: "The History of AI: From Sci-Fi to Real Life",
    description: "Journey through the fascinating evolution of artificial intelligence",
    level: "Beginner",
    category: "Foundational AI & Basics",
    topics: 4,
  },
  {
    id: 6,
    icon: Globe,
    title: "The Future of AI: What Could Happen in 10 Years",
    description: "Explore predictions and possibilities for AI development in the coming decade",
    level: "Intermediate",
    category: "Applied Knowledge",
    topics: 5,
  },
  {
    id: 7,
    icon: Cpu,
    title: "Will AI Take Your Job? Debunking AI Myths",
    description: "Separate fact from fiction about AI's impact on the future of work",
    level: "Intermediate",
    category: "Applied Knowledge",
    topics: 5,
  },
  {
    id: 8,
    icon: Music,
    title: "AI in Entertainment: How Movies, Games and Music Use AI",
    description: "Discover how AI is transforming the entertainment industry",
    level: "Beginner",
    category: "Foundational AI & Basics",
    topics: 4,
  },
  {
    id: 9,
    icon: ShoppingCart,
    title: "Shopping with AI: How Online Stores Know What You Like",
    description: "Learn how AI-powered recommendation systems work in e-commerce",
    level: "Beginner",
    category: "Foundational AI & Basics",
    topics: 4,
  },
  {
    id: 10,
    icon: Lock,
    title: "Self-Driving Cars and Smart Traffic: AI on the Road",
    description: "Explore the technology behind intelligent transportation systems",
    level: "Intermediate",
    category: "Applied Knowledge",
    topics: 5,
  },
];

export default function CourseGeneratorPage() {
  const [searchQuery, setSearchQuery] = useLocalStorage("searchQuery", "");
  const [selectedFilter, setSelectedFilter] = useLocalStorage("selectedFilter", "all");

  const filteredTemplates = courseTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      template.level.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background-subtle to-background">
      <Header />

      {/* Header Section */}
      <section className="bg-background-inverse border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wider text-foreground-inverse/60">
              AI COURSE GENERATOR
            </p>
            <h1 className="text-4xl font-bold flex items-center gap-3 text-foreground-inverse">
              <Sparkles className="w-10 h-10 text-[#00BFA5]" />
              Generate AI-Powered Courses
            </h1>
            <p className="text-foreground-inverse/70">
              Select a template to generate with AI • 60 topics pre-loaded
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-background-subtle border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="relative max-w-xl mx-auto mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-subtle" />
            <Input
              placeholder="Search course templates..."
              className="pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { id: "all", label: "All Courses" },
              { id: "beginner", label: "Beginner" },
              { id: "intermediate", label: "Intermediate" },
              { id: "advanced", label: "Advanced" },
            ].map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Course Templates Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="group hover:border-[#00BFA5]/30 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-[#00BFA5]/20 flex items-center justify-center flex-shrink-0">
                      <template.icon className="w-6 h-6 text-[#00BFA5]" />
                    </div>
                    <div className="flex-1">
                      <Badge
                        variant={
                          template.level === "Beginner"
                            ? "beginner"
                            : "intermediate"
                        }
                        className="mb-2"
                      >
                        {template.level}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-[#00BFA5] transition-colors">
                    {template.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-foreground-subtle">
                      <span className="text-[#00BFA5]">●</span>
                      <span>{template.category}</span>
                    </div>
                    <div className="text-sm text-foreground-subtle">
                      Difficulty Level • {template.topics} topics
                    </div>

                    <Button className="w-full gap-2" variant="default">
                      <Sparkles className="w-4 h-4" />
                      Generate Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
