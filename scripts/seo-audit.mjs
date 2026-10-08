import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');

if (!fs.existsSync(DIST_DIR)) {
  console.error('dist directory not found. Please run "npm run build" first.');
  process.exit(1);
}

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(DIST_DIR);
console.log(`\n🔍 Found ${htmlFiles.length} HTML pages in dist/ to audit...\n`);

const titles = new Map();
const descriptions = new Map();
const internalLinks = new Set();
const allPagePaths = new Set();

let totalErrors = 0;
let totalWarnings = 0;

for (const filePath of htmlFiles) {
  const relPath = path.relative(DIST_DIR, filePath);
  const normalizedUrl = '/' + relPath.replace(/index\.html$/, '').replace(/\.html$/, '');
  allPagePaths.add(normalizedUrl === '/' ? '/' : normalizedUrl.replace(/\/$/, ''));
}

for (const filePath of htmlFiles) {
  const relPath = path.relative(DIST_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const is404 = relPath === '404.html';
  const isPrivate = is404 || relPath.includes('resume-builder');

  // Title check
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;

  if (!title) {
    console.error(`❌ [${relPath}] Missing <title> tag!`);
    totalErrors++;
  } else if (!isPrivate) {
    if (titles.has(title)) {
      console.warn(`⚠️  [${relPath}] Duplicate title found: "${title}" (also in ${titles.get(title)})`);
      totalWarnings++;
    } else {
      titles.set(title, relPath);
    }
  }

  // Description check
  const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const description = descMatch ? descMatch[1].trim() : null;

  if (!description && !is404) {
    console.error(`❌ [${relPath}] Missing meta description!`);
    totalErrors++;
  } else if (description && !isPrivate) {
    if (descriptions.has(description)) {
      console.warn(`⚠️  [${relPath}] Duplicate meta description found: "${description.slice(0, 40)}..." (also in ${descriptions.get(description)})`);
      totalWarnings++;
    } else {
      descriptions.set(description, relPath);
    }
  }

  // H1 check
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  if (!h1Matches || h1Matches.length === 0) {
    console.error(`❌ [${relPath}] Missing <h1> heading!`);
    totalErrors++;
  } else if (h1Matches.length > 1) {
    console.warn(`⚠️  [${relPath}] Multiple <h1> headings found (${h1Matches.length})!`);
    totalWarnings++;
  }

  // Canonical check
  const canonicalMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
  if (!canonicalMatch && !is404) {
    console.error(`❌ [${relPath}] Missing canonical link!`);
    totalErrors++;
  } else if (canonicalMatch && !canonicalMatch[1].startsWith('https://')) {
    console.error(`❌ [${relPath}] Canonical is not absolute: ${canonicalMatch[1]}`);
    totalErrors++;
  }

  // OG Image check
  const ogImageMatch = content.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  if (!ogImageMatch && !is404) {
    console.error(`❌ [${relPath}] Missing og:image!`);
    totalErrors++;
  }

  // Image alt check
  const imgRegex = /<img\b(?![^>]*\balt=)[^>]*>/gi;
  const missingAlt = content.match(imgRegex);
  if (missingAlt) {
    console.warn(`⚠️  [${relPath}] Found ${missingAlt.length} image(s) missing alt attribute`);
    totalWarnings++;
  }

  // Collect internal links to test
  const linkRegex = /<a\b[^>]*href=["']([^"'#]*)["'][^>]*>/gi;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    const href = linkMatch[1];
    if (href.startsWith('/') && !href.startsWith('//')) {
      const cleanHref = href.split('?')[0].replace(/\/$/, '') || '/';
      internalLinks.add(cleanHref);
    }
  }
}

// Broken links check
const BASE_PATH = (process.env.ASTRO_BASE ?? '/AKSNOVA_web').replace(/\/+$/, '');
console.log(`\n🔗 Verifying ${internalLinks.size} unique internal links...`);
for (const link of internalLinks) {
  // Strip base prefix if link starts with it
  const pathWithoutBase = (BASE_PATH && link.startsWith(BASE_PATH))
    ? (link.slice(BASE_PATH.length) || '/')
    : link;

  if (
    pathWithoutBase.startsWith('/images/') ||
    pathWithoutBase.startsWith('/_astro/') ||
    pathWithoutBase.startsWith('/__l5e/') ||
    pathWithoutBase.startsWith('/favicon.') ||
    pathWithoutBase.startsWith('/logos/')
  ) {
    continue;
  }

  const cleanLink = pathWithoutBase.replace(/\/$/, '') || '/';
  const fileExact = path.join(DIST_DIR, cleanLink);
  const fileHtml = path.join(DIST_DIR, `${cleanLink}.html`);
  const fileIndex = path.join(DIST_DIR, cleanLink, 'index.html');

  if (
    !allPagePaths.has(cleanLink) &&
    !fs.existsSync(fileExact) &&
    !fs.existsSync(fileHtml) &&
    !fs.existsSync(fileIndex)
  ) {
    console.error(`❌ Broken internal link: ${link} (resolved: ${cleanLink})`);
    totalErrors++;
  }
}

console.log('\n========================================');
console.log('       SEO AUDIT SUMMARY RESULTS        ');
console.log('========================================');
console.log(`Total Pages Audited:    ${htmlFiles.length}`);
console.log(`Unique Titles:          ${titles.size}`);
console.log(`Unique Descriptions:    ${descriptions.size}`);
console.log(`Internal Links Checked: ${internalLinks.size}`);
console.log(`Total Errors:           ${totalErrors}`);
console.log(`Total Warnings:         ${totalWarnings}`);
console.log('========================================\n');

if (totalErrors > 0) {
  console.error('Audit failed with errors.');
  process.exit(1);
} else {
  console.log('✅ All pages passed SEO audit successfully!');
  process.exit(0);
}
