import { NextRequest, NextResponse } from "next/server";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: string | number | boolean;
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

export interface ValidationSchema {
  pattern?: RegExp;
  maxLength: number;
  minLength: number;
  message: string;
  required?: boolean;
  allowedValues?: readonly string[];
}

export const ValidationSchemas = {
  email: {
    pattern:
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    maxLength: 254,
    minLength: 5,
    message: "Please enter a valid email address",
    required: true,
  },

  name: {
    pattern: /^[a-zA-Z\s\-']+$/,
    maxLength: 100,
    minLength: 2,
    message: "Name can only contain letters, spaces, hyphens, and apostrophes",
    required: true,
  },

  phoneIN: {
    pattern: /^(\+91[\-\s]?)?[6-9]\d{9}$/,
    maxLength: 15,
    minLength: 10,
    message: "Please enter a valid Indian phone number",
    required: false,
  },

  phoneIntl: {
    pattern: /^\+?[1-9]\d{6,14}$/,
    maxLength: 16,
    minLength: 7,
    message: "Please enter a valid phone number",
    required: false,
  },

  safeText: {
    pattern: /^[^<>{}]*$/,
    maxLength: 1000,
    minLength: 1,
    message: "Text contains invalid characters",
    required: false,
  },

  message: {
    pattern: /^[^<>]*$/,
    maxLength: 5000,
    minLength: 10,
    message: "Message contains invalid characters or is too short",
    required: true,
  },

  productName: {
    pattern: /^[a-zA-Z0-9\s\-_.,()\&]+$/,
    maxLength: 300,
    minLength: 2,
    message: "Product name contains invalid characters",
    required: true,
  },

  companyName: {
    pattern: /^[a-zA-Z0-9\s\-_.,()\&']+$/,
    maxLength: 200,
    minLength: 2,
    message: "Company name contains invalid characters",
    required: false,
  },

  quantity: {
    pattern: /^\d+(\.\d{1,2})?$/,
    maxLength: 15,
    minLength: 1,
    message: "Please enter a valid quantity",
    required: false,
  },

  amount: {
    pattern: /^\d{1,12}(\.\d{1,2})?$/,
    maxLength: 15,
    minLength: 1,
    message: "Please enter a valid amount",
    required: false,
  },

  url: {
    pattern:
      /^https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)*(:\d+)?(\/[-a-zA-Z0-9@:%._+~#=]*)*(\?[-a-zA-Z0-9@:%._+~#&=]*)?(#[-a-zA-Z0-9@:%._+~#&=]*)?$/,
    maxLength: 2048,
    minLength: 10,
    message: "Please enter a valid URL",
    required: false,
  },

  uuid: {
    pattern:
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    maxLength: 36,
    minLength: 36,
    message: "Invalid ID format",
    required: false,
  },

  slug: {
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    maxLength: 100,
    minLength: 1,
    message: "Invalid slug format",
    required: false,
  },

  subject: {
    allowedValues: [
      "General Inquiry",
      "Become a Seller",
      "Trade Dispute",
      "Enterprise Solutions",
      "Technical Support",
    ] as const,
    maxLength: 50,
    minLength: 1,
    message: "Please select a valid subject",
    required: false,
  },

  category: {
    allowedValues: [
      "Select Category",
      "Textiles",
      "Industrial Machinery",
      "Electronics",
      "Chemicals",
      "Agriculture",
      "Health",
      "Fashion",
      "Industrial",
    ] as const,
    maxLength: 50,
    minLength: 1,
    message: "Please select a valid category",
    required: false,
  },

  location: {
    pattern: /^[a-zA-Z0-9\s\-_.,()#\/]+$/,
    maxLength: 200,
    minLength: 2,
    message: "Location contains invalid characters",
    required: false,
  },

  source: {
    pattern: /^[a-z0-9_]+$/,
    maxLength: 50,
    minLength: 1,
    message: "Invalid source format",
    required: false,
  },
} as const;

export function sanitizeInput(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/\0/g, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

export function sanitizeForDatabase(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/--/g, "")
    .replace(/\/\*/g, "")
    .replace(/\*\//g, "")
    .replace(/;/g, "")
    .replace(/\bunion\b/gi, "")
    .replace(/\bselect\b.*\bfrom\b/gi, "")
    .replace(/\binsert\b.*\binto\b/gi, "")
    .replace(/\bdelete\b.*\bfrom\b/gi, "")
    .replace(/\bdrop\b.*\btable\b/gi, "")
    .trim();
}

export function stripHtml(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return input.replace(/<[^>]*>/g, "").trim();
}

export function validateField(
  value: unknown,
  schemaKey: keyof typeof ValidationSchemas,
): ValidationResult {
  const errors: string[] = [];
  const schema = ValidationSchemas[schemaKey];

  if (value !== undefined && value !== null && typeof value !== "string") {
    return {
      isValid: false,
      errors: ["Invalid input type - expected string"],
    };
  }

  const stringValue = value as string | undefined | null;
  const trimmedValue = stringValue?.trim() || "";

  if ("required" in schema && schema.required && !trimmedValue) {
    return {
      isValid: false,
      errors: ["This field is required"],
    };
  }

  if (!trimmedValue && !("required" in schema && schema.required)) {
    return {
      isValid: true,
      errors: [],
      sanitizedValue: "",
    };
  }

  if ("allowedValues" in schema) {
    const allowedValues = schema.allowedValues as readonly string[];
    if (!allowedValues.includes(trimmedValue)) {
      errors.push(schema.message);
    }
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: trimmedValue,
    };
  }

  if ("minLength" in schema && trimmedValue.length < schema.minLength) {
    errors.push(`Minimum length is ${schema.minLength} characters`);
  }

  if ("maxLength" in schema && trimmedValue.length > schema.maxLength) {
    errors.push(`Maximum length is ${schema.maxLength} characters`);
  }

  if (
    "pattern" in schema &&
    schema.pattern &&
    !schema.pattern.test(trimmedValue)
  ) {
    errors.push(schema.message);
  }

  const sanitizedValue = sanitizeInput(trimmedValue);

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue,
  };
}

export function validateForm<T extends Record<string, unknown>>(
  formData: T,
  schemaMap: Partial<Record<keyof T, keyof typeof ValidationSchemas>>,
  options: { rejectUnexpected?: boolean } = { rejectUnexpected: true },
): {
  isValid: boolean;
  errors: Partial<Record<keyof T | "_unexpected", string[]>>;
  sanitizedData: Partial<T>;
} {
  const errors: Partial<Record<keyof T | "_unexpected", string[]>> = {};
  const sanitizedData: Partial<T> = {};
  let isValid = true;

  const allowedFields = new Set(Object.keys(schemaMap));

  if (options.rejectUnexpected) {
    const unexpectedFields: string[] = [];
    for (const field of Object.keys(formData)) {
      if (!allowedFields.has(field)) {
        unexpectedFields.push(field);
      }
    }
    if (unexpectedFields.length > 0) {
      errors._unexpected = [
        `Unexpected fields: ${unexpectedFields.join(", ")}`,
      ];
      isValid = false;
    }
  }

  for (const [field, schemaKey] of Object.entries(schemaMap)) {
    if (schemaKey) {
      const value = formData[field as keyof T];
      const result = validateField(
        value,
        schemaKey as keyof typeof ValidationSchemas,
      );

      if (!result.isValid) {
        errors[field as keyof T] = result.errors;
        isValid = false;
      } else {
        sanitizedData[field as keyof T] = result.sanitizedValue as T[keyof T];
      }
    }
  }

  return { isValid, errors, sanitizedData };
}

export async function parseAndValidateBody<T extends object>(
  request: NextRequest,
  schemaMap: Partial<Record<keyof T, keyof typeof ValidationSchemas>>,
  maxBodySize: number = 100 * 1024,
): Promise<
  | { success: true; data: Record<string, unknown>; raw: T }
  | { success: false; response: NextResponse }
> {
  try {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > maxBodySize) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Request body too large" },
          { status: 413 },
        ),
      };
    }

    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Content-Type must be application/json" },
          { status: 415 },
        ),
      };
    }

    let body: T;
    try {
      body = await request.json();
    } catch {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Invalid JSON in request body" },
          { status: 400 },
        ),
      };
    }

    const bodyAsRecord = body as unknown as Record<string, unknown>;
    const schemaMapAsRecord = schemaMap as Partial<
      Record<string, keyof typeof ValidationSchemas>
    >;
    const validation = validateForm(bodyAsRecord, schemaMapAsRecord);

    if (!validation.isValid) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Validation failed", errors: validation.errors },
          { status: 400 },
        ),
      };
    }

    return { success: true, data: validation.sanitizedData, raw: body };
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Failed to process request" },
        { status: 500 },
      ),
    };
  }
}

