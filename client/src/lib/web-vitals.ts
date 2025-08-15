import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';

// Web Vitals thresholds (in milliseconds)
const WEB_VITALS_THRESHOLDS = {
  CLS: { good: 0.1, needsImprovement: 0.25 },
  INP: { good: 200, needsImprovement: 500 },
  FCP: { good: 1800, needsImprovement: 3000 },
  LCP: { good: 2500, needsImprovement: 4000 },
  TTFB: { good: 800, needsImprovement: 1800 }
};

type WebVitalMetric = 'CLS' | 'INP' | 'FCP' | 'LCP' | 'TTFB';

interface WebVitalLog {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  route?: string;
  timestamp: number;
  userAgent: string;
  connectionType?: string;
  navigationType?: string;
  entries?: any[];
}

class WebVitalsLogger {
  private logs: WebVitalLog[] = [];
  private currentRoute: string = '/';
  private isGalleryRoute: boolean = false;

  constructor() {
    this.initializeVitals();
    this.detectRouteChanges();
    this.detectConnectionType();
  }

  private initializeVitals() {
    // Initialize Core Web Vitals collection
    onCLS(this.onVital.bind(this));
    onINP(this.onVital.bind(this));
    onFCP(this.onVital.bind(this));
    onLCP(this.onVital.bind(this));
    onTTFB(this.onVital.bind(this));
  }

  private onVital(metric: Metric) {
    const rating = this.getRating(metric.name as WebVitalMetric, metric.value);
    
    const log: WebVitalLog = {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      rating,
      route: this.currentRoute,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType(),
      navigationType: metric.navigationType,
      entries: metric.entries
    };

    this.logs.push(log);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Web Vital:', {
        metric: metric.name,
        value: metric.value,
        rating,
        route: this.currentRoute,
        isGallery: this.isGalleryRoute
      });
    }

    // Send to analytics if on gallery route
    if (this.isGalleryRoute) {
      this.logGalleryVital(log);
    }

    // Send to server for production logging
    if (process.env.NODE_ENV === 'production') {
      this.sendToServer(log);
    }
  }

  private getRating(name: WebVitalMetric, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = WEB_VITALS_THRESHOLDS[name];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  private detectRouteChanges() {
    // Listen for route changes in SPA
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.updateCurrentRoute();
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.updateCurrentRoute();
    };

    window.addEventListener('popstate', () => {
      this.updateCurrentRoute();
    });

    // Initial route detection
    this.updateCurrentRoute();
  }

  private updateCurrentRoute() {
    this.currentRoute = window.location.pathname;
    this.isGalleryRoute = this.currentRoute.includes('/gallery') || 
                         this.currentRoute.includes('/students') || 
                         this.currentRoute.includes('/success');

    if (this.isGalleryRoute) {
      console.log('🖼️ Gallery route detected:', this.currentRoute);
    }
  }

  private getConnectionType(): string | undefined {
    // @ts-ignore - navigator.connection is not in standard types
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection?.effectiveType || connection?.type;
  }

  private detectConnectionType() {
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', () => {
        console.log('🌐 Connection changed:', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      });
    }
  }

  private logGalleryVital(log: WebVitalLog) {
    // Enhanced logging for gallery-specific vitals
    console.log('🖼️ Gallery Web Vital:', {
      metric: log.name,
      value: log.value,
      rating: log.rating,
      route: log.route,
      timestamp: new Date(log.timestamp).toISOString(),
      connection: log.connectionType
    });

    // Log specific gallery performance insights
    if (log.name === 'LCP' && log.rating === 'poor') {
      console.warn('🐌 Poor LCP on gallery route - consider image optimization');
    }
    
    if (log.name === 'CLS' && log.rating === 'poor') {
      console.warn('📐 Poor CLS on gallery route - check image loading placeholders');
    }

    if (log.name === 'INP' && log.rating === 'poor') {
      console.warn('👆 Poor INP on gallery route - optimize JavaScript execution');
    }
  }

  private async sendToServer(log: WebVitalLog) {
    try {
      await fetch('/api/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...log,
          sessionId: this.getSessionId(),
          build: process.env.VITE_BUILD_ID || 'unknown'
        })
      });
    } catch (error) {
      console.error('Failed to send web vital to server:', error);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('webvitals-session');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('webvitals-session', sessionId);
    }
    return sessionId;
  }

  // Public methods for manual logging
  public logCustomMetric(name: string, value: number, metadata?: Record<string, any>) {
    console.log('📊 Custom Metric:', { name, value, metadata, route: this.currentRoute });
    
    if (process.env.NODE_ENV === 'production') {
      this.sendToServer({
        id: `custom_${Date.now()}`,
        name: `custom.${name}`,
        value,
        rating: 'good',
        route: this.currentRoute,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        connectionType: this.getConnectionType(),
        delta: 0,
        navigationType: 'navigate',
        entries: [],
        ...metadata
      });
    }
  }

  public getVitalsReport(): WebVitalLog[] {
    return [...this.logs];
  }

  public getGalleryVitals(): WebVitalLog[] {
    return this.logs.filter(log => log.route?.includes('/gallery') || 
                                  log.route?.includes('/students') || 
                                  log.route?.includes('/success'));
  }
}

// Create singleton instance
export const webVitalsLogger = new WebVitalsLogger();

// Export function to initialize web vitals logging
export function initWebVitals() {
  console.log('🚀 Web Vitals logging initialized');
  return webVitalsLogger;
}

// Export helper functions for React components
export function logImageLoad(src: string, loadTime: number) {
  webVitalsLogger.logCustomMetric('image.load_time', loadTime, { src });
}

export function logGalleryPageLoad(itemCount: number, loadTime: number) {
  webVitalsLogger.logCustomMetric('gallery.page_load', loadTime, { itemCount });
}

export function logGalleryFilterChange(filter: string, resultCount: number) {
  webVitalsLogger.logCustomMetric('gallery.filter_time', performance.now(), { filter, resultCount });
}