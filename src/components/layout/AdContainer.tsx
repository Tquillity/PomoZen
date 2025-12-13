import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    atOptions?: any;
  }
}
const AD_CONFIG = {
  key: import.meta.env.VITE_ADSTERRA_KEY,
  format: 'iframe',
  height: 90,
  width: 728,
  params: {}
};

export const AdContainer = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!bannerRef.current) return;

    if (bannerRef.current.innerHTML !== '') return;

    if (!AD_CONFIG.key) {
      return;
    }

    let onloadTimeoutId: number | null = null;
    let fallbackTimeoutId: number | null = null;

    window.atOptions = AD_CONFIG;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://www.highperformanceformat.com/${AD_CONFIG.key}/invoke.js`;

    script.onload = () => {
      onloadTimeoutId = window.setTimeout(() => setIsLoaded(true), 1000);
    };
    fallbackTimeoutId = window.setTimeout(() => setIsLoaded(true), 2000);

    bannerRef.current.appendChild(script);

    return () => {
      if (onloadTimeoutId !== null) window.clearTimeout(onloadTimeoutId);
      if (fallbackTimeoutId !== null) window.clearTimeout(fallbackTimeoutId);
      script.remove();
      if (window.atOptions === AD_CONFIG) {
        delete window.atOptions;
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center my-8 px-4 z-10">
      <div className="w-full max-w-[728px] h-[90px] bg-black/20 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden relative shadow-lg flex justify-center items-center">

        {!isLoaded && (
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-pulse z-20" />
        )}

        {!isLoaded && (
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono absolute z-10">
            Loading Partner...
          </span>
        )}

        <div
            ref={bannerRef}
            className="origin-center transform scale-[0.45] sm:scale-[0.75] md:scale-100 transition-transform duration-300 flex justify-center items-center"
        />

      </div>
    </div>
  );
};
