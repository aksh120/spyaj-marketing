import { NextRequest, NextResponse } from "next/server";
import { createQuoteRequest } from "@/lib/db";
import { sendQuoteNotification } from "@/lib/email";
import {
  validateField,
  sanitizeInput,
  checkRateLimit,
  RateLimitPresets,
} from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIP = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : "unknown";

    const rateLimitKey = `rfq:${clientIP}`;
    const rateLimit = checkRateLimit(rateLimitKey, RateLimitPresets.form);

    if (rateLimit.isLimited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (rateLimit.resetTime - Date.now()) / 1000,
            ).toString(),
          },
        },
      );
    }

    const body = await request.json();
    const {
      contactName,
      companyName,
      email,
      phone,
      productName,
      category,
      quantity,
      targetBudget,
      requirements,
      deliveryLocation,
      productId,
      source,
    } = body;

    const errors: Record<string, string> = {};

    const nameResult = validateField(contactName, "name");
    if (!nameResult.isValid) {
      errors.contactName = nameResult.errors[0];
    }

    const emailResult = validateField(email, "email");
    if (!emailResult.isValid) {
      errors.email = emailResult.errors[0];
    }

    if (!productName || productName.trim().length < 2) {
      errors.productName = "Product name is required";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 },
      );
    }

    const sanitizedData = {
      contact_name: sanitizeInput(contactName),
      company_name: companyName ? sanitizeInput(companyName) : null,
      email: sanitizeInput(email),
      phone: phone ? sanitizeInput(phone) : null,
      product_name: sanitizeInput(productName),
      category: category ? sanitizeInput(category) : null,
      quantity: quantity ? sanitizeInput(quantity) : null,
      target_budget: targetBudget ? sanitizeInput(targetBudget) : null,
      requirements: requirements ? sanitizeInput(requirements) : null,
      delivery_location: deliveryLocation
        ? sanitizeInput(deliveryLocation)
        : null,
      product_id: productId || null,
      source: source ? sanitizeInput(source) : "rfq_page",
    };

    const userAgent = request.headers.get("user-agent") || null;

    const quoteRequest = await createQuoteRequest({
      contact_name: sanitizedData.contact_name,
      company_name: sanitizedData.company_name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      product_name: sanitizedData.product_name,
      category: sanitizedData.category,
      quantity: sanitizedData.quantity,
      target_budget: sanitizedData.target_budget,
      requirements: sanitizedData.requirements,
      delivery_location: sanitizedData.delivery_location,
      product_id: sanitizedData.product_id,
      source: sanitizedData.source,
      ip_address: clientIP,
      user_agent: userAgent,
      attachments: [],
    });

    sendQuoteNotification(
      {
        contactName: sanitizedData.contact_name,
        companyName: sanitizedData.company_name || undefined,
        email: sanitizedData.email,
        phone: sanitizedData.phone || undefined,
        productName: sanitizedData.product_name,
        category: sanitizedData.category || undefined,
        quantity: sanitizedData.quantity || undefined,
        targetBudget: sanitizedData.target_budget || undefined,
        requirements: sanitizedData.requirements || undefined,
        deliveryLocation: sanitizedData.delivery_location || undefined,
        source: sanitizedData.source,
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
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
