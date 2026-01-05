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

export const ValidationSchemas = {
  email: {
    pattern:
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    maxLength: 254,
    minLength: 5,
    message: "Please enter a valid email address",
  },

  name: {
    pattern: /^[a-zA-Z\s\-']+$/,
    maxLength: 100,
    minLength: 2,
    message: "Name can only contain letters, spaces, hyphens, and apostrophes",
  },

  phoneIN: {
    pattern: /^(\+91[\-\s]?)?[6-9]\d{9}$/,
    maxLength: 15,
    minLength: 10,
    message: "Please enter a valid Indian phone number",
  },

  safeText: {
    pattern: /^[^<>{}]*$/,
    maxLength: 1000,
    minLength: 1,
    message: "Text contains invalid characters",
  },

  message: {
    pattern: /^[^<>]*$/,
    maxLength: 5000,
    minLength: 10,
    message: "Message contains invalid characters or is too short",
  },

  productName: {
    pattern: /^[a-zA-Z0-9\s\-_.,()&]+$/,
    maxLength: 200,
    minLength: 2,
    message: "Product name contains invalid characters",
  },

  quantity: {
    pattern: /^\d+(\.\d{1,2})?$/,
    maxLength: 15,
    minLength: 1,
    message: "Please enter a valid quantity",
  },

  amount: {
    pattern: /^\d{1,12}(\.\d{1,2})?$/,
    maxLength: 15,
    minLength: 1,
    message: "Please enter a valid amount",
  },

  url: {
    pattern:
      /^https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)*(:\d+)?(\/[-a-zA-Z0-9@:%._+~#=]*)*(\?[-a-zA-Z0-9@:%._+~#&=]*)?(#[-a-zA-Z0-9@:%._+~#&=]*)?$/,
    maxLength: 2048,
    minLength: 10,
    message: "Please enter a valid URL",
  },

  subject: {
    allowedValues: [
      "General Inquiry",
      "Become a Seller",
      "Trade Dispute",
      "Enterprise Solutions",
      "Technical Support",
    ],
    message: "Please select a valid subject",
  },

  category: {
    allowedValues: [
      "Select Category",
      "Textiles",
      "Industrial Machinery",
      "Electronics",
      "Chemicals",
    ],
    message: "Please select a valid category",
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

  if (typeof value !== "string") {
    return {
      isValid: false,
      errors: ["Invalid input type"],
    };
  }

  const trimmedValue = value.trim();

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

  if ("pattern" in schema && !schema.pattern.test(trimmedValue)) {
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
): {
  isValid: boolean;
  errors: Partial<Record<keyof T, string[]>>;
  sanitizedData: Partial<T>;
} {
  const errors: Partial<Record<keyof T, string[]>> = {};
  const sanitizedData: Partial<T> = {};
  let isValid = true;

  const allowedFields = Object.keys(schemaMap);
  for (const field of Object.keys(formData)) {
    if (!allowedFields.includes(field)) {
      errors[field as keyof T] = [`Unexpected field: ${field}`];
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

const rateLimitStore = new Map<string, RateLimitEntry>();

export const RateLimitPresets: Record<string, RateLimitConfig> = {
  standard: {
    windowMs: 60 * 1000,
    maxRequests: 100,
    message: "Too many requests. Please try again in a minute.",
  },

  auth: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    message: "Too many authentication attempts. Please try again later.",
  },

  form: {
    windowMs: 60 * 1000,
    maxRequests: 10,
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

export function createRateLimitKey(ip: string, userId?: string): string {
  if (userId) {
    return `user:${userId}:${ip}`;
  }
  return `ip:${ip}`;
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
      console.warn("Secure random not available, using fallback");
    }
  }

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

  sanitizeInput,
  sanitizeForDatabase,
  stripHtml,

  RateLimitPresets,
  checkRateLimit,
  createRateLimitKey,

  generateSecureToken,
  SecurityHeaders,
};
