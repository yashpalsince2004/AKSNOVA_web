import { describe, expect, it } from 'vitest';
import { formatTitle, formatCanonical, SITE_URL } from '@/lib/seo';
import { BLOG_CATEGORIES, slugifyCategory } from '@/lib/blog-categories';

describe('SEO & Architecture Utilities', () => {
  it('formats title correctly with AKSNOVA brand suffix', () => {
    expect(formatTitle('Data Science Course')).toBe('Data Science Course | AKSNOVA Edutech');
    expect(formatTitle('AKSNOVA Edutech | Learn. Build. Get Hired.')).toBe('AKSNOVA Edutech | Learn. Build. Get Hired.');
  });

  it('normalizes canonical URLs with absolute domain', () => {
    expect(formatCanonical('/')).toBe(SITE_URL);
    expect(formatCanonical('/courses/')).toBe(`${SITE_URL}/courses`);
    expect(formatCanonical('/blog/data-science/')).toBe(`${SITE_URL}/blog/data-science`);
  });

  it('slugifies categories cleanly', () => {
    expect(slugifyCategory('AI & Artificial Intelligence')).toBe('ai-and-artificial-intelligence');
    expect(slugifyCategory('Full Stack Development')).toBe('full-stack-development');
    expect(BLOG_CATEGORIES.length).toBeGreaterThan(15);
  });
});
