import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIContext } from 'astro';
import { withBase } from '@/lib/paths';

export async function GET(context: APIContext) {
  const posts: CollectionEntry<'blog'>[] = await getCollection('blog');
  const publishedPosts = posts
    .filter((p: CollectionEntry<'blog'>) => !p.data.draft)
    .sort((a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: 'AKSNOVA Insights | Career & Technology Guides',
    description: 'Practical career roadmaps, programming tutorials, and industry advice from AKSNOVA Edutech.',
    site: context.site || 'https://yashpalsince2004.github.io',
    items: publishedPosts.map((post: CollectionEntry<'blog'>) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: withBase(`/blog/${post.id.replace(/\.(md|mdx)$/, '')}`),
      categories: [post.data.category, ...post.data.tags],
      author: post.data.author,
    })),
    customData: `<language>en-in</language>`,
  });
}
