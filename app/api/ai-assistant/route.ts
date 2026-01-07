import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

const getAIResponse = async (
  query: string,
): Promise<{ response: string; action?: string; actionData?: any }> => {
  const lowerQuery = query.toLowerCase();

  if (
    lowerQuery.includes("product") ||
    lowerQuery.includes("find") ||
    lowerQuery.includes("search")
  ) {
    const keywords = query
      .replace(/find|search|product|products|for|me|some|the|a|an/gi, "")
      .trim();

    const { data: products } = await supabase
      .from("products")
      .select("id, name, slug, price")
      .ilike("name", `%${keywords}%`)
      .limit(5);

    if (products && products.length > 0) {
      const productList = products.map((p) => p.name).join(", ");
      return {
        response: `I found ${products.length} product(s) matching "${keywords}": ${productList}. Would you like me to show you more details?`,
        action: "view_products",
        actionData: { products, searchTerm: keywords },
      };
    } else {
      return {
        response: `I couldn't find any products matching "${keywords}" in our database. Would you like to browse our categories instead, or request a quote for this item?`,
        action: "browse_categories",
      };
    }
  }

  if (
    lowerQuery.includes("seller") ||
    lowerQuery.includes("supplier") ||
    lowerQuery.includes("vendor") ||
    lowerQuery.includes("manufacturer")
  ) {
    const { data: sellers } = await supabase
      .from("sellers")
      .select("id, company_name, slug, rating")
      .gte("rating", 4.0)
      .limit(5);

    if (sellers && sellers.length > 0) {
      return {
        response: `I found ${sellers.length} verified suppliers with excellent ratings. Top picks: ${sellers.map((s) => `${s.company_name} (⭐${s.rating})`).join(", ")}. Would you like to view their profiles?`,
        action: "view_sellers",
        actionData: { sellers },
      };
    } else {
      return {
        response:
          "I can help you find verified suppliers! Please tell me what type of products or industry you're looking for, or browse our featured suppliers.",
        action: "browse_sellers",
      };
    }
  }

  if (
    lowerQuery.includes("category") ||
    lowerQuery.includes("categories") ||
    lowerQuery.includes("industry") ||
    lowerQuery.includes("industries")
  ) {
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name, slug")
      .limit(10);

    if (categories && categories.length > 0) {
      return {
        response: `We have ${categories.length}+ categories including: ${categories
          .slice(0, 5)
          .map((c) => c.name)
          .join(", ")} and more. Click below to explore!`,
        action: "browse_categories",
        actionData: { categories },
      };
    }
  }

  if (
    lowerQuery.includes("price") ||
    lowerQuery.includes("quote") ||
    lowerQuery.includes("cost") ||
    lowerQuery.includes("bulk")
  ) {
    return {
      response:
        "For bulk pricing and custom quotes, I recommend submitting a Request for Quote (RFQ). Our suppliers typically respond within 24 hours with competitive pricing. Would you like to submit an RFQ now?",
      action: "request_quote",
    };
  }

  if (
    lowerQuery.includes("ship") ||
    lowerQuery.includes("delivery") ||
    lowerQuery.includes("deliver")
  ) {
    return {
      response:
        "Shipping times vary by supplier and destination:\n• Domestic (India): 3-7 business days\n• International: 10-21 business days\n• Express options available for urgent orders\n\nWould you like to check specific shipping rates?",
      action: "shipping_info",
    };
  }

  if (
    lowerQuery.includes("payment") ||
    lowerQuery.includes("pay") ||
    lowerQuery.includes("secure")
  ) {
    return {
      response:
        "We accept multiple secure payment methods:\n✓ Bank Transfer\n✓ Credit/Debit Cards\n✓ UPI\n✓ Escrow (Trade Assurance)\n\nAll transactions are protected with Trade Assurance for your safety!",
      action: "payment_info",
    };
  }

  if (
    lowerQuery.includes("contact") ||
    lowerQuery.includes("support") ||
    lowerQuery.includes("help") ||
    lowerQuery.includes("issue")
  ) {
    return {
      response:
        "I'm here to help! You can:\n• Email: support@spyaj.com\n• Phone: +91 (123) 456-7890\n• Live Chat: Available 24/7\n\nFor faster resolution, please describe your issue and I'll connect you with the right team.",
      action: "contact_support",
    };
  }

  if (
    (lowerQuery.includes("become") && lowerQuery.includes("seller")) ||
    lowerQuery.includes("register") ||
    lowerQuery.includes("sell")
  ) {
    return {
      response:
        "Joining SPYAJ as a seller is easy!\n1. Create an account\n2. Complete verification\n3. List your products\n4. Start receiving orders!\n\nBenefits: Access to 50,000+ buyers, dedicated support, and marketing tools. Ready to get started?",
      action: "become_seller",
    };
  }

  return {
    response: `Thanks for your question! I'm an AI assistant here to help you with:\n\n• Finding products and suppliers\n• Getting price quotes\n• Shipping information\n• Payment options\n• Platform support\n\nCould you be more specific about what you're looking for? For example, try "Find electronics suppliers" or "Get a quote for textiles".`,
    action: "general_help",
  };
};

export async function POST(request: NextRequest) {
  try {
    let body: { query?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const query = body.query;
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (query.length < 3) {
      return NextResponse.json(
        { error: "Query must be at least 3 characters" },
        { status: 400 },
      );
    }

    if (query.length > 500) {
      return NextResponse.json(
        { error: "Query is too long (max 500 characters)" },
        { status: 400 },
      );
    }

    const aiResponse = await getAIResponse(query);

    return NextResponse.json({
      success: true,
      ...aiResponse,
    });
  } catch (error) {
    console.error("Error in AI assistant API:", error);
    return NextResponse.json(
      {
        error:
          "I encountered an error processing your request. Please try again.",
      },
      { status: 500 },
    );
  }
}
