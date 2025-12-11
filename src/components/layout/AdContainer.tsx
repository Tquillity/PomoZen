import { useEffect, useRef, useState } from 'react';

// TypeScript declaration for Adsterra global variable
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    atOptions?: any;
  }
}

// CONFIG: Adsterra 728x90 Banner
const AD_CONFIG = {
  key: 'fb7bcfaa0417bc66ad82f8b1afc7e922',
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

    // Prevent duplicate banners
    if (bannerRef.current.innerHTML !== '') return;

    // 1. Define options
    const conf = document.createElement('script');
    conf.type = 'text/javascript';
    conf.innerHTML = `atOptions = ${JSON.stringify(AD_CONFIG)};`;

    // 2. Load the invocation script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//www.highperformanceformat.com/${AD_CONFIG.key}/invoke.js`;

    // Simple timeout to force state update since Adsterra scripts don't always fire onload perfectly
    script.onload = () => setTimeout(() => setIsLoaded(true), 1000);
    // Fallback: if onload doesn't fire, show it anyway after 2 seconds
    setTimeout(() => setIsLoaded(true), 2000);

    // 3. Append to container
    bannerRef.current.appendChild(conf);
    bannerRef.current.appendChild(script);

  }, []);

  return (
    <div className="w-full flex justify-center my-8 px-4 z-10">
      {/*
        Container Styling:
        - Fixed height (90px) to prevent layout shifts
        - Rounded corners (rounded-xl) + overflow-hidden clips the sharp ad corners
        - Glass effect (backdrop-blur) to blend with your red background
      */}
      <div className="w-full max-w-[728px] h-[90px] bg-black/20 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden relative shadow-lg flex justify-center items-center">

        {/* Loading Pulse Animation */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse z-20" />
        )}

        {/* Placeholder Text */}
        {!isLoaded && (
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono absolute z-10">
            Loading Partner...
          </span>
        )}

        {/*
           Scaling Logic:
           - Default (Mobile): Scale 0.45 (makes 728px fit on ~320px screens)
           - SM (Tablet): Scale 0.75
           - MD (Desktop): Scale 1.0 (Full size)
        */}
        <div
            ref={bannerRef}
            className="origin-center transform scale-[0.45] sm:scale-[0.75] md:scale-100 transition-transform duration-300 flex justify-center items-center"
        />

      </div>
    </div>
  );
};
