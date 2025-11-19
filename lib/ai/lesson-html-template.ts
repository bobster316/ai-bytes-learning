// ========================================
// Professional HTML Lesson Template Generator
// Generates complete standalone HTML lessons with:
// - 1200-2000 words of rich, humanized content
// - Professional Font Awesome icons
// - Real Unsplash photos with CDN links
// - Workflow diagrams, infographic stats
// - Case studies, sticky header, sidebar
// ========================================

export interface LessonHTMLData {
  courseName: string;
  topicTitle: string;
  lessonTitle: string;
  targetAudience: string;
  caseStudySubject: string;
  sections: string[]; // Section titles to include
  content: {
    introduction: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
    caseStudy: {
      title: string;
      content: string;
      stats: string;
      outcomes: string;
    };
    knowledgeCheck: Array<{
      question: string;
      answer: string;
    }>;
    summary: string;
    keyTakeaways: string[];
  };
  images: Array<{
    url: string;
    alt: string;
    caption: string;
  }>;
  diagrams: Array<{
    title: string;
    steps: string[];
  }>;
  stats: Array<{
    icon: string; // Font Awesome icon class
    value: string;
    label: string;
  }>;
  nextLessonUrl?: string;
  wordCount: number;
}

/**
 * Generate complete standalone HTML lesson
 */
