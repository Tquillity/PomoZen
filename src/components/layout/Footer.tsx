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
        // Optional: play success sound or reset value
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <footer className="w-full mt-auto flex flex-col items-center pb-8">
      <AdContainer />
      
      <div className="flex gap-4 text-sm text-white/50">
        <button 
          onClick={exportData}
          className="hover:text-white underline cursor-pointer"
        >
          Export Data
        </button>
        
        <label className="hover:text-white underline cursor-pointer">
          Import Data
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".json" 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </label>
      </div>
      
      <div className="mt-4 text-xs text-white/30">
        PomoZen © 2025 • Offline First
      </div>
    </footer>
  );
};

