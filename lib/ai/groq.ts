// ========================================
// AI API Client for Course Generation
// Supports: Groq, OpenRouter, OpenAI, Together AI
// ========================================

import { validateAIGeneratedOutline } from '@/lib/validations/course-generator';
import type {
  AIGeneratedOutline,
  AIGeneratedLessonContent,
  CourseGenerationRequest,
  DifficultyLevel
} from '@/lib/types/course-generator';
// ?? NEW IMPORT: Import the JSON repair function
import { parseAndRepairJson } from './json-repair-utility'; 


// Auto-detect API provider based on available keys
const getAPIConfig = () => {
  // Priority: Gemini > xAI Grok > Groq > OpenAI > OpenRouter > Together
  if (process.env.GEMINI_API_KEY) {
    return {
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
      key: process.env.GEMINI_API_KEY,
      model: 'gemini-1.5-pro',
      provider: 'Google Gemini'
    };
  }
  if (process.env.XAI_API_KEY) {
    return {
      url: 'https://api.x.ai/v1/chat/completions',
      key: process.env.XAI_API_KEY,
      model: 'grok-2-1212', // Grok-2 (December 2024 version)
      provider: 'xAI Grok'
    };
  }
  if (process.env.GROQ_API_KEY) {
    return {
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile', // Updated to latest Llama 3.3 70B
      provider: 'Groq'
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      url: 'https://api.openai.com/v1/chat/completions',
      key: process.env.OPENAI_API_KEY,
      model: 'gpt-4-turbo-preview', // Upgraded from gpt-3.5 for better complex JSON
      provider: 'OpenAI'
    };
  }
  if (process.env.OPENROUTER_API_KEY) {
    return {
      url: 'https://openrouter.ai/api/v1/chat/completions',
      key: process.env.OPENROUTER_API_KEY,
      model: 'google/gemini-2.0-flash-exp:free', // Confirmed free model 2025
      provider: 'OpenRouter'
    };
  }
  if (process.env.TOGETHER_API_KEY) {
    return {
      url: 'https://api.together.xyz/v1/chat/completions',
      key: process.env.TOGETHER_API_KEY,
      model: 'meta-llama/Llama-3-70b-chat-hf',
      provider: 'Together AI'
    };
  }

  throw new Error('No AI API key found. Set one of: GEMINI_API_KEY, XAI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY, OPENAI_API_KEY, or TOGETHER_API_KEY');
};

/**
 * Universal AI API Client
 */
export class GroqClient {
  private apiUrl: string;
  private apiKey: string;
  private model: string;
  private provider: string;

  constructor() {
    const config = getAPIConfig();
    this.apiUrl = config.url;
    this.apiKey = config.key;
    this.model = config.model;
    this.provider = config.provider;

    console.log(`[AI Client] Using ${this.provider} with model: ${this.model}`);
  }

  /**
   * Make a request to AI API (works with Gemini, Groq, OpenRouter, OpenAI, Together)
   */
  private async makeRequest(
    messages: Array<{ role: string; content: string }>,
    temperature: number = 0.7,
    maxTokens: number = 8000
  ): Promise<any> {
    try {
      // Handle Gemini's different API format
      if (this.provider === 'Google Gemini') {
        return await this.makeGeminiRequest(messages, temperature, maxTokens);
      }

      // Adjust max_tokens based on provider limits
      let adjustedMaxTokens = maxTokens;
      if (this.provider === 'OpenAI') {
        // GPT-3.5-turbo has a 4096 token limit for completion
        adjustedMaxTokens = Math.min(maxTokens, 4096);
      }

      const body: any = {
        model: this.model,
        messages,
        temperature,
        max_tokens: adjustedMaxTokens,
      };

      // Only add response_format for compatible providers
      if (this.provider === 'xAI Grok' || this.provider === 'Groq' || this.provider === 'OpenAI') {
        body.response_format = { type: 'json_object' };
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${this.provider} API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error(`${this.provider} API request failed:`, error);
      throw error;
    }
  }

  /**
   * Make a request to Google Gemini API (different format)
   */
  private async makeGeminiRequest(
    messages: Array<{ role: string; content: string }>,
    temperature: number = 0.7,
    maxTokens: number = 8000
  ): Promise<any> {
    try {
      // Convert OpenAI-style messages to Gemini format
      const contents = messages
        .filter(msg => msg.role !== 'system') // Gemini doesn't use system messages the same way
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      // Prepend system message to first user message if it exists
      const systemMessage = messages.find(msg => msg.role === 'system');
      if (systemMessage && contents.length > 0) {
        contents[0].parts[0].text = `${systemMessage.content}\n\n${contents[0].parts[0].text}`;
      }

      const body = {
        contents,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          responseMimeType: 'application/json', // Request JSON response
        },
      };

      const url = `${this.apiUrl}?key=${this.apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${this.provider} API error: ${response.status} - ${error}`);
      }

