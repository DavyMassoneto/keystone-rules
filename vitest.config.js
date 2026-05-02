import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    pool: 'forks',
    include: ['test/**/*.test.js'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/lib/**/*.js',
        'src/commands/**/*.js',
        'src/cli/**/*.js',
      ],
      exclude: ['**/*.test.js'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
