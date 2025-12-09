import { useEffect } from 'react';

// TOGGLE: Set to true only when you have a real 'data-ad-slot' ID from Google
const ADS_ENABLED = false; 

export const AdContainer = () => {
  useEffect(() => {
    if (ADS_ENABLED) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-[728px] mx-auto my-8 min-h-[100px] flex justify-center items-center bg-black/10 rounded-lg overflow-hidden relative border border-white/5">
        
        {/* Development Placeholder */}
        {!ADS_ENABLED && (
            <div className="flex flex-col items-center justify-center text-white/30 p-4 text-center">
                <span className="text-xs font-mono uppercase tracking-widest mb-1">Ad Space Reserved</span>
                <span className="text-[10px]">configure ADS_ENABLED in AdContainer.tsx</span>
            </div>
        )}
        
        {/* Production Ad Unit */}
        {ADS_ENABLED && (
            <ins className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '100%' }}
                data-ad-client="ca-pub-5921333037216203"
                data-ad-slot="YOUR_REAL_AD_SLOT_ID_HERE" 
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        )}
    </div>
  );
};
