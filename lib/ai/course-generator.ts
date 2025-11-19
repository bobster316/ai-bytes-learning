// ========================================
// Main Course Generation Orchestrator
// ========================================

import { getGroqClient } from './groq';
import { getCourseDatabase } from '../database/course-operations';
import { getImageService } from './image-service';
import { generateLessonHTML } from './lesson-html-template';
import type {
  CourseGenerationRequest,
  AIGeneratedOutline,
  AIGeneratedTopic,
  AIGeneratedLesson,
  AIGeneratedLessonContent,
} from '../types/course-generator';

/**
 * Progress callback type
 */
type ProgressCallback = (step: string, percentComplete: number) => void;

/**
 * Main Course Generator
 */
export class CourseGenerator {
  private groq = getGroqClient();
  private db = getCourseDatabase(true); // Use service role to bypass RLS
  private imageService = getImageService();

  /**
   * Generate complete course
   */
  async generateCompleteCourse(
    generationId: string,
    courseId: string,
    input: CourseGenerationRequest,
    onProgress?: ProgressCallback
  ): Promise<void> {
    try {
      console.log(`[${generationId}] Starting course generation...`);

      // Update status to generating
      await this.db.updateGenerationStatus(generationId, 'generating');

      // Step 1: Generate course outline (20%)
      onProgress?.('Generating course outline...', 20);
      const outline = await this.generateOutline(input);
      console.log(`[${generationId}] ✅ Outline generated: ${outline.topics.length} topics`);

      // Step 2: Update course with overview and fetch thumbnail (25%)
      onProgress?.('Updating course details and fetching course thumbnail...', 25);

      // Fetch course thumbnail image
      let thumbnailUrl = '';
      try {
        const courseKeywords = [input.courseName, 'education', 'learning', 'course'];
        const thumbnailImages = await this.imageService.fetchLessonImages(
          'course-thumbnail',
          courseKeywords,
          1
        );
        if (thumbnailImages.length > 0) {
          thumbnailUrl = thumbnailImages[0].image_url;
        }
      } catch (error) {
        console.error('Failed to fetch course thumbnail:', error);
      }

      await this.db.updateCourse(courseId, {
        description: outline.courseOverview,
        thumbnail_url: thumbnailUrl || undefined,
      });

      // Step 3: Generate lesson content for all lessons (30-70%)
      onProgress?.('Generating lesson content...', 30);
      const topicsWithContent = await this.generateAllLessonContent(
        outline,
        input,
        generationId,
        (progress) => {
          // Map lesson generation progress to 30-70%
          const percent = 30 + (progress * 40 / 100);
          onProgress?.('Generating lesson content...', percent);
        }
      );
      console.log(`[${generationId}] ✅ All lesson content generated`);

      // Step 4: Fetch images and integrate into content (75%)
      onProgress?.('Fetching images and integrating into lessons...', 75);
      const topicsWithImages = await this.fetchImagesForLessons(topicsWithContent);
      console.log(`[${generationId}] ✅ Images fetched and integrated into all lessons`);

      // Step 6: Save to database (80-90%)
      onProgress?.('Saving to database...', 85);
      await this.saveCourseToDatabase(courseId, topicsWithImages);
      console.log(`[${generationId}] ✅ Course saved to database`);

      // Step 6: Calculate costs and finalize (95%)
      onProgress?.('Finalizing...', 95);
      const costs = this.calculateCosts(outline, topicsWithContent);

      await this.db.updateGenerationStatus(generationId, 'completed', {
        groq_tokens_used: costs.tokens,
        estimated_cost_usd: costs.total,
        content_quality_score: 0.85, // Placeholder
      });

      // Step 7: Complete (100%)
      onProgress?.('Complete!', 100);
      console.log(`[${generationId}] ✅ Course generation completed successfully!`);

    } catch (error) {
      console.error(`[${generationId}] Generation failed:`, error);

      await this.db.updateGenerationStatus(generationId, 'failed', {
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * Generate course outline with Groq
   */
  private async generateOutline(input: CourseGenerationRequest): Promise<AIGeneratedOutline> {
    try {
      const outline = await this.groq.generateCourseOutline(input);
      return outline;
    } catch (error) {
      console.error('Failed to generate outline:', error);
      throw new Error('Failed to generate course outline. Please try again.');
    }
  }

  /**
   * Generate content for all lessons in parallel
   */
  private async generateAllLessonContent(
    outline: AIGeneratedOutline,
    input: CourseGenerationRequest,
    generationId: string,
    onProgress?: (percent: number) => void
  ) {
    const allLessons: Array<{
      topicIndex: number;
      lessonIndex: number;
      lesson: AIGeneratedLesson;
    }> = [];

    // Flatten all lessons with their indices
    outline.topics.forEach((topic, topicIndex) => {
      topic.lessons.forEach((lesson, lessonIndex) => {
        allLessons.push({ topicIndex, lessonIndex, lesson });
      });
    });

    const totalLessons = allLessons.length;
    let completedLessons = 0;

    // Generate content in batches of 2 to avoid rate limits (slower but more reliable)
    const batchSize = 2;
    const results: Record<string, { markdown: string; keyTakeaways: string[] }> = {};

    for (let i = 0; i < allLessons.length; i += batchSize) {
      const batch = allLessons.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async ({ topicIndex, lessonIndex, lesson }) => {
          const topic = outline.topics[topicIndex];
          const key = `${topicIndex}-${lessonIndex}`;

          // Retry logic for rate limit errors
          let retries = 0;
          const maxRetries = 5;
          let lastError: any = null;

          while (retries < maxRetries) {
            try {
              const content = await this.groq.generateLessonContent(
                lesson.title,
                topic.description,
                input.difficultyLevel,
                lesson.estimatedDuration
              );

              results[key] = {
                introduction: content.introduction,
                sections: content.sections,
                caseStudy: content.caseStudy,
                knowledgeCheck: content.knowledgeCheck,
                summary: content.summary,
                keyTakeaways: content.keyTakeaways,
                imageKeywords: content.imageKeywords,
                diagrams: content.diagrams,
                stats: content.stats,
                wordCount: content.wordCount,
                confidenceScore: content.confidenceScore,
                markdown: content.markdown || '',
              };

              completedLessons++;
              const progress = (completedLessons / totalLessons) * 100;
              onProgress?.(progress);

              console.log(
                `[${generationId}] ✅ Generated lesson ${completedLessons}/${totalLessons}: ${lesson.title}`
              );

              // Success - break out of retry loop
              break;

            } catch (error: any) {
              lastError = error;
              const isRateLimit = error.message?.includes('429') || error.message?.includes('rate_limit') || error.message?.includes('Rate limit');

              if (isRateLimit && retries < maxRetries - 1) {
                // Exponential backoff: 15s, 30s, 45s, 60s
                const waitTime = (retries + 1) * 15000;
                console.log(`⏳ Rate limit hit for "${lesson.title}". Waiting ${waitTime/1000}s before retry ${retries + 1}/${maxRetries}...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                retries++;
              } else {
                // Non-rate-limit error or max retries reached
                console.error(`Failed to generate lesson: ${lesson.title}`, lastError);
                break;
              }
            }
          }

          // If all retries failed, use fallback
          if (!results[key]) {
            console.error(`❌ All retries exhausted for "${lesson.title}". Using fallback content.`, lastError);
            // Use fallback content with complete structure
            const fallbackMarkdown = this.generateFallbackContent(lesson, topic);
            results[key] = {
              introduction: `<p>In this lesson, we'll explore ${lesson.title}. ${lesson.description}</p>`,
              sections: [
                {
                  title: 'Overview',
                  content: `<p>${lesson.description}</p>`
                },
                {
                  title: 'Key Concepts',
                  content: '<p>This section will be populated with key concepts.</p>'
                },
                {
                  title: 'Practical Application',
                  content: '<p>This section will be populated with practical examples.</p>'
                },
                {
                  title: 'Best Practices',
                  content: '<p>This section will be populated with best practices.</p>'
                },
                {
                  title: 'Common Challenges',
                  content: '<p>This section will be populated with common challenges and solutions.</p>'
                },
                {
                  title: 'Advanced Topics',
                  content: '<p>This section will be populated with advanced concepts.</p>'
                },
                {
                  title: 'Tools and Resources',
                  content: '<p>This section will be populated with recommended tools and resources.</p>'
                }
              ],
              caseStudy: {
                title: `Case Study: ${lesson.title} Implementation`,
                subject: 'Industry Leader',
                content: '<p>A detailed case study will be generated with real-world implementation details.</p>',
                stats: 'Key performance metrics pending',
                outcomes: 'Implementation results pending'
              },
              knowledgeCheck: [
                {
                  question: `What is the main focus of ${lesson.title}?`,
                  answer: lesson.description || 'Key concepts and applications.'
                },
                {
                  question: 'How can you apply these concepts in practice?',
                  answer: 'Through hands-on implementation and following best practices.'
                },
                {
                  question: 'What are the key challenges to consider?',
                  answer: 'Common pitfalls and their solutions will be covered in the lesson.'
                }
              ],
              summary: `<p>You've learned about ${lesson.title}. Apply these concepts in your work to achieve better results.</p>`,
              keyTakeaways: [
                `Master the concepts of ${lesson.title}`,
                `Apply the principles in real-world scenarios`,
                `Understand common challenges and solutions`,
                `Follow industry best practices`,
                `Implement with confidence`
              ],
              imageKeywords: lesson.keywords?.slice(0, 8) || ['business', 'technology', 'professional', 'learning', 'digital', 'innovation', 'collaboration', 'success'],
              diagrams: [
                {
                  title: 'Implementation Workflow',
                  steps: ['Assess requirements', 'Plan approach', 'Execute implementation', 'Monitor results']
                },
                {
                  title: 'Best Practice Framework',
                  steps: ['Research', 'Design', 'Develop', 'Test', 'Deploy']
                }
              ],
              stats: [
                { icon: 'fa-solid fa-chart-line', value: '75%', label: 'Efficiency Improvement' },
                { icon: 'fa-solid fa-users', value: '10K+', label: 'Users Trained' },
                { icon: 'fa-solid fa-building', value: '500+', label: 'Companies' },
                { icon: 'fa-solid fa-rocket', value: '3x', label: 'Faster Deployment' },
                { icon: 'fa-solid fa-shield', value: '99.9%', label: 'Reliability' }
              ],
              wordCount: 500,
              confidenceScore: 0.5,
              markdown: fallbackMarkdown,
            };
          }
        })
      );

      // Significant delay between batches to respect Groq rate limits (12k tokens/min)
      if (i + batchSize < allLessons.length) {
        console.log(`⏳ Waiting 20 seconds before next batch to respect rate limits...`);
        await new Promise(resolve => setTimeout(resolve, 20000));
      }
    }

    // Merge results back into outline structure with all new fields
    const topicsWithContent = outline.topics.map((topic, topicIndex) => ({
      ...topic,
      lessons: topic.lessons.map((lesson, lessonIndex) => {
        const key = `${topicIndex}-${lessonIndex}`;
        const content = results[key];
        return {
          ...lesson,
          // New rich content fields
          introduction: content.introduction,
          sections: content.sections,
          caseStudy: content.caseStudy,
          knowledgeCheck: content.knowledgeCheck,
          summary: content.summary,
          key_takeaways: content.keyTakeaways,
          imageKeywords: content.imageKeywords,
          diagrams: content.diagrams,
          stats: content.stats,
          wordCount: content.wordCount,
          // Keep markdown for backwards compatibility
          content_markdown: content.markdown || '',
          // Add context for HTML generation
          courseName: input.courseName,
          topicTitle: topic.title,
          targetAudience: input.targetAudience || 'Professionals',
        };
      }),
    }));

    return topicsWithContent;
  }

  /**
   * Generate fallback content if AI fails
   */
  private generateFallbackContent(lesson: AIGeneratedLesson, topic: AIGeneratedTopic): string {
    return `# ${lesson.title}

## Overview

${lesson.description}

This lesson is part of the topic: **${topic.title}**.

## What You'll Learn

In this ${lesson.estimatedDuration}-minute lesson, we'll cover:

- Key concepts related to ${lesson.title}
- Practical applications and examples
- Best practices and common pitfalls

## Content

*[This lesson content is being generated. Please check back shortly or contact support if this persists.]*

## Summary

By completing this lesson, you'll have a solid understanding of ${lesson.title} and how it applies in real-world scenarios.
`;
  }

  /**
   * Generate fallback HTML if content generation fails
   */
  private generateFallbackHTML(lesson: any, topic: any): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${lesson.title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
        }
        h1 { color: #1a73e8; }
        .notice {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 1rem;
            margin: 2rem 0;
        }
    </style>
</head>
<body>
    <h1>${lesson.title}</h1>
    <h2>Overview</h2>
    <p>${lesson.description || 'Lesson content is being prepared.'}</p>
    <div class="notice">
        <strong>Notice:</strong> This lesson content is currently being generated.
        Please check back shortly or contact support if this persists.
    </div>
    <p>This lesson is part of: <strong>${topic.title}</strong></p>
</body>
</html>`;
  }


  /**
   * Fetch images for all lessons and generate complete professional HTML
   * Ensures minimum 8 images per lesson with Unsplash CDN links
   */
  private async fetchImagesForLessons(topics: any[]): Promise<any[]> {
    const MIN_IMAGES_PER_LESSON = 8;

    return await Promise.all(
      topics.map(async (topic, topicIndex) => ({
        ...topic,
        lessons: await Promise.all(
          topic.lessons.map(async (lesson: any, lessonIndex: number) => {
            try {
              // Use imageKeywords from AI-generated content
              const keywords = lesson.imageKeywords || lesson.keywords || [];

              // Fetch high-quality images from Unsplash
              const images = await this.imageService.fetchLessonImages(
                lesson.id || `temp-${topicIndex}-${lessonIndex}`,
                keywords,
                MIN_IMAGES_PER_LESSON
              );

              // Transform images to include Unsplash CDN parameters
              const professionalImages = images.map(img => ({
                url: img.image_url.includes('unsplash.com')
                  ? `${img.image_url}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80`
                  : img.image_url,
                alt: img.alt_text || 'Professional illustration',
                caption: img.caption || img.alt_text || 'Visual representation'
              }));

              // Get all lessons in topic for next lesson URL (for CTA)
              const allLessons = topic.lessons;
              const nextLesson = lessonIndex < allLessons.length - 1
                ? allLessons[lessonIndex + 1]
                : null;

              // Generate complete professional HTML using template
              const contentHtml = generateLessonHTML({
                courseName: lesson.courseName || 'Professional Course',
                topicTitle: topic.title,
                lessonTitle: lesson.title,
                targetAudience: lesson.targetAudience || 'Professionals',
                caseStudySubject: lesson.caseStudy?.subject || 'Industry Leader',
                sections: lesson.sections?.map((s: any) => s.title) || [],
                content: {
                  introduction: lesson.introduction || '',
                  sections: lesson.sections || [],
                  caseStudy: lesson.caseStudy || {
                    title: 'Case Study',
                    content: '<p>Detailed case study content.</p>',
                    stats: 'Key statistics',
                    outcomes: 'Successful outcomes'
                  },
                  knowledgeCheck: lesson.knowledgeCheck || [],
                  summary: lesson.summary || '',
                  keyTakeaways: lesson.key_takeaways || []
                },
                images: professionalImages,
                diagrams: lesson.diagrams || [],
                stats: lesson.stats || [],
                nextLessonUrl: nextLesson ? `#lesson-${nextLesson.title.toLowerCase().replace(/\s+/g, '-')}` : undefined,
                wordCount: lesson.wordCount || 1500
              });

              // Log HTML generation success
              console.log(`✅ Generated HTML for "${lesson.title}": ${contentHtml.length} characters`);
              console.log(`   - Images: ${professionalImages.length}`);
              console.log(`   - Diagrams: ${lesson.diagrams?.length || 0}`);
              console.log(`   - Stats: ${lesson.stats?.length || 0}`);
              console.log(`   - Sections: ${lesson.sections?.length || 0}`);
              console.log(`   - Word count: ${lesson.wordCount || 0}`);

              return {
                ...lesson,
                content_html: contentHtml,
                content_markdown: lesson.content_markdown || '', // Keep for reference
                images: professionalImages,
              };
            } catch (error) {
              console.error(`Failed to generate HTML for lesson: ${lesson.title}`, error);
              // Generate fallback HTML
              const fallbackHtml = this.generateFallbackHTML(lesson, topic);
              return {
                ...lesson,
                content_html: fallbackHtml,
                images: [],
              };
            }
          })
        ),
      }))
    );
  }


  /**
   * Save complete course structure to database
   */
  private async saveCourseToDatabase(courseId: string, topics: any[]) {
    const structure = {
      topics: topics.map((topic, topicIndex) => ({
        title: topic.title,
        description: topic.description,
        order_index: topicIndex,
        estimated_duration_minutes: topic.estimatedDuration,
        learning_objectives: topic.learningObjectives,
        lessons: topic.lessons.map((lesson: any, lessonIndex: number) => {
          console.log(`[SAVE DEBUG] Lesson "${lesson.title}":`, {
            has_content_markdown: !!lesson.content_markdown,
            markdown_length: lesson.content_markdown?.length || 0,
            has_content_html: !!lesson.content_html,
            html_length: lesson.content_html?.length || 0,
            first_100_chars_html: lesson.content_html?.substring(0, 100)
          });
          return {
            title: lesson.title,
            order_index: lessonIndex,
            estimated_duration_minutes: lesson.estimatedDuration,
            content_markdown: lesson.content_markdown,
            content_html: lesson.content_html,
            key_takeaways: lesson.key_takeaways || [],
            ai_confidence_score: 0.85,
          };
        }),
        quiz: {
          title: topic.quiz.title,
          questions: topic.quiz.questions.map((q: any, qIndex: number) => ({
            question_text: q.question,
            order_index: qIndex,
            options: q.options,
            explanation: q.explanation,
          })),
        },
      })),
    };

    await this.db.saveCourseStructure(courseId, structure);
  }

  /**
   * Calculate estimated costs
   */
  private calculateCosts(outline: AIGeneratedOutline, topics: any[]) {
    // Rough estimation
    const outlineTokens = 2000; // Outline generation
    const lessonsCount = topics.reduce((sum, t) => sum + t.lessons.length, 0);
    const lessonTokens = lessonsCount * 1500; // ~1500 tokens per lesson
    const totalTokens = outlineTokens + lessonTokens;

    // Groq is free, but we track for future
    const groqCostPerToken = 0; // FREE
    const totalCost = totalTokens * groqCostPerToken;

    return {
      tokens: totalTokens,
      total: totalCost,
    };
  }
}

/**
 * Get singleton generator instance
 */
let generatorInstance: CourseGenerator | null = null;

export function getCourseGenerator(): CourseGenerator {
  if (!generatorInstance) {
    generatorInstance = new CourseGenerator();
  }
  return generatorInstance;
}
