// Cloudflare Workers configuration for headers and caching
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const response = await fetch(request);
    
    // Clone response to modify headers
    const newResponse = new Response(response.body, response);
    
    // Gallery assets - immutable long-term caching
    if (url.pathname.match(/^\/gallery\/.*\.(avif|webp|jpg)$/)) {
      newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      newResponse.headers.set('Vary', 'Accept');
      newResponse.headers.set('Content-Security-Policy', "default-src 'self'");
      newResponse.headers.set('X-Content-Type-Options', 'nosniff');
      
      // Set appropriate content type
      if (url.pathname.endsWith('.avif')) {
        newResponse.headers.set('Content-Type', 'image/avif');
      } else if (url.pathname.endsWith('.webp')) {
        newResponse.headers.set('Content-Type', 'image/webp');
      } else if (url.pathname.endsWith('.jpg')) {
        newResponse.headers.set('Content-Type', 'image/jpeg');
      }
    }
    
    // Gallery API - short-term with stale-while-revalidate
    else if (url.pathname.startsWith('/api/gallery')) {
      newResponse.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=86400');
      newResponse.headers.set('Vary', 'Accept-Language, Accept-Encoding');
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    }
    
    // Other API endpoints - no cache
    else if (url.pathname.startsWith('/api/')) {
      newResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      newResponse.headers.set('Pragma', 'no-cache');
      newResponse.headers.set('Expires', '0');
    }
    
    // Static assets - moderate caching
    else if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      newResponse.headers.set('Cache-Control', 'public, max-age=2592000');
      newResponse.headers.set('Vary', 'Accept-Encoding');
    }
    
    // Security headers for all responses
    newResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
    newResponse.headers.set('X-Content-Type-Options', 'nosniff');
    newResponse.headers.set('X-XSS-Protection', '1; mode=block');
    newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    return newResponse;
  },
};