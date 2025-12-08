# CONTRIBUTING_AI.md

## 1. Project Identity: "PomoZen"
**Type:** Client-Side Single Page Application (SPA).
**Core Philosophy:** Offline-First, Privacy-First, High-Performance.
**Hosting:** Static (Render.com).
**Date Context:** December 2025.

**Crucial Context:**
This application **DOES NOT** have a backend API or database. It runs entirely in the user's browser. All data persistence is handled via `localStorage`. All heavy logic (timer ticking) is offloaded to Web Workers.

---

## 2. The Tech Stack (Strict Enforcement)
Do not deviate from these versions or libraries unless explicitly instructed.

*   **Runtime/Build:** Node.js 22+, Vite 6.
*   **Framework:** React 19 (Leveraging React Compiler).
    *   *Rule:* Do not manually implement `useMemo` or `useCallback` unless profiling proves it necessary. Trust the Compiler.
*   **Language:** TypeScript 6.0.
    *   *Rule:* Strict Mode enabled. No `any`. Define interfaces for all data structures.
*   **Styling:** Tailwind CSS v4.
    *   *Rule:* Use the CSS-first configuration (`@import "tailwindcss";`). Do not create a `tailwind.config.js` unless adding custom plugins. Use CSS variables for theming.
*   **State Management:** Zustand.
    *   *Rule:* Use the `persist` middleware for all user data (tasks, settings).
*   **Async Logic:** Web Workers via `comlink`.
    *   *Rule:* The `setInterval` loop MUST live in a worker. The Main Thread is for UI only.

---

## 3. Architecture & Data Flow

### The "Golden Rule" of PomoZen:
**The UI is a reflection of the Store. The Store is updated by the Worker.**

1.  **The Heart (Timer Engine):**
    *   Located in `src/workers/timer.worker.ts`.
    *   Uses `setInterval` (corrected for drift).
    *   Communicates via `postMessage` (wrapped by Comlink).
    *   **NEVER** accesses the DOM or `window` directly.
2.  **The Brain (State):**
    *   Located in `src/store/`.
    *   Single source of truth for: `timeLeft`, `currentMode` (Pomo/Short/Long), `tasks`, `settings`.
    *   Auto-syncs to `localStorage` on every state change.
3.  **The Face (UI):**
    *   Functional React Components.
    *   Subscribes to Zustand store selectors.
    *   **Zero business logic.** Components only dispatch actions.

---

## 4. Directory Structure (Canonical)

    /
    ├── public/              # Static assets (sounds, favicon, manifest.json)
    ├── src/
    │   ├── components/      # React UI Components
    │   │   ├── common/      # Buttons, Inputs, Cards
    │   │   └── layout/      # Header, Footer, AdContainer
    │   ├── hooks/           # Custom Hooks (useAudio, useTheme)
    │   ├── store/           # Zustand Stores (useTimeStore, useTaskStore)
    │   ├── workers/         # Web Workers (timer.worker.ts)
    │   ├── types/           # Global TypeScript Interfaces
    │   ├── App.tsx          # Main Entry
    │   ├── main.tsx         # Mount Point
    │   └── index.css        # Tailwind v4 Imports & Theme Variables
    ├── index.html           # Entry HTML (AdSense script goes here)
    └── vite.config.ts       # Vite Configuration

---

## 5. Implementation Rules & Constraints

### A. The "Forbidden" Patterns (Strictly Prohibited)
1.  **NO `setInterval` in React Components:** You typically see `useEffect(() => { setInterval... }, [])`. **This is banned.** It causes drift when tabs are inactive. You MUST use the Web Worker.
2.  **NO Backend Calls:** Do not try to `fetch()` from an API. We have no server.
3.  **NO Class Components:** Functional components only.
4.  **NO Hardcoded Colors:** Use Tailwind utility classes that reference CSS variables (e.g., `bg-[var(--bg-primary)]`) to support dynamic theming.

### B. AdSense Safety
*   **CLS Prevention:** Every component that displays an Ad **MUST** have a fixed height defined in CSS (e.g., `h-[280px]` or `min-h-[250px]`).
*   **Responsive:** Use CSS grid/flex to center ads. Never allow an ad to overflow the viewport width on mobile.

### C. Audio & Browsers
*   **Auto-Play Policy:** Browsers block audio until the user interacts with the page.
*   **Pattern:** The first "Start" click should unlock the AudioContext.

### D. Data Persistence
*   **Schema Evolution:** If you change the shape of the data in `store`, you must account for users who have old data in `localStorage`.
*   **Pattern:** Zustand `persist` handles most of this, but ensure versioning is set if breaking changes occur.

---

## 6. Coding Standards (AI Instructions)

1.  **File Naming:** PascalCase for Components (`TimerDisplay.tsx`), camelCase for logic (`timerWorker.ts`).
2.  **Comments:** Do not comment obvious code. Comment *why* a complex decision was made (e.g., "Using Comlink here to avoid manual message parsing").
3.  **Imports:** Use absolute imports if configured, or clean relative imports. Group imports: System -> Library -> Internal.
4.  **Error Handling:** Fail gracefully. If the Worker crashes, the UI should show an error, not blank out.

---

## 7. Interaction Protocol
When I ask you to implement a batch:
1.  **Acknowledge:** Confirm you have read this file.
2.  **Plan:** Briefly outline the files you will touch.
3.  **Execute:** Provide the code blocks.
4.  **Verify:** Tell me how to test that the constraints (like Offline mode) are met.