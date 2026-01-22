/**
 * Cloudflare Pages middleware for SPA routing
 * This ensures all routes serve index.html except static assets
 */
export function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  
  // Allow static assets to be served directly
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname.startsWith('/manifest.json') ||
    url.pathname.startsWith('/robots.txt') ||
    url.pathname.startsWith('/sitemap.xml') ||
    url.pathname.startsWith('/og-image.png') ||
    url.pathname.startsWith('/icon-') ||
    url.pathname.startsWith('/sw.js')
  ) {
    return next();
  }
  
  // For all other routes, serve index.html
  return next(new Request(new URL('/index.html', request.url), request));
}
