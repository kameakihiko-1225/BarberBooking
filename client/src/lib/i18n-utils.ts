import { type Locale } from '@/components/language-switcher';

export const DEFAULT_LOCALE: Locale = 'pl';
export const AVAILABLE_LOCALES: Locale[] = ['pl', 'en', 'uk'];

/**
 * Get current locale with priority order: query → path → storage → default
 */
export function getCurrentLocale(): Locale {
  // 1. Check URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const queryLng = urlParams.get('lng') as Locale;
  if (queryLng && AVAILABLE_LOCALES.includes(queryLng)) {
    return queryLng;
  }

  // 2. Check URL path (e.g., /en/page, /uk/page)
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const pathLng = pathSegments[0] as Locale;
  if (pathLng && AVAILABLE_LOCALES.includes(pathLng)) {
    return pathLng;
  }

  // 3. Check localStorage
  const storedLng = localStorage.getItem('lng') as Locale;
  if (storedLng && AVAILABLE_LOCALES.includes(storedLng)) {
    return storedLng;
  }

  // 4. Return default
  return DEFAULT_LOCALE;
}

/**
 * Get current path without locale prefix
 */
export function getCurrentPathWithoutLocale(): string {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  if (AVAILABLE_LOCALES.includes(firstSegment as Locale)) {
    // Remove locale from path
    return '/' + pathSegments.slice(1).join('/');
  }
  
  return window.location.pathname;
}

/**
 * Create URL with locale prefix for path strategy
 */
export function createLocalizedPath(locale: Locale, path?: string): string {
  const currentPath = path || getCurrentPathWithoutLocale();
  const cleanPath = currentPath.startsWith('/') ? currentPath : '/' + currentPath;
  
  if (locale === DEFAULT_LOCALE) {
    // For default locale, no prefix needed
    return cleanPath || '/';
  }
  
  return `/${locale}${cleanPath}`;
}

/**
 * Update URL query parameter without reload
 */
export function updateQueryParam(key: string, value: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState({}, '', url.toString());
}

/**
 * Remove locale from query parameters
 */
export function removeLocaleFromQuery(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('lng');
  window.history.pushState({}, '', url.toString());
}