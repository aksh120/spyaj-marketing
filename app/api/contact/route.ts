import { NextRequest, NextResponse } from "next/server";
import { createContactSubmission } from "@/lib/db";
import { sendContactNotification } from "@/lib/email";
import {
  parseAndValidateBody,
  checkRateLimit,
  RateLimitPresets,
  getClientIP,
  ValidationSchemas,
} from "@/lib/security";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
}

const CONTACT_SCHEMA: Partial<
  Record<keyof ContactFormData, keyof typeof ValidationSchemas>
> = {
  name: "name",
  email: "email",
  phone: "phoneIN",
  company: "companyName",
  subject: "subject",
  message: "message",
};

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimitKey = `contact:${clientIP}`;
    const rateLimit = checkRateLimit(rateLimitKey, RateLimitPresets.form);

    if (rateLimit.isLimited) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "Too many requests",
          message: "Please wait before submitting another form.",
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

    const validation = await parseAndValidateBody<ContactFormData>(
      request,
      CONTACT_SCHEMA,
      50 * 1024,
    );

    if (!validation.success) {
      return validation.response;
    }

    const { data: sanitizedData, raw: rawData } = validation;

    const userAgent = request.headers.get("user-agent") || null;
    const referrer = request.headers.get("referer") || null;

    const submission = await createContactSubmission({
      name: sanitizedData.name as string,
      email: sanitizedData.email as string,
      phone: (sanitizedData.phone as string) || null,
      company: (sanitizedData.company as string) || null,
      subject: (sanitizedData.subject as string) || "General Inquiry",
      message: sanitizedData.message as string,
      ip_address: clientIP,
      user_agent: userAgent,
      referrer: referrer,
    });

    sendContactNotification(
      {
        name: sanitizedData.name as string,
        email: sanitizedData.email as string,
        phone: sanitizedData.phone as string | undefined,
        company: sanitizedData.company as string | undefined,
        subject: (sanitizedData.subject as string) || "General Inquiry",
        message: sanitizedData.message as string,
      },
      submission.id,
    ).catch((err) => {
      console.error("Failed to send contact notification:", err);
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting us. We will get back to you shortly.",
      id: submission.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);

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
