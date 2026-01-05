import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.get("featured") === "true";

    const products = await getProducts({
      category: category !== "all" ? category : undefined,
      search,
      featured,
      limit,
      offset: (page - 1) * limit,
    });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: products.length,
        hasMore: products.length === limit,
      },
    });
  } catch (error) {
    console.error("Products API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
