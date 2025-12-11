import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (!bannerRef.current) return;

    // Prevent duplicate banners if component re-renders (React Strict Mode double-invoke)
    if (bannerRef.current.innerHTML !== '') return;

    // 1. Define options
    const conf = document.createElement('script');
    conf.type = 'text/javascript';
    conf.innerHTML = `
      atOptions = ${JSON.stringify(AD_CONFIG)};
    `;

    // 2. Load the invocation script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//www.highperformanceformat.com/${AD_CONFIG.key}/invoke.js`;

    // 3. Append to container
    // We append the config first, then the script, so atOptions is defined when invoke.js runs
    bannerRef.current.appendChild(conf);
    bannerRef.current.appendChild(script);

  }, []);

  return (
    <div className="w-full max-w-[728px] mx-auto my-8 min-h-[100px] flex justify-center items-center bg-black/10 rounded-lg overflow-hidden relative border border-white/5">
       <div ref={bannerRef} className="flex justify-center items-center" />
    </div>
  );
};
