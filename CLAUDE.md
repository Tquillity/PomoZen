# CLAUDE.md — PomoZen

## Project Identity

PomoZen is a privacy-first, offline-capable Pomodoro timer with ambient soundscapes.
It is a **client-side SPA with no backend**. All data lives in `localStorage`.
Hosted as static files on Render.com. Live at [pomozen.online](https://pomozen.online).

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime/Build | Node.js, Vite | 22+, 7 |
| Framework | React | 19 |
| Language | TypeScript (strict) | 5.9 |
| Styling | Tailwind CSS (CSS-first, no config file) | 4 |
| State | Zustand with `persist` middleware | 5 |
| Worker bridge | Comlink | 4 |
| Validation | Zod | 4 |
| Unit testing | Vitest + Testing Library | 4 |
| E2E testing | Playwright | 1.57 |

Do not introduce new libraries without explicit instruction.

## Architecture

**Golden Rule: The UI reflects the Store. The Store is updated by the Worker.**

```
timer.worker.ts (setInterval, drift-corrected)
        ↓  Comlink postMessage
    Zustand stores (timeLeft, mode, tasks, settings)
        ↓  selectors
    React components (render only, zero business logic)
```

- **Worker** (`src/workers/timer.worker.ts`): owns the tick loop. Never touches DOM or `window`.
- **Services** (`src/services/`): worker lifecycle (`worker.service.ts`), storage (`storage.service.ts`), event bus (`event.service.ts`).
- **Stores** (`src/store/`): `useTimeStore`, `useTaskStore`, `useSettingsStore`. Persisted to `localStorage` via Zustand `persist`.
- **Hooks** (`src/hooks/`): bridge between stores and UI effects (`useTimerEffects`, `useFocusMode`, `useKeyboardShortcuts`).
- **Components** (`src/components/`): functional only, subscribe to store selectors, dispatch actions.

## Project Structure

```
src/
├── __tests__/          # Unit + integration tests
├── components/
│   ├── common/         # Buttons, inputs, cards
│   ├── layout/         # Header, footer, ad container
│   ├── modals/         # Modal dialogs
│   ├── seo/            # SEO components
│   ├── settings/       # Settings panel
│   ├── sound/          # Audio / zen mode
│   ├── stats/          # Statistics dashboard
│   └── timer/          # Timer display and controls
├── hooks/              # Custom React hooks
├── services/           # Business logic (worker, storage, events)
├── store/              # Zustand stores
├── types/              # Shared TypeScript interfaces
├── utils/              # Pure utility functions
├── workers/            # Web Worker scripts
├── App.tsx             # Root layout + modals
├── main.tsx            # React mount, ErrorBoundary, Web Vitals
└── index.css           # Tailwind v4 imports + CSS theme variables
e2e/                    # Playwright E2E specs
scripts/                # Build helpers (icon/audio generation)
```

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server (Vite)
npm run build        # Type-check + production build
npm run lint         # ESLint (flat config)
npm run test         # Vitest (unit + integration, watch mode)
npm run test:ui      # Vitest browser UI
npm run test:e2e     # Playwright E2E
npm run test:e2e:ui  # Playwright UI mode
npm run preview      # Preview production build
```

## Coding Conventions

### TypeScript
- Strict mode is on. No `any`. Define interfaces for all data structures.
- `noUnusedLocals` and `noUnusedParameters` are enforced.
- `verbatimModuleSyntax` is enabled — use `import type` for type-only imports.

### React
- Functional components only. No class components.
- Do not add `useMemo` or `useCallback` unless profiling proves it necessary.
- Components contain zero business logic — they subscribe to stores and dispatch actions.

### Styling
- Tailwind v4 CSS-first config (`@import "tailwindcss"` in `index.css`). No `tailwind.config.js`.
- Use CSS variables for theming (e.g. `bg-[var(--bg-primary)]`). No hardcoded color values.
- Ad slots must have fixed height (e.g. `h-[280px]`) to prevent CLS.

### Naming
- Components: PascalCase (`TimerDisplay.tsx`)
- Logic / utils / services: camelCase (`timerWorker.ts`, `storage.service.ts`)

### Imports
- Group: system/node → third-party libraries → internal modules.
- Use clean relative imports.

### Error handling
- Fail gracefully. If the Worker crashes, the UI must show an error state, not blank out.

## Forbidden Patterns

1. **No `setInterval` in React components.** Timer ticking happens only in the Web Worker.
2. **No backend calls.** No `fetch()` to an API. This app has no server.
3. **No class components.** Functional components only.
4. **No hardcoded colors.** Always use Tailwind utilities with CSS variables.

## Data Persistence

- All user data (tasks, settings, stats) is stored in `localStorage` via Zustand `persist`.
- If you change the shape of persisted state, handle migration for existing users.
  Zustand `persist` supports `version` + `migrate` for schema evolution.
- `storage.service.ts` wraps `localStorage` with quota-safe handling.

## Audio

- Browsers block autoplay until user interaction. The first "Start" click must unlock the `AudioContext`.

## Testing

### Unit / Integration (Vitest)
- Tests live in `src/__tests__/` and co-located `__tests__/` directories.
- Environment: jsdom. Setup file: `src/setupTests.ts` (mocks Worker, Audio, Notification, alert, confirm).
- Config is in `vite.config.ts` under the `test` key.
- After changing code, verify correlating tests still pass.

### E2E (Playwright)
- Specs live in `e2e/`. Config: `playwright.config.ts`.
- Covers: timer start/pause/reset, mode switching, task creation, settings modal.

### CI
- GitHub Actions (`.github/workflows/ci.yml`): lint → test → build on Node 22.
- Lighthouse CI (`.github/workflows/lighthouse.yml`): perf 0.9, a11y 0.95, best-practices 0.9, SEO 0.9, PWA 0.9.

## PWA

- Configured via `vite-plugin-pwa` in `vite.config.ts`.
- Workbox caches all static assets; sound files use CacheFirst with a 1-year expiration.
- `pomo-ads.html` is excluded from the service worker.

## Key Constraints

- **Offline-first**: every feature must work without a network connection.
- **Privacy-first**: no data leaves the browser. No analytics that track users beyond anonymous page views.
- **Performance**: keep Lighthouse scores above the CI thresholds (perf 90, a11y 95, BP 90, SEO 90, PWA 90).
- **Accessibility**: WCAG 2.2 AA. Keyboard navigation, screen reader support, proper ARIA attributes.
