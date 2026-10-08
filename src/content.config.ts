import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('AKSNOVA Edutech'),
    authorRole: z.string().default('Editorial Team'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string(),
    readingTime: z.number().default(5),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    canonical: z.string().optional(),
    schemaType: z.enum(['Article', 'BlogPosting']).default('BlogPosting'),
    relatedCourses: z.array(z.string()).default([]),
    relatedPosts: z.array(z.string()).default([]),
  }),
});

const courses = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['IT', 'NON-IT']),
    duration: z.string(),
    mode: z.string(),
    level: z.string().default('Beginner to Advanced'),
    tags: z.array(z.string()).default([]),
    heroImage: z.string(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    learningOutcomes: z.array(z.string()).default([]),
    curriculum: z.array(
      z.object({
        module: z.string(),
        description: z.string(),
        topics: z.array(z.string()),
      })
    ).default([]),
    projects: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ).default([]),
    certification: z.string().default('Industry-recognised AKSNOVA Course Certificate'),
    placementSupport: z.string().default('Dedicated resume reviews, mock interviews, and partner referrals'),
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ).default([]),
  }),
});

export const collections = { blog, courses };
