/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // @ts-expect-error - vitest types are not automatically picked up by vite config types without extra work
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
  },
})
