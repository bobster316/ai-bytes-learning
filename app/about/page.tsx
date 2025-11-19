"use client";

import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Lightbulb, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-background-inverse border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-sm uppercase tracking-wider text-foreground-inverse/60">
              ABOUT US
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground-inverse">
              Making AI Education Accessible to Everyone
            </h1>
            <p className="text-base text-foreground-inverse/70 max-w-2xl mx-auto">
              AI Bytes Learning is dedicated to demystifying artificial intelligence and making it accessible to learners of all backgrounds. Our bite-sized courses break down complex AI concepts into easy-to-understand lessons.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-foreground/80 leading-relaxed">
                  We believe that understanding AI is no longer optional—it's essential. Our mission is to empower individuals with the knowledge and skills they need to thrive in an AI-driven world. Through our carefully crafted courses, we make learning AI straightforward, engaging, and practical.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-foreground/80 leading-relaxed">
                  We envision a future where AI literacy is universal, enabling people from all walks of life to harness the power of artificial intelligence. By breaking down barriers to AI education, we're building a more informed and capable global community.
                </p>
              </div>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#00BFA5]/10 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-[#00BFA5]" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Focused Learning</h3>
                  <p className="text-sm text-foreground/70">
                    Bite-sized lessons designed for maximum retention and practical application.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#00BFA5]/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-[#00BFA5]" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Community First</h3>
                  <p className="text-sm text-foreground/70">
                    Learn alongside thousands of students in a supportive environment.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#00BFA5]/10 flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-6 h-6 text-[#00BFA5]" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Innovation</h3>
                  <p className="text-sm text-foreground/70">
                    Cutting-edge content that keeps pace with the rapidly evolving AI landscape.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#00BFA5]/10 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-[#00BFA5]" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Excellence</h3>
                  <p className="text-sm text-foreground/70">
                    High-quality courses developed by AI experts and educators.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Our Story</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>
                AI Bytes Learning was founded with a simple observation: while AI was rapidly transforming every industry, quality education about artificial intelligence remained inaccessible to most people. Courses were either too technical for beginners or too simplified for serious learners.
              </p>
              <p>
                We set out to change that by creating a learning platform that strikes the perfect balance—comprehensive enough to build real understanding, yet approachable enough for anyone to start their AI journey. Our "bytes" approach breaks down complex topics into digestible pieces that can be learned in 60 minutes.
              </p>
              <p>
                Today, we're proud to serve thousands of learners worldwide, from students and professionals to business leaders and curious minds. Our community spans diverse backgrounds and industries, united by a common goal: to understand and leverage the power of AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold text-[#00BFA5] mb-2">50+</p>
              <p className="text-sm text-foreground/70">Courses</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#00BFA5] mb-2">10K+</p>
              <p className="text-sm text-foreground/70">Students</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#00BFA5] mb-2">95%</p>
              <p className="text-sm text-foreground/70">Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#00BFA5] mb-2">24/7</p>
              <p className="text-sm text-foreground/70">Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