export function generateLessonHTML(data: LessonHTMLData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.lessonTitle} - ${data.courseName}</title>

    <!-- Font Awesome for Professional Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #1a73e8;
            --primary-dark: #1557b0;
            --secondary: #34a853;
            --accent: #ea4335;
            --warning: #fbbc04;
            --bg-primary: #ffffff;
            --bg-secondary: #f8f9fa;
            --text-primary: #202124;
            --text-secondary: #5f6368;
            --border: #dadce0;
            --shadow: rgba(0, 0, 0, 0.1);
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.7;
            color: var(--text-primary);
            background: var(--bg-secondary);
        }

        /* Sticky Header */
        header {
            position: sticky;
            top: 0;
            background: var(--bg-primary);
            border-bottom: 1px solid var(--border);
            box-shadow: 0 2px 8px var(--shadow);
            z-index: 1000;
            padding: 1rem 2rem;
        }

        .header-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--primary);
            text-decoration: none;
        }

        .header-meta {
            display: flex;
            gap: 2rem;
            align-items: center;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        .header-meta i {
            margin-right: 0.5rem;
            color: var(--primary);
        }

        /* Main Layout */
        .main-container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 2rem;
            padding: 2rem;
        }

        /* Sidebar Navigation */
        .sidebar {
            background: var(--bg-primary);
            border-radius: 12px;
            padding: 1.5rem;
            height: fit-content;
            position: sticky;
            top: 80px;
            box-shadow: 0 2px 8px var(--shadow);
        }

        .sidebar h3 {
            font-size: 0.85rem;
            text-transform: uppercase;
            color: var(--text-secondary);
            margin-bottom: 1rem;
            letter-spacing: 0.5px;
        }

        .sidebar nav ul {
            list-style: none;
        }

        .sidebar nav a {
            display: block;
            padding: 0.75rem;
            color: var(--text-primary);
            text-decoration: none;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            transition: all 0.2s;
            font-size: 0.9rem;
        }

        .sidebar nav a:hover {
            background: var(--bg-secondary);
            color: var(--primary);
            transform: translateX(4px);
        }

        .sidebar nav a.active {
            background: var(--primary);
            color: white;
            font-weight: 600;
        }

        /* Main Content */
        .content {
            background: var(--bg-primary);
            border-radius: 12px;
            padding: 3rem;
            box-shadow: 0 2px 8px var(--shadow);
        }

        /* Hero Section */
        .hero {
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid var(--border);
        }

        .breadcrumb {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }

        .breadcrumb a {
            color: var(--primary);
            text-decoration: none;
        }

        h1 {
            font-size: 2.75rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 1.5rem;
            color: var(--text-primary);
        }

        .hero-meta {
            display: flex;
            gap: 2rem;
            color: var(--text-secondary);
            font-size: 0.95rem;
        }

        .hero-meta span {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .hero-meta i {
            color: var(--primary);
        }

        /* Content Sections */
        .section {
            margin: 3rem 0;
        }

        h2 {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        h2 i {
            color: var(--primary);
            font-size: 1.5rem;
        }

        h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 2rem 0 1rem;
            color: var(--text-primary);
        }

        p {
            margin-bottom: 1.5rem;
            font-size: 1.05rem;
            line-height: 1.8;
            color: var(--text-primary);
        }

        /* Images */
        .image-full {
            width: 100%;
            margin: 2.5rem 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 16px var(--shadow);
        }

        .image-full img {
            width: 100%;
            height: auto;
            display: block;
        }

        .image-caption {
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-top: 0.75rem;
            font-style: italic;
        }

        /* Stats Blocks */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2.5rem 0;
        }

        .stat-card {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            padding: 2rem;
            border-radius: 12px;
            color: white;
            text-align: center;
            box-shadow: 0 4px 12px var(--shadow);
            transition: transform 0.2s;
        }

        .stat-card:hover {
            transform: translateY(-4px);
        }

        .stat-card i {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            opacity: 0.9;
        }

        .stat-value {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            font-size: 0.95rem;
            opacity: 0.95;
            font-weight: 500;
        }

        /* Workflow Diagrams */
        .workflow {
            margin: 3rem 0;
            padding: 2.5rem;
            background: var(--bg-secondary);
            border-radius: 12px;
        }

        .workflow h3 {
            text-align: center;
            margin-bottom: 2.5rem;
            color: var(--primary);
        }

        .workflow-steps {
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-wrap: wrap;
            gap: 1.5rem;
        }

        .workflow-step {
            text-align: center;
            max-width: 200px;
        }

        .step-circle {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 2rem;
            box-shadow: 0 4px 12px var(--shadow);
        }

        .step-arrow {
            font-size: 2rem;
            color: var(--primary);
            margin: 0 1rem;
        }

        .step-label {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }

        .step-desc {
            font-size: 0.9rem;
            color: var(--text-secondary);
        }

        /* Case Study */
        .case-study {
            background: linear-gradient(135deg, #f8f9fa 0%, #e8f0fe 100%);
            padding: 3rem;
            border-radius: 12px;
            margin: 3rem 0;
            border-left: 5px solid var(--primary);
        }

        .case-study h2 {
            color: var(--primary);
        }

        .case-study-meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }

        .case-study-item {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px var(--shadow);
        }

        .case-study-item strong {
            display: block;
            color: var(--primary);
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }

        /* Knowledge Check */
        .knowledge-check {
            background: var(--bg-secondary);
            padding: 2.5rem;
            border-radius: 12px;
            margin: 3rem 0;
        }

        .knowledge-check h2 {
            color: var(--secondary);
        }

        .check-item {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin: 1.5rem 0;
            border-left: 4px solid var(--secondary);
        }

        .check-question {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.75rem;
            font-size: 1.05rem;
        }

        .check-answer {
            color: var(--text-secondary);
            padding-left: 1.5rem;
            position: relative;
        }

        .check-answer::before {
            content: "\\f058";
            font-family: "Font Awesome 6 Free";
            font-weight: 900;
            position: absolute;
            left: 0;
            color: var(--secondary);
        }

        /* Next Module CTA */
        .next-module {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            background: var(--primary);
            color: white;
            border-radius: 12px;
            margin: 2rem 0;
        }

        .next-module-content h3 {
            color: white;
            margin-bottom: 0.5rem;
        }

        .next-module-content p {
            opacity: 0.9;
            margin: 0;
        }

        .btn-next {
            padding: 1rem 2rem;
            background: white;
            color: var(--primary);
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-next:hover {
            transform: translateX(4px);
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .main-container {
                grid-template-columns: 1fr;
            }

            .sidebar {
                position: static;
            }

            h1 {
                font-size: 2.25rem;
            }
        }

        @media (max-width: 768px) {
            .content {
                padding: 1.5rem;
            }

            h1 {
                font-size: 1.85rem;
            }

            h2 {
                font-size: 1.5rem;
            }

            .workflow-steps {
                flex-direction: column;
            }

            .step-arrow {
                transform: rotate(90deg);
            }

            .next-module {
                flex-direction: column;
                text-align: center;
                gap: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <!-- Sticky Header -->
    <header>
        <div class="header-content">
            <a href="#" class="logo">
                <i class="fa-solid fa-graduation-cap"></i> ${data.courseName}
            </a>
            <div class="header-meta">
                <span><i class="fa-solid fa-clock"></i> ${Math.round(data.wordCount / 200)} min read</span>
                <span><i class="fa-solid fa-users"></i> ${data.targetAudience}</span>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <div class="main-container">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
            <h3>Contents</h3>
            <nav>
                <ul>
                    <li><a href="#introduction"><i class="fa-solid fa-book-open"></i> Introduction</a></li>
                    ${data.sections.map(section => `<li><a href="#${section.toLowerCase().replace(/\s+/g, '-')}"><i class="fa-solid fa-circle-chevron-right"></i> ${section}</a></li>`).join('\n                    ')}
                    <li><a href="#case-study"><i class="fa-solid fa-briefcase"></i> Case Study</a></li>
                    <li><a href="#knowledge-check"><i class="fa-solid fa-clipboard-question"></i> Knowledge Check</a></li>
                    <li><a href="#summary"><i class="fa-solid fa-list-check"></i> Summary</a></li>
                </ul>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="content">
            <!-- Hero Section -->
            <div class="hero">
                <div class="breadcrumb">
                    <a href="#">${data.courseName}</a> / <a href="#">${data.topicTitle}</a> / ${data.lessonTitle}
                </div>
                <h1>${data.lessonTitle}</h1>
                <div class="hero-meta">
                    <span><i class="fa-solid fa-user-tie"></i> Expert Perspective</span>
                    <span><i class="fa-solid fa-chart-line"></i> Professional Level</span>
                </div>
            </div>

            <!-- Introduction -->
            <section class="section" id="introduction">
                <h2><i class="fa-solid fa-book-open"></i> Introduction</h2>
                ${data.content.introduction}
            </section>

            <!-- Infographic Stats (First Set) -->
            <div class="stats-grid">
                ${data.stats.slice(0, 3).map(stat => `
                <div class="stat-card">
                    <i class="${stat.icon}"></i>
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
                `).join('\n                ')}
            </div>

            <!-- Content Sections -->
            ${data.content.sections.map((section, index) => `
            <section class="section" id="${section.title.toLowerCase().replace(/\s+/g, '-')}">
                <h2><i class="fa-solid fa-lightbulb"></i> ${section.title}</h2>
                ${section.content}
                ${index < data.images.length ? `
                <div class="image-full">
                    <img src="${data.images[index].url}" alt="${data.images[index].alt}" loading="lazy">
                    <p class="image-caption">${data.images[index].caption}</p>
                </div>
                ` : ''}
            </section>
            `).join('\n            ')}

            <!-- Workflow Diagram -->
            ${data.diagrams.length > 0 ? data.diagrams.map(diagram => `
            <div class="workflow">
                <h3><i class="fa-solid fa-diagram-project"></i> ${diagram.title}</h3>
                <div class="workflow-steps">
                    ${diagram.steps.map((step, i) => `
                    ${i > 0 ? '<div class="step-arrow"><i class="fa-solid fa-arrow-right"></i></div>' : ''}
                    <div class="workflow-step">
                        <div class="step-circle">
                            <i class="fa-solid fa-${i + 1}"></i>
                        </div>
                        <div class="step-label">Step ${i + 1}</div>
                        <div class="step-desc">${step}</div>
                    </div>
                    `).join('\n                    ')}
                </div>
            </div>
            `).join('\n            ') : ''}

            <!-- Case Study -->
            <section class="case-study" id="case-study">
                <h2><i class="fa-solid fa-briefcase"></i> ${data.content.caseStudy.title}</h2>
                ${data.content.caseStudy.content}

                <div class="case-study-meta">
                    <div class="case-study-item">
                        <strong><i class="fa-solid fa-building"></i> Organization</strong>
                        ${data.caseStudySubject}
                    </div>
                    <div class="case-study-item">
                        <strong><i class="fa-solid fa-chart-bar"></i> Key Metrics</strong>
                        ${data.content.caseStudy.stats}
                    </div>
                    <div class="case-study-item">
                        <strong><i class="fa-solid fa-trophy"></i> Outcomes</strong>
                        ${data.content.caseStudy.outcomes}
                    </div>
                </div>
            </section>

            <!-- Knowledge Check -->
            <section class="knowledge-check" id="knowledge-check">
                <h2><i class="fa-solid fa-clipboard-question"></i> Knowledge Check</h2>
                ${data.content.knowledgeCheck.map(item => `
                <div class="check-item">
                    <div class="check-question">${item.question}</div>
                    <div class="check-answer">${item.answer}</div>
                </div>
                `).join('\n                ')}
            </section>

            <!-- Summary -->
            <section class="section" id="summary">
                <h2><i class="fa-solid fa-list-check"></i> Summary</h2>
                ${data.content.summary}
            </section>

            <!-- Next Module CTA -->
            ${data.nextLessonUrl ? `
            <div class="next-module">
                <div class="next-module-content">
                    <h3>Ready for the Next Challenge?</h3>
                    <p>Continue your learning journey with the next module</p>
                </div>
                <a href="${data.nextLessonUrl}" class="btn-next">
                    Next Module <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
            ` : ''}
        </main>
    </div>

    <!--
    Word Count: ${data.wordCount} (British English)
    Case Study: ${data.caseStudySubject}
    Images: All real Unsplash photos, directly relevant
    Icons: Professional Font Awesome icons only
    -->
</body>
</html>`;
}
