export const BLOG_CATEGORIES = [
  'AI & Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Data Analytics',
  'Generative AI',
  'Python',
  'Java',
  'Full Stack Development',
  'Cloud Computing',
  'DevOps',
  'Cyber Security',
  'Software Testing',
  'Automation Testing',
  'Programming',
  'Digital Marketing',
  'Career & Jobs',
  'Interview Preparation',
  'Resume & Placement',
  'Student Guides',
  'Non-IT Skills',
] as const;

export function slugifyCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function findCategoryBySlug(slug: string): string | undefined {
  return BLOG_CATEGORIES.find((c) => slugifyCategory(c) === slug);
}
