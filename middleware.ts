import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RATE_LIMITS: Record<string, { windowMs: number; maxRequests: number }> = {
  "/api/auth": {
    windowMs: 15 * 1000,
    maxRequests: 10,
  },
  "/api/contact": { windowMs: 60 * 1000, maxRequests: 5 },
  "/api/rfq": { windowMs: 60 * 1000, maxRequests: 5 },
  "/api/products": { windowMs: 60 * 1000, maxRequests: 60 },
  default: { windowMs: 60 * 1000, maxRequests: 100 },
};

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ip = forwardedFor.split(",")[0].trim();
    if (isValidIP(ip)) return ip;
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP && isValidIP(realIP)) {
    return realIP;
  }

  return "unknown";
}

function isValidIP(ip: string): boolean {
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

function getRateLimitConfig(pathname: string): {
  windowMs: number;
  maxRequests: number;
} {
  for (const [path, config] of Object.entries(RATE_LIMITS)) {
    if (path !== "default" && pathname.startsWith(path)) {
      return config;
    }
  }
  return RATE_LIMITS.default;
}

function checkRateLimit(
  identifier: string,
  config: { windowMs: number; maxRequests: number },
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (entry && now > entry.resetTime) {
    rateLimitMap.delete(identifier);
  }

  const currentEntry = rateLimitMap.get(identifier);

  if (!currentEntry) {
    const resetTime = now + config.windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime };
  }

  if (currentEntry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: currentEntry.resetTime };
  }

  currentEntry.count++;
  rateLimitMap.set(identifier, currentEntry);
  return {
    allowed: true,
    remaining: config.maxRequests - currentEntry.count,
    resetTime: currentEntry.resetTime,
  };
}

function createRateLimitResponse(
  resetTime: number,
  maxRequests: number,
): NextResponse {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

  return new NextResponse(
    JSON.stringify({
      error: "Too Many Requests",
      message:
        "You have exceeded the rate limit. Please wait before trying again.",
      retryAfter: retryAfter,
      retryAfterMs: resetTime - Date.now(),
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": maxRequests.toString(),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": Math.ceil(resetTime / 1000).toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);

  if (pathname.startsWith("/api/")) {
    const config = getRateLimitConfig(pathname);

    const rateLimitKey = `${clientIP}:${pathname.split("/").slice(0, 3).join("/")}`;
    const rateLimit = checkRateLimit(rateLimitKey, config);

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.resetTime, config.maxRequests);
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", config.maxRequests.toString());
    response.headers.set(
      "X-RateLimit-Remaining",
      rateLimit.remaining.toString(),
    );
    response.headers.set(
      "X-RateLimit-Reset",
      Math.ceil(rateLimit.resetTime / 1000).toString(),
    );

    return response;
  }

  const blockedPatterns = [
    /^\/\.env/,
    /^\/\.git/,
    /^\/\.env\.local/,
    /^\/_next\/static\/.*\.map$/,
    /^\/api\/.*\.(ts|js)$/,
    /^\/prisma\//,
    /^\/node_modules\//,
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(pathname)) {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  if (process.env.NODE_ENV === "development") {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] ${request.method} ${pathname} - IP: ${clientIP}`,
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
