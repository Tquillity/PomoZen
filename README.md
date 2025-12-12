# PomoZen

[![CI](https://github.com/Tquillity/PomoZen/actions/workflows/ci.yml/badge.svg)](https://github.com/Tquillity/PomoZen/actions/workflows/ci.yml)

A privacy-first, offline-capable Pomodoro timer with ambient soundscapes. Built with React 19, TypeScript 6, and Tailwind CSS v4.

## Features

- **Offline-First**: Works entirely in your browser with no backend required
- **Privacy-First**: All data stored locally in your browser (localStorage)
- **Accurate Timing**: Web Worker-based timer prevents UI thread blocking and drift
- **Zen Mode**: Ambient nature sounds (rain, forest, white noise) for enhanced focus
- **Task Tracking**: Track your pomodoro sessions per task
- **Statistics**: Visual progress tracking with daily, weekly, monthly, and yearly views
- **Customizable**: Adjustable timer durations, theme colors, and presets
- **PWA Ready**: Installable as a Progressive Web App
- **Accessible**: WCAG 2.2 AA compliant with keyboard navigation and screen reader support

## Tech Stack

- **Runtime/Build**: Node.js 22+, Vite 6
- **Framework**: React 19
- **Language**: TypeScript 6.0 (Strict Mode)
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **State Management**: Zustand with persist middleware
- **Async Logic**: Web Workers via Comlink
- **Validation**: Zod for data integrity
- **Testing**: Vitest with Testing Library

## Architecture

**The Golden Rule**: *The UI is a reflection of the Store. The Store is updated by the Worker.*

- **Timer Engine**: Runs in a Web Worker (`src/workers/timer.worker.ts`) to prevent UI blocking
- **State Management**: Zustand stores with localStorage persistence
- **Data Flow**: Worker → Store → UI (unidirectional)
- **No Backend**: 100% client-side application

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── services/       # Business logic (workers, storage, events)
├── store/          # Zustand state management
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── workers/        # Web Worker scripts
```

## License

See [LICENSE](LICENSE) file for details.

## Contributing

See [CONTRIBUTING_AI.md](CONTRIBUTING_AI.md) for project guidelines and architecture details.
