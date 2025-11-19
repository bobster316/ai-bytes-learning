// ========================================
// Image Fetching Service
// Fetches relevant images from Unsplash or Pexels
// ========================================

import type { LessonImage } from '../types/course-generator';

/**
 * Image Service for fetching lesson images
 */
export class ImageService {
  private unsplashAccessKey: string | undefined;
  private pexelsApiKey: string | undefined;

  constructor() {
    this.unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
    this.pexelsApiKey = process.env.PEXELS_API_KEY;
  }

  /**
   * Fetch images for a lesson based on keywords
   * Returns at least 2 images (minimum requirement for best-in-class e-learning)
   */
  async fetchLessonImages(
    lessonId: string,
    keywords: string[],
    minImages: number = 2
  ): Promise<Omit<LessonImage, 'id' | 'created_at'>[]> {
    const images: Omit<LessonImage, 'id' | 'created_at'>[] = [];

    try {
      // Try Unsplash first (better quality, free tier available)
      if (this.unsplashAccessKey && images.length < minImages) {
        const unsplashImages = await this.fetchFromUnsplash(keywords, minImages);
        images.push(
          ...unsplashImages.map((img, index) => ({
            lesson_id: lessonId,
            image_url: img.url,
            alt_text: img.alt,
            caption: img.description,
            order_index: images.length + index,
            source: 'unsplash' as const,
            source_attribution: `Photo by ${img.author} on Unsplash`,
          }))
        );
      }

      // Fallback to Pexels if needed
      if (this.pexelsApiKey && images.length < minImages) {
        const pexelsImages = await this.fetchFromPexels(keywords, minImages - images.length);
        images.push(
          ...pexelsImages.map((img, index) => ({
            lesson_id: lessonId,
            image_url: img.url,
            alt_text: img.alt,
            caption: img.description,
            order_index: images.length + index,
            source: 'pexels' as const,
            source_attribution: `Photo by ${img.author} on Pexels`,
          }))
        );
      }

      // Use placeholder images if no API keys available
      if (images.length < minImages) {
        const placeholders = this.generatePlaceholderImages(
          lessonId,
          keywords,
          minImages - images.length,
          images.length
        );
        images.push(...placeholders);
      }

      console.log(`✅ Fetched ${images.length} images for lesson ${lessonId}`);
      return images;

    } catch (error) {
      console.error('Error fetching images:', error);
      // Return placeholder images on error
      return this.generatePlaceholderImages(lessonId, keywords, minImages, 0);
    }
  }

  /**
   * Fetch images from Unsplash
   */
  private async fetchFromUnsplash(
    keywords: string[],
    count: number = 2
  ): Promise<Array<{ url: string; alt: string; description: string; author: string }>> {
    if (!this.unsplashAccessKey) {
      return [];
    }

    try {
      // Use first few keywords for search
      const query = keywords.slice(0, 3).join(' ');
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Client-ID ${this.unsplashAccessKey}`,
        },
      });

      if (!response.ok) {
        console.warn('Unsplash API error:', response.status);
        return [];
      }

      const data = await response.json();

      return (data.results || []).slice(0, count).map((photo: any) => ({
        url: photo.urls.regular,
        alt: photo.alt_description || photo.description || query,
        description: photo.description || photo.alt_description || `Image related to ${query}`,
        author: photo.user.name,
      }));

    } catch (error) {
      console.error('Unsplash fetch error:', error);
      return [];
    }
  }

  /**
   * Fetch images from Pexels
   */
  private async fetchFromPexels(
    keywords: string[],
    count: number = 2
  ): Promise<Array<{ url: string; alt: string; description: string; author: string }>> {
    if (!this.pexelsApiKey) {
      return [];
    }

    try {
      const query = keywords.slice(0, 3).join(' ');
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;

      const response = await fetch(url, {
        headers: {
          'Authorization': this.pexelsApiKey,
        },
      });

      if (!response.ok) {
        console.warn('Pexels API error:', response.status);
        return [];
      }

      const data = await response.json();

      return (data.photos || []).slice(0, count).map((photo: any) => ({
        url: photo.src.large,
        alt: photo.alt || query,
        description: photo.alt || `Image related to ${query}`,
        author: photo.photographer,
      }));

    } catch (error) {
      console.error('Pexels fetch error:', error);
      return [];
    }
  }

  /**
   * Generate placeholder images (fallback)
   * Uses picsum.photos for random, high-quality placeholder images
   */
  private generatePlaceholderImages(
    lessonId: string,
    keywords: string[],
    count: number,
    startIndex: number
  ): Omit<LessonImage, 'id' | 'created_at'>[] {
    return Array.from({ length: count }, (_, index) => {
      const seed = `${lessonId}-${index}`;
      const keyword = keywords[index % keywords.length] || 'learning';

      return {
        lesson_id: lessonId,
        image_url: `https://picsum.photos/seed/${seed}/1200/675`, // 16:9 aspect ratio
        alt_text: `Illustration for ${keyword}`,
        caption: `Visual representation of ${keyword} concept`,
        order_index: startIndex + index,
        source: 'placeholder' as any,
        source_attribution: 'Lorem Picsum',
      };
    });
  }

  /**
   * Batch fetch images for multiple lessons
   */
  async fetchBatchLessonImages(
    lessons: Array<{ id: string; keywords: string[] }>,
    minImagesPerLesson: number = 2
  ): Promise<Record<string, Omit<LessonImage, 'id' | 'created_at'>[]>> {
    const results: Record<string, Omit<LessonImage, 'id' | 'created_at'>[]> = {};

    // Process in batches to avoid rate limits
    const batchSize = 3;
    for (let i = 0; i < lessons.length; i += batchSize) {
      const batch = lessons.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (lesson) => {
          results[lesson.id] = await this.fetchLessonImages(
            lesson.id,
            lesson.keywords,
            minImagesPerLesson
          );
        })
      );

      // Small delay between batches
      if (i + batchSize < lessons.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return results;
  }
}

/**
 * Get singleton image service instance
 */
let imageServiceInstance: ImageService | null = null;

export function getImageService(): ImageService {
  if (!imageServiceInstance) {
    imageServiceInstance = new ImageService();
  }
  return imageServiceInstance;
}
