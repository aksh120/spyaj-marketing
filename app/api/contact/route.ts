import { NextRequest, NextResponse } from "next/server";
import { createContactSubmission } from "@/lib/db";
import { sendContactNotification } from "@/lib/email";
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

    const rateLimitKey = `contact:${clientIP}`;
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
    const { name, email, phone, company, subject, message } = body;

    const errors: Record<string, string> = {};

    const nameResult = validateField(name, "name");
    if (!nameResult.isValid) {
      errors.name = nameResult.errors[0];
    }

    const emailResult = validateField(email, "email");
    if (!emailResult.isValid) {
      errors.email = emailResult.errors[0];
    }

    const messageResult = validateField(message, "message");
    if (!messageResult.isValid) {
      errors.message = messageResult.errors[0];
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 },
      );
    }

    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: phone ? sanitizeInput(phone) : null,
      company: company ? sanitizeInput(company) : null,
      subject: subject ? sanitizeInput(subject) : "General Inquiry",
      message: sanitizeInput(message),
    };

    const userAgent = request.headers.get("user-agent") || null;
    const referrer = request.headers.get("referer") || null;

    const submission = await createContactSubmission({
      name: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      company: sanitizedData.company,
      subject: sanitizedData.subject,
      message: sanitizedData.message,
      ip_address: clientIP,
      user_agent: userAgent,
      referrer: referrer,
    });

    sendContactNotification(
      {
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone || undefined,
        company: sanitizedData.company || undefined,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
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
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
