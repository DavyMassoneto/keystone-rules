import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    pool: 'forks',
    include: ['test/**/*.test.js', 'src/**/*.test.js'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
