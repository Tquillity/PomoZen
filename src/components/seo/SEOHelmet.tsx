import { useEffect } from 'react';

export const SEOHelmet = () => {
  useEffect(() => {
    // Set basic meta tags
    document.title = 'PomoZen - Offline Pomodoro Focus Timer';

    // Remove any existing meta tags we want to control
    const existingMetaTags = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], script[type="application/ld+json"]');
    existingMetaTags.forEach(tag => tag.remove());

    // Create and append meta tags
    const metaTags = [
      { name: 'description', content: 'Boost productivity with PomoZen. A free, privacy-first Pomodoro timer with tasks, ambient sounds, and statistics. Works offline.' },
      { name: 'keywords', content: 'pomodoro timer, focus timer, tomato timer, study timer, offline pomodoro, productivity tool' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'PomoZen - Master Your Focus' },
      { property: 'og:description', content: 'The Zen way to focus. Offline-first Pomodoro timer with tasks and soundscapes.' },
    ];

    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      Object.entries(tag).forEach(([key, value]) => {
        meta.setAttribute(key, value);
      });
      document.head.appendChild(meta);
    });

    // Add JSON-LD structured data
    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "PomoZen",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "A privacy-first, offline-capable Pomodoro timer with ambient soundscapes and usage statistics.",
      "featureList": "Offline Mode, Task Tracking, White Noise, Custom Timer"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Remove our added meta tags and script
      const addedMetaTags = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], script[type="application/ld+json"]');
      addedMetaTags.forEach(tag => tag.remove());
    };
  }, []);

  return null; // This component doesn't render anything
};
