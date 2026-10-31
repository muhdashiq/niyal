import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { BRAND_NAME, SITE_URL } from './src/config';

// GitHub Pages serves the site from /<repo-name>/. Change this if the repo name changes.
const REPO_NAME = 'niyal';

export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [
    react(),
    {
      name: 'niyal-html-config',
      transformIndexHtml: (html) =>
        html.replaceAll('%BRAND_NAME%', BRAND_NAME).replaceAll('%SITE_URL%', SITE_URL),
    },
  ],
});
