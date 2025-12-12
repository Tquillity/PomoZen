/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import sitemap from 'vite-plugin-sitemap';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Includes all mp3s in public/sounds/ to guarantee offline availability
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'sounds/*.mp3'],
      manifest: {
        name: 'PomoZen',
        short_name: 'PomoZen',
        description: 'Free Online Pomodoro Timer',
        theme_color: '#ba4949',
        icons: [
          {
            src: 'pwa-192x192.png',
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
    sitemap({ hostname: 'https://pomozen.online' })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
});