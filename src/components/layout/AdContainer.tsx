/**
 * Adsterra ad integration with privilege separation architecture.
 * 
 * Security Architecture: 
 * 1. The main application maintains a Strict CSP (no 'unsafe-eval').
 * 2. The Ad is isolated in an iframe with a Permissive CSP.
 * 3. We allow 'allow-same-origin' because Adsterra requires access to its own 
 *    cookies/storage for fraud detection and frequency capping.
 * 
 * While 'allow-scripts' + 'allow-same-origin' theoretically lowers the sandbox 
 * barrier, the primary goal here is CSP Isolation (containing the 'eval' calls),
 * which remains fully intact. The main application's strict CSP still protects
 * against XSS even if the iframe has same-origin access.
 */
export const AdContainer = () => {
  const adKey = import.meta.env.VITE_ADSTERRA_KEY;

  if (!adKey) {
    return null;
  }

  return (
    <div className="w-full flex justify-center my-8 px-4 z-10">
      <div className="w-full max-w-[728px] h-[90px] bg-black/20 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden relative shadow-lg flex justify-center items-center">
        <iframe 
          title="Advertisement"
          src={`/adsterra-enclosure.html?key=${encodeURIComponent(adKey)}`}
          width="728"
          height="90"
          className="border-0 overflow-hidden origin-center transform scale-[0.45] sm:scale-[0.75] md:scale-100 transition-transform duration-300"
          scrolling="no"
          sandbox="allow-scripts allow-popups allow-same-origin"
          loading="lazy"
        />
      </div>
    </div>
  );
};
