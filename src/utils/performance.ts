/**
 * Web Vitals Performance Monitoring
 * 
 * Tracks Core Web Vitals (LCP, FID, CLS) and other performance metrics
 * for portfolio demonstration and production monitoring.
 */

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
}

/**
 * Get performance rating based on Web Vitals thresholds
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, { good: number; poor: number }> = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
  };

  const threshold = thresholds[name];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function reportMetric(metric: WebVitalMetric) {
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // LCP - Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
        };
        
        const value = lastEntry.renderTime || lastEntry.loadTime || 0;
        reportMetric({
          name: 'LCP',
          value,
          rating: getRating('LCP', value),
        });
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      // LCP not supported
    }

    // FID - First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEventTiming;
          reportMetric({
            name: 'FID',
            value: fidEntry.processingStart - fidEntry.startTime,
            rating: getRating('FID', fidEntry.processingStart - fidEntry.startTime),
          });
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch {
      // FID not supported
    }

    // CLS - Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const layoutShift = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (!layoutShift.hadRecentInput && layoutShift.value) {
            clsValue += layoutShift.value;
          }
        });
        
        reportMetric({
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
        });
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch {
      // CLS not supported
    }

    // FCP - First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            reportMetric({
              name: 'FCP',
              value: entry.startTime,
              rating: getRating('FCP', entry.startTime),
            });
          }
        });
      });
      
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch {
      // FCP not supported
    }
  }

  // TTFB - Time to First Byte (using Navigation Timing API)
  if ('performance' in window && 'timing' in window.performance) {
    const timing = window.performance.timing;
    const ttfb = timing.responseStart - timing.requestStart;
    if (ttfb > 0) {
      reportMetric({
        name: 'TTFB',
        value: ttfb,
        rating: getRating('TTFB', ttfb),
      });
    }
  }
}

/**
 * Get current performance metrics summary
 */
export function getPerformanceSummary(): Record<string, number> {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return {};
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!navigation) return {};

  return {
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
  };
}
