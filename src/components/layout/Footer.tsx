import { useRef } from 'react';
import { AdContainer } from './AdContainer';
import { exportData, importData } from '../../services/storage.service';

export const Footer = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await importData(file);
      if (success) {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <footer className="w-full mt-auto flex flex-col items-center pb-4 z-20">
      {/* Ad Section - Kept separate to ensure compliance */}
      <AdContainer />

      {/* Unified Footer Bar */}
      <div className="w-full px-6">
        <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Left: Branding */}
          <div className="flex items-center gap-2 text-white/60">
            <span className="font-bold text-white tracking-wide">PomoZen</span>
            <span className="text-xs border border-white/20 px-1.5 rounded text-white/40">v1.0</span>
            <span className="text-xs hidden sm:inline">Offline First</span>
          </div>

          {/* Right: Data Actions (Integrated) */}
          <div className="flex items-center gap-4">
            <button
              onClick={exportData}
              className="text-xs font-medium text-white/70 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              title="Export Data"
              aria-label="Export Data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              Export
            </button>

            <div className="w-px h-4 bg-white/20"></div>

            <label className="text-xs font-medium text-white/70 hover:text-white flex items-center gap-1 transition-colors cursor-pointer" title="Import Data" aria-label="Import Data">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" className="rotate-180 origin-center" />
              </svg>
              Import
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

        </div>
      </div>
    </footer>
  );
};