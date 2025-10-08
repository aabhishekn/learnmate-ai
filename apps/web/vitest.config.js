import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    exclude: ['e2e/*', 'e2e/**/*', 'e2e-playwright/*', 'e2e-playwright/**/*'],
  },
});
