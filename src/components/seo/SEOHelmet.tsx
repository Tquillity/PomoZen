import { useEffect } from 'react';

export const SEOHelmet = () => {
  useEffect(() => {
    const existingMetaTags = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]');
    existingMetaTags.forEach(tag => tag.remove());

    const metaTags = [
      { name: 'description', content: 'The best free online Pomodoro timer. Boost focus with aesthetic themes, ambient nature sounds (Zen Mode), and task tracking. Works 100% offline.' },
      { name: 'keywords', content: 'pomodoro timer, online timer, study timer, focus timer, tomato timer, pomodoro technique app, productivity tool, pomozen' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Pomodoro Timer Online - PomoZen' },
      { property: 'og:url', content: 'https://pomozen.online' },
      { property: 'og:description', content: 'Free aesthetic Pomodoro timer with white noise and tasks.' },
      { property: 'og:image', content: 'https://pomozen.online/PomoZen.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Pomodoro Timer Online - PomoZen' },
      { name: 'twitter:description', content: 'Free aesthetic Pomodoro timer with white noise and tasks.' },
      { name: 'twitter:image', content: 'https://pomozen.online/PomoZen.png' },
    ];

    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      Object.entries(tag).forEach(([key, value]) => {
        meta.setAttribute(key, value);
      });
      document.head.appendChild(meta);
    });

    const schema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PomoZen",
      "url": "https://pomozen.online",
      "applicationCategory": "ProductivityApplication",
      "genre": "productivity",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "A privacy-first, offline-capable Pomodoro timer with ambient soundscapes.",
      "featureList": "Offline Mode, Task Tracking, White Noise, Custom Timer, Dark Mode",
      "isAccessibleForFree": true
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const addedMetaTags = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]');
      addedMetaTags.forEach(tag => tag.remove());
    };
  }, []);

  return null;
};