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
    <div className="w-full max-w-[728px] mx-auto my-8 min-h-[100px] flex justify-center items-center bg-black/10 rounded-lg overflow-hidden relative">
        {/* Placeholder for dev mode or when ad hasn't loaded */}
        <div className="text-white/20 text-xs font-mono absolute pointer-events-none">
            Advertisement
        </div>
        
        {/* 
           NOTE: 
           1. data-ad-client MUST match the ID in index.html
           2. data-ad-slot: You need to create an "Ad Unit" in AdSense dashboard 
              and paste that specific number here (replace 1234567890).
        */}
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', height: '100%' }}
             data-ad-client="ca-pub-5921333037216203"
             data-ad-slot="1234567890"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
    </div>
  );
};