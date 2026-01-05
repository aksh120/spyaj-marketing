import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db";
import {
  checkRateLimit,
  RateLimitPresets,
  getClientIP,
  sanitizeForDatabase,
} from "@/lib/security";

const MAX_LIMIT = 50;
const MAX_PAGE = 1000;
const MAX_SEARCH_LENGTH = 100;
const MAX_CATEGORY_LENGTH = 50;

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimitKey = `products:${clientIP}`;
    const rateLimit = checkRateLimit(rateLimitKey, RateLimitPresets.search);

    if (rateLimit.isLimited) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "Too many requests",
          message: "Please wait before making more requests.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": RateLimitPresets.search.maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(
              rateLimit.resetTime / 1000,
            ).toString(),
          },
        },
      );
    }

    const { searchParams } = new URL(request.url);

    const rawPage = searchParams.get("page") || "1";
    const rawLimit = searchParams.get("limit") || "12";
    const rawCategory = searchParams.get("category");
    const rawSearch = searchParams.get("search");
    const rawFeatured = searchParams.get("featured");

    let page = parseInt(rawPage, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (page > MAX_PAGE) page = MAX_PAGE;
    let limit = parseInt(rawLimit, 10);
    if (isNaN(limit) || limit < 1) limit = 12;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;

    let category: string | undefined;
    if (rawCategory && rawCategory !== "all") {
      if (rawCategory.length > MAX_CATEGORY_LENGTH) {
        return NextResponse.json(
          { error: "Category parameter too long" },
          { status: 400 },
        );
      }
      if (!/^[a-zA-Z0-9\-_]+$/.test(rawCategory)) {
        return NextResponse.json(
          { error: "Invalid category format" },
          { status: 400 },
        );
      }
      category = sanitizeForDatabase(rawCategory);
    }

    let search: string | undefined;
    if (rawSearch) {
      if (rawSearch.length > MAX_SEARCH_LENGTH) {
        return NextResponse.json(
          { error: "Search query too long" },
          { status: 400 },
        );
      }
      search = sanitizeForDatabase(rawSearch.trim());
      if (!/^[a-zA-Z0-9\s\-_.,]+$/.test(search)) {
        return NextResponse.json(
          { error: "Invalid search query format" },
          { status: 400 },
        );
      }
    }

    const featured = rawFeatured === "true";

    const products = await getProducts({
      category,
      search,
      featured,
      limit,
      offset: (page - 1) * limit,
    });

    const response = NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: products.length,
        hasMore: products.length === limit,
      },
    });

    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300",
    );
    response.headers.set(
      "X-RateLimit-Remaining",
      rateLimit.remainingRequests.toString(),
    );

    return response;
  } catch (error) {
    console.error("Products API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } },
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } },
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } },
  );
}
