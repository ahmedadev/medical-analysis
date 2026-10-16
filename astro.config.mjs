// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import compress from '@playform/compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://ahmedadev.github.io',
  base: '/medical-analysis',
  integrations: [
    preact(),
    compress({
      HTML: {
        'html-minifier-terser': {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          minifyCSS: true,
          minifyJS: true,
        },
      },
      CSS: true,
      JavaScript: true,
      Image: false,
      SVG: false,
    }),
  ],
});