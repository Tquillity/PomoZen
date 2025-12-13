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
      includeAssets: [
        'favicon.png', 
        'apple-touch-icon.png', 
        'pwa-192x192.png', 
        'pwa-512x512.png', 
        'sounds/*.mp3',
        'adsterra-enclosure.html'
      ],
      workbox: {
        navigateFallbackDenylist: [/^\/adsterra-enclosure\.html/],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}']
      },
      manifest: {
        name: 'PomoZen',
        short_name: 'PomoZen',
        description: 'Free Online Pomodoro Timer',
        start_url: '/',
        display: 'standalone',
        background_color: '#c15c5c',
        theme_color: '#ba4949',
        scope: '/',
        id: '/',
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
  // Note: CSP is set via meta tag in index.html
  // frame-ancestors cannot be enforced via meta tag, so for production
  // you should configure it via your hosting provider (Render) headers
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    // Prevent Vitest from picking up Playwright E2E specs.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',
      'e2e/**',
      '**/*.e2e.*',
      'playwright.config.*',
    ],
  },
});
