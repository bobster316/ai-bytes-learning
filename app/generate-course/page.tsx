'use client';

// STANDALONE COURSE GENERATOR - NO AUTH REQUIRED

import { useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type GenerationStatus = 'idle' | 'generating' | 'completed' | 'failed';

export default function GenerateCoursePage() {
  const [courseName, setCourseName] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [duration, setDuration] = useState<30 | 45 | 60>(60);
  const [targetAudience, setTargetAudience] = useState('');

  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generationId, setGenerationId] = useState<number | null>(null);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

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
      const response = await fetch('/api/course/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName,
          difficultyLevel: difficulty,
          targetDuration: duration,
          targetAudience: targetAudience || undefined,
          generateAudio: false,
          generateImages: false,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to start generation');
      }

      setGenerationId(data.generationId);
      setCourseId(data.courseId);

      pollProgress(data.generationId);

    } catch (err) {
      console.error('Generation failed:', err);
      setStatus('failed');
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const pollProgress = async (genId: number) => {
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
    }, 2000);

    setTimeout(() => clearInterval(interval), 600000);
  };

  const handleReset = () => {
    setStatus('idle');
    setGenerationId(null);
    setCourseId(null);
    setError(null);
    setProgress(0);
    setCurrentStep('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="text-[#00BFA5]" size={36} />
            AI Course Generator
          </h1>
          <p className="text-lg text-foreground-subtle mt-2">
            Generate complete AI courses automatically - NO LOGIN REQUIRED
          </p>
        </div>

        {status === 'idle' && (
          <div className="space-y-6 bg-background-card border-2 border-[#E2E8F0] dark:border-[#334155] rounded-lg p-8 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Course Name *
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g., Introduction to Machine Learning"
                className="w-full px-4 py-3 border-2 border-[#E2E8F0] dark:border-[#334155] rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#00BFA5]"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Target Audience (Optional)
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Software engineers, Students"
                className="w-full px-4 py-3 border-2 border-[#E2E8F0] dark:border-[#334155] rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#00BFA5]"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!courseName.trim()}
              className="w-full py-6 text-lg font-semibold bg-[#00BFA5] hover:bg-[#00BFA5]/90 text-white"
            >
              <Sparkles className="mr-2" size={20} />
              Generate Course
            </Button>

            <div className="text-sm text-foreground-subtle">
              <p>ℹ️ Takes 2-5 minutes</p>
            </div>
          </div>
        )}

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
            </div>
          </div>
        )}

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
              <p><strong>Course ID:</strong> {courseId}</p>
              <p><strong>Generation ID:</strong> {generationId}</p>
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

            <Button
              onClick={handleReset}
              className="w-full bg-[#00BFA5] hover:bg-[#00BFA5]/90 text-white"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
