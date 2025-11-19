"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight, BookOpen, Home, ChevronRight } from "lucide-react";
import Link from "next/link";

// Blog post interface
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
}

// Sample blog posts
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with AI: A Beginner's Guide",
    excerpt: "Learn the fundamentals of artificial intelligence and how to start your journey into this exciting field.",
    date: "2025-11-05",
    readTime: "5 min read",
    category: "Beginner",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    author: {
      name: "AI Bytes Team",
      avatar: "/ai-bytes-logo.png"
    }
  },
  {
    id: "2",
    title: "Understanding Machine Learning Algorithms",
    excerpt: "Deep dive into the most popular machine learning algorithms and when to use each one.",
    date: "2025-11-03",
    readTime: "8 min read",
    category: "Intermediate",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
    author: {
      name: "AI Bytes Team",
      avatar: "/ai-bytes-logo.png"
    }
  },
  {
    id: "3",
    title: "Prompt Engineering Best Practices",
    excerpt: "Master the art of crafting effective prompts for AI models like ChatGPT and other LLMs.",
    date: "2025-11-01",
    readTime: "6 min read",
    category: "Advanced",
    image: "https://images.unsplash.com/photo-1676573409381-c0d74a44f7ad?w=800&h=600&fit=crop",
    author: {
      name: "AI Bytes Team",
      avatar: "/ai-bytes-logo.png"
    }
  },
  {
    id: "4",
    title: "AI Ethics: Building Responsible AI Systems",
    excerpt: "Explore the ethical considerations and best practices for developing responsible AI applications.",
    date: "2025-10-28",
    readTime: "7 min read",
    category: "Ethics",
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=600&fit=crop",
    author: {
      name: "AI Bytes Team",
      avatar: "/ai-bytes-logo.png"
    }
  },
  {
    id: "5",
    title: "Python for AI: Essential Libraries You Need",
    excerpt: "Discover the must-know Python libraries for AI development including TensorFlow, PyTorch, and more.",
    date: "2025-10-25",
    readTime: "10 min read",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop",
    author: {
      name: "AI Bytes Team",
      avatar: "/ai-bytes-logo.png"
    }
  },
  {
    id: "6",
    title: "Natural Language Processing in 2025",
    excerpt: "The latest trends and breakthroughs in NLP, from transformers to multimodal models.",
    date: "2025-10-20",
    readTime: "9 min read",
    category: "NLP",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop",
    author: {
      name: "AI Bytes Team",
      avatar: "/ai-bytes-logo.png"
    }
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      {/* Navigation Breadcrumb */}
      <nav className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Link href="/" className="flex items-center gap-1 hover:text-[#00BFA5] transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Blog</span>
            </div>

            {/* Quick Navigation Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link href="/" className="text-foreground/70 hover:text-[#00BFA5] transition-colors">
                Home
              </Link>
              <Link href="/courses" className="text-foreground/70 hover:text-[#00BFA5] transition-colors">
                Courses
              </Link>
              <Link href="/pricing" className="text-foreground/70 hover:text-[#00BFA5] transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-foreground/70 hover:text-[#00BFA5] transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-background-inverse border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="w-4 h-4 mr-1" />
              BLOG
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground-inverse mb-4">
              AI Bytes <span className="text-[#00BFA5]">Blog</span>
            </h1>
            <p className="text-base text-foreground-inverse/70 leading-relaxed">
              Insights, tutorials, and the latest updates on artificial intelligence and machine learning
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post) => (
              <Link href={`/blog/${post.id}`} key={post.id} className="group">
                <Card className="h-full flex flex-col bg-card border-border shadow-sm hover:shadow-xl hover:border-[#00BFA5]/50 transition-all duration-300 overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#00BFA5] text-foreground-inverse">
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardHeader className="flex-grow">
                    <h2 className="text-xl font-bold text-foreground group-hover:text-[#00BFA5] transition-colors line-clamp-2 mb-3">
                      {post.title}
                    </h2>
                    <p className="text-foreground/80 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardHeader>

                  {/* Footer */}
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-foreground/60 pt-4 border-t border-border">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Want to Learn More?
          </h2>
          <p className="text-foreground/80 mb-8 max-w-2xl mx-auto">
            Join our AI Bytes community and get access to exclusive courses, tutorials, and resources
          </p>
          <Link href="/courses">
            <button className="bg-[#00BFA5] text-foreground-inverse px-8 py-3 rounded-lg font-semibold hover:bg-[#00A896] transition-colors shadow-lg">
              Explore Courses
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
