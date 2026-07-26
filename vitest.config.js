import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}', 'tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
      setupFiles: ['./tests/setup.js'],
      css: false,
      server: {
        deps: {
          inline: ['vuetify'],
        },
      },
      deps: {
        optimizer: {
          ssr: {
            include: ['vuetify'],
          },
        },
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        thresholds: {
          statements: 40,
          branches: 30,
          functions: 40,
          lines: 40,
        },
      },
    },
  }),
)
