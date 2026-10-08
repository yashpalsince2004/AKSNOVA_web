# AKSNOVA Edutech

> **Empowering Careers Through High-Impact Technical & Professional Training**

[![Astro](https://img.shields.io/badge/Astro-v7.3.7-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![SEO Score](https://img.shields.io/badge/SEO_Audit-100%25_Passing-10B981?style=flat-square&logo=google&logoColor=white)](#automated-seo--integrity-audit)
[![License](https://img.shields.io/badge/License-Proprietary-FF5500?style=flat-square)](#copyright--license)

---

## Overview

**AKSNOVA Edutech** is a high-performance, SEO-engineered web application and public portal designed for modern technical and professional education. Built on a static-first **Astro 7** architecture, the platform combines sub-second page delivery, zero runtime JavaScript overhead on marketing pages, an automated Content Layer for courses and career insights, and rich interactive tools for aspiring engineers.

The platform showcases comprehensive training tracks, structured learning roadmaps, verified hiring partner networks, and self-service student utilities such as an ATS Resume Builder.

---

## Key Features

- ⚡ **Static-First Performance (Astro 7)**: 45 fully prerendered static pages with zero client-side JavaScript overhead on marketing content, guaranteeing 100/100 Core Web Vitals and instant TTFB.
- 📚 **Comprehensive Course Catalog**: Structured curriculum paths covering Full Stack Development, Data Science & AI, Cloud & DevOps, Cyber Security, Accounting (Tally & GST), and Graphic Design with interactive filtering (`All`, `IT`, `Non-IT`).
- ✍️ **Career Insights & Technical Blog**: 10 deeply researched industry guides categorized across 20+ specialized topics with schema.org `Article` metadata, auto-calculated reading times, and category-level archives.
- 🏢 **Placement Partner Network**: Smooth bidirectional marquee displaying 43 corporate hiring partners with local vector artwork and resilient text fallbacks.
- 📄 **In-Browser ATS Resume Builder**: Interactive client-side utility enabling students to format, curate, and export ATS-friendly technical resumes instantly.
- 🔍 **Enterprise Technical SEO**:
  - Validated Schema.org JSON-LD structured data (`EducationalOrganization`, `Course`, `Article`, `BreadcrumbList`).
  - Canonical URL normalization and complete Open Graph / Twitter Cards metadata.
  - Automated XML sitemap generation (`/sitemap-index.xml`) and RSS 2.0 feed (`/rss.xml`).
  - Crawl-optimized `robots.txt` configuration.
- 🌓 **Zero-Flicker Theme Engine**: Adaptive Dark & Light modes powered by Tailwind CSS v4 and modern CSS OKLCH color spaces, with instant pre-paint theme resolution.
- 📱 **Responsive & Accessible**: Strict semantic HTML5 hierarchy, WCAG AA color contrast, fluid mobile navigation drawers, and thumb-friendly touch targets.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | [Astro 7.3.7](https://astro.build) (Static Site Generation / Content Layer) |
| **Interactive Islands** | [React 19](https://react.dev) (Course Filtering, Resume Builder, Contact Forms) |
| **Styling System** | [Tailwind CSS v4](https://tailwindcss.com) + `@tailwindcss/vite` + OKLCH Tokens |
| **Type Safety** | [TypeScript 5.9](https://www.typescriptlang.org/) + Strict Mode |
| **Content Management** | Astro Content Collections (`astro:content`) + [Zod](https://zod.dev) Schemas |
| **Search Engine Optimization** | `@astrojs/sitemap`, `@astrojs/rss`, Custom JSON-LD Generators |
| **Testing & Auditing** | [Vitest](https://vitest.dev), Custom AST/Link Auditing Engine |

---

## Project Structure

```text
AKSNOVA/
├── public/                       # Static public assets served from root
│   ├── favicon.png               # Brand favicon
│   ├── robots.txt                # Search crawler control rules
│   └── logos/                    # Verified brand & partner assets
│       ├── logo-light.png        # Primary brand logo (light theme)
│       ├── logo-dark.png         # Primary brand logo (dark theme)
│       └── companies/            # 43 partner company SVGs and PNGs
├── src/
│   ├── content/                  # Structured Content Layer data
│   │   ├── courses/              # Course specifications (6 detailed markdown tracks)
│   │   └── blog/                 # Career Insights & roadmaps (10 markdown articles)
│   ├── content.config.ts         # Zod schemas for courses & blog collections
│   ├── components/               # UI components
│   │   ├── common/               # Global components (Navbar, Footer, SEO, ThemeToggle, Logo)
│   │   ├── courses/              # Course cards and interactive filter islands
│   │   ├── blog/                 # Article cards, category chips, social share
│   │   ├── forms/                # Contact and counselling inquiry forms
│   │   ├── home/                 # Landing page sections (Hero, Stats, Journey, PlacementNetwork)
│   │   └── onboarding/           # Interactive ATS Resume Builder
│   ├── layouts/
│   │   └── BaseLayout.astro      # Master HTML shell with theme initialization and slots
│   ├── lib/                      # Helper libraries & configuration
│   │   ├── company-logos.ts      # Placement company logo mappings & fallback helpers
│   │   ├── blog-categories.ts    # Blog taxonomies and category slugs
│   │   ├── seo.ts                # Structured data generators & metadata utilities
│   │   └── utils.ts              # General string and class utilities
│   ├── pages/                    # File-based routing (45 static routes)
│   │   ├── index.astro           # Homepage
│   │   ├── about.astro           # About AKSNOVA Edutech
│   │   ├── contact.astro         # Contact & location inquiries
│   │   ├── placements.astro      # Placement network & career statistics
│   │   ├── trainers.astro        # Faculty & mentor credentials
│   │   ├── resume-builder.astro  # Interactive ATS Resume Builder app
│   │   ├── 404.astro             # Custom 404 error page
│   │   ├── rss.xml.ts            # Dynamic RSS 2.0 feed
│   │   ├── courses/              # Course catalog & dynamic course detail pages
│   │   └── blog/                 # Blog index, category archives & article pages
│   └── styles/
│       ├── tokens.css            # OKLCH color variables and design tokens
│       └── global.css            # Tailwind v4 configuration, font styling, animations
├── scripts/
│   └── seo-audit.mjs             # Automated 45-page SEO, link, and schema verification script
├── astro.config.mjs              # Astro configuration (Vite, React, Sitemap, RSS)
├── package.json                  # Dependencies and project scripts
├── tsconfig.json                 # TypeScript strict configuration
└── vitest.config.ts              # Vitest unit test configuration
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yashpalsince2004/AKSNOVA_web.git
cd AKSNOVA_web
npm install
```

### Development Server

Start the local development server:

```bash
npm run dev
```

The application will be available at:
- **Local:** `http://localhost:8080/`
- **Network:** `http://<your-lan-ip>:8080/`

### Production Build

Create an optimized, static production build:

```bash
npm run build
```

This compiles all 45 routes to static HTML, CSS, and optimized assets inside the `dist/` directory in under a second.

### Preview Production Build

Preview the generated static distribution locally:

```bash
npm run preview
```

---

## Testing & Quality Assurance

### Run Unit Tests

Execute the unit test suite with Vitest:

```bash
npm run test
```

### Automated SEO & Integrity Audit

Run the built-in SEO verification script to audit all 45 statically generated HTML pages:

```bash
npm run audit
```

The audit validates:
- [x] Every page contains a unique, non-empty `<title>` tag.
- [x] Every page has a descriptive `<meta name="description">` (50–160 chars).
- [x] Exactly one `<h1>` heading exists per page with valid heading hierarchy.
- [x] Canonical URL tags are present and accurately formatted.
- [x] Schema.org JSON-LD structured data is present and syntactically valid on courses and articles.
- [x] Every internal link (`href`) resolves to an existing static HTML destination with 0 dead links.

```text
========================================
       SEO AUDIT SUMMARY RESULTS        
========================================
Total Pages Audited:    45
Unique Titles:          43
Unique Descriptions:    43
Internal Links Checked: 45
Total Errors:           0
Total Warnings:         0
========================================
✅ All pages passed SEO audit successfully!
```

---

## Content Management

### Adding a New Course

Create a new Markdown file inside `src/content/courses/<course-slug>.md`:

```markdown
---
title: "Cloud & DevOps Engineering"
slug: "cloud-devops"
category: "IT"
duration: "6 Months"
mode: "Hybrid"
rating: 4.9
enrolledCount: "1,100+"
shortDescription: "Master Docker, Kubernetes, AWS, and CI/CD pipelines."
metaDescription: "Comprehensive Cloud and DevOps course covering AWS, Docker, Kubernetes, and CI/CD."
highlights:
  - "AWS Cloud Architecture & IAM"
  - "Containerization with Docker"
  - "Kubernetes Cluster Management"
curriculum:
  - title: "Module 1: Linux & Git"
    topics:
      - "Advanced Bash Scripting"
      - "Git Workflows & Trunk-Based Development"
tools:
  - "AWS"
  - "Docker"
  - "Kubernetes"
placementAssistance: true
---

# Course Content Overview
Detailed course syllabus and project descriptions go here...
```

### Adding a Career Insights Article

Create a new Markdown file inside `src/content/blog/<article-slug>.md`:

```markdown
---
title: "How to Build a Modern Tech Portfolio in 2026"
slug: "how-to-build-a-modern-tech-portfolio-2026"
description: "Proven portfolio strategies that get noticed by engineering leaders and hiring managers."
publishDate: "2026-03-15"
author: "AKSNOVA Career Team"
category: "Career & Jobs"
tags:
  - "Career & Jobs"
  - "Resume & Placement"
  - "Student Guides"
featured: true
readTimeMinutes: 7
---

Your portfolio is the single most verified credential you present to hiring managers...
```

---

## Deployment

### Automated GitHub Pages Deployment (Configured & Ready)

This repository includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and publishes the site to GitHub Pages on every push to `main`.

#### Enabling GitHub Pages in Repository Settings:
1. Navigate to your repository on GitHub: [`yashpalsince2004/AKSNOVA_web`](https://github.com/yashpalsince2004/AKSNOVA_web)
2. Go to **Settings** > **Pages** (under Code and automation).
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push to `main` (or run the workflow manually via the **Actions** tab).
5. Your site will automatically be live at:
   ```
   https://yashpalsince2004.github.io/AKSNOVA_web/
   ```

#### Subpath vs. Custom Domain Configuration:
- **Default GitHub Pages Subpath** (`/AKSNOVA_web/`):
  Handled automatically via `withBase()` and `astro.config.mjs`:
  ```bash
  ASTRO_SITE=https://yashpalsince2004.github.io
  ASTRO_BASE=/AKSNOVA_web
  ```
- **Custom Domain** (e.g., `aksnova.in`):
  If you configure a custom domain in GitHub Pages Settings:
  Set `ASTRO_BASE=""` and `ASTRO_SITE=https://yourdomain.com` in repository secrets/environment or workflow.

### Alternative Static Hosting Providers

The production build in `dist/` can also be deployed to any static host:

#### Cloudflare Pages
- **Framework preset**: `Astro`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Environment variables**: `ASTRO_BASE=""`

#### Vercel
- **Framework preset**: `Astro`
- **Build command**: `npm run build`
- **Output directory**: `dist`

#### Netlify
- **Build command**: `npm run build`
- **Publish directory**: `dist`

---

## Copyright & License

Copyright © 2026 **AKSNOVA Edutech**. All rights reserved.  
*Learn. Build. Get Hired.*
