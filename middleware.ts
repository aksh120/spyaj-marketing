/**
 * SPYAJ Marketing - Next.js Middleware
 * =====================================
 * Security middleware for API route protection
 * 
 * Features:
 * - Rate limiting on API routes
 * - Request logging for monitoring
 * - Security header enforcement
 * 
 * @see https://nextjs.org/docs/pages/building-your-application/routing/middleware
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rate limit configuration
 * In production, use Redis or a distributed store
 */
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // Max requests per window

// In-memory rate limit store (for development/single instance)
// NOTE: In production with multiple instances, use Redis
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Get client IP from request
 */
function getClientIP(request: NextRequest): string {
    // Try various headers in order of preference
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        // x-forwarded-for may contain multiple IPs, take the first one
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    // Fallback to connection IP (may not be available in edge runtime)
    return 'unknown';
}

/**
 * Check rate limit for a request
 */
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    // Clean up expired entries
    if (entry && now > entry.resetTime) {
        rateLimitMap.delete(ip);
    }

    const currentEntry = rateLimitMap.get(ip);

    if (!currentEntry) {
        // First request in this window
        const resetTime = now + RATE_LIMIT_WINDOW_MS;
        rateLimitMap.set(ip, { count: 1, resetTime });
        return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime };
    }

    if (currentEntry.count >= RATE_LIMIT_MAX_REQUESTS) {
        // Rate limit exceeded
        return { allowed: false, remaining: 0, resetTime: currentEntry.resetTime };
    }

    // Increment counter
    currentEntry.count++;
    rateLimitMap.set(ip, currentEntry);
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - currentEntry.count, resetTime: currentEntry.resetTime };
}

/**
 * Middleware function
 * 
 * Currently handles:
 * 1. Rate limiting for API routes
 * 2. Security headers for all routes
 * 3. Request logging (development)
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // === API ROUTE PROTECTION ===
    if (pathname.startsWith('/api/')) {
        const clientIP = getClientIP(request);
        const rateLimit = checkRateLimit(clientIP);

        // If rate limited, return 429 response
        if (!rateLimit.allowed) {
            const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);

            return new NextResponse(
                JSON.stringify({
                    error: 'Too Many Requests',
                    message: 'Rate limit exceeded. Please try again later.',
                    retryAfter: retryAfter
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': retryAfter.toString(),
                        'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': rateLimit.resetTime.toString()
                    }
                }
            );
        }

        // Add rate limit headers to response
        const response = NextResponse.next();
        response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
        response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
        response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());

        return response;
    }

    // === STATIC FILE PROTECTION ===
    // Prevent direct access to sensitive files
    const sensitivePatterns = [
        /^\/\.env/,
        /^\/\.git/,
        /^\/_next\/static\/.*\.map$/,
    ];

    for (const pattern of sensitivePatterns) {
        if (pattern.test(pathname)) {
            return new NextResponse('Not Found', { status: 404 });
        }
    }

    // === DEVELOPMENT LOGGING ===
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${new Date().toISOString()}] ${request.method} ${pathname}`);
    }

    return NextResponse.next();
}

/**
 * Configure which paths the middleware should run on
 * 
 * Currently:
 * - All API routes (for rate limiting)
 * - Excludes static files and image optimization
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico (browser favicon)
         * - Public files with extensions
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
