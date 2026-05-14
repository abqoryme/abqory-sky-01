// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    imagesConfig: {
      sizes: [320, 640, 1280],
      domains: ['raw.githubusercontent.com', 'i.pinimg.com'],
    },
  }),
  vite: {
    plugins: [tailwindcss()]
  }
});