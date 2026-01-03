import type { NextConfig } from "next";

/**
 * SPYAJ Marketing - Next.js Configuration
 * ========================================
 * Security-hardened configuration following OWASP best practices.
 * 
 * Security Headers Reference:
 * - https://owasp.org/www-project-secure-headers/
 * - https://nextjs.org/docs/advanced-features/security-headers
 */

const securityHeaders = [
  // DNS Prefetch Control - Enable DNS prefetching for better performance
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  // HSTS - Enforce HTTPS for 2 years, include subdomains
  // OWASP: Transport Layer Protection
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  // XSS Protection - Enable browser's XSS filter (legacy, but defense in depth)
  // OWASP: XSS Prevention
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  // Frame Options - Prevent clickjacking by disabling framing except same origin
  // OWASP: Clickjacking Defense
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  // Content Type Options - Prevent MIME type sniffing
  // OWASP: Content Security
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // Referrer Policy - Control referrer information leakage
  // OWASP: Information Disclosure Prevention
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // Permissions Policy - Disable sensitive browser features not needed
  // Prevents access to camera, microphone, geolocation, etc.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  },
  // Content Security Policy - Strict CSP for XSS and injection prevention
  // OWASP: Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      // Default fallback - restrict to same origin
      "default-src 'self'",
      // Scripts - self + necessary for Next.js hydration
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      // Styles - self + inline styles for Next.js + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images - self + data URIs + trusted image hosts
      "img-src 'self' data: https: blob:",
      // Fonts - self + Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com data:",
      // Connections - restrict to self and HTTPS
      "connect-src 'self' https:",
      // Prevent framing by other domains
      "frame-ancestors 'self'",
      // Restrict form submissions to same origin
      "form-action 'self'",
      // Restrict base URI to prevent base tag hijacking
      "base-uri 'self'",
      // Block object, embed, and applet elements
      "object-src 'none'",
      // Upgrade insecure requests to HTTPS
      "upgrade-insecure-requests"
    ].join('; ')
  }
];

const nextConfig: NextConfig = {
  // Security: Add security headers to all responses
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  // Image optimization configuration
  images: {
    // Trusted remote image sources (allowlist only)
    remotePatterns: [
      { protocol: "https", hostname: "www.svgrepo.com" },
      { protocol: "https", hostname: "loremflickr.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "randomuser.me" },
    ],
    // Disable image optimization for untrusted sources
    dangerouslyAllowSVG: false,
    // Set content disposition header for images
    contentDispositionType: 'inline',
    // Add security headers to image responses
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Security: Disable x-powered-by header to hide Next.js
  poweredByHeader: false,

  // Security: Enable strict mode for React
  reactStrictMode: true,

  // Production optimizations
  compress: true,
};

export default nextConfig;
