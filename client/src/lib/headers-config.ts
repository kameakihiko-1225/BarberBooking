// Headers configuration for different asset types
export const HEADERS_CONFIG = {
  // Gallery assets - long-term immutable caching
  gallery: {
    'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
    'Vary': 'Accept',
    'Content-Security-Policy': "default-src 'self'",
    'X-Content-Type-Options': 'nosniff'
  },

  // Gallery API - short-term with stale-while-revalidate
  api: {
    'Cache-Control': 's-maxage=60, stale-while-revalidate=86400',
    'Vary': 'Accept-Language, Accept-Encoding',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  },

  // Static assets - moderate caching
  static: {
    'Cache-Control': 'public, max-age=2592000', // 30 days
    'Vary': 'Accept-Encoding'
  },

  // No cache for dynamic content
  noCache: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
};

// Apply headers based on file type and route
export function getHeaders(path: string): Record<string, string> {
  // Gallery assets
  if (path.match(/^\/gallery\/.*\.(avif|webp|jpg)$/)) {
    return HEADERS_CONFIG.gallery;
  }

  // Gallery API
  if (path.startsWith('/api/gallery')) {
    return HEADERS_CONFIG.api;
  }

  // Other API endpoints
  if (path.startsWith('/api/')) {
    return HEADERS_CONFIG.noCache;
  }

  // Static assets
  if (path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    return HEADERS_CONFIG.static;
  }

  // Default - no special caching
  return {};
}