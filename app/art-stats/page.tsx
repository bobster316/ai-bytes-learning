'use client';

import { useState } from 'react';
import { getGroqClient } from '@/lib/ai/groq';
import type { ArtStatsContext, AIGeneratedArtStats } from '@/lib/mcp/schemas/art-stats';

export default function ArtStatsPage() {
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState<'infographic' | 'minimalist' | 'academic'>('infographic');
  const [artStats, setArtStats] = useState<AIGeneratedArtStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setArtStats(null);

    const context: ArtStatsContext = {
      task: 'generate_art_stats',
      subject,
      style,
    };

    const groqClient = getGroqClient();
    const stats = await groqClient.generateArtStats(context);

    setArtStats(stats);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Structured Art Stats Generator</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Art Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Renaissance paintings"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="style" className="block text-sm font-medium text-gray-700">
            Style
          </label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value as 'infographic' | 'minimalist' | 'academic')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="infographic">Infographic</option>
            <option value="minimalist">Minimalist</option>
            <option value="academic">Academic</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading || !subject}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Stats'}
        </button>
      </form>

      {artStats && (
        <div>
          <h2 className="text-2xl font-bold mb-2">{artStats.title}</h2>
          <p className="mb-4">{artStats.summary}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artStats.stats.map((stat, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p className="text-lg font-semibold">{stat.label}</p>
                <p className="text-3xl font-bold">
                  {stat.value} {stat.unit}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
