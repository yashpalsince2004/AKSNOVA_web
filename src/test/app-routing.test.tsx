import { describe, expect, it } from 'vitest';
import { formatTitle, formatCanonical, SITE_URL } from '@/lib/seo';
import { BLOG_CATEGORIES, slugifyCategory } from '@/lib/blog-categories';
import { withBase } from '@/lib/paths';

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

  it('prefixes subpath with withBase', () => {
    // In test environment, BASE_URL is set by astro.config.mjs ('/AKSNOVA_web')
    expect(withBase('/')).toBe('/AKSNOVA_web/');
    expect(withBase('/courses')).toBe('/AKSNOVA_web/courses');
    expect(withBase('https://example.com')).toBe('https://example.com');
    expect(withBase('mailto:info@aksnova.in')).toBe('mailto:info@aksnova.in');
    expect(withBase('#journey')).toBe('#journey');
  });
});
