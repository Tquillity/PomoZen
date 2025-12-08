import { useEffect } from 'react';

export const AdContainer = () => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Ad blocker likely active or script not loaded
    }
  }, []);

  return (
    <div className="w-full max-w-[728px] mx-auto my-8 min-h-[100px] flex justify-center items-center bg-black/10 rounded-lg overflow-hidden">
        {/* Placeholder for dev mode or when ad hasn't loaded */}
        <div className="text-white/20 text-xs font-mono absolute pointer-events-none">
            Advertisement
        </div>
        
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', height: '100%' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Placeholder ID
             data-ad-slot="1234567890"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
    </div>
  );
};

