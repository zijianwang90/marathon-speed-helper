/**
 * Cloudflare Pages middleware for SPA routing
 * This ensures all routes serve index.html except static assets
 */
export function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  
  // Allow static assets and existing files to be served directly
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname === '/favicon.ico' ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/robots.txt' ||
    url.pathname === '/sitemap.xml' ||
    url.pathname === '/og-image.png' ||
    url.pathname.startsWith('/icon-') ||
    url.pathname === '/sw.js' ||
    url.pathname === '/index.html'
  ) {
    return next();
  }
  
  // For all other routes (SPA routes), serve index.html
  // Use rewrite instead of redirect to avoid redirect loops
  const rewrittenUrl = new URL('/index.html', request.url);
  return next(new Request(rewrittenUrl, request));
}
