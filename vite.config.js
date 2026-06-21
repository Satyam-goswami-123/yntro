import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    globals: true,
    exclude: ['node_modules', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'vitest.setup.js',
        'postcss.config.js',
        'tailwind.config.js',
        'tests/**',
        'dist/**',
        'src/main.jsx', // skip entry point from coverage
        'src/pages/GamePage.jsx', // skip WebGL canvas from unit test coverage
        '.eslintrc.cjs'
      ]
    }
  }
})
