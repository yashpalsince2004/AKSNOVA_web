import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: process.env.ASTRO_SITE || 'https://yashpalsince2004.github.io',
  base: process.env.ASTRO_BASE ?? '/AKSNOVA_web',
  trailingSlash: 'never',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/resume-builder') && !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});
