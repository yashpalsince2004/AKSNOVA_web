export interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
}

export const SITE_URL = (
  process.env['ASTRO_SITE']
    ? `${process.env['ASTRO_SITE']}${process.env['ASTRO_BASE'] || ''}`
    : 'https://yashpalsince2004.github.io/AKSNOVA_web'
).replace(/\/+$/, '');

export const SITE_NAME = 'AKSNOVA Edutech';
export const DEFAULT_OG_IMAGE = '/logos/logo-dark.png';

export function formatTitle(title?: string): string {
  if (!title) return `${SITE_NAME} | Career-Focused IT & Professional Training`;
  if (title.includes('AKSNOVA')) return title;
  return `${title} | ${SITE_NAME}`;
}

export function formatCanonical(path?: string): string {
  if (!path) return SITE_URL;
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Strip trailing slash except for root
  const normalized = cleanPath === '/' ? '' : cleanPath.replace(/\/+$/, '');
  return `${SITE_URL}${normalized}`;
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: 'AKSNOVA Edutech',
    url: SITE_URL,
    logo: `${SITE_URL}/images/emblem.png`,
    description: 'Career-focused IT and professional training institute offering real projects, certification, and placement assistance.',
    sameAs: [
      'https://www.linkedin.com/company/aksnova-edutech',
      'https://twitter.com/aksnova',
      'https://www.instagram.com/aksnova_edutech',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-00000-00000',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  };
}

export function generateCourseSchema(course: {
  title: string;
  description: string;
  url: string;
  duration?: string;
  mode?: string;
  provider?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url: formatCanonical(course.url),
    provider: {
      '@type': 'EducationalOrganization',
      name: course.provider || SITE_NAME,
      url: SITE_URL,
    },
    timeRequired: course.duration,
    courseMode: course.mode,
    educationalCredentialAwarded: 'AKSNOVA Course Completion Certificate',
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  image?: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    url: formatCanonical(article.url),
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      '@type': 'Organization',
      name: article.author || SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/emblem.png`,
      },
    },
    image: article.image ? (article.image.startsWith('http') ? article.image : `${SITE_URL}${article.image}`) : `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    articleSection: article.category,
  };
}

export function generateBreadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const el: Record<string, unknown> = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
      };
      if (item.url) {
        el['item'] = formatCanonical(item.url);
      }
      return el;
    }),
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
