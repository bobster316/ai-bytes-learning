'use client';

import { useEffect, useState } from 'react';

interface LessonContentProps {
  content: string;
  title: string;
}

export function LessonContent({ content, title }: LessonContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="text-muted-foreground text-center py-12">
        <p>Loading lesson content...</p>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={content}
      className="w-full border-0 min-h-screen"
      style={{ height: '100vh', minHeight: '2000px' }}
      title={title}
      sandbox="allow-same-origin allow-scripts"
    />
  );
}
