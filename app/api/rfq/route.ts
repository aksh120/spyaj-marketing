import { NextRequest, NextResponse } from "next/server";
import { createQuoteRequest } from "@/lib/db";
import { sendQuoteNotification } from "@/lib/email";
import {
  parseAndValidateBody,
  checkRateLimit,
  RateLimitPresets,
  getClientIP,
  ValidationSchemas,
} from "@/lib/security";

interface RFQFormData {
  contactName: string;
  companyName?: string;
  email: string;
  phone?: string;
  productName: string;
  category?: string;
  quantity?: string;
  targetBudget?: string;
  requirements?: string;
  deliveryLocation?: string;
  productId?: string;
  source?: string;
}

const RFQ_SCHEMA: Partial<
  Record<keyof RFQFormData, keyof typeof ValidationSchemas>
> = {
  contactName: "name",
  companyName: "companyName",
  email: "email",
  phone: "phoneIN",
  productName: "productName",
  category: "category",
  quantity: "safeText",
  targetBudget: "safeText",
  requirements: "safeText",
  deliveryLocation: "location",
  productId: "uuid",
  source: "source",
};

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    const rateLimitKey = `rfq:${clientIP}`;
    const rateLimit = checkRateLimit(rateLimitKey, RateLimitPresets.form);

    if (rateLimit.isLimited) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "Too many requests",
          message: "Please wait before submitting another quote request.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": RateLimitPresets.form.maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(
              rateLimit.resetTime / 1000,
            ).toString(),
          },
        },
      );
    }

    const validation = await parseAndValidateBody<RFQFormData>(
      request,
      RFQ_SCHEMA,
      100 * 1024,
    );

    if (!validation.success) {
      return validation.response;
    }

    const { data: sanitizedData } = validation;

    const userAgent = request.headers.get("user-agent") || null;

    const quoteRequest = await createQuoteRequest({
      contact_name: sanitizedData.contactName as string,
      company_name: (sanitizedData.companyName as string) || null,
      email: sanitizedData.email as string,
      phone: (sanitizedData.phone as string) || null,
      product_name: sanitizedData.productName as string,
      category: (sanitizedData.category as string) || null,
      quantity: (sanitizedData.quantity as string) || null,
      target_budget: (sanitizedData.targetBudget as string) || null,
      requirements: (sanitizedData.requirements as string) || null,
      delivery_location: (sanitizedData.deliveryLocation as string) || null,
      product_id: (sanitizedData.productId as string) || null,
      source: (sanitizedData.source as string) || "rfq_page",
      ip_address: clientIP,
      user_agent: userAgent,
      attachments: [],
    });

    sendQuoteNotification(
      {
        contactName: sanitizedData.contactName as string,
        companyName: sanitizedData.companyName as string | undefined,
        email: sanitizedData.email as string,
        phone: sanitizedData.phone as string | undefined,
        productName: sanitizedData.productName as string,
        category: sanitizedData.category as string | undefined,
        quantity: sanitizedData.quantity as string | undefined,
        targetBudget: sanitizedData.targetBudget as string | undefined,
        requirements: sanitizedData.requirements as string | undefined,
        deliveryLocation: sanitizedData.deliveryLocation as string | undefined,
        source: (sanitizedData.source as string) || "rfq_page",
      },
      quoteRequest.id,
    ).catch((err) => {
      console.error("Failed to send quote notification:", err);
    });

    return NextResponse.json({
      success: true,
      message:
        "Your quote request has been submitted. We will contact you shortly.",
      id: quoteRequest.id,
    });
  } catch (error) {
    console.error("RFQ form error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
