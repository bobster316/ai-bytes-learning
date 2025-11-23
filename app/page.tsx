"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingNews } from "@/components/trending-news";
import { NewsletterSignup } from "@/components/newsletter-signup";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Users,
  CheckCircle2,
  Play,
  Pause,
  Sparkles,
  BarChart3,
  Shield,
  Target,
  Rocket,
  Zap,
  Brain,
  Code,
  Eye,
  MessageSquare,
  Scale,
  Lightbulb,
  Network,
  Briefcase,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { theme, resolvedTheme } = useTheme();

  // Determine current theme (resolvedTheme handles 'system' preference)
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  // Video paths based on theme
  const videoSrc = isDark
    ? '/videos/AI Bytes Learning Home Page Darker Background.mp4'
    : '/videos/AI Bytes Learning Home Page White  Background.mp4';

  const fallbackImage = isDark
    ? '/Main Image Dark Mode.png'
    : '/Main Image Light Mode.png';

  useEffect(() => {
    setMounted(true);

    // Check if video file exists
    fetch(videoSrc, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          setVideoError(true);
        }
      })
      .catch(() => setVideoError(true));
  }, [videoSrc]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background border-b border-border w-full">
        <div className="container mx-auto px-4 py-12 lg:py-16 max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <p className="text-sm text-foreground-subtle uppercase tracking-wider">AI BYTES LEARNING</p>
              <div className="space-y-2">
                <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-foreground">
                  From <span className="text-[#00BFA5]">AI Zero</span> to{" "}
                  <span className="text-[#00BFA5]">AI Hero</span>
                </h1>
                <p className="text-2xl lg:text-3xl font-bold text-foreground/80">
                  Learn AI in 60 Minutes
                </p>
              </div>
              <p className="text-lg text-foreground-subtle max-w-xl">
                Master AI in 60-minute micro-courses designed for professionals. Learn smarter, one AI concept at a time, with jargon-free instruction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses">
                  <Button size="lg" className="bg-[#0A1628] dark:bg-off-white hover:bg-[#1E293B] dark:hover:bg-light-grey text-white dark:text-navy-blue px-8">
                    Get Started
                  </Button>
                </Link>
                <Link href="#overview">
                  <Button size="lg" variant="outline" className="border-2 border-border text-foreground hover:bg-background-subtle px-8">
                    Watch Overview
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-6">
                <div>
                  <p className="text-3xl font-bold text-foreground">0+</p>
                  <p className="text-sm text-foreground-subtle">Courses</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">0+</p>
                  <p className="text-sm text-foreground-subtle">Students</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">95%</p>
                  <p className="text-sm text-foreground-subtle">Completion Rate</p>
                </div>
              </div>
            </div>

            {/* AI Tutor Video or Image Fallback */}
            <div className="relative group">
              <div className="aspect-video rounded-lg border border-border overflow-hidden shadow-lg relative bg-white dark:bg-gray-900">
                {mounted && !videoError ? (
                  <>
                    <video
                      ref={videoRef}
                      loop
                      playsInline
                      className="w-full h-full object-contain"
                      onError={() => setVideoError(true)}
                      key={videoSrc}
                    >
                      <source src={videoSrc} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    {/* Custom Play/Pause Button - Bottom Left */}
                    <button
                      onClick={togglePlay}
                      className="absolute bottom-4 left-4 bg-[#00BFA5] hover:bg-[#00A896] text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>
                  </>
                ) : (
                  <Image
                    src={fallbackImage}
                    alt="AI Tutor - Learn AI in 60 Minutes"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-contain"
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Top Categories Section */}
      <section className="py-20 lg:py-32 bg-background relative overflow-hidden w-full">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary" className="mb-2">
              <BookOpen className="w-4 h-4 mr-1" />
              EXPLORE CATEGORIES
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Top <span className="text-[#00BFA5]">Categories</span>
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Explore our most popular AI learning paths and find the perfect course for your goals
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: Lightbulb,
                title: "Foundational AI Literacy",
                description: "Start your AI journey with essential concepts and terminology",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50 dark:bg-blue-950/30",
                iconColor: "text-blue-600 dark:text-blue-400",
                courses: 12,
                category: "foundational-ai-literacy"
              },
              {
                icon: Sparkles,
                title: "Generative AI and Prompt Engineering",
                description: "Master the art of creating with AI and crafting effective prompts",
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-purple-50 dark:bg-purple-950/30",
                iconColor: "text-purple-600 dark:text-purple-400",
                courses: 15,
                category: "generative-ai-prompt-engineering"
              },
              {
                icon: Brain,
                title: "Machine Learning Fundamentals",
                description: "Build strong foundations in ML algorithms and techniques",
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-green-50 dark:bg-green-950/30",
                iconColor: "text-green-600 dark:text-green-400",
                courses: 18,
                category: "machine-learning-fundamentals"
              },
              {
                icon: Code,
                title: "Python Programming for AI",
                description: "Learn Python essentials for artificial intelligence development",
                color: "from-yellow-500 to-orange-500",
                bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
                iconColor: "text-yellow-600 dark:text-yellow-400",
                courses: 16,
                category: "python-programming-ai"
              },
              {
                icon: BarChart3,
                title: "Data Science for AI",
                description: "Analyze and process data to power intelligent systems",
                color: "from-orange-500 to-red-500",
                bgColor: "bg-orange-50 dark:bg-orange-950/30",
                iconColor: "text-orange-600 dark:text-orange-400",
                courses: 14,
                category: "data-science-ai"
              },
              {
                icon: Eye,
                title: "Computer Vision Basics",
                description: "Enable machines to see and interpret visual information",
                color: "from-teal-500 to-cyan-500",
                bgColor: "bg-teal-50 dark:bg-teal-950/30",
                iconColor: "text-teal-600 dark:text-teal-400",
                courses: 13,
                category: "computer-vision-basics"
              },
              {
                icon: MessageSquare,
                title: "Natural Language Processing",
                description: "Teach machines to understand and generate human language",
                color: "from-indigo-500 to-purple-500",
                bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
                iconColor: "text-indigo-600 dark:text-indigo-400",
                courses: 11,
                category: "natural-language-processing"
              },
              {
                icon: Scale,
                title: "AI Ethics and Responsible AI",
                description: "Build ethical and responsible artificial intelligence systems",
                color: "from-rose-500 to-pink-500",
                bgColor: "bg-rose-50 dark:bg-rose-950/30",
                iconColor: "text-rose-600 dark:text-rose-400",
                courses: 8,
                category: "ai-ethics-responsible"
              },
              {
                icon: Briefcase,
                title: "AI Tools and Business Applications",
                description: "Apply AI solutions to real-world business challenges",
                color: "from-violet-500 to-purple-500",
                bgColor: "bg-violet-50 dark:bg-violet-950/30",
                iconColor: "text-violet-600 dark:text-violet-400",
                courses: 10,
                category: "ai-tools-business"
              },
            ].map((category, index) => (
              <Link
                key={index}
                href={`/courses?category=${category.category}`}
                className="group block h-full"
              >
                <Card className="relative h-full bg-card border-2 border-border shadow-md hover:shadow-2xl hover:border-[#00BFA5]/50 transition-all duration-300 group-hover:-translate-y-2 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                  {/* Shine effect */}
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-700"></div>

                  <CardContent className="p-6 space-y-4 relative">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className={`w-7 h-7 ${category.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-[#00BFA5] transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2">
                        {category.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-sm font-medium text-foreground/60">
                        {category.courses} Courses
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#00BFA5] group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Bottom gradient accent */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/courses">
              <Button size="lg" variant="outline" className="group">
                View All Categories
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Three-Phase Approach */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-card to-background relative overflow-hidden w-full">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#00BFA5] rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00BFA5]/10 rounded-full">
              <Zap className="w-4 h-4 text-[#00BFA5]" />
              <span className="text-sm text-[#00BFA5] font-semibold uppercase tracking-wider">
                Learning Approach
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Your Journey to <span className="text-[#00BFA5]">AI Mastery</span>
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              A structured, proven methodology designed to take you from beginner to expert
            </p>
          </div>

          {/* Three Phase Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
            {[
              {
                phase: "01",
                icon: Target,
                title: "Selection",
                description: "Browse curated content with AI-powered course selection to match your goals and skill level.",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                phase: "02",
                icon: Rocket,
                title: "Execution",
                description: "Engage with world-class lessons, practical exercises, and AI tutoring for optimal learning outcomes.",
                color: "from-[#00BFA5] to-emerald-500",
                bgColor: "bg-emerald-50",
                iconColor: "text-[#00BFA5]",
              },
              {
                phase: "03",
                icon: Award,
                title: "Validation",
                description: "Complete assessments and earn verified certificates to showcase your expertise to employers worldwide.",
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-purple-50",
                iconColor: "text-purple-600",
              },
            ].map((item, index) => (
              <div key={index} className="group relative">
                {/* Connecting line (hidden on mobile) */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-border to-border/50 z-0">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-border rounded-full"></div>
                  </div>
                )}

                <Card className="relative h-full bg-card border-2 border-border shadow-lg hover:shadow-2xl hover:border-[#00BFA5]/50 transition-all duration-300 group-hover:-translate-y-2">
                  <CardContent className="p-8 space-y-6">
                    {/* Phase number with gradient */}
                    <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${item.color} text-white font-bold text-sm`}>
                      PHASE {item.phase}
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-[#00BFA5] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-foreground/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Decorative element */}
                    <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${item.color} group-hover:w-full transition-all duration-500`}></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Stats Section - Enhanced */}
          <div className="bg-card rounded-3xl shadow-xl border border-border p-8 lg:p-12 max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Trusted by Thousands Worldwide
              </h3>
              <p className="text-foreground/80">
                Join a growing community of AI enthusiasts and professionals
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "500+", label: "Completed", icon: CheckCircle2, color: "bg-green-500" },
                { value: "150+", label: "Courses", icon: BookOpen, color: "bg-blue-500" },
                { value: "5000+", label: "Students", icon: Users, color: "bg-[#00BFA5]" },
                { value: "99.5%", label: "Uptime", icon: TrendingUp, color: "bg-purple-500" },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl lg:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-foreground/80 font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Built for Performance Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-card relative overflow-hidden w-full">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00BFA5] rounded-full blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00BFA5]/10 to-blue-500/10 rounded-full border border-[#00BFA5]/20">
              <Sparkles className="w-4 h-4 text-[#00BFA5]" />
              <span className="text-sm text-[#00BFA5] font-semibold uppercase tracking-wider">
                Features
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Built for <span className="bg-gradient-to-r from-[#00BFA5] to-blue-500 bg-clip-text text-transparent">Performance</span>
              </h2>
              <p className="text-lg lg:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
                Enterprise-grade learning infrastructure designed for modern professionals seeking excellence
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: BookOpen,
                title: "Structured Learning",
                description: "Bite-sized lessons with clear progression paths for maximum retention",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50",
              },
              {
                icon: Clock,
                title: "Time-Optimised",
                description: "60-minute courses designed for busy professionals who value their time",
                gradient: "from-purple-500 to-pink-500",
                bgGradient: "from-purple-50 to-pink-50",
              },
              {
                icon: Sparkles,
                title: "AI-Powered",
                description: "Intelligent study companion and adaptive learning recommendations",
                gradient: "from-[#00BFA5] to-emerald-500",
                bgGradient: "from-teal-50 to-emerald-50",
              },
              {
                icon: BarChart3,
                title: "Progress Analytics",
                description: "Track your learning journey with detailed completion and performance insights",
                gradient: "from-orange-500 to-red-500",
                bgGradient: "from-orange-50 to-red-50",
              },
              {
                icon: Shield,
                title: "Verified Certification",
                description: "Industry-recognised certificates with blockchain verification and LinkedIn integration",
                gradient: "from-indigo-500 to-blue-500",
                bgGradient: "from-indigo-50 to-blue-50",
              },
              {
                icon: Users,
                title: "Enterprise Ready",
                description: "Team management with bulk certificate generation and comprehensive admin dashboards",
                gradient: "from-green-500 to-teal-500",
                bgGradient: "from-green-50 to-teal-50",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group relative bg-card border-2 border-border hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
                <div className="absolute inset-[2px] bg-card rounded-lg -z-5"></div>

                {/* Background gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.bgGradient} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <CardContent className="relative p-8 space-y-5">
                  {/* Icon */}
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-foreground group-hover:to-foreground/60 transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/80 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative element */}
                  <div className="flex items-center gap-2 pt-2">
                    <div className={`h-1 rounded-full bg-gradient-to-r ${feature.gradient} w-8 group-hover:w-full transition-all duration-700`}></div>
                  </div>

                  {/* Hover shine effect */}
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-full transition-all duration-1000"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA or Additional Info */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00BFA5] to-blue-500 border-2 border-background flex items-center justify-center text-white text-xs font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground/80 font-medium">
                Trusted by <span className="text-[#00BFA5] font-bold">5,000+</span> professionals worldwide
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Trending AI News Section */}
      <TrendingNews />

      {/* Newsletter Signup Section */}
      <NewsletterSignup />

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-background-inverse w-full">
        <div className="container mx-auto px-4 text-center max-w-7xl">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground-inverse">
              Ready to accelerate your learning?
            </h2>
            <p className="text-lg text-foreground-inverse/80">
              Join thousands of professionals mastering AI with our cutting-edge platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="bg-[#00BFA5] hover:bg-[#00A896] text-white px-8">
                  Start Learning Today
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-2 border-foreground-inverse text-foreground-inverse hover:bg-foreground-inverse/10 px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="text-sm text-foreground-inverse/60">
              7-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
