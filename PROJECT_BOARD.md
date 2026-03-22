# PomoZen - Project Board

## Project Description
A privacy-first, offline-capable Pomodoro timer with ambient soundscapes. Built with React 19, TypeScript 6, and Tailwind CSS v4.

## Quick Links
- **Repository**: [GitHub](https://github.com/Tquillity/PomoZen)
- **CI Status**: [![CI](https://github.com/Tquillity/PomoZen/actions/workflows/ci.yml/badge.svg)](https://github.com/Tquillity/PomoZen/actions/workflows/ci.yml)
- **Version**: 1.1.0

## Tech Stack
- **Frontend**: React 19, TypeScript 6, Tailwind CSS v4
- **State**: Zustand with localStorage persistence
- **Timing**: Web Workers (Comlink)
- **Build**: Vite 7
- **Testing**: Vitest, Playwright

## Key Features
- ✅ Offline-first (no backend required)
- ✅ Privacy-first (localStorage only)
- ✅ Web Worker-based accurate timing
- ✅ Ambient soundscapes (Zen Mode)
- ✅ Task tracking per pomodoro
- ✅ Statistics dashboard
- ✅ PWA ready
- ✅ WCAG 2.2 AA accessible

## Architecture
**Golden Rule**: *The UI is a reflection of the Store. The Store is updated by the Worker.*

- Timer runs in Web Worker → Updates Zustand Store → UI reflects state
- Unidirectional data flow
- 100% client-side application

## Development Commands
```bash
corepack enable  # Make pnpm available via Node 22
pnpm install     # Install dependencies
pnpm dev         # Start dev server
pnpm test        # Run tests
pnpm build       # Production build
pnpm lint        # Lint code
```

## Project Status
- ✅ Core timer functionality
- ✅ Task management
- ✅ Statistics tracking
- ✅ Settings & customization
- ✅ PWA support
- ✅ Accessibility features
