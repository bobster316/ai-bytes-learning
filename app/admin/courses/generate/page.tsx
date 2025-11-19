'use client';

// ========================================
// Admin: AI Course Generator Page
// ========================================

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type GenerationStatus = 'idle' | 'generating' | 'completed' | 'failed';

export default function CourseGeneratorPage() {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [duration, setDuration] = useState<30 | 45 | 60>(60);
  const [targetAudience, setTargetAudience] = useState('');

  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  /**
   * Auto-generate course description when course name is entered
   */
  const handleCourseNameBlur = async () => {
    if (!courseName.trim() || courseDescription.trim()) {
      return; // Skip if no course name or description already exists
    }

    setIsGeneratingDescription(true);
    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseName: courseName.trim() }),
      });

      const data = await response.json();
      if (data.description) {
        setCourseDescription(data.description);
      }
    } catch (err) {
      console.error('Failed to generate description:', err);
      // Silently fail - user can manually enter description
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  /**
   * Start course generation
   */
  const handleGenerate = async () => {
    if (!courseName.trim()) {
      alert('Please enter a course name');
      return;
    }

    setStatus('generating');
    setError(null);
    setProgress(0);
    setCurrentStep('Initiating generation...');

    try {
      // Call API to start generation
      const response = await fetch('/api/course/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName,
          courseDescription: courseDescription || undefined,
          difficultyLevel: difficulty,
          targetDuration: duration,
          targetAudience: targetAudience || undefined,
          generateAudio: false, // Disabled for Week 2
          generateImages: false, // Disabled for Week 2
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to start generation');
      }

      setGenerationId(data.generationId);
      setCourseId(data.courseId);

      // Poll for progress
      pollProgress(data.generationId);

    } catch (err) {
      console.error('Generation failed:', err);
      setStatus('failed');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  /**
   * Poll generation progress
   */
  const pollProgress = async (genId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/course/generate/${genId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          clearInterval(interval);
          setStatus('completed');
          setProgress(100);
          setCurrentStep('Complete!');
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setStatus('failed');
          setError(data.error || 'Generation failed');
        } else if (data.progress) {
          setProgress(data.progress.percentComplete);
          setCurrentStep(data.progress.currentStep);
        }
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      }
    }, 2000); // Poll every 2 seconds

    // Stop polling after 10 minutes (safety)
    setTimeout(() => clearInterval(interval), 600000);
  };

  /**
   * Reset form
   */
  const handleReset = () => {
    setStatus('idle');
    setGenerationId(null);
    setCourseId(null);
    setError(null);
    setProgress(0);
    setCurrentStep('');
  };

  return (
    <div className="max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Sparkles className="text-[#00BFA5]" size={32} />
          AI Course Generator
        </h2>
        <p className="text-lg text-foreground-subtle mt-2">
          Generate complete AI courses automatically with just a course name
        </p>
      </div>

      <div>

        {/* Generation Form */}
        {status === 'idle' && (
          <div className="space-y-6 bg-background-card border-2 border-[#E2E8F0] dark:border-[#334155] rounded-lg p-8 shadow-sm">
            {/* Course Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Course Name *
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                onBlur={handleCourseNameBlur}
                placeholder="e.g., Introduction to Neural Networks"
                className="w-full px-4 py-3 border-2 border-[#E2E8F0] dark:border-[#334155] rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#00BFA5]"
              />
            </div>

            {/* Course Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Course Description
                {isGeneratingDescription && (
                  <span className="ml-2 text-xs text-[#00BFA5]">✨ Generating...</span>
                )}
              </label>
              <textarea
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="A brief description will be auto-generated when you enter a course name..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-[#E2E8F0] dark:border-[#334155] rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#00BFA5] resize-none"
              />
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Difficulty Level *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-4 py-3 rounded-lg border-2 capitalize transition-colors ${
                      difficulty === level
                        ? 'bg-[#00BFA5] text-white border-[#00BFA5]'
                        : 'border-[#E2E8F0] dark:border-[#334155] hover:border-[#00BFA5] text-foreground'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Target Duration *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {([30, 45, 60] as const).map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setDuration(mins)}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      duration === mins
                        ? 'bg-[#00BFA5] text-white border-[#00BFA5]'
                        : 'border-[#E2E8F0] dark:border-[#334155] hover:border-[#00BFA5] text-foreground'
                    }`}
                  >
                    {mins} minutes
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience (Optional) */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Target Audience (Optional)
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Software engineers, Students, Data scientists"
                className="w-full px-4 py-3 border-2 border-[#E2E8F0] dark:border-[#334155] rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#00BFA5]"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!courseName.trim()}
              className="w-full py-6 text-lg font-semibold bg-[#00BFA5] hover:bg-[#00BFA5]/90 text-white"
            >
              <Sparkles className="mr-2" size={20} />
              Generate Course
            </Button>

            {/* Info */}
            <div className="text-sm text-foreground-subtle">
              <p>ℹ️ Course generation typically takes 2-5 minutes</p>
              <p className="mt-1">✨ Week 2: Content generation only (images & audio in Week 3)</p>
            </div>
          </div>
        )}

        {/* Generating Status */}
        {status === 'generating' && (
          <div className="bg-background-card border-2 border-[#E2E8F0] dark:border-[#334155] rounded-lg p-8 shadow-sm">
            <div className="flex items-center justify-center mb-6">
              <Loader2 className="animate-spin text-[#00BFA5]" size={48} />
            </div>

            <h2 className="text-2xl font-bold text-center text-foreground mb-4">
              Generating Course...
            </h2>

            <p className="text-center text-foreground-subtle mb-6">
              {currentStep}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-background-subtle rounded-full h-4 mb-4">
              <div
                className="bg-[#00BFA5] h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-center text-sm text-foreground-subtle">
              {progress}% complete
            </p>

            <div className="mt-6 p-4 bg-background-subtle rounded-lg text-sm text-foreground">
              <p><strong>Course Name:</strong> {courseName}</p>
              <p><strong>Difficulty:</strong> {difficulty}</p>
              <p><strong>Duration:</strong> {duration} minutes</p>
              {generationId && (
                <p className="mt-2 text-xs font-mono break-all">
                  <strong>Generation ID:</strong> {generationId}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Success Status */}
        {status === 'completed' && (
          <div className="bg-background-card border-2 border-[#E2E8F0] dark:border-[#334155] rounded-lg p-8 shadow-sm">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle2 className="text-green-500" size={64} />
            </div>

            <h2 className="text-2xl font-bold text-center text-foreground mb-4">
              Course Generated Successfully! 🎉
            </h2>

            <div className="mb-6 p-4 bg-background-subtle rounded-lg text-foreground">
              <p><strong>Course Name:</strong> {courseName}</p>
              <p><strong>Course ID:</strong> <code className="text-xs">{courseId}</code></p>
              <p><strong>Generation ID:</strong> <code className="text-xs">{generationId}</code></p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => window.open(`/courses/${courseId}`, '_blank')}
                className="flex-1 bg-[#00BFA5] hover:bg-[#00BFA5]/90 text-white"
              >
                View Course
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
              >
                Generate Another
              </Button>
            </div>
          </div>
        )}

        {/* Error Status */}
        {status === 'failed' && (
          <div className="bg-background-card border border-red-500 rounded-lg p-8 shadow-sm">
            <div className="flex items-center justify-center mb-6">
              <XCircle className="text-red-500" size={64} />
            </div>

            <h2 className="text-2xl font-bold text-center text-foreground mb-4">
              Generation Failed
            </h2>

            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-600 dark:text-red-400">
                {error || 'An unknown error occurred'}
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleReset}
                className="flex-1 bg-[#00BFA5] hover:bg-[#00BFA5]/90 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
