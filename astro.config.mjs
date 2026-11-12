import { defineConfig } from 'astro/config';
import rehypeSidenotes from './src/lib/rehype-sidenotes.mjs';

export default defineConfig({
  site: 'https://samwitty.github.io',
  markdown: {
    rehypePlugins: [rehypeSidenotes],
  },
});
