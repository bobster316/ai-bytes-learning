import React from "react";
import { Header } from "@/components/header";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Users, Sparkles } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard className="w-6 h-6 text-[#00BFA5]" />
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <p className="text-foreground-subtle">Manage your AI Bytes Learning platform</p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="border-b-2 border-[#E2E8F0] dark:border-[#334155] mb-8">
          <nav className="flex gap-6">
            <Link
              href="/admin/courses"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground-subtle hover:text-foreground hover:border-b-2 hover:border-[#00BFA5] transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Courses
            </Link>
            <Link
              href="/admin/courses/generate"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground-subtle hover:text-foreground hover:border-b-2 hover:border-[#00BFA5] transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              AI Course Generator
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground-subtle hover:text-foreground hover:border-b-2 hover:border-[#00BFA5] transition-colors"
            >
              <Users className="w-4 h-4" />
              Users
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
