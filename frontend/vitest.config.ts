import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Use happy-dom to avoid ESM require issues with newer jsdom/parse5
    environment: 'happy-dom',
    globals: true,
    setupFiles: './tests/setupTests.ts',
    include: ['tests/**/*.test.{ts,tsx}'],
  },
})