      const data = await response.json();

      // Convert Gemini response to OpenAI-compatible format
      const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!geminiText) {
        throw new Error('No content in Gemini response');
      }

      return {
        choices: [
          {
            message: {
              content: geminiText,
              role: 'assistant'
            }
          }
        ]
      };

    } catch (error) {
      console.error(`${this.provider} API request failed:`, error);
      throw error;
    }
  }

  /**
   * Generate simple text completion (for descriptions, summaries, etc.)
   */
  async generateText(
    systemPrompt: string,
    userPrompt: string,
    temperature: number = 0.7,
    maxTokens: number = 500
  ): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ];

    const response = await this.makeRequest(messages, temperature, maxTokens);
    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from AI API');
    }

    return content.trim();
  }

  /**
   * Generate complete course outline
   */
  async generateCourseOutline(
    input: CourseGenerationRequest
  ): Promise<AIGeneratedOutline> {
    const maxRetries = 3;
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const prompt = this.buildCourseOutlinePrompt(input);

        // ?? CHANGE 1: Emphasize JSON-only output in system prompt to prevent preamble/postamble
        const messages = [
          {
            role: 'system',
            content: 'You are an expert AI educator specializing in creating comprehensive, engaging course content. Your ONLY output MUST be a single, complete, valid JSON object. DO NOT include any text or commentary outside of the JSON block.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ];

        // Increase max tokens for comprehensive course outline (4 topics × 4 lessons with descriptions)
        const response = await this.makeRequest(messages, 0.8, 10000);
        let content = response.choices[0]?.message?.content;

        if (!content) {
          throw new Error('No content returned from AI API');
        }

        // Parse and validate JSON response
        let parsedContent;
        try {
          parsedContent = JSON.parse(content);
        } catch (error) {
          console.error('Failed to parse course outline JSON. Attempting repair...');
          
          // ?? CHANGE 2: Attempt to repair the JSON
          parsedContent = parseAndRepairJson(content);
          
          if (!parsedContent) {
            console.error('Failed to parse course outline JSON, even after repair:', error);
            console.error('Raw content:', content.substring(0, 1000));
            throw new Error('Invalid JSON response from AI for course outline');
          }
          console.log('? JSON Repair successful for course outline.');
        }

        // Log what we received before validation
        console.log(`?? Course outline received (attempt ${attempt}/${maxRetries}): ${parsedContent.topics?.length || 0} topics`);
        if (parsedContent.topics) {
          parsedContent.topics.forEach((topic: any, idx: number) => {
            const questionCount = topic.quiz?.questions?.length || 0;
            console.log(`  Topic ${idx + 1}: "${topic.title}" with ${topic.lessons?.length || 0} lessons, ${questionCount} quiz questions`);
          });
        }

        // Validate against schema
        const validatedOutline = validateAIGeneratedOutline(parsedContent);

        // Additional validation logging
        if (validatedOutline.topics.length !== 4) {
          console.error(`? VALIDATION FAILED: Expected 4 topics, got ${validatedOutline.topics.length}`);
        }

        validatedOutline.topics.forEach((topic, idx) => {
          if (topic.lessons.length !== 4) {
            console.error(`? VALIDATION FAILED: Topic ${idx + 1} has ${topic.lessons.length} lessons (expected 4)`);
          }
          if (topic.quiz.questions.length < 5 || topic.quiz.questions.length > 7) {
            console.error(`? VALIDATION FAILED: Topic ${idx + 1} has ${topic.quiz.questions.length} quiz questions (expected 5-7)`);
          }
        });

        const totalLessons = validatedOutline.topics.reduce((sum, t) => sum + t.lessons.length, 0);
        console.log(`? Course outline validated: ${validatedOutline.topics.length} topics, ${totalLessons} total lessons`);

        return validatedOutline;

      } catch (error: any) {
        lastError = error;
        console.error(`? Attempt ${attempt}/${maxRetries} failed:`, error.message);

        // If this isn't the last attempt, wait before retrying
        if (attempt < maxRetries) {
          const waitTime = attempt * 2000; // 2s, 4s, 6s
          console.log(`? Retrying in ${waitTime/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    // All retries failed
    throw lastError || new Error('Failed to generate course outline after multiple attempts');
  }

  /**
   * Generate detailed lesson content with rich HTML structure
   */
  async generateLessonContent(
    lessonTitle: string,
    topicContext: string,
    difficultyLevel: DifficultyLevel,
    targetDuration: number
  ): Promise<AIGeneratedLessonContent> {
    const prompt = this.buildLessonContentPrompt(
      lessonTitle,
      topicContext,
      difficultyLevel,
      targetDuration
    );

    // ?? CHANGE 3: Emphasize JSON-only output in system prompt
    const messages = [
      {
        role: 'system',
        content: 'You are an expert educator creating professional, humanised e-learning content. Write in first-person with personal anecdotes and expert insights. Your ONLY output MUST be a single, complete, valid JSON object. DO NOT include any text or commentary outside of the JSON block.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    // Increase max tokens for comprehensive lesson content (1500-2000 words + JSON structure)
    const response = await this.makeRequest(messages, 0.7, 12000);
    let content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from AI API');
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse lesson content JSON. Attempting repair...');

      // ?? CHANGE 4: Attempt to repair the JSON for lesson content
      parsedContent = parseAndRepairJson(content);
        
      if (!parsedContent) {
        console.error('Failed to parse lesson content JSON, even after repair:', error);
        console.error('Raw content:', content.substring(0, 500));
        throw new Error('Invalid JSON response from AI for lesson content');
      }
      console.log('? JSON Repair successful for lesson content.');
    }

    // Validate that all required fields are present
    const result = {
      introduction: parsedContent.introduction || '',
      sections: parsedContent.sections || [],
      caseStudy: parsedContent.caseStudy || { title: '', subject: '', content: '', stats: '', outcomes: '' },
      knowledgeCheck: parsedContent.knowledgeCheck || [],
      summary: parsedContent.summary || '',
      keyTakeaways: parsedContent.keyTakeaways || [],
      imageKeywords: parsedContent.imageKeywords || [],
      diagrams: parsedContent.diagrams || [],
      stats: parsedContent.stats || [],
      wordCount: parsedContent.wordCount || 0,
      confidenceScore: parsedContent.confidenceScore || 0.8,
      // Keep markdown for backwards compatibility
      markdown: parsedContent.markdown || '',
    };

    // Log validation warnings
    if (!result.introduction) console.warn(`?? Missing introduction for lesson`);
    if (result.sections.length < 7) console.warn(`?? Only ${result.sections.length} sections (expected 7-8)`);
    if (!result.caseStudy.content) console.warn(`?? Missing case study content`);
    if (result.imageKeywords.length < 8) console.warn(`?? Only ${result.imageKeywords.length} image keywords (expected 8)`);
    if (result.diagrams.length < 2) console.warn(`?? Only ${result.diagrams.length} diagrams (expected 2)`);
    if (result.stats.length < 5) console.warn(`?? Only ${result.stats.length} stats (expected 5-6)`);
    if (result.wordCount < 1500) console.warn(`?? Word count ${result.wordCount} is below minimum 1500`);

    console.log(`? Lesson content validated: ${result.wordCount} words, ${result.sections.length} sections, ${result.imageKeywords.length} keywords`);

    return result;
  }
  
// ... (rest of the file remains the same) ...

  /**
   * Build prompt for course outline generation
   */
  private buildCourseOutlinePrompt(input: CourseGenerationRequest): string {
    const { courseName, difficultyLevel, targetDuration, targetAudience, topics } = input;

    return `Create a comprehensive ${targetDuration}-minute course on "${courseName}" for ${difficultyLevel} learners.

${targetAudience ? `Target Audience: ${targetAudience}` : ''}
${topics && topics.length > 0 ? `Specific Topics to Cover: ${topics.join(', ')}` : ''}

Generate a complete course outline with:

1. **Course Overview**: A comprehensive 3-4 sentence overview describing what students will learn and achieve
2. **Learning Objectives**: 5-8 clear, measurable, specific learning objectives
3. **Topics**: Create EXACTLY 4 topics (modules), each containing:
   - Topic title (clear, engaging, descriptive)
   - Topic description (**MINIMUM 200 WORDS** - must be comprehensive, detailed, and engaging)
   - Estimated duration (minutes)
   - Learning objectives for this topic (4-5 specific, measurable bullet points)
   - EXACTLY 4 Lessons per topic (NO LESS THAN 4) with:
     * Lesson title (specific and descriptive)
     * Detailed description (3-4 sentences explaining what will be covered)
     * Estimated duration (5-15 minutes - lessons should be substantial)
     * 5-8 relevant keywords for image search (variety: concepts, visuals, diagrams, examples)
   - Quiz with **EXACTLY 5-7 multiple-choice questions** (MINIMUM 5, MAXIMUM 7):
     * Thoughtful question text that tests understanding
     * EXACTLY 4 options (exactly one correct, others plausible but incorrect)
     * Detailed explanation of the correct answer (2-3 sentences)
   - 5-7 key takeaways for the topic (specific, actionable insights)

CRITICAL CONTENT REQUIREMENTS (MUST FOLLOW):
- You MUST create EXACTLY 4 topics - no more, no less
- Each topic MUST have EXACTLY 4 lessons - no more, no less
- Each topic MUST have EXACTLY 5-7 quiz questions (MINIMUM 5, MAXIMUM 7)
- Topic descriptions MUST be **MINIMUM 200 WORDS** - detailed, informative, engaging
- Lesson descriptions MUST be **detailed and specific** (3-4 sentences minimum)
- Each lesson MUST have 5-8 diverse keywords for finding professional images
- Content must be **completely jargon-free** and accessible to all learners
- Use **rich, practical, real-world examples** throughout
- Focus on **hands-on, applied learning** where applicable
- Explanations must be **comprehensive yet engaging**
- Each topic should tell a story and build on previous concepts
- Total duration must sum to approximately ${targetDuration} minutes
- Difficulty level: ${difficultyLevel} (adjust depth and complexity accordingly)
- Include diverse perspectives and inclusive examples
- Total lessons across all topics: 16 (4 topics × 4 lessons each)

QUALITY STANDARDS:
- Every description should be informative and valuable on its own
- Keywords should help find meaningful, relevant images
- Quiz questions should test real understanding, not just memorization
- Takeaways should be specific and actionable
- Create a logical flow and progression through the course

Respond with ONLY valid JSON in this exact format:
{
  "courseOverview": "...",
  "learningObjectives": ["...", "...", "...", "...", "..."],
  "topics": [
    {
      "title": "...",
      "description": "... (MINIMUM 200 WORDS - comprehensive, detailed, engaging description) ...",
      "estimatedDuration": 10,
      "learningObjectives": ["...", "...", "...", "..."],
      "lessons": [
        {
          "title": "...",
          "description": "... (3-4 detailed sentences) ...",
          "estimatedDuration": 10,
          "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
        }
      ],
      "quiz": {
        "title": "...",
        "questions": [
          {
            "question": "...",
            "options": [
              {"text": "...", "is_correct": false},
              {"text": "...", "is_correct": true},
              {"text": "...", "is_correct": false},
              {"text": "...", "is_correct": false}
            ],
            "explanation": "... (2-3 sentences explaining why this is correct) ..."
          },
          // ... MINIMUM 5 questions, MAXIMUM 7 questions (repeat this structure 5-7 times)
        ]
      },
      "keyTakeaways": ["...", "...", "...", "...", "..."]
    }
  ]
}`;
  }

  /**
   * Build prompt for lesson content generation (Professional HTML with rich content)
   */
  private buildLessonContentPrompt(
    lessonTitle: string,
    topicContext: string,
    difficultyLevel: DifficultyLevel,
    targetDuration: number
  ): string {
    return `You are an expert educator creating professional e-learning content. Generate comprehensive lesson content for a corporate-level online course.

**COURSE CONTEXT:**
- Lesson Title: "${lessonTitle}"
- Topic Context: "${topicContext}"
- Difficulty: ${difficultyLevel}
- Target Duration: ${targetDuration} minutes

**CRITICAL REQUIREMENTS (YOU MUST FOLLOW ALL OF THESE):**
1. **Word Count**: MINIMUM 1500 to MAXIMUM 2000 words of rich, humanised, first-person narrative
2. **Writing Style**: Write as if you're an expert sharing personal experiences and insights
3. **Real-World Focus**: Include industry jargon, realistic challenges, personal anecdotes
4. **Professional Tone**: Corporate, clean, suitable for Google/DeepMind-level companies
5. **British English**: Use British spelling and grammar throughout
6. **You MUST generate ALL sections**: introduction, 7-8 content sections, case study, knowledge check, summary
7. **You MUST provide 8 image keywords**: These are essential for visual content
8. **You MUST provide 2 workflow diagrams**: Each with 4-6 steps
9. **You MUST provide 5-6 infographic stats**: With Font Awesome icons

**CONTENT STRUCTURE:**

1. **Introduction** (200-300 words)
   - Write in first person ("In my 15 years working with...", "I've seen firsthand how...")
   - Personal hook that engages readers emotionally
   - Overview of what they'll learn and why it matters
   - Real-world context from your "experience"
   - Include specific anecdotes or observations

2. **Main Content Sections** (7-8 sections, 800-1200 words total)
   Create 7-8 detailed sections covering:
   - Core concepts with expert insights
   - Industry best practices you've "implemented"
   - Challenges you've "encountered" and solutions
   - Step-by-step methodologies
   - Common pitfalls and how to avoid them
   - Expert quotes (create realistic named experts with titles)
   - Specific statistics and data points
   - Personal observations and lessons learned

3. **Detailed Case Study** (250-350 words)
   A comprehensive real-world case study including:
   - Named organisation (real or realistic)
   - Specific dates and timeframes
   - Named stakeholders (with titles)
   - Quantified outcomes (percentages, costs, time saved, etc.)
   - Implementation challenges and solutions
   - Key lessons from the case study
   - Write as if you were personally involved or studied it in depth

4. **Knowledge Check Questions** (3-5 questions with answers)
   - Thought-provoking questions that test understanding
   - Detailed answers (2-3 sentences each)

5. **Summary & Key Takeaways** (150-200 words)
   - Personal reflection on the most important points
   - How to apply what was learned
   - Your "recommendations" for next steps
   - 5-7 specific, actionable key takeaways

**HUMANISATION REQUIREMENTS:**
- Use personal pronouns: "I've found that...", "In my experience...", "We discovered..."
- Include industry jargon appropriate for the topic
- Share "mistakes I've made" or challenges faced
- Reference specific tools, frameworks, methodologies by name
- Include realistic expert quotes: "As Dr. Sarah Chen, CTO of TechCorp, notes: '...'"
- Use conversational but professional language
- Share specific numbers and statistics
- Include dates, versions, specific technologies

**IMAGE KEYWORDS:**
Provide 8 descriptive keywords for sourcing professional Unsplash images:
- Keywords should describe: concepts, workflows, professionals, technology, data, collaboration, etc.
- Avoid generic terms; be specific to the lesson topic

**WORKFLOW DIAGRAMS:**
Provide 2 workflow diagrams, each with:
- Title of the workflow
- 4-6 step descriptions (concise, 5-8 words each)

**INFOGRAPHIC STATS:**
Provide 5-6 impressive statistics with:
- Font Awesome icon class (professional business icons only: fa-chart-line, fa-users, fa-building, fa-rocket, fa-shield, fa-cog, fa-database, fa-cloud, etc.)
- Value (percentage, number, time, etc.)
- Label describing what the stat represents

**CASE STUDY SUBJECT:**
Identify the specific organisation/project for the detailed case study (e.g., "Google's migration to microservices", "Tesla's AI training infrastructure", "NHS Digital's patient data platform")

**OUTPUT FORMAT (JSON):**
{
  "introduction": "<p>First person introduction paragraph 1...</p><p>Paragraph 2...</p><p>Paragraph 3...</p>",
  "sections": [
    {
      "title": "Section Title",
      "content": "<p>First person narrative...</p><p>More content with examples...</p><h3>Subsection</h3><p>Details...</p>"
    },
    // ... 7-8 sections total
  ],
  "caseStudy": {
    "title": "Case Study: [Organisation Name] - [Project/Initiative]",
    "subject": "[Organisation Name]'s [specific project]",
    "content": "<p>Detailed first-person narrative of the case study...</p><p>Specific dates, people, stats...</p>",
    "stats": "Improved efficiency by 45%, reduced costs by £2.3M annually",
    "outcomes": "Deployed across 15 regions, 10,000+ users, 99.9% uptime achieved"
  },
  "knowledgeCheck": [
    {
      "question": "Thought-provoking question testing understanding?",
      "answer": "Detailed answer explaining the concept with examples."
    },
    // ... 3-5 questions
  ],
  "summary": "<p>Personal reflection paragraph 1...</p><p>Recommendations and next steps...</p>",
  "keyTakeaways": [
    "Specific, actionable takeaway 1",
    "Specific, actionable takeaway 2",
    "Specific, actionable takeaway 3",
    "Specific, actionable takeaway 4",
    "Specific, actionable takeaway 5",
    "Specific, actionable takeaway 6",
    "Specific, actionable takeaway 7"
  ],
  "imageKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
  "diagrams": [
    {
      "title": "Workflow Diagram Title",
      "steps": ["Step 1 description", "Step 2 description", "Step 3 description", "Step 4 description"]
    },
    {
      "title": "Another Workflow Title",
      "steps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"]
    }
  ],
  "stats": [
    {
      "icon": "fa-solid fa-chart-line",
      "value": "87%",
      "label": "Increased Efficiency"
    },
    // ... 5-6 stats total
  ],
  "wordCount": 1650,
  "confidenceScore": 0.9
}

**MANDATORY VALIDATION CHECKLIST:**
Before returning your JSON, verify you have included:
? Introduction (200-300 words) with first-person narrative
? 7-8 content sections with detailed HTML paragraphs
? Complete case study with title, subject, content, stats, and outcomes
? 3-5 knowledge check questions with detailed answers
? Summary (150-200 words)
? 5-7 key takeaways
? EXACTLY 8 image keywords
? EXACTLY 2 workflow diagrams (each with 4-6 steps)
? 5-6 infographic stats (with fa-solid icon classes)
? Total word count between 1500-2000 words

**REMEMBER:**
- MINIMUM 1500 words, MAXIMUM 2000 words
- First-person, expert perspective throughout
- Real dates, names, statistics, specifics
- British English spelling (organisation, colour, realise, etc.)
- Professional, corporate tone (Google/DeepMind level)
- Deeply humanised with anecdotes and personal insights
- ALL fields must be populated with substantial content
- Return COMPLETE, VALID JSON with ALL required fields`;
  }
}

/**
 * Get singleton Groq client instance
 */
let groqClient: GroqClient | null = null;

export function getGroqClient(): GroqClient {
  if (!groqClient) {
    groqClient = new GroqClient();
  }
  return groqClient;
}