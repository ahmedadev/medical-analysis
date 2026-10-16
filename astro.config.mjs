// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: 'https://ahmedadev.github.io',
  base: '/medical-analysis',
  integrations: [preact()]
});