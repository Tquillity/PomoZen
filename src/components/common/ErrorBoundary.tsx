import { Component } from "react";
import type { ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    // Error logged to component state for user-facing error UI
  }

  handleFactoryReset = () => {
    if (confirm("This will wipe all data and reset the app. Are you sure?")) {
      // Clear only app-owned keys; do not wipe unrelated origin storage.
      try {
        const keysToRemove = [
          'pomo-settings-storage',
          'pomo-time-storage',
          'pomo-tasks-storage',
        ];
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch {
        // Ignore storage errors (private mode / blocked storage)
      }
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-900 text-white p-6 text-center font-sans">
          <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
          <p className="mb-8 opacity-80 max-w-md">
            The application encountered a critical error. This is often due to corrupted local data.
          </p>
          <button
            onClick={this.handleFactoryReset}
            className="bg-white text-red-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Factory Reset App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
