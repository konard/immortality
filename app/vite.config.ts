/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GITHUB_PAGES is set by CI when building for https://konard.github.io/immortality/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/immortality/' : '/',
  plugins: [react()],
  // Vitest blanks CSS by default; keep the stylesheet so tests can check axis coverage.
  test: { css: { include: [/styles\.css/] } },
});
