/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'PomoZen',
        short_name: 'PomoZen',
        description: 'Offline-First Pomodoro Timer',
        theme_color: '#ba4949',
        icons: [
          {
            src: 'pwa-192x192.png', // We don't have these yet, but config needs them
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    sitemap({ hostname: 'https://pomozen.app' }) // Placeholder domain
  ],
  // @ts-expect-error - vitest types are not automatically picked up by vite config types without extra work
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
})
