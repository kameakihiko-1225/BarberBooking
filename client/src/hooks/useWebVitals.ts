import { useEffect } from 'react';
import { logGalleryPageLoad, logGalleryFilterChange, webVitalsLogger } from '@/lib/web-vitals';

interface UseWebVitalsGalleryOptions {
  route?: string;
  itemCount?: number;
  isLoading?: boolean;
  selectedFilter?: string;
}

export function useWebVitalsGallery({
  route = '/gallery',
  itemCount = 0,
  isLoading = false,
  selectedFilter
}: UseWebVitalsGalleryOptions = {}) {
  
  // Log page load when gallery finishes loading
  useEffect(() => {
    if (!isLoading && itemCount > 0) {
      const loadTime = performance.now();
      logGalleryPageLoad(itemCount, loadTime);
    }
  }, [isLoading, itemCount]);

  // Log filter changes
  useEffect(() => {
    if (selectedFilter) {
      logGalleryFilterChange(selectedFilter, itemCount);
    }
  }, [selectedFilter, itemCount]);

  return {
    logCustomMetric: (name: string, value: number, metadata?: Record<string, any>) => {
      webVitalsLogger.logCustomMetric(name, value, metadata);
    },
    
    logImageLoad: (src: string, loadTime: number) => {
      webVitalsLogger.logCustomMetric('image.load_time', loadTime, { src });
    },
    
    logGalleryInteraction: (action: string, metadata?: Record<string, any>) => {
      webVitalsLogger.logCustomMetric('gallery.interaction', performance.now(), { action, ...metadata });
    }
  };
}