export function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  return "unknown";
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export const RateLimitPresets: Record<string, RateLimitConfig> = {
  standard: {
    windowMs: 60 * 1000,
    maxRequests: 100,
    message: "Too many requests. Please try again in a minute.",
  },

  auth: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 50,
    message: "Too many authentication attempts. Please try again later.",
  },

  form: {
    windowMs: 60 * 1000,
    maxRequests: 5,
    message: "Too many form submissions. Please slow down.",
  },

  search: {
    windowMs: 60 * 1000,
    maxRequests: 30,
    message: "Too many search requests. Please wait a moment.",
  },

  sensitive: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 3,
    message: "Rate limit exceeded for this operation.",
  },
};

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RateLimitPresets.standard,
): {
  isLimited: boolean;
  remainingRequests: number;
  resetTime: number;
  message?: string;
} {
  const now = Date.now();
  const key = identifier;
  const entry = rateLimitStore.get(key);

  if (entry && now > entry.resetTime) {
    rateLimitStore.delete(key);
  }

  const currentEntry = rateLimitStore.get(key);

  if (!currentEntry) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      isLimited: false,
      remainingRequests: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (currentEntry.count >= config.maxRequests) {
    return {
      isLimited: true,
      remainingRequests: 0,
      resetTime: currentEntry.resetTime,
      message: config.message,
    };
  }

  currentEntry.count++;
  rateLimitStore.set(key, currentEntry);

  return {
    isLimited: false,
    remainingRequests: config.maxRequests - currentEntry.count,
    resetTime: currentEntry.resetTime,
  };
}

export function createRateLimitKey(
  ip: string,
  userId?: string,
  endpoint?: string,
): string {
  const parts = ["rl"];
  if (userId) parts.push(`user:${userId}`);
  parts.push(`ip:${ip}`);
  if (endpoint) parts.push(`ep:${endpoint}`);
  return parts.join(":");
}

export function generateSecureToken(length: number = 32): string {
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  }

  if (typeof require !== "undefined") {
    try {
      const crypto = require("crypto");
      return crypto.randomBytes(length).toString("hex");
    } catch {
      console.warn("Secure random not available");
    }
  }

  console.warn("Using insecure random fallback for token generation");
  let result = "";
  const characters = "0123456789abcdef";
  for (let i = 0; i < length * 2; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const SecurityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https:",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "base-uri 'self'",
    ].join("; "),
  },
];

export default {
  ValidationSchemas,
  validateField,
  validateForm,
  parseAndValidateBody,

  sanitizeInput,
  sanitizeForDatabase,
  stripHtml,

  RateLimitPresets,
  checkRateLimit,
  createRateLimitKey,
  getClientIP,

  generateSecureToken,
  SecurityHeaders,
};
