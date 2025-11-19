'use client';

import { Header } from '@/components/header';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Test Page - No Auth Required</h1>
        <p className="text-foreground-subtle mb-8">If you can see this, the page loaded successfully without authentication!</p>

        <div className="bg-background-card border-2 border-[#E2E8F0] dark:border-[#334155] rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Next Step:</h2>
          <p className="mb-4">Now try accessing the actual course generator at:</p>
          <a
            href="/admin/courses/generate"
            className="text-[#00BFA5] hover:underline font-mono"
          >
            /admin/courses/generate
          </a>
        </div>
      </div>
    </div>
  );
}
